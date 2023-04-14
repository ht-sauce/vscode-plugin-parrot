import {
  parse,
  compileTemplate,
  compileScript,
  compileStyleAsync,
  generateCodeFrame,
} from '@vue/compiler-sfc'
import generate from '@babel/generator'
import { readFile } from 'fs/promises'
import fs from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filenameNew = fileURLToPath(import.meta.url)
const __dirnameNew = dirname(__filenameNew)

async function runApp() {
  const filePath = join(__dirnameNew, './test.vue')
  const fileContent = await fs.readFile(filePath)
  const descriptor = parse(fileContent.toString())
  const { template, script, scriptSetup } = descriptor.descriptor

  console.log(template.ast)
  const output = generate.default(
    template.ast,
    {
      /* options */
    },
    // code,
  )

  console.log(output)
}
runApp()
