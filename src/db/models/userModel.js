import {
  buildInsertQuery,
  buildSelectQuery,
  checkFieldNames
} from '../../utils/queryCreator.js'

const userModel = (db) => {
  const tableName = 'users'
  const fields = {
    id: 'id',
    uuid: 'uuid',
    password: 'password',
    login: 'login',
    isOnline: 'isOnline',
    lastOnlineTime: 'lastOnlineTime'
  }

  db.exec(`
    CREATE TABLE IF NOT EXISTS ${tableName} (
      ${fields.id} INTEGER PRIMARY KEY,
      ${fields.uuid} VARCHAR(36) NOT NULL,
      ${fields.password} VARCHAR(100) NOT NULL,
      ${fields.login} VARCHAR(30) NOT NULL,
      ${fields.isOnline} BOOLEAN NOT NULL,
      ${fields.lastOnlineTime} DATETIME NOT NULL
    )  
  `)

  return {
    create: (data) => {
      try {
        if (!checkFieldNames(data, fields)) {
          throw new Error('Incorrect field name')
        }
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
      try {
        const { query } = buildSelectQuery(tableName)
        const data = db.prepare(query).all()
        return data
      } catch (e) {
        console.log(e)
        return false
      }
    },
    count: () => {
      try {
        const query = `SELECT COUNT(*) FROM ${tableName}`
        const count = db.prepare(query).pluck().get()
        return count
      } catch (e) {
        console.log(e)
        return false
      }
    },
    getByUuid: (uuid) => {
      try {
        const query = `SELECT * FROM ${tableName} WHERE uuid = ?`
        const user = db.prepare(query).pluck().get(uuid)
        return user
      } catch (e) {
        console.log(e)
        return false
      }
    }
  }
}

export default userModel
