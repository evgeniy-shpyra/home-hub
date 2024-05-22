import { queryWrapper } from '../../utils/dbTools.js'

const userModel = (db) => {
  const tableName = 'users'

  db.exec(`
    CREATE TABLE IF NOT EXISTS ${tableName} (
      id INTEGER PRIMARY KEY,
      uuid VARCHAR(36) NOT NULL,
      password VARCHAR(100) NOT NULL,
      login VARCHAR(30) NOT NULL,
      isOnline BOOLEAN NOT NULL,
      lastOnlineAt DATETIME
    )  
  `)

  return {
    create: ({ uuid, password, login }) => {
      return queryWrapper(() => {
        const query = `INSERT INTO ${tableName} (uuid, password, login, isOnline) VALUES (?, ?, ?, 0);`
        db.transaction(() => {
          db.prepare(query).run(uuid, password, login)
        })()
      })
    },
    getAll: () => {
      return queryWrapper(() => {
        const query = `SELECT * FROM ${tableName}`
        const result = db.prepare(query).all()
        return result
      })
    },
    getCount: () => {
      return queryWrapper(() => {
        const query = `SELECT COUNT(*) as count FROM ${tableName}`
        const result = db.prepare(query).get()
        return result.count
      })
    },
    getByLoginAndPassword: ({ login, password }) => {
      return queryWrapper(() => {
        const query = `SELECT * FROM ${tableName} WHERE login = ? AND password = ?;`
        const result = db.prepare(query).get(login, password)
        return result
      })
    },
    getByUuid: (uuid) => {
      return queryWrapper(() => {
        const query = `SELECT * FROM ${tableName} WHERE uuid = ?`
        const result = db.prepare(query).get(uuid)
        return result
      })
    },
    deleteById: (id) => {
      return queryWrapper(() => {
        const query = `DELETE FROM ${tableName} WHERE id = ?`
        const result = db.prepare(query).run(id)
        const isDeleted = result.changes === 1
        return isDeleted
      })
    }
  }
}

export default userModel
