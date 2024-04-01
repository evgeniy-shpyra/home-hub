const deviceModel = (db) => {
  const tableName = 'devices'

  db.exec(`
    CREATE TABLE IF NOT EXISTS ${tableName} (
      id INTEGER PRIMARY KEY,
      topic_id INTEGER NOT NULL,
      isOnline BOOLEAN NOT NULL,
      status BOOLEAN NOT NULL,
      connectedAt DATETIME,
      FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
    )  
  `)

  return {}
}

export default deviceModel
