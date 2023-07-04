import express from 'express'
import { forwardMapManage, ErrorResponse, SuccessResponse } from '../utils'
import httpProxy from 'http-proxy'

const proxy = httpProxy.createProxyServer({})

export const forwardRouter = express.Router()

forwardRouter.get('/add', (req, res) => {
  const { alias, name, host } = req.query as { alias: string; host: string; name: string }

  if (!alias || !host || !name) {
    return res.json(new ErrorResponse({ msg: '缺少参数' }))
  }

  if (!forwardMapManage.add({ alias, name, host })) {
    return res.json(new ErrorResponse({ msg: '添加失败' }))
  }

  res.json(new SuccessResponse({ msg: '添加成功' }))
})

forwardRouter.get('/delete', (req, res) => {
  const { alias, name } = req.query as { alias?: string; name?: string }

  if (!alias) {
    return res.json(new ErrorResponse({ msg: '缺少参数' }))
  }

  if (name) {
    if (forwardMapManage.delete({ alias, name })) {
      return res.json(new SuccessResponse({ msg: '删除成功' }))
    }
    return res.json(new ErrorResponse({ msg: '删除失败' }))
  }

  if (forwardMapManage.delete({ alias })) {
    return res.json(new SuccessResponse({ msg: '删除成功' }))
  }

  res.json(new ErrorResponse({ msg: '删除失败' }))
})

forwardRouter.get('/set', (req, res) => {
  const { alias, host, name } = req.query as { alias?: string; host?: string; name?: string }

  if (!alias || !host || !name) {
    return res.json(new ErrorResponse({ msg: '缺少参数' }))
  }

  if (
    forwardMapManage.set({
      alias,
      host,
      name,
    })
  ) {
    return res.json(new SuccessResponse({ msg: '修改成功' }))
  }

  res.json(new ErrorResponse({ msg: '修改失败' }))
})

forwardRouter.get('/get', (req, res) => {
  const { alias, name } = req.query as { alias?: string; name?: string }

  if (!alias) {
    res.json(
      new SuccessResponse({
        data: forwardMapManage.get(),
      })
    )
    return
  }

  const hostArr = forwardMapManage.get({ alias, name })

  if (!hostArr) {
    res.json(new ErrorResponse({ msg: '无此代理' }))
    return
  }

  res.json(
    new SuccessResponse({
      data: {
        [alias]: hostArr,
      },
    })
  )
})

forwardRouter.use('/to/:alias', (req, res) => {
  const alias = req.params.alias
  if (!alias) {
    return res.json(new ErrorResponse({ msg: '缺少参数' }))
  }

  const hostArr = forwardMapManage.get({ alias })

  if (!(hostArr instanceof Array)) {
    return res.json(
      new ErrorResponse({
        msg: '无此代理',
      })
    )
  }

  console.log(hostArr, 'layouwen')

  const requests = hostArr.map(({ host }) => {
    return new Promise((resolve, reject) => {
      proxy.web(req, res, { target: host }, err => {
        reject(err)
      })
    })
  })

  Promise.all(requests).catch(err => {
    console.error('Error forwarding request:', err)
    res.status(500).send('Error forwarding request')
  })
})
