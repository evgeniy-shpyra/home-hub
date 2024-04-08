export const checkFieldNames = (data, possibleFields) => {
  for (const name in data) {
    if (possibleFields[name] === undefined) return false
  }
  return true
}

export const buildInsertQuery = (tableName, data) => {
  const fields = []
  const values = []
  for (const name in data) {
    fields.push(name)
    values.push(data[name])
  }
  const fieldsStr = fields.join(',')
  const valuesStr = new Array(values.length).fill('?').join(',')

  return {
    query: `INSERT INTO ${tableName} (${fieldsStr}) VALUES (${valuesStr});`,
    values
  }
}

export const buildSelectQuery = (tableName, opt = {}) => {
  const fields = opt.fields || '*'
  const where = opt.fields || ''

  const query = `SELECT ${fields.split(', ')} FROM ${tableName} ${
    where.length ? `WHERE ${where}` : ''
  };`

  return {
    query
  }
}
