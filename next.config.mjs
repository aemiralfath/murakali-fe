// @ts-check
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
// TODO: Delete image domains
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env/server.mjs"));

/** @type {import("next").NextConfig} */
const config = {
  images: {
    domains: ['res.cloudinary.com', 'images.unsplash.com', 'i.ebayimg.com', 'cf.shopee.co.id', 'images.tokopedia.net']
  },
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
};
export default config;
