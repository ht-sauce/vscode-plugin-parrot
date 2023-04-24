import { EntryStatus, FileType, InsertState, ReplaceType } from '../../store/types'
import { Rule } from 'eslint'
import { ReplaceTextParams } from './types'
import { ASTType } from '../../tool/ast'

// 替换文本为指定内容
export function replaceText(
  { node, entryStatus, context, replaceType, isTemplate } = {
    isTemplate: false,
  } as ReplaceTextParams,
) {
  const { state, key } = entryStatus
  if (state === InsertState.empty) return false
  const { type } = node

  const TemplateCode = i18nTemplateCode(replaceType, key)

  // 修复函数
  let fixFun = (
    fixer: Rule.RuleFixer,
  ): null | Rule.Fix | IterableIterator<Rule.Fix> | Rule.Fix[] => {
    return null
  }
  if (type === ASTType.Literal) {
    fixFun = (fixer: Rule.RuleFixer) => {
      const [start, end] = node.range
      return fixer.replaceTextRange([start, end], TemplateCode)
    }
  }
  if (type === ASTType.TemplateElement) {
    fixFun = (fixer: Rule.RuleFixer) => {
      const [start, end] = node.range
      const { value } = node
      const { raw } = value
      // 需要减去的长度,需要动态变化
      let reduceLen = end - start - 1 - raw.length
      reduceLen = reduceLen === 2 ? 2 : 1 // 存在字符差异，进行抹平
      return fixer.replaceTextRange([start + 1, end - reduceLen], '${' + TemplateCode + '}')
    }
  }
  if (type === ASTType.VText) {
    fixFun = (fixer: Rule.RuleFixer) => {
      const [start, end] = node.range
      return fixer.replaceTextRange([start, end], '{{' + TemplateCode + '}}')
    }
  }
  if (type === ASTType.VAttribute) {
    fixFun = (fixer: Rule.RuleFixer) => {
      const { key } = node
      // const [start, end] = node.range
      return fixer.replaceText(node, ':' + key.name + '=' + '"' + TemplateCode + '"')
    }
  }
  context.report({ node, message: '替换为:' + TemplateCode, fix: fixFun })
}
// i18n模板代码
export function i18nTemplateCode(replaceType: ReplaceType, key: string) {
  switch (replaceType) {
    case ReplaceType.js: {
      return `i18n.t('${key}')`
    }
    case ReplaceType.vueOptions: {
      return `this.$t('${key}')`
    }
    case ReplaceType.vueTemplate: {
      return `$t('${key}')`
    }
    case ReplaceType.vue3js: {
      return `i18n.global.t('${key}')`
    }
    default: {
      return `i18n.t('${key}')`
    }
  }
}
