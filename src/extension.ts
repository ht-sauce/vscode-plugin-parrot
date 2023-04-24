//模块“vscode”包含VS Code可扩展性API
//导入模块并在下面的代码中使用别名vscode引用它
import * as vscode from 'vscode'
import { CommandsEnum } from './tool/enums'

import { analysis } from './analysis'

//当您的扩展被激活时，会调用此方法
//您的扩展在第一次执行命令时就被激活了
export function activate(context: vscode.ExtensionContext) {
  //使用控制台输出诊断信息（console.log）和错误（console.error）
  //当您的扩展被激活时，这行代码将只执行一次

  //该命令需要已在package.json文件中定义
  //现在用registerCommand提供该命令的实现
  //commandId参数必须与package.json中的命令字段匹配
  const disposable = vscode.commands.registerCommand(CommandsEnum.ExtractChinese, (uri) => {
    //每次执行命令时，都会执行您在此处放置的代码
    // console.log(111, uri)
    if (uri.path) analysis(uri.path.substring(1, uri.path.length))
  })

  context.subscriptions.push(disposable)
}
//当您的扩展被停用时，会调用此方法
export function deactivate() {}
