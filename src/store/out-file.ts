import { getWordBar } from './term-bank'
import { createFile, rootPath, writeFile } from '../tool/file'
import { getConfig } from '../config'

// 将词条存入到文件当中
export async function depositEntry() {
  if (!getWordBar().WordBar.length) return Promise.reject('没有可以提取的文字内容')

  const config = getConfig()
  const time = new Date().getTime()
  const createPath = rootPath() + `/${config.outFile}/`
  await createFile(createPath)
  // console.log(res)
  await writeFile(
    rootPath() + '/dist/',
    time.toString() + '.json',
    JSON.stringify(getWordBar().WordBarJson, null, '\t'),
  )
  console.log('提取成功')
}
