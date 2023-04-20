import { ESLint } from 'eslint'
import ChineseExtract, { meta } from '../plugins/chinese-extract/imort'

export async function analysis(url: string) {
  const eslint = new ESLint({
    fix: true, // 是否自动修复
    plugins: { [meta.name]: ChineseExtract }, // 加载自定义的插件
    overrideConfig: {
      // 加载插件自定义的配置
      // 原理：根据已经加载的插件去读取插件下面的配置信息
      extends: ['plugin:parrot/extract'],
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
        // extraFileExtensions: ['.vue'],
      },
      rules: {
        'prettier/prettier': 'off',
      },
    },
  })

  // 检查文件
  const results = await eslint.lintFiles([url])
  console.log(results)
  // 输出回原文件
  await ESLint.outputFixes(results)
}
