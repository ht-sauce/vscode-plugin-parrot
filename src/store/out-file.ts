import { getWordBar } from './term-bank'
import { createFile, getVsCodeProjectPath, writeFile } from '../tool/file'
import { getConfig } from '../config'
import { globalStatus } from './global-status'

// 将词条存入到文件当中
export async function depositEntry() {
  // if (!getWordBar().WordBar.length) return Promise.reject('没有可以提取的文字内容')
  // d:\G\zl-project\nbs-pc
  const config = getConfig()
  // const time = new Date().getTime()
  const createPath = getVsCodeProjectPath() + `\\${config.outFile}\\`
  await createFile(createPath)
  // console.log(res)
  await writeFile(
    createPath,
    globalStatus.currentFileName + '.json',
    JSON.stringify(getWordBar().WordBarJson, null, '\t'),
  )
  console.log('提取成功')
}
