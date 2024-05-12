import app from './src/index.js'

async function main () {
  const shutdownMaxWait = 10_000

  const { stop } = await app()

  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)

  let isRunning = true

  function shutdown () {
    if (!isRunning) return
    isRunning = false
    console.log('closing with grace...')
    stop()
    setTimeout(() => process.exit(1), shutdownMaxWait).unref()
  }
}

main()
