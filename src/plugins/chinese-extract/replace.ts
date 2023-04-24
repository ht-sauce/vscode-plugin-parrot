import { EntryStatus, FileType, InsertState, ReplaceType } from '../../store/types'
import { Rule } from 'eslint'

// 替换文本为指定内容
export function replaceText(
  node: Rule.Node | any,
  entryStatus: EntryStatus,
  content: Rule.RuleContext,
  replaceType: ReplaceType,
) {
  const { state, key } = entryStatus
  if (state === InsertState.empty) return false

  const TemplateCode = i18nTemplateCode(replaceType, key)

  content.report({
    node,
    message: '替换为:' + TemplateCode,
    fix(fixer: Rule.RuleFixer) {
      const [start, end] = node.range
      return fixer.replaceTextRange([start, end], TemplateCode)
    },
  })
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
