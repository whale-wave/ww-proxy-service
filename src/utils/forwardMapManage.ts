import fs from 'fs'
import { FORWARD_FILE_PATH } from '../preInit'

class ForwardMapManage {
  private cacheMap = new Map<string, { name: string; host: string }[]>()
  private writeCacheData() {
    fs.writeFileSync(FORWARD_FILE_PATH, JSON.stringify(Object.fromEntries(this.cacheMap)))
  }

  loadCacheData() {
    const data = JSON.parse(fs.readFileSync(FORWARD_FILE_PATH, { encoding: 'utf-8' }))
    this.cacheMap = new Map(Object.entries(data))
  }

  getCacheData() {
    return this.cacheMap
  }

  add({ alias, name, host }: { alias: string; name: string; host: string }): boolean {
    let hostArr = this.cacheMap.get(alias)

    if (!hostArr) {
      hostArr = []
    }

    if (hostArr.find(item => item.name === name)) {
      return false
    }

    hostArr.push({ name, host })

    this.cacheMap.set(alias, hostArr)
    this.writeCacheData()
    return true
  }

  delete({ alias, name }: { alias: string; name?: string }): boolean {
    const hostArr = this.cacheMap.get(alias)
    if (!hostArr) {
      return false
    }

    if (name) {
      const index = hostArr.findIndex(item => item.name === name)
      if (index === -1) {
        return false
      }
      hostArr.splice(index, 1)
      this.cacheMap.set(alias, hostArr)
    } else {
      this.cacheMap.delete(alias)
    }

    this.writeCacheData()
    return true
  }

  set({ alias, name, host }: { alias: string; name: string; host: string }): boolean {
    const hostArr = this.cacheMap.get(alias)
    if (!hostArr) {
      return false
    }

    const index = hostArr.findIndex(item => item.name === name)
    if (index === -1) {
      return false
    }

    hostArr[index].host = host

    this.cacheMap.set(alias, hostArr)
    this.writeCacheData()
    return true
  }

  get(alias: string): { name: string; host: string }[] | undefined {
    return this.cacheMap.get(alias)
  }
}

export const forwardMapManage = new ForwardMapManage()
