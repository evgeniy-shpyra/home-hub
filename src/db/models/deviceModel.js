import { buildInsertQuery, buildSelectQuery } from '../../utils/queryCreator.js'

const deviceModel = (db) => {
  const tableName = 'devices'

  db.exec(`
    CREATE TABLE IF NOT EXISTS ${tableName} (
      id INTEGER PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      password VARCHAR(64) NOT NULL,
      isOnline BOOLEAN NOT NULL,
      status BOOLEAN NOT NULL,
      connectedAt DATETIME
    )  
  `)

  return {
    create: (data) => {
      try {
        const { query, values } = buildInsertQuery(tableName, data)
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
    updateStatus: (id, status) => {
      try {
     
        const query = db.prepare(
          `UPDATE ${tableName} SET status = ? WHERE id = ?;`
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
    getAll: () => {
      const { query } = buildSelectQuery(tableName)
      const data = db.prepare(query).all()
      return data
    },
    getByIdAndPassword: (id, password) => {
      const query = `SELECT * FROM ${tableName} WHERE id = ? AND password = ?;`
      const data = db.prepare(query).get(id, password)
      return data
    },
    getDeviceByActive: (actionId) => {
      const query = `
                    SELECT action_device.device_id, devices.status from action_device 
                    LEFT JOIN actions ON actions.id = action_device.action_id 
                    LEFT JOIN devices ON devices.id = action_device.device_id
                    WHERE actions.id = ? AND devices.isOnline = 1;
                    `
      const data = db.prepare(query).all(actionId)
      return data
    },
    setOnline: (isOnline, id) => {
      try {
        const query = db.prepare(
          `UPDATE ${tableName} SET isOnline = ?, connectedAt = ? WHERE id = ?;`
        )
        db.transaction(() => {
          query.run(isOnline ? 1 : 0, new Date().toISOString(), id) 
        })()
      } catch (e) {
        console.log(e)
        return false
      }
    },
    deleteAll: () => {
      const deleteQuery = db.prepare(`DELETE FROM ${tableName};`)

      let changed = null
      db.transaction(() => {
        const result = deleteQuery.run()
        changed = result.changes
      })()

      return changed
    },
  }
}

export default deviceModel
