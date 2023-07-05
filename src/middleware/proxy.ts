import { createProxyMiddleware } from 'http-proxy-middleware'
import { ErrorResponse, logger, proxyMapManage } from '../utils'
import { NextFunction, Request, Response } from 'express'
import zlib from 'zlib'
import { IncomingMessage } from 'http'
import config from '../config'

export const proxyMid = (req: Request, res: Response, next: NextFunction) => {
  const { alias } = req.params as { alias: string }
  const host = proxyMapManage.get(req.params.alias)

  if (!host) {
    return res.json(new ErrorResponse({ msg: '无此代理' }))
  }

  const { method, url, query, headers, ip } = req

  const proxy = createProxyMiddleware({
    target: host,
    pathRewrite: {
      [`^/api/proxy/to/${alias}`]: '',
    },
    onProxyReq: (_, req) => {
      let bodyStr = ''

      req.on('data', chunk => {
        bodyStr += chunk.toString()
      })

      req.on('end', () => {
        let body = {}
        try {
          body = JSON.parse(bodyStr)
        } catch (e) {}
        if (config.config.logSecret) {
          logger.daily.info(
            'proxy to req',
            alias,
            host,
            method,
            url,
            query,
            body,
            headers['user-agent'],
            headers.host,
            ip
          )
        }
      })
    },
    onProxyRes: proxyRes => {
      const rawData = [] as any[]
      let gunzip: IncomingMessage | zlib.Gunzip

      if (config.config.logSecret) {
        logger.debug.debug('proxyRes headers', proxyRes.headers)
      }

      const contentEncoding = proxyRes.headers['content-encoding']
      if (contentEncoding && contentEncoding.includes('gzip')) {
        gunzip = zlib.createGunzip()
        proxyRes.pipe(gunzip)
      } else {
        gunzip = proxyRes
      }

      gunzip.on('data', chunk => {
        rawData.push(chunk)
      })

      gunzip.on('end', () => {
        const resStr = Buffer.concat(rawData).toString()
        let body = resStr
        try {
          body = JSON.stringify(JSON.parse(resStr), null, 2)
        } catch (e) {}
        if (config.config.logSecret) {
          logger.daily.info('proxy to res', alias, host, method, url, body, headers['user-agent'], headers.host, ip)
        }
      })

      gunzip.on('error', err => {
        logger.error.error('proxy to res error', err)
      })
    },
    changeOrigin: true,
  })

  proxy(req, res, next)
}
