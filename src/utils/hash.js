import crypto from 'node:crypto'

export const createHash = (string) => {
  return crypto.createHash('sha256').update(string).digest('hex')
}
