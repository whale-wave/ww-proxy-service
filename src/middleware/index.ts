import { createProxyMiddleware } from 'http-proxy-middleware'
import { ErrorResponse, logger, proxyMapManage } from '../utils'
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
    onProxyReq: (_, req) => {
      let bodyStr = ''

      req.on('data', chunk => {
        console.log('proxy chuck')
        bodyStr += chunk.toString()
      })

      req.on('end', () => {
        let body = {}
        try {
          body = JSON.parse(bodyStr)
        } catch (e) {}
        const { method, url, query, headers, ip } = req
        logger.daily.info(method, url, query, body, headers['user-agent'], headers.host, ip)
      })
    },
    changeOrigin: true,
  })

  proxy(req, res, next)
}
