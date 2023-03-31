
import * as fs from 'fs/promises'
import { join } from 'path'
import { parse, compileTemplate, compileScript, compileStyleAsync } from '@vue/compiler-sfc'

async function readFile() {
    const vue3FileText = await fs.readFile(join(__dirname, '../demo/vue3/index.vue'))
    const descriptor = parse(vue3FileText.toString())
    console.log(descriptor)
}
// parrot-compiler
readFile()