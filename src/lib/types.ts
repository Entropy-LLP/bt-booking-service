// ============================================================
// src/lib/types.ts
//
// Responsibility: all shared domain types for the booking service.
//   - BookingStop: a single geographic stop on an order
//   - OrderState: full lifecycle enum
//   - Booking: the core domain entity
//   - CreateBookingInput: inbound shape for creating a booking
//   - CreateBookingInputSchema: Zod runtime validation for CreateBookingInput
//   - BookingError: base domain error with a machine-readable code
// ============================================================

import { z } from 'zod'

// -----------------------------------------------------------
// BookingStop
// Represents either the pickup or delivery point on an order.
// -----------------------------------------------------------

export type BookingStop = {
  address: string
  lat: number
  lng: number
  contactName: string
  contactPhone: string
  scheduledAt: Date
  actualAt?: Date
  notes?: string
}

// -----------------------------------------------------------
// OrderState
// Full lifecycle of a booking, from draft through completion.
// -----------------------------------------------------------

export enum OrderState {
  DRAFT           = 'DRAFT',
  SUBMITTED       = 'SUBMITTED',
  ASSIGNED        = 'ASSIGNED',
  PICKUP_EN_ROUTE = 'PICKUP_EN_ROUTE',
  AT_PICKUP       = 'AT_PICKUP',
  IN_TRANSIT      = 'IN_TRANSIT',
  AT_DELIVERY     = 'AT_DELIVERY',
  DELIVERED       = 'DELIVERED',
  COMPLETED       = 'COMPLETED',
  CANCELLED       = 'CANCELLED',
  DISPUTED        = 'DISPUTED',
}

// -----------------------------------------------------------
// Booking
// Core domain entity persisted in the `orders` table.
// -----------------------------------------------------------

export type Booking = {
  id: string
  shipperId: string
  driverId?: string
  carrierId?: string
  vehicleId?: string
  pickup: BookingStop
  delivery: BookingStop
  orderType: string
  cargoType: string
  weightKg: number
  volumeCbm?: number
  declaredValue: number
  description: string
  specialInstructions?: string
  rateAmount: number
  rateType: string
  requiresPhotoProof: boolean
  requiresSignature: boolean
  ewayBillNumber?: string
  ewayBillExpiry?: Date
  currentState: OrderState
  createdAt: Date
  updatedAt: Date
}

// -----------------------------------------------------------
// CreateBookingInput
// Caller-supplied fields only — the service fills the rest.
// -----------------------------------------------------------

export type CreateBookingInput = Omit<
  Booking,
  'id' | 'currentState' | 'createdAt' | 'updatedAt' | 'driverId' | 'carrierId' | 'vehicleId'
>

// -----------------------------------------------------------
// Zod schema for CreateBookingInput
// Use for request body validation at the route layer.
// -----------------------------------------------------------

const BookingStopSchema = z.object({
  address:      z.string().min(1),
  lat:          z.number(),
  lng:          z.number(),
  contactName:  z.string().min(1),
  contactPhone: z.string().min(1),
  scheduledAt:  z.coerce.date(),
  actualAt:     z.coerce.date().optional(),
  notes:        z.string().optional(),
})

export const CreateBookingInputSchema = z.object({
  shipperId:           z.string().uuid(),
  pickup:              BookingStopSchema,
  delivery:            BookingStopSchema,
  orderType:           z.string().min(1),
  cargoType:           z.string().min(1),
  weightKg:            z.number().positive(),
  volumeCbm:           z.number().positive().optional(),
  declaredValue:       z.number().nonnegative(),
  description:         z.string().min(1),
  specialInstructions: z.string().optional(),
  rateAmount:          z.number().nonnegative(),
  rateType:            z.string().min(1),
  requiresPhotoProof:  z.boolean(),
  requiresSignature:   z.boolean(),
  ewayBillNumber:      z.string().optional(),
  ewayBillExpiry:      z.coerce.date().optional(),
})

// -----------------------------------------------------------
// BookingError
// Base domain error; carry a machine-readable code so HTTP
// handlers can map errors to status codes without string-matching.
// -----------------------------------------------------------

export class BookingError extends Error {
  public readonly code: string

  constructor(message: string, code: string) {
    super(message)
    this.name = 'BookingError'
    this.code = code
  }
}
