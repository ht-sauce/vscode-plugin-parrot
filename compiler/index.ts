import { join } from 'path'
import { FileType } from './utils/enum'
import { vueAnalysis } from './analysis/vue'
import { getWordBar } from './store/termBank'

const fileUrl = join(__dirname, '../test/vue3/addOrEdit.vue')

async function readFile(filePath: string) {
  const fileExtension = filePath.split('.').slice(-1)[0]
  switch (fileExtension) {
    case FileType.vue: {
      await vueAnalysis(filePath)
      break
    }
    case FileType.js: {
      break
    }
    case FileType.jsx: {
      break
    }
    case FileType.mjs: {
      break
    }
    case FileType.ts: {
      break
    }
    case FileType.tsx: {
      break
    }
    case FileType.mts: {
      break
    }
    default: {
      console.warn('不支持的文件类型无法解析')
    }
  }
}

// js解析
async function jsAnalysis(filePath: string) {}
// ts解析
async function tsAnalysis(filePath: string) {}

// 运行
async function runApp() {
  try {
    await readFile(fileUrl)
    const WordBar = getWordBar()
    console.log('最终提取文字:')
    console.log(WordBar)
  } catch (e) {
    console.error(e)
  }
}
runApp()
