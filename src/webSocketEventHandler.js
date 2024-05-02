import {
  actionBusEvent,
  deviceConDiscBusEvent,
  sensorConDiscBusEvent,
  onChangeDeviceStatusBusEvent,
  changeDeviceStatusBusEvent,
} from './bus/busEvents.js'

const webSocketEventHandler = (wsHandlers, bus, services) => {
  const deviceWsHandler = wsHandlers.device
  const userWsHandler = wsHandlers.user
  const deviceService = services.device

  bus.on(actionBusEvent, (data) => {
    console.log("actionBusEvent", data)
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
        deviceStatus: device.deviceStatus ? true : false,
        sensorStatus: device.sensorStatus ? true : false,
      })
    }

    for (const device of devicesForWriting) {
      const payloadForDevice = {
        action: 'autoToggleStatus',
        status: device.deviceStatus,
        actionStatus: device.sensorStatus,
      }

      deviceWsHandler(payloadForDevice, [device.deviceId])
    }
  })

  bus.on(onChangeDeviceStatusBusEvent, (data) => {
    console.log('changeDeviceStatusBusEvent', data)

    const payloadForUser = {
      action: 'deviceChangeStatus',
      payload: data,
    }

    userWsHandler(payloadForUser)
  })

  bus.on(changeDeviceStatusBusEvent, ({ id, status }) => {
    const payloadForDevice = {
      action: 'changeStatus',
      status,
    }
    deviceWsHandler(payloadForDevice, [id])
  })

  bus.on(deviceConDiscBusEvent, (data) => {
    console.log('deviceConDiscBusEvent', data)
    const { isOnline, id } = data

    if (isOnline) {
      const deviceByAction = services.device.getDevicesByActiveActionsById(id)
      if (!deviceByAction.length) return

      const payloadForDevice = {
        action: 'autoToggleStatus',
      }

      let maxPriority = 0
      for (const data of deviceByAction) {
        if (data.priority > maxPriority) {
          maxPriority = data.priority
          payloadForDevice.status = data.deviceStatus
          payloadForDevice.actionStatus = true
        }
      }

      deviceWsHandler(payloadForDevice, [id])
    }

    userWsHandler({
      action: 'deviceConDisc',
      payload: data,
    })
  })

  bus.on(sensorConDiscBusEvent, (data) => {
    console.log(sensorConDiscBusEvent, data)
    const { isOnline, id } = data

    wsHandlers.user({
      action: 'sensorConDisc',
      isOnline,
      id,
    })
  })
}

export default webSocketEventHandler
