import { analysis } from '../analysis'
import { join, resolve } from 'path'
import { depositEntry } from '../store/out-file'
import { readFile, rootPath } from '../tool/file'

// 测试中文提取
async function runAnalysisTest() {
  try {
    const urlStr = join(rootPath() + '/test-file/HeaderInfo.vue')
    // console.log(urlStr)
    await analysis(urlStr)

    // 提取的词条输出
    depositEntry()
  } catch (e) {
    console.log(e)
  }
}
// runAnalysisTest()

async function testFile() {
  const res = await readFile('d:/G/zl-project/nbs-pc/src/views/supplierSys/account/AddSupplier.vue')
  console.log(res)
}
testFile()
