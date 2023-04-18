// 统一前缀
export function prefix(commands: string) {
  return 'parrot.dht.' + commands
}
// 命令枚举集合
export enum CommandsEnum {
  ExtractChinese = 'ExtractChinese', // 提取文件中的中文
}
