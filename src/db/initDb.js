import Database from 'better-sqlite3'
import deviceModel from './models/deviceModel.js'
import actionModel from './models/actionModel.js'
import userModel from './models/userModel.js'
import sensorModel from './models/sensorsModel.js'
import deviceActionModel from './models/deviceActionModel.js'

const initDb = () => {
  const db = new Database('home.db')

  const Device = deviceModel(db)
  const Action = actionModel(db)
  const DeviceAction = deviceActionModel(db)
  const User = userModel(db)
  const Sensor = sensorModel(db)

  const models = { Device, Action, User, Sensor, DeviceAction }

  // setupDb(models)

  return {
    close: () => {
      db.close()
      console.log("Db has been stopped")
    },
    models,
  } 
}

export default initDb
