// ============================================================
// src/lib/repository.ts
//
// Responsibility: all database interactions for the booking service.
//   - orders table: create, read, list, cancel
//   - order_events table: append-only audit log
//
// DB: inject your pg/kysely client here — this module currently
// operates on a module-level client placeholder. Replace with a
// real SupabaseClient / Kysely<DB> / Pool before wiring up.
// ============================================================

import type { Booking, CreateBookingInput } from './types.js'

// -----------------------------------------------------------
// createBooking
// -----------------------------------------------------------

export async function createBooking(input: CreateBookingInput): Promise<Booking> {
  // TODO: INSERT INTO orders (...) VALUES (...) RETURNING *
  // TODO: map row → Booking domain type
  void input
  throw new Error('createBooking: not implemented')
}

// -----------------------------------------------------------
// getBookingById
// Returns null when no row exists; let callers decide on 404 vs error.
// -----------------------------------------------------------

export async function getBookingById(id: string): Promise<Booking | null> {
  // TODO: SELECT * FROM orders WHERE id = $1 LIMIT 1
  // TODO: return null if no row, else map row → Booking
  void id
  return null
}

// -----------------------------------------------------------
// listBookings
// -----------------------------------------------------------

export async function listBookings(shipperId: string): Promise<Booking[]> {
  // TODO: SELECT * FROM orders WHERE shipperId = $1 ORDER BY createdAt DESC
  void shipperId
  return []
}

// -----------------------------------------------------------
// cancelBooking
// Hard-cancels by writing status only; the state machine in
// state.ts is responsible for validating the transition first.
// -----------------------------------------------------------

export async function cancelBooking(id: string): Promise<void> {
  // TODO: UPDATE orders SET currentState = 'CANCELLED', updatedAt = now() WHERE id = $1
  void id
}

// -----------------------------------------------------------
// appendEvent
// Append-only — never UPDATE or DELETE rows from order_events.
// -----------------------------------------------------------

export async function appendEvent(
  bookingId: string,
  event: object,
  actorId: string,
): Promise<void> {
  // TODO: INSERT INTO order_events (bookingId, payload, actorId, createdAt) VALUES (...)
  void bookingId
  void event
  void actorId
}

// -----------------------------------------------------------
// getEvents
// Returns all events for a booking in chronological order (oldest first).
// Used by replayEvents() in state.ts.
// -----------------------------------------------------------

export async function getEvents(bookingId: string): Promise<object[]> {
  // TODO: SELECT * FROM order_events WHERE bookingId = $1 ORDER BY createdAt ASC
  void bookingId
  return []
}
