# parrot-compiler 鹦鹉翻译 vscode 插件
## 开发
遵循vscode开发规范，请尽可能的保证代码解耦
- npm run test 纯node环境测试核心文件逻辑
- F5 vscode测试
- npm run test-plugin vscode单元测试
## 发布
npm run build
## 功能
### 自定义配置表
在项目根目录下面新增配置文件：parrot-config.js
```typescript
export type Config = {
  // 注意输出的文件地址为：项目地址+outFile+文件.json
  // 这是文件输出的目录地址
  outFile: string
  // 当需要直接输出到i18n当中的json文件时有效，需要配置unified
  // i18n的语言文件目录
  // 项目的i18n语言路径,路径编写需要前斜杠，如：/src/i18n/zh
  i18nLang: string | null
  // file按获取到的翻译文件名称输出提取的文件名称，
  // unified 统一的输出名称,统一模式为根据原来的输出的json，增量增加json当中的内容
  fileOutMode: 'file' | 'unified'
  // 统一输出的文件名称，固定为json文件
  unifiedFileName: string
}
```
### 提取中文
![提取中文.png](https://raw.githubusercontent.com/ht-sauce/vscode-plugin-parrot/main/docs/images/%E6%8F%90%E5%8F%96%E4%B8%AD%E6%96%87.png)  
将会把vue,js,ts文件提取中文代码改为$t()方式   
生成parrot-extract-out文件夹，翻译提取内容在该文件夹中  
## 关于开源
1、项目当中的vscode插件不是最新的，请自己重新构建最新版本
