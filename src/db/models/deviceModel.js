import { buildInsertQuery, buildSelectQuery } from '../../utils/queryCreator.js'

const deviceModel = (db) => {
  const tableName = 'devices'

  db.exec(`
    CREATE TABLE IF NOT EXISTS ${tableName} (
      id INTEGER PRIMARY KEY,
      name INTEGER UNIQUE NOT NULL,
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
    getAll: () => {
      const { query } = buildSelectQuery(tableName)
      const data = db.prepare(query).all()
      return data
    },
    getById: (id) => {
      const query = `SELECT * FROM ${tableName} WHERE id = ?;`
      const data = db.prepare(query).get(id)
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
    }
  }
}

export default deviceModel
