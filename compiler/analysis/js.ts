import * as babelParse from '@babel/parser'
import { entryWordBar } from '../store/termBank'
import { AST_Type } from '../utils/enum'

// js文字解析
export function jsExtract(source: string) {
  const parseResult = babelParse.parse(source)
  const { directives, body } = parseResult.program
  if (directives && directives.length > 0) {
    for (let i = 0; i < directives.length; i++) {
      const directivesItem = directives[i]
      if (directivesItem.type === AST_Type.Directive) {
        if (directivesItem.value.type === AST_Type.DirectiveLiteral) {
          entryWordBar(directivesItem.value.extra?.rawValue as string)
        }
      }
    }
  }

  // 三元表达式递归
  const ConditionalExpressionRecursion = (expression: any) => {
    const { consequent, alternate } = expression
    if (consequent.type === AST_Type.StringLiteral) {
    }
    if (alternate.type === AST_Type.StringLiteral) {
    }
  }

  if (body.length > 0) {
    for (let i = 0; i < body.length; i++) {
      const bodyItem = body[i]
      // 表达式处理
      if (bodyItem.type === AST_Type.ExpressionStatement) {
        console.log(bodyItem)
        if (bodyItem.expression.type === AST_Type.ConditionalExpression) {
          ConditionalExpressionRecursion(bodyItem.expression)
        }
      }
      //
    }
  }
}
