import fs from 'fs'
import path from 'path'
import config from '../config'

export const DATA_BASE = config.database || process.cwd()
export const DATABASE_DIR_PATH = path.join(DATA_BASE, '.database')
export const PROXY_FILE_PATH = path.join(DATABASE_DIR_PATH, 'proxy.json')
export const LOG_DIR_PATH = path.join(DATABASE_DIR_PATH, 'logs')

const dirs = [DATABASE_DIR_PATH, LOG_DIR_PATH]

dirs.forEach(dirPath => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath)
  }
})

if (!fs.existsSync(PROXY_FILE_PATH)) {
  fs.writeFileSync(PROXY_FILE_PATH, JSON.stringify({}))
}
