import fs from 'fs'
import path from 'path'
import config from '../config'

export const DATA_BASE = config.database || process.cwd()
export const DATABASE_DIR_PATH = path.join(DATA_BASE, '.database')
export const PROXY_FILE_PATH = path.join(DATABASE_DIR_PATH, 'proxy.json')

if (!fs.existsSync(DATABASE_DIR_PATH)) {
  fs.mkdirSync(DATABASE_DIR_PATH)
}

if (!fs.existsSync(PROXY_FILE_PATH)) {
  fs.writeFileSync(PROXY_FILE_PATH, JSON.stringify({}))
}
