import express, { Application } from 'express'
import { default as proxyRouter } from './proxy'

const apiRouter = express.Router()
apiRouter.use('/proxy', proxyRouter)

export const initRoute = (app: Application) => {
  app.use('/api', apiRouter)
}
