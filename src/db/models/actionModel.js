import { buildInsertQuery, buildSelectQuery } from '../../utils/queryCreator.js'

const actionModel = (db) => {
  const actionTableName = 'actions'
  const deviceTableName = 'devices'
  const deviceActionActiveTableName = 'action_device_active'
  const deviceActionInactiveTableName = 'action_device_inactive'

  db.exec(`
    CREATE TABLE IF NOT EXISTS ${actionTableName} (
      id INTEGER PRIMARY KEY,
      isActive BOOLEAN NOT NULL,
      lastActiveTime DATETIME,
      name TEXT NOT NULL
    )  
  `)

  db.exec(`
    CREATE TABLE IF NOT EXISTS ${deviceActionActiveTableName} (
      action_id INTEGER,
      device_id INTEGER,
      FOREIGN KEY (action_id) REFERENCES ${actionTableName}(id) ON DELETE CASCADE,
      FOREIGN KEY (device_id) REFERENCES ${deviceTableName}(id) ON DELETE CASCADE,
      PRIMARY KEY (action_id, device_id)
    )
  `)
  db.exec(`
    CREATE TABLE IF NOT EXISTS ${deviceActionInactiveTableName} (
      action_id INTEGER,
      device_id INTEGER,
      FOREIGN KEY (action_id) REFERENCES ${actionTableName}(id) ON DELETE CASCADE,
      FOREIGN KEY (device_id) REFERENCES ${deviceTableName}(id) ON DELETE CASCADE,
      PRIMARY KEY (action_id, device_id)
    )
  `)

  return {
    create: (data) => {
      const { query, values } = buildInsertQuery(actionTableName, data)
      const createQuery = db.prepare(query)

      let insertedId = null
      db.transaction(() => {
        const info = createQuery.run(...values)

        insertedId = info.lastInsertRowid
      })()

      return insertedId
    },
    select: (fields = null) => {
      const { query } = buildSelectQuery(actionTableName, { fields })
      const data = db.prepare(query).all()
      return data
    },
    deleteAll: () => {
      const deleteQuery = db.prepare(`DELETE FROM ${actionTableName};`)

      let changed = null
      db.transaction(() => {
        const result = deleteQuery.run()
        changed = result.changes
      })()

      return changed
    },
    addDeviceToActive: (deviceId, actionId) => {
      try {
        const createQuery = db.prepare(
          `INSERT INTO ${deviceActionActiveTableName} (device_id, action_id) VALUES (?, ?);`
        )
        let insertedId = null
        db.transaction(() => {
          const info = createQuery.run(deviceId, actionId)
          insertedId = info.lastInsertRowid
        })()

        return insertedId
      } catch (e) {
        console.log(e)
        return null
      }
    },
    addDeviceToInactive: (deviceId, actionId) => {
      try {
        const createQuery = db.prepare(
          `INSERT INTO ${deviceActionInactiveTableName} (device_id, action_id) VALUES (?, ?);`
        )
        console.log(deviceId, actionId)  
        let insertedId = null
        db.transaction(() => {
          const info = createQuery.run(deviceId, actionId)
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

export default actionModel
