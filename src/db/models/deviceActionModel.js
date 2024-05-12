import { queryWrapper } from '../../utils/dbTools.js'

const deviceActionModel = (db) => {
  const actionTableName = 'actions'
  const deviceTableName = 'devices'
  const deviceActionTableName = 'action_device'

  db.exec(`
    CREATE TABLE IF NOT EXISTS ${deviceActionTableName} (
      id INTEGER PRIMARY KEY,
      actionId VARCHAR(40),
      deviceId INTEGER,
      priority INTEGER NOT NULL,
      deviceStatus BOOLEAN NOT NULL,
      FOREIGN KEY (actionId) REFERENCES ${actionTableName}(id) ON DELETE CASCADE,
      FOREIGN KEY (deviceId) REFERENCES ${deviceTableName}(id) ON DELETE CASCADE,
      CONSTRAINT unique_action_device UNIQUE (actionId, deviceId)
    )
  `)

  return {
    create: function ({ actionId, deviceId, priority, deviceStatus }) {
      return queryWrapper(() => {
        const createQuery = db.prepare(
          `INSERT INTO ${deviceActionTableName} (actionId, deviceId, priority, deviceStatus) VALUES (?, ?, ?, ?);`
        )
        db.transaction(() => {
          createQuery.run(actionId, deviceId, priority, deviceStatus)
        })()
      })
    },
    select: () => {
      return queryWrapper(() => {
        const query = `SELECT * FROM ${deviceActionTableName};`
        const result = db.prepare(query).all()
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

export default deviceActionModel
