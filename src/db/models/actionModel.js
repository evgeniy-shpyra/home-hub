import { queryWrapper } from '../../utils/dbTools.js'

const actionModel = (db) => {
  const tableName = 'actions'

  db.exec(`
    CREATE TABLE IF NOT EXISTS ${tableName} (
      id INTEGER PRIMARY KEY,
      lastActiveTime DATETIME,
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
    select: () => {
      return queryWrapper(() => {
        const query = `SELECT * FROM ${tableName};`
        const result = db.prepare(query).all()
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
    }
  }
}

export default actionModel
