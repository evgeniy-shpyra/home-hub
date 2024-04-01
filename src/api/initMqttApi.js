import MQTT from 'async-mqtt'

const initMqttApi = (opt = {}) => {
  const host = opt.host
  const port = opt.port
  const password = opt.token
  const user = opt.token

  if (!host || !port) {
    throw new Error(
      'Mqtt api: host, port are required for initiation'
    )
  }

  const url = `tcp://${host}:${port}`
  let client = null

  let subscriptions = {}

  return {
    strat: async () => {
      client = await MQTT.connectAsync(url)

      client.on("message", (topic, message) => {
        if(subscriptions[topic]){
          subscriptions[topic](message.toString())
          return 
        }

        console.log("Recived message but cam't find a handler")
      });

      console.log('Connected to mqtt')
    },
    stop: async () => {
      if(client){
        await client.end();
        subscriptions = {}
      }
    },
    subscribe: async (topic, callback) => {
      if(!client) throw new Error("Mqtt dosn't start")

      try {
        await client.subscribe(topic, callback);
        subscriptions[topic] = callback
      } catch(e){
        console.log('Mqtt subscribe error:', e)
        return false
      } 
      return true
    },
    unsubscribe: async (topic) => {
      if(!client) throw new Error("Mqtt dosn't start")

      try {
        await client.unsubscribe(topic);
        delete subscriptions[topic]
      } catch(e){
        console.log('Mqtt unsubscribe error:', e)
        return false
      } 
      return true
    },
    publish: async (topic, message, opt = {}) => {
      if(!client) throw new Error("Mqtt dosn't start")
    
      const qos = opt.qos || 0
      try {
        await client.publish(topic, message, {qos});
      } catch(e){
        console.log('Mqtt unsubscribe error:', e)
        return false
      } 
      return true
    }
  }
}

export default initMqttApi
