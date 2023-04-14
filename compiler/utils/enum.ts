export enum FileType {
  vue = 'vue',
  js = 'js',
  jsx = 'jsx',
  mjs = 'mjs',
  ts = 'ts',
  tsx = 'tsx',
  mts = 'mts',
}

export enum AST_Type {
  // 一个完整的程序源代码树。
  Directive = 'Directive',
  // 指令当中的文字
  DirectiveLiteral = 'DirectiveLiteral',
  // 字符串文字
  StringLiteral = 'StringLiteral',
  // 表达式语句，即由单个表达式组成的语句。
  ExpressionStatement = 'ExpressionStatement',
  // 三元表达式
  ConditionalExpression = 'ConditionalExpression',
  // 函数或方法调用表达式。
  CallExpression = 'CallExpression',
  // 二元运算符表达式。
  BinaryExpression = 'BinaryExpression',
}
