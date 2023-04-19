import { ESLint } from 'eslint'
import * as fs from 'fs/promises'

// 读取文件内容
export async function readFile(url: string) {
  const fileContent = (await fs.readFile(url)).toString()
  return fileContent
}

export async function analysis(url: string) {
  const eslint = new ESLint({
    overrideConfig: {
      // root: true,
      // 添加vue和ts解析功能
      parser: 'vue-eslint-parser',
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: {
          jsx: true,
        },
        parser: {
          js: 'espree',
          jsx: 'espree',
          ts: '@typescript-eslint/parser',
          tsx: '@typescript-eslint/parser',
          // '<template>': 'espree',
        },
        extraFileExtensions: ['.vue'],
      },
      overrides: [],
      rules: {
        'prettier/prettier': 'off',
      },
    },
  })

  const results = await eslint.lintFiles([url])

  console.log(results)
}
