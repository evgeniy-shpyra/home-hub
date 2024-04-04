import Database from 'better-sqlite3'
import deviceModel from './models/deviceModel.js'
import actionModel from './models/actionModel.js'
import setupDb from './setupDb.js'


const initDb = () => {
  const db = new Database('home.db')

  const Device = deviceModel(db)
  const Action = actionModel(db)

  const handlers = { Device, Action }

  setupDb(handlers)

  return {
    close: () => {
      db.close()
    },
    models: {
      Device,
      Action,
    },
  }
}

export default initDb
