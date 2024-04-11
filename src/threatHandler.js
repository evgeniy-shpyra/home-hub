const threatHandler = (id, status, services, wsHandlers) => {
  const actionService = services.action
  const sendDataToUsers = wsHandlers.user

  const payloadForUsers = {
    id,
    status,
  }

  console.log(payloadForUsers)

  sendDataToUsers({ payload: payloadForUsers, action: 'threat' })
  actionService.updateActionStatus(id, status)
}

export default threatHandler
