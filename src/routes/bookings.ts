import type { FastifyInstance } from 'fastify'
import { z } from 'zod'

const CreateBookingBody = z.object({
  pickup_address: z.string(),
  pickup_lat: z.number(),
  pickup_lng: z.number(),
  drop_address: z.string(),
  drop_lat: z.number(),
  drop_lng: z.number(),
  vehicle_type: z.enum(['mini_truck', 'lcv', 'hcv', 'trailer']),
  load_type: z.enum(['general', 'fragile', 'perishable', 'hazardous', 'heavy_machinery']),
  weight_kg: z.number().positive(),
  scheduled_at: z.string().datetime(),
  notes: z.string().optional(),
})

export async function bookingRoutes(app: FastifyInstance) {

  // POST /bookings — create a new booking, get price quote, find nearest driver
  app.post('/', async (req, reply) => {
    const body = CreateBookingBody.safeParse(req.body)
    if (!body.success) return reply.status(400).send({ success: false, error: body.error.errors[0].message })

    // TODO: verify JWT, get shipper_id from token
    // TODO: call pricing-service for quote
    // TODO: insert booking into Supabase
    // TODO: trigger driver matching

    return reply.status(201).send({
      success: true,
      data: {
        id: 'booking-stub-id',
        status: 'pending',
        message: 'Booking created — driver matching in Sprint 3-4',
        ...body.data,
      },
    })
  })

  // GET /bookings/:id
  app.get('/:id', async (req, reply) => {
    const { id } = req.params as { id: string }
    // TODO: fetch from Supabase with driver + shipper details
    return reply.send({ success: true, data: { id, status: 'stub — Sprint 3' } })
  })

  // GET /bookings — list bookings for current user
  app.get('/', async (_req, reply) => {
    // TODO: filter by shipper_id or driver_id from JWT
    return reply.send({ success: true, data: [] })
  })

  // PATCH /bookings/:id/cancel
  app.patch('/:id/cancel', async (req, reply) => {
    const { id } = req.params as { id: string }
    // TODO: check cancellation window (2hr before pickup), update status
    return reply.send({ success: true, data: { id, status: 'cancelled' } })
  })

  // POST /bookings/:id/confirm-pickup — driver OTP confirmation
  app.post('/:id/confirm-pickup', async (req, reply) => {
    const { id } = req.params as { id: string }
    const { otp } = (req.body as any) ?? {}
    // TODO: verify OTP stored in Redis for this booking, update status → in_transit
    return reply.send({ success: true, data: { id, status: 'in_transit', otp_received: otp } })
  })

  // POST /bookings/:id/deliver — driver marks delivery, triggers ePOD + payment release
  app.post('/:id/deliver', async (req, reply) => {
    const { id } = req.params as { id: string }
    // TODO: save ePOD photo, update status → delivered, call payment-service to release escrow
    return reply.send({ success: true, data: { id, status: 'delivered' } })
  })
}
