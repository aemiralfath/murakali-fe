/** @type {import("prettier").Config} */
module.exports = {
  plugins: [require.resolve('prettier-plugin-tailwindcss')],
  trailingComma: 'es5',
  tabWidth: 2,
  semi: false,
  singleQuote: true,
  importOrder: [
    '^react(.*)',
    'next/(.*)',
    '@/(.*)',
    '<THIRD_PARTY_MODULES>',
    '^[./]',
  ],
  importOrderSeparation: true,
}
