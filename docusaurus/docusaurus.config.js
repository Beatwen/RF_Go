// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const { themes } = require('prism-react-renderer');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'RF Go Documentation',
  tagline: 'Gestion de fréquences audio professionnelle',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://beatwen.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/RF_Go/',
  trailingSlash: true,

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'Beatwen', // Usually your GitHub org/user name.
  projectName: 'RF_Go', // Usually your repo name.

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  // i18n: {
  //   defaultLocale: 'en',
  //   locales: ['en', 'fr'],
  // },

  themes: ['@docusaurus/theme-mermaid'],

  markdown: {
    mermaid: true,
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/', // Serve docs at the site root instead of /docs/
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/Beatwen/RF_Go/tree/main/',
        },
        blog: false, // Disable blog
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
          {
            from: '/docs/intro',
            to: '/intro',
          },
          {
            from: '/docs',
            to: '/intro',
          },
        ],
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        logo: {
          alt: 'RF Go Logo',
          src: 'img/logo.svg',
          srcDark: 'img/logo-dark.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Documentation',
          },
          {
            href: 'https://github.com/Beatwen/rf_go',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Documentation',
            items: [
              {
                label: 'Introduction',
                to: '/intro',
              },
              {
                label: 'Analyse UML',
                to: '/uml-analysis/overview',
              },
              {
                label: 'Architecture',
                to: '/architecture/overview',
              },
            ],
          },
          {
            title: 'Ressources',
            items: [
              {
                label: 'API Licensing',
                to: '/api/overview',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/Beatwen/rf_go',
              },
            ],
          },
          {
            title: 'Projet TFE',
            items: [
              {
                label: 'RF.Go Application',
                href: 'https://github.com/Beatwen/rf_go',
              },
              {
                label: 'Documentation Source',
                href: 'https://github.com/Beatwen/RF_Go/tree/main/docusaurus',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} RF Go - Documentation TFE. Built with Docusaurus.`,
      },
      prism: {
        theme: themes.github,
        darkTheme: themes.dracula,
      },
    }),
};

module.exports = config; 