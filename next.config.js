/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  env: {
    SLACK_BOT_TOKEN: process.env.SLACK_BOT_TOKEN,
    SLACK_SIGNING_SECRET: process.env.SLACK_SIGNING_SECRET,
    OBSIDIAN_VAULT_PATH: process.env.OBSIDIAN_VAULT_PATH,
    DATABASE_URL: process.env.DATABASE_URL,
  },
}

module.exports = nextConfig