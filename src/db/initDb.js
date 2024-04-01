import Database from 'better-sqlite3'
import topicModel from './models/topicModel.js'
import deviceModel from './models/deviceModel.js'
import actionModel from './models/actionModel.js'

const initDb = () => {
  const db = new Database('home.db')

  const Topic = topicModel(db)
  const Device = deviceModel(db)
  const Action = actionModel(db)

  return {
    close: () => {
      db.close()
    },
    models: {
      Topic,
      Device,
      Action,
    },
  }
}

export default initDb
 