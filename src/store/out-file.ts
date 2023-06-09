import { getWordBar, mergeWordBar } from './term-bank'
import { createFile, getVsCodeProjectPath, isAccess, writeFile } from '../tool/file'
import { getConfig } from '../config'
import { globalStatus } from './global-status'
import { join } from 'path'

// 针对词条库合并路径处理
export function mergeEntryPath() {
  const config = getConfig()
  let fileOut = ''
  // 有i18n目录清空
  if (config.i18nLang) {
    fileOut = join(getVsCodeProjectPath(), config.i18nLang + '/')
  } else {
    // 不输出到i1n8目录中
    fileOut = join(getVsCodeProjectPath(), '/' + config.outFile + '/')
  }
  // 需要读取的json数据
  const importDataUrl = fileOut + config.unifiedFileName + '.json'
  // const oldEntry = require(importDataUrl) ?? {}
  return {
    fileOut, // 文件路径
    importDataUrl, // 文件合并路径
  }
}

// 将词条存入到文件当中
export async function depositEntry() {
  if (!getWordBar().WordBar.length) return Promise.reject('没有可以提取的文字内容')
  // d:\G\zl-project\nbs-pc
  const config = getConfig()
  if (config.fileOutMode === 'file') {
    // 输出的文件目录
    const createPath = join(getVsCodeProjectPath(), '/' + config.outFile + '/')
    await createFile(createPath)
    // console.log(res)
    await writeFile(
      createPath,
      globalStatus.currentFileName + '.json',
      JSON.stringify(getWordBar().WordBarJson, null, '\t'),
    )
  }
  if (config.fileOutMode === 'unified') {
    const { fileOut } = mergeEntryPath()
    // 检测并创建目录
    if (!config.i18nLang) await createFile(fileOut)
    await writeFile(
      fileOut,
      config.unifiedFileName + '.json',
      JSON.stringify(getWordBar().WordBarJson, null, '\t'),
    )
  }

  console.log('提取成功')
}
// 在unified模式下判断创建目录或文件
export async function unifiedFileMergeData() {
  if (getConfig().fileOutMode !== 'unified') return null
  const { importDataUrl } = mergeEntryPath()
  const isFile = await isAccess(importDataUrl)
  if (isFile) {
    // 如果存在数据文件则需要进行合并词条库
    delete require.cache[importDataUrl]
    const data = require(importDataUrl)
    mergeWordBar(data)
  }
}
