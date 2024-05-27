import { queryWrapper } from '../../utils/dbTools.js'

const configModel = (db) => {
  const tableName = 'configs'

  db.exec(`
    CREATE TABLE IF NOT EXISTS ${tableName} (
      name VARCHAR(30) PRIMARY KEY,
      data TEXT NOT NULL
    )  
  `)

  return {
    create: ({ name, data }) => {
      return queryWrapper(() => {
        const createQuery = db.prepare(
          `INSERT INTO ${tableName} (name, data) VALUES (?, ?);`
        )
        db.transaction(() => {
          createQuery.run(name, data)
        })()
      })
    },
    selectAll: () => {
      return queryWrapper(() => {
        const query = `SELECT * FROM ${tableName};`
        const result = db.prepare(query).all()
        return result
      })
    },
    update: ({ name, data }) => {
      return queryWrapper(() => {
        const createQuery = db.prepare(
          `UPDATE ${tableName} SET data = ? WHERE name = ?;`
        )
        db.transaction(() => {
          createQuery.run(data, name)
        })()
      })
    },
    selectByName: (name) => {
      return queryWrapper(() => {
        const query = `SELECT * FROM ${tableName} WHERE name = ?;`
        const result = db.prepare(query).get(name)
        return result
      })
    },
   
    deleteByName: (name) => {
      return queryWrapper(() => {
        const query = `DELETE FROM ${tableName} WHERE name = ?`
        const result = db.prepare(query).run(name)
        const isDeleted = result.changes === 1
        return isDeleted
      })
    }
  }
}

export default configModel
