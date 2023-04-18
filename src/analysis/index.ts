import * as eslint from 'eslint'
import * as fs from 'fs/promises'

// 读取文件内容
export async function readFile(url: string) {
  const fileContent = (await fs.readFile(url)).toString()
  return fileContent
}

export async function analysis(url: string) {
  const fileStr = await readFile(url)
  console.log(fileStr)
}
