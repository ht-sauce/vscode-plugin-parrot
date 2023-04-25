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
暂未开放
### 提取中文
![提取中文.png](https://raw.githubusercontent.com/ht-sauce/vscode-plugin-parrot/main/docs/images/%E6%8F%90%E5%8F%96%E4%B8%AD%E6%96%87.png)  
将会把vue,js,ts文件提取中文代码改为$t()方式   
生成parrot-extract-out文件夹，翻译提取内容在该文件夹中  
