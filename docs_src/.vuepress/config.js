'use strict';

const name = 'uitest';

module.exports = {
  dest: 'docs',
  base: `/${name}/`,

  locales: {
    '/': {
      lang: 'en-US',
      title: 'UITest',
      description: 'Run mocha in a browser environment.',
    },
    '/zh/': {
      lang: 'zh-CN',
      title: 'UITest',
      description: '在浏览器环境中运行测试。',
    },
  },
  head: [
    ['link', { rel: 'icon', href: 'logo/favicon.ico' }],
    ['script', {
      async: true,
      src: 'https://www.googletagmanager.com/gtag/js?id=UA-49226133-2',
    }, ''],
    ['script', {}, `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'UA-49226133-2');
    `]
  ],
  serviceWorker: true,
  themeConfig: {
    repo: `macacajs/${name}`,
    editLinks: true,
    docsDir: 'docs_src',
    locales: {
      '/': {
        label: 'English',
        selectText: 'Languages',
        editLinkText: 'Edit this page on GitHub',
        lastUpdated: 'Last Updated',
        serviceWorker: {
          updatePopup: {
            message: 'New content is available.',
            buttonText: 'Refresh',
          },
        },
        nav: [
          {
            text: 'Guide',
            link: '/guide/install.html'
          },
        ],
        sidebar: {
          '/guide/': genSidebarConfig('Guide', 'Usage', 'Advanced'),
        },
      },
      '/zh/': {
        label: '简体中文',
        selectText: '选择语言',
        editLinkText: '在 GitHub 上编辑此页',
        lastUpdated: '上次更新',
        serviceWorker: {
          updatePopup: {
            message: '发现新内容可用',
            buttonText: '刷新',
          },
        },
        nav: [
          {
            text: '指南',
            link: '/zh/guide/install.html'
          },
        ],
        sidebar: {
          '/zh/guide/': genSidebarConfig('指南'),
        },
      },
    },
  },
};

function genSidebarConfig(guide) {
  return [
    {
      title: guide,
      collapsable: false,
      children: [
        'install',
        'usage',
        'advanced',
      ],
    },
  ];
}
