// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");
require("dotenv").config();

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Mindsmiths",
  tagline: "A platform for enhancing human-machine cooperation by building AI-first solutions",
  url: "https://docs.mindsmiths.com",
  baseUrl: "/",
  onBrokenLinks: "warn",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  organizationName: "mindsmiths",
  projectName: "platform-docs",

  plugins: [
    [
      "@docusaurus/plugin-google-gtag",
      {
        trackingID: process.env.GA_TRACKING_ID || "example",
      },
    ],
  ],
  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: "https://github.com/mindsmiths/docs/tree/main",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
    // Redocusaurus config
    [
      "redocusaurus",
      {
        // Plugin Options for loading OpenAPI files
        specs: [
          {
            spec: "static/http-api/swagger.yaml",
            url: "/http-api/swagger.yaml",
            route: "/http-api/",
          },
        ],
        // Theme Options for modifying how redoc renders them
        theme: {
          // Change with your site colors
          primaryColor: "#1890ff",
        },
      },
    ],
  ],
  themes: ["@easyops-cn/docusaurus-search-local"],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: "Mindsmiths",
        logo: {
          alt: "Mindsmiths Logo",
          src: "img/logo.png",
        },
        items: [
          {
            type: "doc",
            label: "Docs",
            docId: 'platform/getting-started',
            position: "left",
            sidebarPath: "platformSidebar",
          },
          {
            type: "doc",
            label: "Tutorials",
            docId: "tutorials/getting-started",
            position: "left",
            sidebarPath: "tutorialsSidebar",
          },
          {
            type: "doc",
            label: "Integrations",
            docId: "integrations/getting-started",
            position: "left",
            sidebarPath: "integrationsSidebar",
          },
          {
            type: "doc",
            label: "Community",
            docId: "community",
            position: "right",
          },
        ],
      },
      footer: {
        copyright: `Copyright © ${new Date().getFullYear()} Mindsmiths`,
      },
      colorMode: {
        defaultMode: 'light',
        disableSwitch: true,
        respectPrefersColorScheme: false,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ["java", "scala", "diff"],
        magicComments: [
          // Remember to extend the default highlight class name as well!
          {
            className: "theme-code-block-highlighted-line",
            line: "highlight-next-line",
            block: { start: "highlight-start", end: "highlight-end" },
          },
          {
            className: "code-block-added-line",
            line: "highlight-added-line",
            block: {
              start: "highlight-added-start",
              end: "highlight-added-end",
            },
          },
          {
            className: "code-block-changed-line",
            line: "highlight-changed-line",
            block: {
              start: "highlight-changed-start",
              end: "highlight-changed-end",
            },
          },
          {
            className: "code-block-removed-line",
            line: "highlight-removed-line",
            block: {
              start: "highlight-removed-start",
              end: "highlight-removed-end",
            },
          },
        ],
      },
    }),
};

module.exports = config;
