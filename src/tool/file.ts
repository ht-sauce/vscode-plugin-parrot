import * as fs from 'fs/promises'
import { FileContent } from '../types/file'
import { resolve } from 'path'
import { access, mkdir } from 'fs/promises'
// 读取文件内容
export async function readFile(url: string) {
  const fileBuffer = await fs.readFile(url)
  return {
    strFile: fileBuffer.toString(),
    fileBuffer,
  }
}

// 写入文件
// writeUrl 注意是是否需要增加斜杠和fileName组成完整的地址链路
export async function writeFile(writeUrl: string, fileName: string, fileContent: FileContent) {
  await fs.writeFile(writeUrl + fileName, fileContent)
}

// 获取根目录
export function rootPath() {
  return resolve('.')
}

// 检测并创建目录
export async function createFile(path: string) {
  try {
    await access(path)
    return Promise.resolve(true)
  } catch (e) {
    await mkdir(path)
    return Promise.resolve(true)
  }
}
