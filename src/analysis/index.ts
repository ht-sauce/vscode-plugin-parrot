import { ESLint } from 'eslint'
import ChineseExtract, { meta } from '../plugins/chinese-extract/imort'
import { setCurrentFileName, setFileType } from '../store/global-status'
import { FileType } from '../store/types'
import { resolve } from 'path'
const tsParser = require('@typescript-eslint/parser')
const espree = require('espree')
const vueParser = require('vue-eslint-parser')
export async function analysis(url: string) {
  if (!url) return false
  // 获取文件后缀名
  const fileSuffixName = url.split('.').reverse()[0]
  const fileName = url.split('\\').reverse()[0]
  setFileType(fileSuffixName as FileType)
  setCurrentFileName(fileName)

  const vueParser = resolve('node_modules/vue-eslint-parser/index.js')
  const eslint = new ESLint({
    fix: true, // 是否自动修复
    plugins: { [meta.name]: ChineseExtract }, // 加载自定义的插件
    overrideConfig: {
      // 加载插件自定义的配置
      // 原理：根据已经加载的插件去读取插件下面的配置信息
      extends: ['plugin:parrot/extract'],
      // 添加vue和ts解析功能
      parser: vueParser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: {
          jsx: true,
        },
        parser: {
          js: espree,
          jsx: espree,
          ts: tsParser,
          tsx: tsParser,
        },
      },
      rules: {
        'prettier/prettier': 'off',
      },
    },
  })

  // 检查文件
  const results = await eslint.lintFiles([url])
  // console.log(results)
  // 输出回原文件
  await ESLint.outputFixes(results)
}
