import * as fs from 'fs/promises'
import { parse, compileTemplate, compileScript, compileStyleAsync } from '@vue/compiler-sfc'
import { NodeTypes } from '@vue/compiler-dom'
import { ElementNode, TemplateChildNode } from '@vue/compiler-core'
import { entryWordBar } from '../store/termBank'
import { jsExtract } from './js'
// vue解析
export async function vueAnalysis(filePath: string) {
  const fileContent = await fs.readFile(filePath)
  const descriptor = parse(fileContent.toString())
  const { template, script, scriptSetup } = descriptor.descriptor
  // vue template解析处理
  if (template?.ast) {
    // console.log(template.ast)
    templateExtract(template.ast)
  }
}
// template部分文字提取
function templateExtract(ast: ElementNode) {
  const { children } = ast
  const textHandler = (content: string) => {
    // 传入文字内容
    entryWordBar(content)
  }
  // 处理简单表达式
  const hand_SIMPLE_EXPRESSION = (content: string) => {
    jsExtract(content)
  }
  // 递归数据
  const recursion = (list: TemplateChildNode[]) => {
    for (let i = 0; i < list.length; i++) {
      const node = list[i] as any
      const { type, props } = node
      // 纯文本处理
      if (type === NodeTypes.TEXT) {
        textHandler(node.content)
      }
      // props部分处理
      if (props && props.length > 0) {
        for (let pi = 0; pi < props.length; pi++) {
          const pItem = props[pi]
          if (pItem.value && pItem.value.type === NodeTypes.TEXT) {
            textHandler(pItem.value.content)
          }
          // 7
          if (pItem.type === NodeTypes.DIRECTIVE) {
            // 进入简单表达式4
            if (pItem.exp?.type === NodeTypes.SIMPLE_EXPRESSION) {
              hand_SIMPLE_EXPRESSION(pItem.exp.content)
            }
          }
        }
      }

      // 插值处理5
      if (type === NodeTypes.INTERPOLATION) {
        // 内部的简单表达式4
        if (node.content.type === NodeTypes.SIMPLE_EXPRESSION) {
          hand_SIMPLE_EXPRESSION(node.content.content)
        }
      }

      // 存在子数据处理
      if (Array.isArray(node.children) && node.children.length > 0) {
        recursion(node.children as TemplateChildNode[])
      }
    }
  }
  recursion(children)
}
