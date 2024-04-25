import { queryWrapper } from '../../utils/dbTools.js'
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
    create: function (data) {
      return queryWrapper(() => {
        const { name, password } = data
        const createQuery = db.prepare(
          `INSERT INTO ${tableName} (name, password, isOnline, status) VALUES (?, ?, 0, 0);`
        )
        db.transaction(() => {
          createQuery.run(name, password)
        })()
      })
    },
    updateStatus: (id, status) => {
      return queryWrapper(() => {
        const query = db.prepare(
          `UPDATE ${tableName} SET status = ? WHERE id = ?;`
        )
        db.transaction(() => {
          query.run(status, id)
        })()
      })
    },
    getAll: () => {
      const { query } = buildSelectQuery(tableName)
      const data = db.prepare(query).all()
      return data
    },
    getById: () => {
      return queryWrapper(() => {
        const query = `SELECT * FROM ${tableName} WHERE id = ?;`
        const result = db.prepare(query).get(id)
        return result
      })
    },
    getByNameAndPassword: ({ name, password }) => {
      const query = `SELECT * FROM ${tableName} WHERE name = ? AND password = ?;`
      const data = db.prepare(query).get(name, password)
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
    deleteById: (id) => {
      return queryWrapper(() => {
        const query = `DELETE FROM ${tableName} WHERE id = ?`
        const result = db.prepare(query).run(id)
        const isDeleted = result.changes === 1
        return isDeleted
      })
    },
  }
}

export default deviceModel
