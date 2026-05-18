export default {
  scenarios: [
    {
      name: 'ember-lts-4.12',
      npm: {
        devDependencies: {
          'ember-source': '~4.12.0',
        },
      },
    },
    {
      name: 'ember-lts-5.4',
      npm: {
        devDependencies: {
          'ember-source': '~5.4.0',
        },
      },
    },
    {
      name: 'ember-lts-5.8',
      npm: {
        devDependencies: {
          'ember-source': '~5.8.0',
        },
      },
    },
    {
      name: 'ember-lts-5.12',
      npm: {
        devDependencies: {
          'ember-source': '~5.12.0',
        },
      },
    },
    {
      name: 'ember-lts-6.4',
      npm: {
        devDependencies: {
          'ember-source': 'npm:ember-source@~6.4.0',
        },
      },
    },
    {
      name: 'ember-lts-6.8',
      npm: {
        devDependencies: {
          'ember-source': 'npm:ember-source@~6.8.0',
        },
      },
    },
    {
      name: 'ember-lts-6.12',
      npm: {
        devDependencies: {
          'ember-source': 'npm:ember-source@~6.12.0',
        },
      },
    },
    {
      name: 'ember-latest',
      npm: {
        devDependencies: {
          'ember-source': 'npm:ember-source@latest',
        },
      },
    },
    {
      name: 'ember-beta',
      npm: {
        devDependencies: {
          'ember-source': 'npm:ember-source@beta',
        },
      },
    },
    {
      name: 'ember-alpha',
      npm: {
        devDependencies: {
          'ember-source': 'npm:ember-source@alpha',
        },
      },
    },
  ],
};
