const deviceHandlers = (client) => {
  return {
    setStatus: async (data, deviceName) => {
      const topic = `device/${deviceName}/status/set`
      await client.publish(topic, JSON.stringify(data)) 
    },
  }
}

export default deviceHandlers
