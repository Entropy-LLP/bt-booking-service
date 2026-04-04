// ============================================================
// src/lib/service.ts
//
// Responsibility: business logic layer.
//   Orchestrates repository (DB) and state machine calls.
//   Route handlers call into this layer; this layer must never
//   know about HTTP, Fastify, or request/response objects.
// ============================================================

import type { Booking, CreateBookingInput } from './types.js'
import { BookingError, OrderState } from './types.js'
import { transitionOrder } from './state.js'
import {
  createBooking as repoCreateBooking,
  getBookingById,
  listBookings as repoListBookings,
} from './repository.js'

// -----------------------------------------------------------
// createBooking
// -----------------------------------------------------------

export async function createBooking(input: CreateBookingInput): Promise<Booking> {
  // TODO: validate input with CreateBookingInputSchema
  // TODO: call repoCreateBooking(input)
  // TODO: enqueue notifyDriver job (jobs.ts)
  return repoCreateBooking(input)
}

// -----------------------------------------------------------
// getBooking
// Throws BookingError('NOT_FOUND') when the booking does not exist.
// -----------------------------------------------------------

export async function getBooking(id: string): Promise<Booking> {
  // TODO: call getBookingById(id)
  // TODO: if null, throw new BookingError(`Booking ${id} not found`, 'NOT_FOUND')
  const booking = await getBookingById(id)
  if (booking === null) {
    throw new BookingError(`Booking ${id} not found`, 'NOT_FOUND')
  }
  return booking
}

// -----------------------------------------------------------
// listBookings
// -----------------------------------------------------------

export async function listBookings(shipperId: string): Promise<Booking[]> {
  // TODO: call repoListBookings(shipperId)
  return repoListBookings(shipperId)
}

// -----------------------------------------------------------
// cancelBooking
// -----------------------------------------------------------

export async function cancelBooking(id: string, actorId: string): Promise<void> {
  // TODO: call getBooking(id) to confirm it exists (throws if not)
  // TODO: call transitionOrder(id, OrderState.CANCELLED, actorId)
  //       transitionOrder handles validation + atomic DB write
  await getBooking(id)
  await transitionOrder(id, OrderState.CANCELLED, actorId)
}
