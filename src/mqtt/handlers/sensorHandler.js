const sensorHandlers = (client) => {
  return {
    setStatus: async (data, deviceName) => {
      const topic = `sensor/${deviceName}/status/set`
      await client.publish(topic, JSON.stringify(data))
    },
  }
}

export default sensorHandlers
