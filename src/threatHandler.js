const prevStatuses = {
  missileThreat: null,
  radiationThreat: null,
  chemicalThreat: null,
}

const threatHandler = (id, status, services, wsHandlers) => {
  console.log({id, status})
  const deviceService = services.device
  const sendDataToDevice = wsHandlers.device
  const actionService = services.action
  const sendDataToUsers = wsHandlers.user

  const prevStatus = actionService.getStatusById(id)
  if(prevStatus === status){
    return
  }

  const devices = deviceService.getDeviceByActive(id)
  const payloadForDevice = {
    status: true,
  } 

  for (const device of devices) {
    if (device.status == 0) {
      sendDataToDevice(
        { payload: payloadForDevice, action: 'toggleStatus' },
        device.id
      )
    }
  }

  const payloadForUsers = {
    id,
    status,
  }
  sendDataToUsers({ payload: payloadForUsers, action: 'threat' })
  actionService.updateActionStatus(id, status)

  prevStatuses[id] = status
}

export default threatHandler
