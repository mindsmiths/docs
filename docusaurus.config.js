// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Mindsmiths Platform',
  tagline: 'Unleash The Power Of Autonomy',
  url: 'https://docs.mindsmiths.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'mindsmiths',
  projectName: 'platform-docs',

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/mindsmiths/docs/tree/main',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Docs',
        logo: {
          alt: 'Mindsmiths Logo',
          src: 'img/logo.png',
        },
        items: [
          {
            type: 'doc',
            docId: 'Forge/forge-intro',
            position: 'left',
            label: 'Platform',
          },
          {
            type: 'doc',
            docId: 'Coding Environment/environment-setup',
            position: 'left',
            label: 'Environment',
          },
          {
            type: 'doc',
            docId: 'Quickstart/intro',
            position: 'left',
            label: 'Quickstart',
          },
          {
            href: 'https://www.mindsmiths.com/',
            label: 'Mindsmiths',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Platform',
                to: '/docs/Forge/forge-intro',
              },
              {
                label: 'Quickstart',
                to: '/docs/Quickstart/intro',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Discord',
                href: 'https://discord.gg/knYDVJ5Ez8',
              },
            ],
          },
        ],
        copyright: `Copyright ?? ${new Date().getFullYear()} Mindsmiths`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: [
          'java',
          'scala',
          'diff',
        ],
        magicComments: [
            // Remember to extend the default highlight class name as well!
            {
              className: 'theme-code-block-highlighted-line',
              line: 'highlight-next-line',
              block: {start: 'highlight-start', end: 'highlight-end'},
            },
            {
              className: 'code-block-added-line',
              line: 'highlight-added-line',
              block: {start: 'highlight-added-start', end: 'highlight-added-end'},
            },
            {
              className: 'code-block-changed-line',
              line: 'highlight-changed-line',
              block: {start: 'highlight-changed-start', end: 'highlight-changed-end'},
            },
            {
              className: 'code-block-removed-line',
              line: 'highlight-removed-line',
              block: {start: 'highlight-removed-start', end: 'highlight-removed-end'},
            },
        ],
      },
    }),
};

module.exports = config;
