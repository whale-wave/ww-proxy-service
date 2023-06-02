import fs from 'fs'
import { PROXY_FILE_PATH } from '../preInit'

class ProxyMapManage {
  private cacheMap = new Map<string, string>()
  private writeCacheData() {
    fs.writeFileSync(PROXY_FILE_PATH, JSON.stringify(Object.fromEntries(this.cacheMap)))
  }

  loadCacheData() {
    const data = JSON.parse(fs.readFileSync(PROXY_FILE_PATH, { encoding: 'utf-8' }))
    this.cacheMap = new Map(Object.entries(data))
  }
  getCacheData() {
    return this.cacheMap
  }
  add(alias: string, host: string): boolean {
    if (this.cacheMap.has(alias)) {
      return false
    }
    this.cacheMap.set(alias, host)
    this.writeCacheData()
    return true
  }
  delete(alias: string): boolean {
    if (!this.cacheMap.has(alias)) {
      return false
    }
    this.cacheMap.delete(alias)
    this.writeCacheData()
    return true
  }
  set(alias: string, host: string): boolean {
    if (!this.cacheMap.has(alias)) {
      return false
    }
    this.cacheMap.set(alias, host)
    this.writeCacheData()
    return true
  }
  get(alias: string): string | undefined {
    return this.cacheMap.get(alias)
  }
}

export default new ProxyMapManage()
