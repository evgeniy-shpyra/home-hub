import { queryWrapper } from '../../utils/dbTools.js'
import { buildInsertQuery, buildSelectQuery } from '../../utils/queryCreator.js'

const actionModel = (db) => {
  const actionTableName = 'actions'

  db.exec(`
    CREATE TABLE IF NOT EXISTS ${actionTableName} (
      id VARCHAR(40) PRIMARY KEY,
      status BOOLEAN NOT NULL,
      lastActiveTime DATETIME,
      name TEXT NOT NULL
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
      return queryWrapper(() => {
        const { query } = buildSelectQuery(actionTableName, { fields })
        const result = db.prepare(query).all()
        return result
      })
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
  }
}

export default actionModel
