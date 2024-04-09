import { actions } from '../constantsData/actions.js'

const devices = [{ id: 1, name: 'Window', status: 1, isOnline: 0 }]

const setupDb = (handlers) => {
  const { Action, Device } = handlers

  const allActions = Action.select()
  if (allActions.length !== actions.length) {
    Action.deleteAll()
    for (const action of actions) {
      const { id, name } = action
      Action.create({ name, id, status: 0 })
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
