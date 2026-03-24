import Fastify from 'fastify'
import { PrismaClient } from '@prisma/client'

const app = Fastify({
  logger: true
})

const prisma = new PrismaClient()

app.get('/ping', async (request, reply) => {
  const usersCount = await prisma.user.count()
  
  return { 
    message: 'API rodando perfeitamente', 
    bancoDeDados: `Conectado! Total de usuários: ${usersCount}` 
  }
})

const start = async () => {
  try {
    await app.listen({ port: 3333, host: '0.0.0.0' })
    console.log('Servidor rodando em http://localhost:3333')
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
