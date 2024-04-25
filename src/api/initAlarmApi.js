import WebSocket from 'ws'
import wait from '../utils/wait.js'
import { scheduler } from 'node:timers/promises'

const initAlarmApi = (opt = {}) => {
  const host = opt.host
  const port = opt.port
  const token = opt.token
  const tryToConnectInterval = opt.tryToConnectInterval || 5_000

  if (!host || !port || !token) {
    throw new Error(
      'Alarm api: host, port and token are required for initiation'
    )
  }

  const headers = {
    Authorization: `Bearer ${token}`,
  }

  const subscriptions = {}

  const tryToConnect = (route) => {
    return new Promise((res, rej) => {
      const ws = new WebSocket(`ws://${host}:${port}/${route}`, {
        headers,
      })

      if (!subscriptions[route]) {
        rej('`Alarm api: subscription on route ${route} already exist`')
      }

      subscriptions[route] = ws

      ws.on('error', (error) => {
        rej(error)
      })
      ws.on('open', function open() {
        res(ws)
        console.log('Open connection')
      })
    })
  }

  return {
    subscribe: async function (route, onMessage) {
      const context = this

      let ws = null
      let isConnected = false
      while (!isConnected) {
        try {
          ws = await tryToConnect(route)
          isConnected = true
          if (!ws) throw new Error('Connection error')
        } catch (e) {
          // console.log(e)
          console.error('Connection to alarm api error')
          await scheduler.wait(tryToConnectInterval)
        }
      }

      ws.on('close', function close() {
        console.log('Disconnected from alarm api')
        setTimeout(
          context.subscribe.bind(context, route, onMessage),
          tryToConnectInterval
        )
      })

      ws.on('message', function incoming(data) {
        onMessage && onMessage(JSON.parse(data.toString()))
      })
    },
    unsubscribe: async (route = null) => {
      if (route) {
        subscriptions[route] && (await subscriptions[route].close())
        return
      }
      for (const route in subscriptions) {
        subscriptions[route] && (await subscriptions[route].close())
      }
    },
  }
}

export default initAlarmApi
