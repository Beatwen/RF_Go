import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug', '5ff'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config', '5ba'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content', 'a2b'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData', 'c3c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata', '156'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry', '88c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes', '000'),
    exact: true
  },
  {
    path: '/docs',
    component: ComponentCreator('/docs', '642'),
    routes: [
      {
        path: '/docs',
        component: ComponentCreator('/docs', '76d'),
        routes: [
          {
            path: '/docs',
            component: ComponentCreator('/docs', 'b58'),
            routes: [
              {
                path: '/docs/',
                component: ComponentCreator('/docs/', '0ee'),
                exact: true
              },
              {
                path: '/docs/api/interfaces',
                component: ComponentCreator('/docs/api/interfaces', '4a4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/api/models',
                component: ComponentCreator('/docs/api/models', '902'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/api/overview',
                component: ComponentCreator('/docs/api/overview', '5d7'),
                exact: true
              },
              {
                path: '/docs/api/services',
                component: ComponentCreator('/docs/api/services', '1d2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/architecture',
                component: ComponentCreator('/docs/architecture', '4b2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/architecture/class-diagram',
                component: ComponentCreator('/docs/architecture/class-diagram', 'bdf'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/architecture/components',
                component: ComponentCreator('/docs/architecture/components', '44e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/architecture/data-flow',
                component: ComponentCreator('/docs/architecture/data-flow', '6bc'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/architecture/overview',
                component: ComponentCreator('/docs/architecture/overview', '833'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/architecture/use-cases',
                component: ComponentCreator('/docs/architecture/use-cases', '0eb'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/configuration/database',
                component: ComponentCreator('/docs/configuration/database', 'b4a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/configuration/environment',
                component: ComponentCreator('/docs/configuration/environment', '08a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/configuration/guide',
                component: ComponentCreator('/docs/configuration/guide', '762'),
                exact: true
              },
              {
                path: '/docs/configuration/licensing',
                component: ComponentCreator('/docs/configuration/licensing', 'cd0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/development/contributing',
                component: ComponentCreator('/docs/development/contributing', '98b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/development/guide',
                component: ComponentCreator('/docs/development/guide', 'ae9'),
                exact: true
              },
              {
                path: '/docs/development/setup',
                component: ComponentCreator('/docs/development/setup', '375'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/development/testing',
                component: ComponentCreator('/docs/development/testing', 'cf3'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/docs/architecture/overview',
                component: ComponentCreator('/docs/docs/architecture/overview', 'ff0'),
                exact: true
              },
              {
                path: '/docs/features/authentication',
                component: ComponentCreator('/docs/features/authentication', 'cb4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/features/device-management',
                component: ComponentCreator('/docs/features/device-management', '91f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/features/frequency-management',
                component: ComponentCreator('/docs/features/frequency-management', '1b1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/features/licensing',
                component: ComponentCreator('/docs/features/licensing', '5a9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/features/workflows',
                component: ComponentCreator('/docs/features/workflows', '635'),
                exact: true
              },
              {
                path: '/docs/getting-started',
                component: ComponentCreator('/docs/getting-started', '2a1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/intro',
                component: ComponentCreator('/docs/intro', '61d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/protocols/device-specific',
                component: ComponentCreator('/docs/protocols/device-specific', 'bdd'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/protocols/dns-discovery',
                component: ComponentCreator('/docs/protocols/dns-discovery', 'e5e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/protocols/udp-tcp',
                component: ComponentCreator('/docs/protocols/udp-tcp', '0f9'),
                exact: true,
                sidebar: "tutorialSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
