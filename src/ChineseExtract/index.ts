import { ESLint, Rule } from 'eslint'

module.exports = {
  meta: {
    name: '@parrot/eslint-plugin-chinese-extract',
    version: '1.0.0',
  },
  rules: {
    // 实际规则名称@parrot/chinese-extract
    'chinese-extract': {
      meta: {
        type: 'suggestion',
        docs: {
          description: '检测使用了中文并进行提取',
        },
        fixable: 'code',
      },
      create(context: Rule.RuleContext): Rule.RuleListener {
        return {}
      },
    },
  },
} as ESLint.Plugin
