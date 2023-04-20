import { isChina, trimSpecial } from '../tool/string'

export type WordBarItem = {
  key: string
  text: string
}
/*两个词条库数据保持一致，用于不同的校验处理*/
// 单词条目
export const WordBar: WordBarItem[] = []
// json结构的词条，最终丢出去的提取词条库
export const WordBarJson: { [key: string]: string } = {}
// 录入词条，统一处理，必须是唯一的处理入口
export function entryWordBar(content: string) {
  const item = wordProcessing(content)
  if (!item) return null
  const { key, text } = item
  // 如果存在内容一样则不记录词条
  if (WordBar.find((li) => li.text === text)) return false
  // 如果存在内容一样但是词条key不一样的数据
  const equallyKey = WordBarJson[key]
  if (equallyKey) {
    const incrementalKey = key + (WordBar.length + 1).toString()
    WordBar.push({
      key: incrementalKey,
      text,
    })
    WordBarJson[incrementalKey] = text
  } else {
    // 全新的词条
    WordBar.push({
      key,
      text,
    })
    WordBarJson[key] = text
  }
}
// 获取处理过后的词条
export function getWordBar() {
  return {
    WordBar,
    WordBarJson,
  }
}

// 文字提取处理
export function wordProcessing(str = '') {
  if (!str) return false
  // 不是汉字的不能进入提取
  if (!isChina(str)) return false
  // 去除特殊字符,作为key
  const keyStr = trimSpecial(str)
  if (!keyStr) return false
  return {
    key: keyStr.substring(0, 100), // 前100位作为词条key
    text: str.trim(), // 原始内容需要保留
  } as WordBarItem
}
