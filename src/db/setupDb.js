import { actions } from '../constantsData/actions.js'
import { createHash } from '../utils/hash.js'

const devices = [
  {
    id: 1,
    name: 'Window',
    password: createHash('111'),
    isOnline: 0,
    status: 0,
  },
  {
    id: 2,
    name: 'Door',
    password: createHash('111'),
    isOnline: 0,
    status: 0,
  },
  {
    id: 3,
    name: 'Door2',
    password: createHash('111'),
    isOnline: 0,
    status: 0,
  },
]


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
