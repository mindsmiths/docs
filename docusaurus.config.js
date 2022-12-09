// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");
require("dotenv").config();

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Mindsmiths Platform",
  tagline: "Unleash The Power Of Autonomy",
  url: "https://docs.mindsmiths.com",
  baseUrl: "/",
  onBrokenLinks: "throw",
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
            spec: "static/httpapi/swagger.yaml",
            url: "/httpapi/swagger.yaml",
            route: "/api/",
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
        title: "Mindsmiths Docs",
        logo: {
          alt: "Mindsmiths Logo",
          src: "img/logo.png",
        },
        items: [
          {
            href: "https://discord.com/invite/mindsmiths",
            label: "Discord",
            position: "right",
          },
        ],
      },
      footer: {
        copyright: `Copyright © ${new Date().getFullYear()} Mindsmiths`,
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
