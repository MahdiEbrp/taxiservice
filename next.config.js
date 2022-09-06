/** @type {import('next').NextConfig} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withAxiom } = require('next-axiom');

const nextConfig = withAxiom({
  reactStrictMode: false,
  i18n: {
    locales: ['en', 'en-US', 'fa', 'fa-IR'],
    defaultLocale: 'en',
  },
});

module.exports = nextConfig;
