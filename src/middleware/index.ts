import { createProxyMiddleware } from 'http-proxy-middleware'
import { ErrorResponse, proxyMapManage } from '../utils'
import { NextFunction, Request, Response } from 'express'

export const proxyMid = (req: Request, res: Response, next: NextFunction) => {
  const { alias } = req.params as { alias: string }
  const host = proxyMapManage.get(req.params.alias)

  if (!host) {
    return res.json(new ErrorResponse({ msg: '无此代理' }))
  }

  const proxy = createProxyMiddleware({
    target: host,
    pathRewrite: {
      [`^/api/proxy/to/${alias}`]: '',
    },
    changeOrigin: true,
  })

  proxy(req, res, next)
}
