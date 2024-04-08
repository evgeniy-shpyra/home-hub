const actions = [
  { name: 'Повітряна загроза', isActive: 0 },
  { name: 'Радіаційна загроза', isActive: 0 },
  { name: 'Хімічна загроза', isActive: 0 }
]

const devices = [
  { id: 1, name: 'Window', status: 1, isOnline: 0 }
]

const setupDb = (handlers) => {
  const { Action, Device } = handlers

  const allActions = Action.select()
  if (allActions.length !== actions.length) {
    Action.deleteAll()
    for (const action of actions) {
      const { isActive, name } = action
      Action.create({ name, isActive })
    }
  }

  const allDevices = Device.getAll()
  if (allDevices.length !== actions.length) {
    Device.deleteAll()
    for (const device of devices) {
      Device.create(device)
    }
  }
}

export default setupDb
