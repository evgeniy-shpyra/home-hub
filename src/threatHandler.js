const threatHandler = (id, status, services, wsHandlers) => {
  const deviceService = services.device
  const sendDataToDevice = wsHandlers.device
  const actionService = services.action
  const sendDataToUsers = wsHandlers.user

  const devices = deviceService.getDeviceByActive(id)
  const payloadForDevice = {
    status: true
  }

  console.log(devices)

  // for(const device of activeDevices){
  //   if(device.status == 0){
  //     sendDataToDevice({payload: payloadForDevice, action: 'toggleStatus'}, device.id)
  //   }
  // }

  const payloadForUsers = {
    id,
    status,
  }
  sendDataToUsers({ payload: payloadForUsers, action: 'threat' })
  actionService.updateActionStatus(id, status)
  console.log(payloadForUsers)
}

export default threatHandler
