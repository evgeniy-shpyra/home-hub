import WebSocket from 'ws'

const initAlarmApi = (opt = {}) => {
  const host = opt.host
  const port = opt.port
  const token = opt.token

  if (!host || !port || !token) {
    throw new Error(
      'Alarm api: host, port and token are required for initiation'
    )
  }

  const headers = {
    Authorization: `Bearer ${token}`
  }

  const subscriptions = {}

  return {
    subscribe: (route, onMessage) => {
      const ws = new WebSocket(`ws://${host}:${port}/${route}`, {
        headers
      })

      if (subscriptions[route]) {
        throw new Error(
          `Alarm api: subscription on route ${route} already exist`
        )
      }

      subscriptions[route] = ws

      ws.on('error', (error) => {
        console.log('Ws proxy server error:', error)
      })

      ws.on('open', function open () {
        console.log('Open connection')
      })

      ws.on('message', function incoming (data) {
        onMessage && onMessage(data)
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
    }
  }
}

export default initAlarmApi
