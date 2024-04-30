import { queryWrapper } from '../../utils/dbTools.js'

const sensorModel = (db) => {
  const tableName = 'sensors'
  const actionTableName = 'actions'

  db.exec(`
    CREATE TABLE IF NOT EXISTS ${tableName} (
      id INTEGER PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      password VARCHAR(64) NOT NULL,
      isOnline BOOLEAN NOT NULL,
      action_id NUMBER NOT NULL,
      status BOOLEAN NOT NULL,
      connectedAt DATETIME,
      FOREIGN KEY (action_id) REFERENCES ${actionTableName}(id) ON DELETE CASCADE
    )  
  `)

  return {
    create: ({ name, password, action_id }) => {
      return queryWrapper(() => {
        const createQuery = db.prepare(
          `INSERT INTO ${tableName} (name, password, isOnline, action_id, status) VALUES (?, ?, 0, ?, 0);`
        )
        db.transaction(() => {
          createQuery.run(name, password, action_id)
        })()
      })
    },
    getAll: () => {
      return queryWrapper(() => {
        const query = `SELECT * FROM ${tableName};`
        const data = db.prepare(query).all()
        return data
      })
    },
    getById: (id) => {
      return queryWrapper(() => {
        const query = `SELECT * FROM ${tableName} WHERE id = ?;`
        const data = db.prepare(query).get(id)
        return data
      })
    },
    getByIdAndPassword: ({ id, password }) => {
      return queryWrapper(() => {
        const query = `SELECT * FROM ${tableName} WHERE id = ? AND password = ?;`
        const data = db.prepare(query).get(id, password)
        return data
      })
    },
    setOnline: ({ isOnline, id }) => {
      return queryWrapper(() => {
        const createQuery = db.prepare(
          `UPDATE ${tableName} SET isOnline = ?, connectedAt = ? WHERE id = ?;`
        )
        db.transaction(() => {
          createQuery.run(isOnline, new Date().toISOString(), id)
        })()
      })
    },
    deleteAll: () => {
      return queryWrapper(() => {
        const query = db.prepare(`DELETE FROM ${tableName};`)
        db.transaction(() => {
          query.run()
        })()
      })
    },
    deleteById: (id) => {
      return queryWrapper(() => {
        const query = `DELETE FROM ${tableName} WHERE id = ?`
        const result = db.prepare(query).run(id)
        const isDeleted = result.changes === 1
        return isDeleted
      })
    },
    changeStatus: ({id, status}) => {
      return queryWrapper(() => {
        const createQuery = db.prepare(
          `UPDATE ${tableName} SET status = ? WHERE id = ?;`
        )
        db.transaction(() => {
          createQuery.run(status, id)
        })()
      })
    }
  }
}

export default sensorModel
