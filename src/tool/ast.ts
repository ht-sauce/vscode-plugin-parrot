export enum ASTType {
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
  // 标识符。请注意，标识符可以是表达式或析构函数模式。
  Identifier = 'Identifier',
}
