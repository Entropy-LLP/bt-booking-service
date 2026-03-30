import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import { bookingRoutes } from './routes/bookings.js'
import { locationRoutes } from './routes/location.js'

const app = Fastify({
  logger: {
    transport: process.env.NODE_ENV === 'development'
      ? { target: 'pino-pretty', options: { colorize: true } } : undefined,
  },
})

async function bootstrap() {
  await app.register(cors, { origin: true })
  await app.register(bookingRoutes, { prefix: '/bookings' })
  await app.register(locationRoutes, { prefix: '/location' })
  app.get('/health', () => ({ status: 'ok', service: 'bt-booking-service', ts: new Date().toISOString() }))
  await app.listen({ port: Number(process.env.PORT ?? 3002), host: '0.0.0.0' })
}

bootstrap().catch(err => { console.error(err); process.exit(1) })
