import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/RF_Go/__docusaurus/debug/',
    component: ComponentCreator('/RF_Go/__docusaurus/debug/', '981'),
    exact: true
  },
  {
    path: '/RF_Go/__docusaurus/debug/config/',
    component: ComponentCreator('/RF_Go/__docusaurus/debug/config/', 'e40'),
    exact: true
  },
  {
    path: '/RF_Go/__docusaurus/debug/content/',
    component: ComponentCreator('/RF_Go/__docusaurus/debug/content/', '432'),
    exact: true
  },
  {
    path: '/RF_Go/__docusaurus/debug/globalData/',
    component: ComponentCreator('/RF_Go/__docusaurus/debug/globalData/', '27e'),
    exact: true
  },
  {
    path: '/RF_Go/__docusaurus/debug/metadata/',
    component: ComponentCreator('/RF_Go/__docusaurus/debug/metadata/', 'f35'),
    exact: true
  },
  {
    path: '/RF_Go/__docusaurus/debug/registry/',
    component: ComponentCreator('/RF_Go/__docusaurus/debug/registry/', '708'),
    exact: true
  },
  {
    path: '/RF_Go/__docusaurus/debug/routes/',
    component: ComponentCreator('/RF_Go/__docusaurus/debug/routes/', 'fef'),
    exact: true
  },
  {
    path: '/RF_Go/docs/',
    component: ComponentCreator('/RF_Go/docs/', 'b01'),
    routes: [
      {
        path: '/RF_Go/docs/',
        component: ComponentCreator('/RF_Go/docs/', '614'),
        routes: [
          {
            path: '/RF_Go/docs/',
            component: ComponentCreator('/RF_Go/docs/', '795'),
            routes: [
              {
                path: '/RF_Go/docs/',
                component: ComponentCreator('/RF_Go/docs/', 'a15'),
                exact: true
              },
              {
                path: '/RF_Go/docs/api/interfaces/',
                component: ComponentCreator('/RF_Go/docs/api/interfaces/', '160'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/RF_Go/docs/api/models/',
                component: ComponentCreator('/RF_Go/docs/api/models/', '218'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/RF_Go/docs/api/overview/',
                component: ComponentCreator('/RF_Go/docs/api/overview/', '7c9'),
                exact: true
              },
              {
                path: '/RF_Go/docs/api/services/',
                component: ComponentCreator('/RF_Go/docs/api/services/', 'bd9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/RF_Go/docs/architecture/',
                component: ComponentCreator('/RF_Go/docs/architecture/', '00e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/RF_Go/docs/architecture/class-diagram/',
                component: ComponentCreator('/RF_Go/docs/architecture/class-diagram/', '048'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/RF_Go/docs/architecture/components/',
                component: ComponentCreator('/RF_Go/docs/architecture/components/', '321'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/RF_Go/docs/architecture/data-flow/',
                component: ComponentCreator('/RF_Go/docs/architecture/data-flow/', '554'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/RF_Go/docs/architecture/overview/',
                component: ComponentCreator('/RF_Go/docs/architecture/overview/', 'a30'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/RF_Go/docs/architecture/use-cases/',
                component: ComponentCreator('/RF_Go/docs/architecture/use-cases/', '290'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/RF_Go/docs/configuration/database/',
                component: ComponentCreator('/RF_Go/docs/configuration/database/', '62c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/RF_Go/docs/configuration/environment/',
                component: ComponentCreator('/RF_Go/docs/configuration/environment/', 'a5a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/RF_Go/docs/configuration/guide/',
                component: ComponentCreator('/RF_Go/docs/configuration/guide/', '4ed'),
                exact: true
              },
              {
                path: '/RF_Go/docs/configuration/licensing/',
                component: ComponentCreator('/RF_Go/docs/configuration/licensing/', '8e6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/RF_Go/docs/development/contributing/',
                component: ComponentCreator('/RF_Go/docs/development/contributing/', 'bbb'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/RF_Go/docs/development/guide/',
                component: ComponentCreator('/RF_Go/docs/development/guide/', '5b0'),
                exact: true
              },
              {
                path: '/RF_Go/docs/development/setup/',
                component: ComponentCreator('/RF_Go/docs/development/setup/', '881'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/RF_Go/docs/development/testing/',
                component: ComponentCreator('/RF_Go/docs/development/testing/', '624'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/RF_Go/docs/docs/architecture/overview/',
                component: ComponentCreator('/RF_Go/docs/docs/architecture/overview/', '6cc'),
                exact: true
              },
              {
                path: '/RF_Go/docs/features/authentication/',
                component: ComponentCreator('/RF_Go/docs/features/authentication/', 'f25'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/RF_Go/docs/features/device-management/',
                component: ComponentCreator('/RF_Go/docs/features/device-management/', '3bc'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/RF_Go/docs/features/frequency-management/',
                component: ComponentCreator('/RF_Go/docs/features/frequency-management/', '157'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/RF_Go/docs/features/licensing/',
                component: ComponentCreator('/RF_Go/docs/features/licensing/', '00a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/RF_Go/docs/features/workflows/',
                component: ComponentCreator('/RF_Go/docs/features/workflows/', 'a26'),
                exact: true
              },
              {
                path: '/RF_Go/docs/getting-started/',
                component: ComponentCreator('/RF_Go/docs/getting-started/', '354'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/RF_Go/docs/intro/',
                component: ComponentCreator('/RF_Go/docs/intro/', 'f07'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/RF_Go/docs/protocols/device-specific/',
                component: ComponentCreator('/RF_Go/docs/protocols/device-specific/', '656'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/RF_Go/docs/protocols/dns-discovery/',
                component: ComponentCreator('/RF_Go/docs/protocols/dns-discovery/', '38d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/RF_Go/docs/protocols/udp-tcp/',
                component: ComponentCreator('/RF_Go/docs/protocols/udp-tcp/', '008'),
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
