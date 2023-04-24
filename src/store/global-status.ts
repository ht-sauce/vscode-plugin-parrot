import { FileType } from './types'

export const globalStatus = {
  fileType: FileType.vue as FileType,
}

export function setFileType(fileType: FileType) {
  globalStatus.fileType = fileType
}
