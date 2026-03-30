import type { FastifyInstance } from 'fastify'
import { z } from 'zod'

const UpdateLocationBody = z.object({
  driver_id: z.string().uuid(),
  lat: z.number(),
  lng: z.number(),
  booking_id: z.string().uuid().optional(),
})

export async function locationRoutes(app: FastifyInstance) {

  // POST /location/update — driver app sends GPS ping every 5s while trip active
  app.post('/update', async (req, reply) => {
    const body = UpdateLocationBody.safeParse(req.body)
    if (!body.success) return reply.status(400).send({ success: false, error: body.error.errors[0].message })
    const { driver_id, lat, lng, booking_id } = body.data

    // TODO: store in Redis (live location cache) with 30s TTL
    // TODO: push to shipper via WebSocket if booking_id active

    app.log.info({ driver_id, lat, lng, booking_id }, 'Location update')
    return reply.send({ success: true, data: { received: true } })
  })

  // GET /location/driver/:driver_id — get last known location (shipper polling)
  app.get('/driver/:driver_id', async (req, reply) => {
    const { driver_id } = req.params as { driver_id: string }
    // TODO: read from Redis
    return reply.send({ success: true, data: { driver_id, lat: null, lng: null, note: 'Sprint 3' } })
  })
}
