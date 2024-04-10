import Database from 'better-sqlite3'
import deviceModel from './models/deviceModel.js'
import actionModel from './models/actionModel.js'
import setupDb from './setupDb.js'
import userModel from './models/userModel.js'


const initDb = () => {
  const db = new Database('home.db')

  const Device = deviceModel(db)
  const Action = actionModel(db)
  const User = userModel(db)

  const models = { Device, Action, User }

  setupDb(models)

  return {
    close: () => {
      db.close()
    },
    models,
  }
}

export default initDb
