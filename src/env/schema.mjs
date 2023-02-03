// @ts-check
import { z } from 'zod'

/**
 * Specify your server-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 */
export const serverSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
})

/**
 * Specify your client-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 * To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
export const clientSchema = z.object({
  NEXT_PUBLIC_BE_URL: z.string(),
  NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID: z.string(),
  NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_SECRET: z.string(),
  NEXT_PUBLIC_GOOGLE_OAUTH_REDIRECT_URL: z.string(),
  NEXT_PUBLIC_SECRET_KEY: z.string(),
})

/**
 * You can't destruct `process.env` as a regular object, so you have to do
 * it manually here. This is because Next.js evaluates this at build time,
 * and only used environment variables are included in the build.
 * @type {{ [k in keyof z.infer<typeof clientSchema>]: z.infer<typeof clientSchema>[k] | undefined }}
 */
export const clientEnv = {
  NEXT_PUBLIC_BE_URL: process.env.NEXT_PUBLIC_BE_URL,
  NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID:
    process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID,
  NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_SECRET:
    process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_SECRET,
  NEXT_PUBLIC_GOOGLE_OAUTH_REDIRECT_URL:
    process.env.NEXT_PUBLIC_GOOGLE_OAUTH_REDIRECT_URL,
  NEXT_PUBLIC_SECRET_KEY: process.env.NEXT_PUBLIC_SECRET_KEY,
}
