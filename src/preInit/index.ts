import fs from 'fs'
import path from 'path'
import config from '../config'

export const DATA_BASE = config.database || process.cwd()
export const DATABASE_DIR_PATH = path.join(DATA_BASE, '.database')
export const PROXY_FILE_PATH = path.join(DATABASE_DIR_PATH, 'proxy.json')
export const FORWARD_FILE_PATH = path.join(DATABASE_DIR_PATH, 'forward.json')
export const LOG_DIR_PATH = path.join(DATABASE_DIR_PATH, 'logs')

const dirs = [DATABASE_DIR_PATH, LOG_DIR_PATH]

dirs.forEach(dirPath => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath)
  }
})

const createFileArr = [PROXY_FILE_PATH, FORWARD_FILE_PATH]

createFileArr.forEach(filePath => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({}))
  }
})
