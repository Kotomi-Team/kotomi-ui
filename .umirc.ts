
export default {
  logo: '/',
  mode: 'site',
  title: 'Kotomi Ui',
  resolve: {
    includes: ['./docs'],
    previewLangs: [],
  },
  menus: {
    '/docs': [
      {
        title: '快速开始',
        path: '/docs/getting-started',
      },
    ],
    '/components': [
      {
        title: '组件',
        children: [
          '/components/form/README',
          '/components/table/README',
          '/components/tree/README',
          '/components/upload/README',
          '/components/picker/README',
        ]
      },
    ],
  },
  navs: [
    null,
    {
      title: 'GitHub',
      path: 'https://github.com/Kotomi-Team/kotomi-ui',
    },
  ],
  exportStatic: {},
  extraBabelPlugins: [
    [
      'import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: 'css',
      },
    ],
  ],
};