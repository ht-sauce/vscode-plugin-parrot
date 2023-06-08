import { analysis } from '../analysis'
import { join, resolve } from 'path'
// import { depositEntry } from '../store/out-file'
// import { readFile, rootPath } from '../tool/file'
import { getWordBar } from '../store/term-bank'
import * as fs from 'fs/promises'
import { access, mkdir } from 'fs/promises'
// 测试中文提取
async function runAnalysisTest() {
  try {
    const urlStr = join(resolve('.') + '/test-file/HeaderInfo.vue')
    console.log(111, urlStr)
    await analysis(urlStr)

    console.log(getWordBar().WordBarJson)
    // 提取的词条输出
    // await depositEntry()
  } catch (e) {
    console.log(e)
  }
}
// runAnalysisTest()

// async function testFile() {
//   const res = await readFile('d:/G/zl-project/nbs-pc/src/views/supplierSys/account/AddSupplier.vue')
//   console.log(res)
// }
// testFile()
// depositEntry()

async function testImportFile() {
  const url = resolve('.') + '/test-file/test2.js'
  // const data = require(url)
  // console.log(data)
  const res = await access(url)
  // fs.writeFile(url, '')
  console.log(res)
}
testImportFile()
