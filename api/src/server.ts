import { app } from './app.js'

const start = async () => {
  try {
    await app.ready()

    await app.listen({
      port: 3333,
      host: '0.0.0.0'
    })

    console.log('Servidor rodando em http://localhost:3333')
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
