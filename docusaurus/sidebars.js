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
      label: 'Architecture',
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
      label: 'Fonctionnalités',
      items: [
        'features/device-management',
        'features/frequency-management',
        'features/licensing',
        'features/authentication',
      ],
    },
    {
      type: 'category',
      label: 'Protocoles',
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
      label: 'Configuration',
      items: [
        'configuration/environment',
        'configuration/database',
        'configuration/licensing',
      ],
    },
    {
      type: 'category',
      label: 'Développement',
      items: [
        'development/setup',
        'development/contributing',
        'development/testing',
      ],
    },
  ],
};

module.exports = sidebars; 