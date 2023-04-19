import { ESLint } from 'eslint'
import * as fs from 'fs/promises'
// @ts-ignore
import * as EslintPluginVue from 'eslint-plugin-vue'

// 读取文件内容
export async function readFile(url: string) {
  const fileContent = (await fs.readFile(url)).toString()
  return fileContent
}

export async function analysis(url: string) {
  // const fileStr = await readFile(url)
  // EslintPluginVue.configs['vue3-recommended']

  // @ts-ignore
  const eslint = new ESLint({
    overrideConfig: {
      root: true,
      // 添加vue和ts解析功能
      extends: ['plugin:vue/vue3-essential', '@vue/eslint-config-typescript'],
      parserOptions: {
        ecmaVersion: 'latest',
      },
      rules: {
        '*': ['off'],
      },
    },
  })

  const results = await eslint.lintFiles([url])

  console.log(results)
}
