import { queryWrapper } from '../../utils/dbTools.js'

const deviceModel = (db) => {
  const actionTableName = 'actions'
  const deviceTableName = 'devices'
  const deviceActionTableName = 'action_device'
  const sensorTableName = 'sensors'

  db.exec(`
    CREATE TABLE IF NOT EXISTS ${deviceTableName} (
      id INTEGER PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      password VARCHAR(64) NOT NULL,
      isOnline BOOLEAN NOT NULL,
      connectedAt DATETIME
    )  
  `)

  return {
    create: function ({ name, password }) {
      return queryWrapper(() => {
        const createQuery = db.prepare(
          `INSERT INTO ${deviceTableName} (name, password, isOnline ) VALUES (?, ?, 0);`
        )
        db.transaction(() => {
          createQuery.run(name, password)
        })()
      })
    },
    getAll: () => {
      return queryWrapper(() => {
        const query = `SELECT * FROM ${deviceTableName};`
        const result = db.prepare(query).all()
        return result
      })
    },
    getById: (id) => {
      return queryWrapper(() => {
        const query = `SELECT * FROM ${deviceTableName} WHERE id = ?;`
        const result = db.prepare(query).get(id)
        return result
      })
    },
    getByNameAndPassword: ({ name, password }) => {
      return queryWrapper(() => {
        const query = `SELECT * FROM ${deviceTableName} WHERE name = ? AND password = ?;`
        const result = db.prepare(query).get(name, password)
        return result
      })
    },
    getByName: (name) => {
      return queryWrapper(() => {
        const query = `SELECT * FROM ${deviceTableName} WHERE name = ?;`
        const result = db.prepare(query).get(name)
        return result
      })
    },

    setOnline: ({ isOnline, id }) => {
      return queryWrapper(() => {
        const query = db.prepare(
          `UPDATE ${deviceTableName} SET isOnline = ?, connectedAt = ? WHERE id = ?;`
        )
        db.transaction(() => {
          query.run(isOnline, new Date().toISOString(), id)
        })()
      })
    },
    deleteAll: () => {
      return queryWrapper(() => {
        const query = db.prepare(`DELETE FROM ${deviceTableName};`)
        db.transaction(() => {
          query.run()
        })()
      })
    },
    deleteById: (id) => {
      return queryWrapper(() => {
        const query = `DELETE FROM ${deviceTableName} WHERE id = ?`
        const result = db.prepare(query).run(id)
        const isDeleted = result.changes === 1
        return isDeleted
      })
    },
    getDevicesByActiveActions: () => {
      return queryWrapper(() => {
        const query = `SELECT device.id as deviceId, device.name as deviceName,
                              actionDevice.deviceStatus, actionDevice.priority, 
                              action.id as actionId, action.name as actionName,
                              sensor.name as sensorName, sensor.id as sensorId, sensor.status as sensorStatus
                       FROM ${deviceTableName} as device
                       INNER JOIN ${deviceActionTableName} as actionDevice
                       ON device.id = actionDevice.deviceId
                       INNER JOIN ${actionTableName} as action
                       ON action.id = actionDevice.actionId
                       INNER JOIN ${sensorTableName} as sensor
                       ON sensor.action_id = action.id`
        const result = db.prepare(query).all()
        return result
      })
    },
    getDevicesByActiveActionsById: (deviceId) => {
      return queryWrapper(() => {
        const query = `SELECT device.id as deviceId, device.name as deviceName,
                              actionDevice.deviceStatus, actionDevice.priority, 
                              action.id as actionId, action.name as actionName,
                              sensor.name as sensorName, sensor.id as sensorId, sensor.status as sensorStatus
                       FROM ${deviceTableName} as device
                       INNER JOIN ${deviceActionTableName} as actionDevice
                       ON device.id = actionDevice.deviceId
                       INNER JOIN ${actionTableName} as action
                       ON action.id = actionDevice.actionId
                       INNER JOIN ${sensorTableName} as sensor
                       ON sensor.action_id = action.id
                       WHERE sensor.status = 1 AND deviceId = ?;`
        const result = db.prepare(query).all(deviceId)
        return result
      })
    }
  }
}

export default deviceModel
