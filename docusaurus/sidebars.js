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
        {
          type: 'category',
          label: 'Use Cases',
          items: [
            'uml-analysis/use-cases/overview',
            'uml-analysis/use-cases/uc-001',
            'uml-analysis/use-cases/uc-002',
            'uml-analysis/use-cases/uc-003',
            'uml-analysis/use-cases/uc-004',
            'uml-analysis/use-cases/uc-005',
            'uml-analysis/use-cases/uc-006',
            'uml-analysis/use-cases/uc-007',
            'uml-analysis/use-cases/uc-008',
            'uml-analysis/use-cases/uc-010',
            
          ],
        },
        'uml-analysis/sequence-diagrams',
        'uml-analysis/activity-diagrams',
        'uml-analysis/class-diagrams',
        'uml-analysis/state-diagrams',
        'uml-analysis/deployment-diagrams',
      ],
    },
    {
      type: 'category',
      label: '🏛️Architecture technique',
      items: [
        'architecture/overview',
        'architecture/deployment',
        'architecture/design-patterns',
        'architecture/data-architecture',
        'architecture/technology-choices',
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
      type: 'doc',
      id: 'api/overview',
      label: '🔑 API Licensing'
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