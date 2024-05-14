import {
  actionBusEvent,
  deviceStatusSetBusEvent,
  changeDeviceStatusBusEvent,
  pingSystemBusEvent,
  deviceStatusGetBusEvent
} from './bus/busEvents.js'

const webSocketEventHandler = (wsHandlers, mqttHandlers, bus, services) => {
  const deviceMqttHandler = mqttHandlers.device
  const pingMqttHandler = mqttHandlers.ping
  const userWsHandler = wsHandlers.user
  const deviceService = services.device

  // changed status of sensor
  bus.on(actionBusEvent, (data) => {
    console.log('actionBusEvent', data)
    const devices = services.device.getDevicesByActiveActions()
    const devicesForWriting = []

    for (const device of devices) {
      const foundDeviceForWriting = devicesForWriting.find(
        (d) => d.id === device.deviceId
      )
      if (
        foundDeviceForWriting &&
        foundDeviceForWriting.priority >= device.priority
      ) {
        continue
      }
      devicesForWriting.push({
        ...device,
        sensorStatus: !!device.sensorStatus
      })
    }

    for (const device of devicesForWriting) {
      console.log(device)
      const payloadForDevice = {
        deviceStatus: device.deviceStatus,
        sensorStatus: device.sensorStatus,
        isAction: true
      }

      deviceMqttHandler.setStatus(payloadForDevice, device.deviceName)
    }

    const payloadForUser = {
      action: 'changeSensorStatus',
      payload: data
    }
    userWsHandler(payloadForUser)
  })

  // connect device
  bus.on(deviceStatusGetBusEvent, (device) => {
    console.log('deviceStatusGetBusEvent', device)

    const deviceByAction = services.device.getDevicesByActiveActionsById(
      device.id
    )

    if (!deviceByAction.length) return

    const deviceMaxPriority = {}

    let maxPriority = 0
    for (const data of deviceByAction) {
      if (data.priority > maxPriority) {
        maxPriority = data.priority
        deviceMaxPriority.deviceStatus = !!data.deviceStatus
        deviceMaxPriority.sensorStatus = !!data.sensorStatus
        deviceMaxPriority.name = data.deviceName
      }
    }

    deviceMqttHandler.setStatus(
      {
        deviceStatus: deviceMaxPriority.deviceStatus,
        sensorStatus: deviceMaxPriority.sensorStatus,
        isAction: true
      },
      deviceMaxPriority.name
    )

    userWsHandler({
      action: 'deviceConDisc',
      payload: device
    })
  })

  // on changed status of device
  bus.on(deviceStatusSetBusEvent, (data) => {
    console.log('deviceStatusSetBusEvent', data)

    const payloadForUser = {
      action: 'deviceStatus',
      payload: data
    }

    userWsHandler(payloadForUser)
  })

  // user connected
  bus.on(pingSystemBusEvent, () => {
    pingMqttHandler()
  })

  // handle changed status of device | hub -> device
  bus.on(changeDeviceStatusBusEvent, (device) => {
    const payloadForDevice = {
      deviceStatus: device.status,
      isAction: false
    }
    deviceMqttHandler.setStatus(payloadForDevice, device.name)
  })
}

export default webSocketEventHandler
