import * as EslintPluginVue from 'eslint-plugin-vue'
import * as VueEslintTsPlugin from '@vue/eslint-config-typescript'
// 忽略规则的处理
export function ignoreRules() {
  const vueJsRules = (EslintPluginVue as any).configs['vue3-essential'].rules
  const vueTsRules = (VueEslintTsPlugin as any).overrides[0].rules
  console.log(vueJsRules, vueTsRules)
}
