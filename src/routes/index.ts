import express, { Application } from 'express'
import { default as proxyRouter } from './proxy'
import { forwardRouter } from './forward'

const apiRouter = express.Router()
apiRouter.use('/proxy', proxyRouter)
apiRouter.use('/forward', forwardRouter)

export const initRoute = (app: Application) => {
  app.use('/api', apiRouter)
}
