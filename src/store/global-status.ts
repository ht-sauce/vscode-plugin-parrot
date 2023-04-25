import { FileType } from './types'

export const globalStatus = {
  fileType: FileType.vue as FileType,
  currentFileName: 'lang',
}

export function setFileType(fileType: FileType) {
  globalStatus.fileType = fileType
}
// 设置当前文件名称
export function setCurrentFileName(name: string) {
  globalStatus.currentFileName = name
}
