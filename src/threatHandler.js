const prevStatuses = {
  missileThreat: null,
  radiationThreat: null,
  chemicalThreat: null,
}

const threatHandler = (id, status, services, wsHandlers) => {
  const activeThreatIds = new Set()

  const deviceService = services.device
  const sendDataToDevice = wsHandlers.device
  const actionService = services.action
  const sendDataToUsers = wsHandlers.user

  const actions = actionService.getAll()
  for (const action of actions) {
    if (action.status === 1) activeThreatIds.add(action.id)
  }
  if (status) {
    activeThreatIds.add(id)
  }

  const activeDevices = []
  const inactiveDevices = []

  for (const action of actions) {
    const isActive = activeThreatIds.has(action.id)
    console.log({ isActive })
    if (isActive) {
      const devices = deviceService.getDeviceByActive(action.id)
      console.log({ devices })
    } else {
    }
  }

  console.log(activeThreatIds)

  const devices = []
  for (const threatId of activeThreatIds) {
    console.log(threatId)
  }

  // const isActivated = activeThreat.find(t => t.id === id) ? true : false
  // if(status && isActivated || !status && !isActivated){
  //   return
  // }

  // const devices = deviceService.getDeviceByActive(id)

  for (const device of devices) {
    if (device.status == 0) {
      sendDataToDevice({ status: true, action: 'toggleStatus' }, device.id)
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
