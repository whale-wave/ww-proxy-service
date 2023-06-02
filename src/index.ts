import express from 'express'
import config from './config'
import { initRoute } from './routes'
import { proxyMapManage } from './utils'

const app = express()

initRoute(app)
proxyMapManage.loadCacheData()

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`)
})
