<h1 align="center">Kotomi UI</h1>
<div align="center">基于Ant Design做的组件扩展，方便开发的一套组件库</div>

## ✨ 特性 

- ⚙️  表格支持单元格和行编辑，并且很方便的进行远程分页加载数据。
- 🌈  语义话的表单定义，无需构建复杂的xml或者json格式。
- 🛡  使用 TypeScript 开发，提供完整的类型定义文件。

## 🖥 支持环境

- 现代浏览器和 IE11 及以上。
- 支持服务端渲染。
- [Electron](http://electron.atom.io/)

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Opera | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/electron/electron_48x48.png" alt="Electron" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Electron |
| --- | --- | --- | --- | --- | --- |
| IE11, Edge | last 2 versions | last 2 versions | last 2 versions | last 2 versions | last 2 versions |


## 📦 安装

```bash
npm install kotomi-ui --save
```

```bash
yarn add kotomi-ui
```

## 🔨 示例

```jsx
import { Form } from 'kotomi-ui';
const App = () => (
  <>
    <Form
        script={`
            [name|Field1 drop 8]        [code|Field2 input 8 ]        [code1|Field3 input 8] 
            [name1|Field4 input 8]       [code2|Field5 input 16-2-22]
            [name2|Field6 input 16-2-22] [code3|Field7 input 8]
        `}
        rules={[{
            name:'name',
            rules:[{ required: true, message: '请输入用户名' }]
        }]}
        components={[{
            name: 'drop',
            component: <Input />
        } ]}
    />
  </>
);
```

## 🔗 链接

- [Ant Design](http://ant.design/)
- [组件库](http://ant.design/docs/react/introduce)
- [Ant Design Pro](http://pro.ant.design/)
- [React 底层基础组件](http://react-component.github.io/)
- [移动端组件](http://mobile.ant.design)
- [Ant Design 图标](https://github.com/ant-design/ant-design-icons)
- [Ant Design 色彩](https://github.com/ant-design/ant-design-colors)
- [Ant Design Pro 布局组件](https://github.com/ant-design/ant-design-pro-layout)
- [Ant Design Pro 区块集](https://github.com/ant-design/pro-blocks)
- [Dark Theme](https://github.com/ant-design/ant-design-dark-theme)
- [首页模板集](https://landing.ant.design)
- [动效](https://motion.ant.design)
- [脚手架市场](http://scaffold.ant.design)
- [设计规范速查手册](https://github.com/ant-design/ant-design/wiki/Ant-Design-%E8%AE%BE%E8%AE%A1%E5%9F%BA%E7%A1%80%E7%AE%80%E7%89%88)
- [常见问题](https://ant.design/docs/react/faq-cn)
- [CodeSandbox 模板](https://u.ant.design/codesandbox-repro) for bug reports
- [Awesome Ant Design](https://github.com/websemantics/awesome-ant-design)
- [定制主题](http://ant.design/docs/react/customize-theme-cn)