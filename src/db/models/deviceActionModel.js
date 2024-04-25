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
      status BOOLEAN NOT NULL,
      priority INTEGER NOT NULL,
      FOREIGN KEY (actionId) REFERENCES ${actionTableName}(id) ON DELETE CASCADE,
      FOREIGN KEY (deviceId) REFERENCES ${deviceTableName}(id) ON DELETE CASCADE,
      CONSTRAINT unique_action_device UNIQUE (actionId, deviceId, status)
    )
  `)

  return {
    select: () => {
      return queryWrapper(() => {
        const query = `SELECT * FROM ${deviceActionTableName};`
        const result = db.prepare(query).all()
        return result
      })
    },
    addDeviceAction: ({ deviceId, actionId, status, priority }) => {
      return queryWrapper(() => {
        const createQuery = db.prepare(
          `INSERT INTO ${deviceActionTableName} (deviceId, actionId, status, priority) VALUES (?, ?, ?, ?);`
        )
        db.transaction(() => {
          createQuery.run(deviceId, actionId, status, priority)
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
  }
}

export default deviceActionModel
