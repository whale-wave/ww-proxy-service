import { ErrorResponse, forwardMapManage, logger } from '../utils'
import { Request, Response } from 'express'
import httpProxy from 'http-proxy'
import config from '../config'

const proxy = httpProxy.createProxyServer({})

export const forwardMid = (req: Request, res: Response) => {
  const { alias } = req.params as { alias: string }
  const hostArr = forwardMapManage.get({ alias })

  if (!(hostArr instanceof Array)) {
    return res.json(
      new ErrorResponse({
        msg: '无此代理',
      })
    )
  }

  if (config.config.logSecret) {
    logger.daily.info('forward mid: ', alias, hostArr)
  }

  const { method, query, headers, ip } = req

  let reqBodyCounter = 0
  let resBodyCounter = 0

  const requests = hostArr.map(({ host }) => {
    return new Promise((resolve, reject) => {
      proxy.web(req, res, { target: host })

      // TODO: body parser for example: gzip
      proxy.once('proxyReq', (_, req) => {
        let body = ''

        req.on('data', chuck => {
          body += chuck.toString()
        })

        req.on('end', () => {
          if (reqBodyCounter === 0 && config.config.logSecret) {
            reqBodyCounter++
            logger.daily.info(`forward mid req ${host}: `, method, query, body, headers['user-agent'], headers.host, ip)
          }
        })
      })

      proxy.once('proxyRes', proxyRes => {
        const rawData = [] as any[]

        proxyRes.once('data', chunk => {
          rawData.push(chunk)
        })

        proxyRes.once('end', () => {
          const body = Buffer.concat(rawData).toString()

          if (resBodyCounter === 0 && config.config.logSecret) {
            resBodyCounter++
            logger.daily.info(`forward mid response ${host}: `, body)
          }
        })

        resolve('success')
      })

      proxy.once('error', err => {
        if (config.config.logSecret) {
          logger.daily.error(`forward mid error ${host}: `, err)
        }
        reject('error')
      })
    })
  })

  Promise.all(requests).then(() => {
    if (config.config.logSecret) {
      logger.daily.info('forward mid: all requests forwarded successfully')
    }
  })
}
