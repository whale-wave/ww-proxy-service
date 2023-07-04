import fs from 'fs'
import { FORWARD_FILE_PATH } from '../preInit'

type ForwardItem = { name: string; host: string }

type ForwardResult = { [alias: string]: ForwardItem[] }

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
    let hostArr = this.cacheMap.get(alias) || []

    if (this.getByName(alias, name)) {
      return false
    }

    hostArr.push({ name, host })

    this.cacheMap.set(alias, hostArr)
    this.writeCacheData()
    return true
  }

  delete({ alias, name }: { alias: string; name?: string }): boolean {
    const hostArr = this.getByAlias(alias)
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
    const hostArr = this.getByAlias(alias)
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

  get({ alias, name }: { alias?: string; name?: string } = {}):
    | ForwardResult
    | ForwardItem[]
    | ForwardItem
    | undefined {
    if (alias) {
      if (name) {
        return this.getByName(alias, name)
      }
      return this.getByAlias(alias)
    }

    return this.getAll()
  }

  private getByAlias(alias: string) {
    return this.cacheMap.get(alias)
  }

  private getByName(alias: string, name: string) {
    const hostArr = this.getByAlias(alias)
    return hostArr?.find(item => item.name === name)
  }

  private getAll(): ForwardResult {
    const result = Array.from(this.cacheMap).reduce((res, [alias, hostArr]) => {
      res[alias] = hostArr
      return res
    }, {} as ForwardResult)
    return result
  }
}

export const forwardMapManage = new ForwardMapManage()
