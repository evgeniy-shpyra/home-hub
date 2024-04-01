const actionModel = (db) => {
  const actionTableName = 'actions'
  const deviceTableName = 'devices'

  db.exec(`
    CREATE TABLE IF NOT EXISTS ${actionTableName} (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL
    ) 
  `)

  db.exec(`
    CREATE TABLE IF NOT EXISTS action_device_active (
      action_id INTEGER,
      device_id INTEGER,
      FOREIGN KEY (action_id) REFERENCES ${actionTableName}(id) ON DELETE CASCADE,
      FOREIGN KEY (device_id) REFERENCES ${deviceTableName}(id) ON DELETE CASCADE,
      PRIMARY KEY (action_id, device_id)
    )
  `)
  db.exec(`
    CREATE TABLE IF NOT EXISTS action_device_inactive (
      action_id INTEGER,
      device_id INTEGER,
      FOREIGN KEY (action_id) REFERENCES ${actionTableName}(id) ON DELETE CASCADE,
      FOREIGN KEY (device_id) REFERENCES ${deviceTableName}(id) ON DELETE CASCADE,
      PRIMARY KEY (action_id, device_id)
    )
  `)

  return {
    create: (data) => {
      const fields = []
      const values = []
      for (const name in data) {
        fields.push(name)
        values.push(data[name])
      }
      const fieldsStr = fields.join(',')
      const valuesStr = new Array(values.length).fill('?').join(',')

      const query = db.prepare(
        `INSERT INTO ${actionTableName} (${fieldsStr}) VALUES (${valuesStr});`
      )

      let insertedId = null
      db.transaction(() => {
        const info = query.run(...values)

        insertedId = info.lastInsertRowid
      })()

      return insertedId
    },
  }
}

export default actionModel
