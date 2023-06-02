import fs from 'fs'
import path from 'path'
import config from '../config'

export const DATA_BASE = config.database || path.resolve(__dirname, '../..')
export const DATABASE_DIR_PATH = path.resolve(DATA_BASE, '.database')
export const PROXY_FILE_PATH = path.resolve(DATABASE_DIR_PATH, 'proxy.json')

if (!fs.existsSync(DATABASE_DIR_PATH)) {
  fs.mkdirSync(DATABASE_DIR_PATH)
}

if (!fs.existsSync(PROXY_FILE_PATH)) {
  fs.writeFileSync(PROXY_FILE_PATH, JSON.stringify({}))
}
