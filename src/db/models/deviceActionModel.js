import { buildInsertQuery, buildSelectQuery } from '../../utils/queryCreator.js'

const deviceActionModel = (db) => {
  const actionTableName = 'actions'
  const deviceTableName = 'devices'
  const deviceActionTableName = 'action_device'

  db.exec(`
    CREATE TABLE IF NOT EXISTS ${deviceActionTableName} (
      id INTEGER PRIMARY KEY,
      action_id VARCHAR(40),
      device_id INTEGER,
      status BOOLEAN NOT NULL,
      priority INTEGER NOT NULL,
      FOREIGN KEY (action_id) REFERENCES ${actionTableName}(id) ON DELETE CASCADE,
      FOREIGN KEY (device_id) REFERENCES ${deviceTableName}(id) ON DELETE CASCADE,
      CONSTRAINT unique_action_device UNIQUE (action_id, device_id, status)
    )
  `)


  return {
    addDeviceAction: ({deviceId, actionId, status, priority}) => {
      try {
        const createQuery = db.prepare(
          `INSERT INTO ${deviceActionTableName} (device_id, action_id, status, priority) VALUES (?, ?, ?, ?);`
        )
        let insertedId = null
        db.transaction(() => {
          const info = createQuery.run(deviceId, actionId, status, priority)
          insertedId = info.lastInsertRowid
        })()

        return insertedId
      } catch (e) {
        console.log(e)
        return null
      }
    },
  }
}

export default deviceActionModel
