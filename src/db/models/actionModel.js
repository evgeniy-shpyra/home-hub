import { queryWrapper } from '../../utils/dbTools.js'

const actionModel = (db) => {
  const tableName = 'actions'

  db.exec(`
    CREATE TABLE IF NOT EXISTS ${tableName} (
      id INTEGER PRIMARY KEY,
      name TEXT UNIQUE NOT NULL
    )  
  `)

  return {
    create: (name) => {
      return queryWrapper(() => {
        const createQuery = db.prepare(
          `INSERT INTO ${tableName} (name) VALUES (?);`
        )
        db.transaction(() => {
          createQuery.run(name)
        })()
      })
    },
    createWithId: ({ id, name }) => {
      return queryWrapper(() => {
        const createQuery = db.prepare(
          `INSERT INTO ${tableName} (id, name) VALUES (?, ?);`
        )
        db.transaction(() => {
          createQuery.run(id, name)
        })()
      })
    },
    select: () => {
      return queryWrapper(() => {
        const query = `SELECT * FROM ${tableName};`
        const result = db.prepare(query).all()
        return result
      })
    },
    selectById: (id) => {
      return queryWrapper(() => {
        const query = `SELECT * FROM ${tableName} WHERE id = ?;`
        const result = db.prepare(query).get(id)
        return result
      })
    },
    selectStatusById: (id) => {
      return queryWrapper(() => {
        const query = `SELECT * FROM ${tableName} WHERE id = ?;`
        const result = db.prepare(query).get(id)
        return result
      })
    },
    deleteAll: () => {
      return queryWrapper(() => {
        const createQuery = db.prepare(`DELETE FROM ${tableName};`)
        db.transaction(() => {
          createQuery.run()
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
    }
  }
}

export default actionModel
