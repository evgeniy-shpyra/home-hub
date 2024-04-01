const topicModel = (db) => {
  const tableName = 'topics'
  db.exec(`
    CREATE TABLE IF NOT EXISTS ${tableName} (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL
    )  
  `)

  return {
    
  }
}

export default topicModel
