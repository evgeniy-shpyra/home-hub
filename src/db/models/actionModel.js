import { buildInsertQuery, buildSelectQuery } from '../../utils/queryCreator.js'

const actionModel = (db) => {
  const actionTableName = 'actions'
  const deviceTableName = 'devices'
  const deviceActionActiveTableName = 'action_device_active'
  const deviceActionInactiveTableName = 'action_device_inactive'

  db.exec(`
    CREATE TABLE IF NOT EXISTS ${actionTableName} (
      id VARCHAR(40) PRIMARY KEY,
      status BOOLEAN NOT NULL,
      lastActiveTime DATETIME,
      name TEXT NOT NULL
    )  
  `)

  db.exec(`
    CREATE TABLE IF NOT EXISTS ${deviceActionActiveTableName} (
      action_id VARCHAR(40),
      device_id INTEGER,
      FOREIGN KEY (action_id) REFERENCES ${actionTableName}(id) ON DELETE CASCADE,
      FOREIGN KEY (device_id) REFERENCES ${deviceTableName}(id) ON DELETE CASCADE,
      PRIMARY KEY (action_id, device_id)
    )
  `)
  db.exec(`
    CREATE TABLE IF NOT EXISTS ${deviceActionInactiveTableName} (
      action_id VARCHAR(40),
      device_id INTEGER,
      FOREIGN KEY (action_id) REFERENCES ${actionTableName}(id) ON DELETE CASCADE,
      FOREIGN KEY (device_id) REFERENCES ${deviceTableName}(id) ON DELETE CASCADE,
      PRIMARY KEY (action_id, device_id)
    )
  `)

  return {
    create: (data) => {
      try {
        const { query, values } = buildInsertQuery(actionTableName, data)
        const createQuery = db.prepare(query)

        let insertedId = null
        db.transaction(() => {
          const info = createQuery.run(...values)

          insertedId = info.lastInsertRowid
        })()

        return insertedId
      } catch (e) {
        console.log(e)
        return false
      }
    },
    select: (fields = null) => {
      try {
        const { query } = buildSelectQuery(actionTableName, { fields })
        const data = db.prepare(query).all()
        return data
      } catch (e) {
        console.log(e)
        return false
      }
    },
    deleteAll: () => {
      try {
        const deleteQuery = db.prepare(`DELETE FROM ${actionTableName};`)

        let changed = null
        db.transaction(() => {
          const result = deleteQuery.run()
          changed = result.changes
        })()

        return changed
      } catch (e) {
        console.log(e)
        return false
      }
    },
    updateStatus: (id, status) => {
      try {
        const query = db.prepare(
          `UPDATE ${actionTableName} SET status = ? WHERE id = ?;`
        )
        db.transaction(() => {
          const info = query.run(id, status)
        })()

        return true
      } catch (e) {
        console.log(e)
        return false
      }
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
