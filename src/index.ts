import express from 'express'
import config from './config'
import { initRoute } from './routes'
import { proxyMapManage, logger } from './utils'
import './preInit'
// @ts-ignore
import { expressMid } from 'avan-logger'
import cors from 'cors'

const app = express()

app.use(cors({
  origin: '*',
}))
app.use(expressMid(logger as any))

initRoute(app)
proxyMapManage.loadCacheData()

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`)
})
