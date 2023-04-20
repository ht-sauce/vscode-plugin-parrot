import { analysis } from '../analysis'
import { join, resolve } from 'path'
import { depositEntry } from '../store/out-file'
import { rootPath } from '../tool/file'

// 测试中文提取
async function runAnalysisTest() {
  try {
    const urlStr = join(rootPath() + '/test-file/test.vue')
    // console.log(urlStr)
    await analysis(urlStr)
  } catch (e) {
    console.log(e)
  }
}
runAnalysisTest()

// 提取的词条输出
depositEntry()
