import { queryWrapper } from '../../utils/dbTools.js'
import { buildInsertQuery, buildSelectQuery } from '../../utils/queryCreator.js'

const sensorModel = (db) => {
  const tableName = 'sensors'
  const actionTableName = 'actions'

  db.exec(`
    CREATE TABLE IF NOT EXISTS ${tableName} (
      id INTEGER PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      password VARCHAR(64) NOT NULL,
      isOnline BOOLEAN NOT NULL,
      action_id VARCHAR(40) NOT NULL,
      connectedAt DATETIME,
      FOREIGN KEY (action_id) REFERENCES ${actionTableName}(id) ON DELETE CASCADE
    )  
  `)

  return {
    create: ({ name, password, action_id }) => {
      return queryWrapper(() => {
        const createQuery = db.prepare(
          `INSERT INTO ${tableName} (name, password, isOnline, action_id) VALUES (?, ?, 0, ?);`
        )
        db.transaction(() => {
          createQuery.run(name, password, action_id)
        })()
      })
    },
    getAll: () => {
      return queryWrapper(() => {
        const { query } = buildSelectQuery(tableName)
        const data = db.prepare(query).all()
        return data
      })
    },
    getById: (id) => {
      const query = `SELECT * FROM ${tableName} WHERE id = ?;`
      const data = db.prepare(query).get(id)
      return data
    },
    getByIdAndPassword: (id, password) => {
      const query = `SELECT * FROM ${tableName} WHERE id = ? AND password = ?;`
      const data = db.prepare(query).get(id, password)
      return data
    },
    setOnline: (isOnline, id) => {
      try {
        const query = db.prepare(
          `UPDATE ${tableName} SET isOnline = ?, connectedAt = ? WHERE id = ?;`
        )
        db.transaction(() => {
          const info = query.run(isOnline ? 1 : 0, new Date().toISOString(), id)
          console.log({ info })
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

export default sensorModel
