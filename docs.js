const Docma = require('docma');
const fs = require('fs');

const packages = fs.readdirSync('./packages');

const config = {
  dest: './docs',
  debug: 16,
  clean: true,
  app: {
    title: 'Endb',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width,initial-scale=1.0' },
    ],
    base: '/endb/',
    entrance: 'content:readme',
    routing: Docma.RoutingMethod.PATH,
    server: Docma.ServerType.GITHUB,
  },
  src: [
    './packages/**/src/*.js',
    { content: './README.md' },
    ...packages.map((package) => ({
      [package]: `./packages/${package}/README.md`,
    })),
  ],
  template: {
    options: {
      title: 'Endb',
      navbar: {
        dark: true,
        menu: [
          { label: 'Home', href: '/' },
          {
            label: 'Packages',
            items: packages.map((package) => ({
              label: package,
              href: `/${package}`,
            })),
          },
          {
            label: 'GitHub',
            href: 'https://github.com/chroventer/endb',
            iconClass: 'fab fa-github',
            target: '_blank',
          },
        ],
      },
    },
  },
  markdown: { sanitize: true },
};

Docma.create()
  .build(config)
  .then(() => console.log('Successfully build the documentation.'))
  .catch(console.error);
