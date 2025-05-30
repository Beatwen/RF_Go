/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Introduction',
      items: [
        'intro',
        'architecture',
        'getting-started',
      ],
    },
    {
      type: 'category',
      label: '🔍Analyse UML',
      collapsed: false,
      items: [
        'uml-analysis/overview',
        'uml-analysis/use-cases',
        'uml-analysis/sequence-diagrams',
        'uml-analysis/activity-diagrams',
        'uml-analysis/class-diagrams',
        'uml-analysis/state-diagrams',
        'uml-analysis/component-diagrams',
        'uml-analysis/deployment-diagrams',
      ],
    },
    {
      type: 'category',
      label: '🏛️Architecture Technique',
      items: [
        'architecture/overview',
        'architecture/components',
        'architecture/data-flow',
        'architecture/class-diagram',
        'architecture/use-cases',
      ],
    },
    {
      type: 'category',
      label: '⚡Fonctionnalités Métier',
      items: [
        'features/device-management',
        'features/frequency-management',
        'features/time-management',
        'features/frequency-visualization',
        'features/session-management',
        'features/scan-management',
        'features/backup-frequencies',
        'features/licensing',
        'features/authentication',
        'features/workflows',
      ],
    },
    {
      type: 'category',
      label: '🌐 Protocoles et Intégrations',
      items: [
        'protocols/dns-discovery',
        'protocols/udp-tcp',
        'protocols/device-specific',
      ],
    },
    {
      type: 'category',
      label: 'API Interne',
      items: [
        'api/services',
        'api/models',
        'api/interfaces',
      ],
    },
    {
      type: 'category',
      label: 'Configuration et Déploiement',
      items: [
        'configuration/environment',
        'configuration/database',
        'configuration/licensing',
      ],
    },
    {
      type: 'category',
      label: '👨‍💻Guide Développeur',
      items: [
        'development/setup',
        'development/contributing',
        'development/testing',
      ],
    },
  ],
};

module.exports = sidebars; 