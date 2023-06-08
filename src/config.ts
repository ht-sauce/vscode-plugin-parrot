import { Config } from './types/config'
import { getVsCodeProjectPath, isAccess } from './tool/file'
import { join } from 'path'
import { message } from './tool/message'
import { MessageType } from './tool/enums'

let configBase: Config = {
  // 注意输出的文件地址为：项目地址+outFile+文件.json
  outFile: 'parrot-extract-out',
  // 项目的i18n语言路径,路径编写需要前斜杠，如：/src/i18n/zh
  i18nLang: '',
  fileOutMode: 'unified',
  unifiedFileName: 'lang',
}
export function getConfig(): Config {
  return configBase
}
// 获取配置文件
export async function getSetConfigFile() {
  const configUrl = join(getVsCodeProjectPath(), '/' + 'parrot-config.js')
  const isFile = await isAccess(configUrl)
  if (!isFile) return false
  // 清理缓存，每次都需要读取最新的配置文件
  delete require.cache[configUrl]
  const set = require(configUrl)
  if (typeof set === 'function') {
    configBase = {
      ...configBase,
      ...set(),
    }
  } else {
    configBase = {
      ...configBase,
      ...set,
    }
  }
}
