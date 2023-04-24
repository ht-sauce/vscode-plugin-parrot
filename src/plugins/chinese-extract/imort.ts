import { ESLint, Rule } from 'eslint'
import * as ESTree from 'estree'
import { PrivateIdentifier } from 'estree'
import { AST } from 'vue-eslint-parser'
import { entryWordBar } from '../../store/term-bank'
import { ASTType } from '../../tool/ast'
import { unmatchedIdentifier } from '../../tool/string'
import { replaceText } from './replace'
import { ReplaceType } from '../../store/types'
import { globalStatus } from '../../store/global-status'

export const meta = {
  name: 'eslint-plugin-parrot',
  version: '1.0.0',
}

export default {
  rules: {
    // 实际规则名称parrot/chinese-extract
    'chinese-extract': {
      meta: {
        /*
         "problem"表示规则正在标识将导致错误或可能导致混淆行为的代码。开发人员应将此视为高度优先解决的问题。
        "suggestion"意味着规则正在识别可以以更好的方式完成的事情，但如果不更改代码就不会发生错误。
        "layout"意味着规则主要关心空格、分号、逗号和括号，程序的所有部分决定代码的外观而不是代码的执行方式。这些规则适用于 AST 中未指定的部分代码。
                * */
        type: 'suggestion',
        // 定义提示信息文本 error-name为提示文本的名称 定义后我们可以在规则内部使用这个名称
        messages: {
          // 'error-name': '这是一个错误的命名',
        },
        docs: {
          description: '检测使用了中文并进行提取',
        },
        // 标识这条规则是否可以修复，假如没有这属性，即使你在下面那个create方法里实现了fix功能，eslint也不会帮你修复
        fixable: 'code',
        // 这里定义了这条规则需要的参数
        // 比如我们是这样使用带参数的rule的时候，rules: { myRule: ['error', param1, param2....]}
        // error后面的就是参数，而参数就是在这里定义的
        schema: [],
      },
      create(context: Rule.RuleContext): Rule.RuleListener {
        // console.log(1111, context.parserServices)
        // 原始ast方式
        // return {
        //   // 在ReturnStatement节点上
        //   ReturnStatement(node) {},
        //   // 在开始分析代码路径时
        //   onCodePathStart(codePath, node) {
        //     // console.log(codePath, node)
        //   },
        //   // 在分析代码路径结束时
        //   onCodePathEnd(codePath, node) {},
        //   // onCodePathSegmentStart(segment, node) {},
        //   // onCodePathSegmentEnd(segment, node) {},
        //   // onCodePathSegmentLoop(fromSegment, toSegment, node) {},
        // }
        // vue解析器提供的方式
        return context.parserServices.defineTemplateBodyVisitor(
          // <template>部分走这里
          /* 存在的节点类型,ast原生类型未列出
            VAttribute: ["key", "value"],
            VDirectiveKey: ["name", "argument", "modifiers"],
            VDocumentFragment: ["children"],
            VElement: ["startTag", "children", "endTag"],
            VEndTag: [],
            VExpressionContainer: ["expression"],
            VFilter: ["callee", "arguments"],
            VFilterSequenceExpression: ["expression", "filters"],
            VForExpression: ["left", "right"],
            VIdentifier: [],
            VLiteral: [],
            VOnExpression: ["body"],
            VSlotScopeExpression: ["params"],
            VStartTag: ["attributes"],
            VText: [],*/
          {
            TemplateElement(node: ESTree.TemplateElement) {
              const entryStatus = entryWordBar(node.value.raw)
              replaceText({
                node,
                entryStatus,
                context,
                replaceType: ReplaceType.vueTemplate,
                isTemplate: true,
              })
            },
            Literal(node: Rule.Node): void {
              const parent = node?.parent as ESTree.CallExpression
              if (parent && parent.type === ASTType.CallExpression) {
                if (
                  parent.callee.type === ASTType.Identifier &&
                  unmatchedIdentifier(parent.callee.name)
                )
                  return
              }
              const entryStatus = entryWordBar((node as ESTree.Literal).value as string)
              replaceText({
                node,
                entryStatus,
                context,
                replaceType: ReplaceType.vueTemplate,
                isTemplate: true,
              })
            },
            VLiteral(node: AST.VLiteral): void {
              entryWordBar(node.value)
            },
            VText(node: AST.VText): void {
              // console.log(node)
              entryWordBar(node.value)
            },
          },
          // Event handlers for <script> or scripts. (optional)
          // js，ts部分会走这里
          {
            // Program(node: AST.ESLintProgram): void {
            //   // console.log(node)
            // },
            Literal(node: Rule.Node): void {
              // console.log(node)
              const parent = node?.parent as ESTree.CallExpression
              if (parent && parent.type === ASTType.CallExpression) {
                if (
                  parent.callee.type === ASTType.MemberExpression &&
                  unmatchedIdentifier((parent.callee.property as PrivateIdentifier).name)
                )
                  return
              }
              const entryStatus = entryWordBar((node as ESTree.Literal).value as string)
              replaceText({ node, entryStatus, context, replaceType: ReplaceType.js })
            },
            TemplateElement(node: ESTree.TemplateElement) {
              const entryStatus = entryWordBar(node.value.raw)
              replaceText({
                node,
                entryStatus,
                context,
                replaceType: ReplaceType.js,
                isTemplate: true,
              })
            },
          },
          // Options. (optional)
          {
            templateBodyTriggerSelector: 'Program:exit',
          },
        )
      },
    },
  },
  configs: {
    extract: {
      plugins: ['parrot'], // 插件的前缀名称
      rules: {
        'parrot/chinese-extract': 'error',
      },
    },
  },
} as ESLint.Plugin
