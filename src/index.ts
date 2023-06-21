import { proxyMid } from './middleware'
import express from 'express'
import config from './config'
import { initRoute } from './routes'
import { proxyMapManage, logger } from './utils'
import './preInit'
// @ts-ignore
import { expressMid } from 'avan-logger'
import cors from 'cors'
import bodyParser from 'body-parser'

const app = express()

app.use(
  cors({
    origin: '*',
  })
)

app.use('/api/proxy/to/:alias', proxyMid)

app.use(bodyParser.json())
if (config.config.logSecret) {
  app.use(expressMid(logger as any))
}

initRoute(app)
proxyMapManage.loadCacheData()

app.listen(config.port, () => {
  if (config.config.logSecret) {
    logger.daily.mark('Program start')
    logger.daily.info('Server running on port', config.port)
  }
})
