import {
  deviceStatusSetBusEvent,
  deviceStatusGetBusEvent,
} from '../bus/busEvents.js'

const controller = async (client, services, bus) => {
  const deviceService = services.device
  const sensorService = services.sensor
  const systemService = services.system

  await client.subscribe('device/+/status/#', (err) => {
    if (!err) {
      console.log(err)
      process.exit(1)
    }
  })

  await client.subscribe('sensor/+/status', (err) => {
    if (!err) {
      console.log(err)
      process.exit(1)
    }
  })

  const onDeviceStatusSet = async (payload) => {
    if (
      !payload.name ||
      !payload.message ||
      typeof payload.message.status !== 'boolean'
    ) {
      return
    }

    const device = deviceService.getByName(payload.name)
    if (!device) return

    bus.emit(deviceStatusSetBusEvent, {
      id: device.id,
      status: payload.message.status,
    })
  }
  const onDeviceStatusGet = async (deviceName) => {
    const device = deviceService.getByName(deviceName)
    if (!device) return
    bus.emit(deviceStatusGetBusEvent, device)
  }

  const onSensorChangeStatus = async (payload) => {
    if (
      !payload.name ||
      !payload.message ||
      typeof payload.message.status !== 'boolean'
    ) {
      return
    }
    const sensor = sensorService.getByName(payload.name)
    if (!sensor) return

    const systemStatus = systemService.getSystemStatus()

    if (!systemStatus) return

    sensorService.changeStatus({
      id: sensor.id,
      status: payload.message.status,
    })
  }

  client.on('message', (topic, messageBuff) => {
    const topicArr = topic.split('/')
    const message = messageBuff.toString()
    const data = JSON.parse(message)

    // device status
    if (
      topicArr.length === 4 &&
      topicArr[0] === 'device' &&
      topicArr[2] === 'status' &&
      topicArr[3] === 'set'
    ) {
      onDeviceStatusSet({ name: topicArr[1], message: data })
    } else if (
      topicArr.length === 4 &&
      topicArr[0] === 'device' &&
      topicArr[2] === 'status' &&
      topicArr[3] === 'get'
    ) {
      onDeviceStatusGet(topicArr[1])
    } else if (
      topicArr.length === 3 &&
      topicArr[0] === 'sensor' &&
      topicArr[2] === 'status'
    ) {
      onSensorChangeStatus({ name: topicArr[1], message: data })
    }
  })
}

export default controller
