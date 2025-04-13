import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/docs/',
    component: ComponentCreator('/docs/', '712'),
    routes: [
      {
        path: '/docs/',
        component: ComponentCreator('/docs/', 'd49'),
        routes: [
          {
            path: '/docs/',
            component: ComponentCreator('/docs/', '83f'),
            routes: [
              {
                path: '/docs/',
                component: ComponentCreator('/docs/', '0ee'),
                exact: true
              },
              {
                path: '/docs/api/interfaces/',
                component: ComponentCreator('/docs/api/interfaces/', '815'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/api/models/',
                component: ComponentCreator('/docs/api/models/', '2e5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/api/overview/',
                component: ComponentCreator('/docs/api/overview/', '128'),
                exact: true
              },
              {
                path: '/docs/api/services/',
                component: ComponentCreator('/docs/api/services/', '37d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/architecture/',
                component: ComponentCreator('/docs/architecture/', '3f2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/architecture/class-diagram/',
                component: ComponentCreator('/docs/architecture/class-diagram/', '967'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/architecture/components/',
                component: ComponentCreator('/docs/architecture/components/', '3f4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/architecture/data-flow/',
                component: ComponentCreator('/docs/architecture/data-flow/', 'af2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/architecture/overview/',
                component: ComponentCreator('/docs/architecture/overview/', 'b3e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/architecture/use-cases/',
                component: ComponentCreator('/docs/architecture/use-cases/', 'b67'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/configuration/database/',
                component: ComponentCreator('/docs/configuration/database/', '263'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/configuration/environment/',
                component: ComponentCreator('/docs/configuration/environment/', 'dfc'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/configuration/guide/',
                component: ComponentCreator('/docs/configuration/guide/', '912'),
                exact: true
              },
              {
                path: '/docs/configuration/licensing/',
                component: ComponentCreator('/docs/configuration/licensing/', '5c8'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/development/contributing/',
                component: ComponentCreator('/docs/development/contributing/', 'e22'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/development/guide/',
                component: ComponentCreator('/docs/development/guide/', '161'),
                exact: true
              },
              {
                path: '/docs/development/setup/',
                component: ComponentCreator('/docs/development/setup/', '549'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/development/testing/',
                component: ComponentCreator('/docs/development/testing/', '768'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/docs/architecture/overview/',
                component: ComponentCreator('/docs/docs/architecture/overview/', '851'),
                exact: true
              },
              {
                path: '/docs/features/authentication/',
                component: ComponentCreator('/docs/features/authentication/', 'e7b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/features/device-management/',
                component: ComponentCreator('/docs/features/device-management/', 'fc3'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/features/frequency-management/',
                component: ComponentCreator('/docs/features/frequency-management/', '162'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/features/licensing/',
                component: ComponentCreator('/docs/features/licensing/', 'ab0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/features/workflows/',
                component: ComponentCreator('/docs/features/workflows/', '969'),
                exact: true
              },
              {
                path: '/docs/getting-started/',
                component: ComponentCreator('/docs/getting-started/', '526'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/intro/',
                component: ComponentCreator('/docs/intro/', 'e44'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/protocols/device-specific/',
                component: ComponentCreator('/docs/protocols/device-specific/', '6b9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/protocols/dns-discovery/',
                component: ComponentCreator('/docs/protocols/dns-discovery/', 'f30'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/protocols/udp-tcp/',
                component: ComponentCreator('/docs/protocols/udp-tcp/', '8e1'),
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
