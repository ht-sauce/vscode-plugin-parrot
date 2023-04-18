import { analysis } from '../analysis'
import { join, resolve } from 'path'

async function runAnalysisTest() {
  try {
    const rootPath = resolve('.') // 从根目录拼接地址，比较方便
    const urlStr = join(rootPath + '/test-file/test.vue')
    console.log(urlStr)
    // await analysis(urlStr)
  } catch (e) {
    console.log(e)
  }
}

runAnalysisTest()
