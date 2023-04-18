import * as eslint from 'eslint'
import * as fs from 'fs/promises'

// 读取文件内容
export function readFile(url: string) {
  console.log(url)
}

export function analysis(url: string) {
  readFile(url)
}
