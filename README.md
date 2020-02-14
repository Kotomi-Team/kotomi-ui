<h1 align="center">Kotomi UI</h1>
<div align="center">基于Ant Design做的组件扩展，开发的一套组件库</div>


[![Codacy Badge](https://api.codacy.com/project/badge/Grade/e250572478fe40f18b4164d325c78176)](https://www.codacy.com/gh/Kotomi-Team/kotomi-ui?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=Kotomi-Team/kotomi-ui&amp;utm_campaign=Badge_Grade) ![![npm](https://www.npmjs.com/package/kotomi-ui)](https://img.shields.io/npm/dw/kotomi-ui?label=npm)

## ✨ 特性

- ⚙️ 表格支持单元格和行编辑，并且很方便的进行远程分页加载数据。
- 🌈 语义话的表单定义，无需构建复杂的xml或者json格式。
- 🛡 使用 TypeScript 开发，提供完整的类型定义文件。
- 🌍 使用storybook 包含大量例子

> Day before yesterday I saw a rabbit, and yesterday a deer, and today, you.

## 🖥 支持环境

- 现代浏览器和 IE11 及以上。
- 支持服务端渲染。
- [Electron](http://electron.atom.io/)

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Opera | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/electron/electron_48x48.png" alt="Electron" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Electron |
| --- | --- | --- | --- | --- | --- |
| IE11, Edge | last 2 versions | last 2 versions | last 2 versions | last 2 versions | last 2 versions |

## 📦 安装

### 使用npm 或者 yarn 进行安装

```bash
npm install kotomi-ui --save
```

```bash
yarn add kotomi-ui
```

### 浏览器引用

我们在 npm 发布包内的 kotomi-ui/dist 目录下提供了kotomi.bundle.js。你也可以通过 CDNJS， 或 UNPKG 进行下载。

```
<script src="//unpkg.com/kotomi-ui@latest/dist/kotomi.bundle.js"></script>
```

> 强烈不推荐使用已构建文件，这样无法按需加载，而且难以获得底层依赖模块的 bug 快速修复支持。注意：你需要自行引入 moment。


