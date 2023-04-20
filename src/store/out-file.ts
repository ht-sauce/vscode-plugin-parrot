import { getWordBar } from './term-bank'

// 将词条存入到文件当中
export function depositEntry() {
  console.log(getWordBar().WordBarJson)
}
