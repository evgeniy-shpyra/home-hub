import { buildInsertQuery, buildSelectQuery } from '../../utils/queryCreator.js'

const actionModel = (db) => {
  const actionTableName = 'actions'
  const deviceTableName = 'devices'
  const deviceActionTableName = 'action_device'

  db.exec(`
    CREATE TABLE IF NOT EXISTS ${actionTableName} (
      id VARCHAR(40) PRIMARY KEY,
      status BOOLEAN NOT NULL,
      lastActiveTime DATETIME,
      name TEXT NOT NULL
    )  
  `)

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
    selectStatusById: (id) => {
      try {
        const query = `SELECT status FROM ${actionTableName} WHERE id = ?;`
        const data = db.prepare(query).get(id)
        return data
      } catch (e) {
        console.log(e)
        return false
      }
    },
    selectActive: () => {
      try {
        const query = `SELECT * FROM ${actionTableName} WHERE status = 1;`
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
          const info = query.run(status, id)
        })()

        return true
      } catch (e) {
        console.log(e)
        return false
      }
    },
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

export default actionModel
