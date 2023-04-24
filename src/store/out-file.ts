import { getWordBar } from './term-bank'
import { createFile, rootPath, writeFile } from '../tool/file'

// 将词条存入到文件当中
export async function depositEntry() {
  const time = new Date().getTime()
  const createPath = rootPath() + '/dist/'
  await createFile(createPath)
  // console.log(res)
  await writeFile(
    rootPath() + '/dist/',
    time.toString() + '.json',
    JSON.stringify(getWordBar().WordBarJson, null, '\t'),
  )
  console.log('提取完成')
}
