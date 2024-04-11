import { actions } from '../constantsData/actions.js'
import { createHash } from '../utils/hash.js'

const devices = [{ id: 1, name: 'Window', password: createHash("111"), isOnline: 0, status: 0 }]
const sensors = [{ id: 1, name: 'Датчик газів', password: createHash("111"), isOnline: 0, action_id: "chemicalThreat" }]

const setupDb = (handlers) => {
  const { Action, Device, Sensor } = handlers

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

  Action.addDeviceToActive(1, "missileThreat")

  const allSensors = Sensor.getAll()
  if (allSensors.length !== sensors.length) {
    Sensor.deleteAll()
    for (const sensor of sensors) {
      Sensor.create(sensor)
    }
  }
}

export default setupDb
