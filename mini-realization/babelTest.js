import { parse } from '@babel/parser'
import generate from '@babel/generator'

const code = 'const test = 1123344'
const ast = parse(code)

const test = ast.program.body[0]
test.declarations[0].init.value = "$t('测试内容')"
// ast.program.body[0] = test

const output = generate.default(
  ast,
  {
    /* options */
  },
  // code,
)
// console.log(ast)
console.log(output)
