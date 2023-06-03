import express from 'express'
import { proxyMapManage, ErrorResponse, SuccessResponse } from '../utils'

const proxyRouter = express.Router()

proxyRouter.get('/add', (req, res) => {
  const { alias, host } = req.query as { alias: string; host: string }

  if (!alias || !host) {
    return res.json(new ErrorResponse({ msg: '缺少参数' }))
  }

  if (!proxyMapManage.add(alias, host)) {
    return res.json(new ErrorResponse({ msg: '添加失败' }))
  }

  res.json(new SuccessResponse({ msg: '添加成功' }))
})

proxyRouter.get('/delete', (req, res) => {
  const { alias } = req.query as { alias: string }

  if (!alias) {
    return res.json(new ErrorResponse({ msg: '缺少参数' }))
  }

  if (proxyMapManage.delete(alias)) {
    return res.json(new SuccessResponse({ msg: '删除成功' }))
  }

  res.json(new ErrorResponse({ msg: '删除失败' }))
})

proxyRouter.get('/set', (req, res) => {
  const { alias, host } = req.query as { alias: string; host: string }

  if (!alias || !host) {
    return res.json(new ErrorResponse({ msg: '缺少参数' }))
  }

  if (proxyMapManage.set(alias, host)) {
    return res.json(new SuccessResponse({ msg: '修改成功' }))
  }

  res.json(new ErrorResponse({ msg: '修改失败' }))
})

proxyRouter.get('/get', (req, res) => {
  const { alias } = req.query as { alias: string }

  if (!alias) {
    res.json(
      new SuccessResponse({
        data: Array.from(proxyMapManage.getCacheData()).reduce((acc, [alias, host]) => {
          acc[alias] = host
          return acc
        }, {} as Record<string, string>),
      })
    )
    return
  }

  const host = proxyMapManage.get(alias)

  if (!host) {
    res.json(new ErrorResponse({ msg: '无此代理' }))
    return
  }

  res.json(
    new SuccessResponse({
      data: {
        [alias]: host,
      },
    })
  )
})


export default proxyRouter
