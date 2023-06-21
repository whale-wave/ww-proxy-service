import dotenv from 'dotenv'

dotenv.config()

export default {
  port: process.env.PORT || 6000,
  database: process.env.DATABASE_BASE || '',
  config: {
    logSecret: process.env.CONFIG_SECRET || '',
  },
}
