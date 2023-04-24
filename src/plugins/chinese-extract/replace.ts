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
  let fixFun = (fixer: Rule.RuleFixer): Rule.Fix | null => {
    return null
  }
  if (type === ASTType.Literal) {
    fixFun = (fixer: Rule.RuleFixer) => {
      const [start, end] = node.range
      return fixer.replaceTextRange([start, end], TemplateCode)
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
