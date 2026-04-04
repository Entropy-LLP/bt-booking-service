// ============================================================
// src/lib/state.ts
//
// Responsibility: order lifecycle state machine.
//   - VALID_TRANSITIONS: every legal edge in the state graph
//   - transitionOrder(): validates a requested transition and
//     persists the state change + event atomically
//   - replayEvents(): reconstructs current state from the event log
// ============================================================

import { OrderState } from './types.js'

// -----------------------------------------------------------
// Valid transition map
// Read as: "from state X, the service may move to any of [Y, Z]"
// Terminal states (COMPLETED, CANCELLED) have empty arrays — no exit.
// -----------------------------------------------------------

export const VALID_TRANSITIONS: Record<OrderState, OrderState[]> = {
  [OrderState.DRAFT]:           [OrderState.SUBMITTED, OrderState.CANCELLED],
  [OrderState.SUBMITTED]:       [OrderState.ASSIGNED, OrderState.CANCELLED],
  [OrderState.ASSIGNED]:        [OrderState.PICKUP_EN_ROUTE, OrderState.CANCELLED],
  [OrderState.PICKUP_EN_ROUTE]: [OrderState.AT_PICKUP, OrderState.CANCELLED],
  [OrderState.AT_PICKUP]:       [OrderState.IN_TRANSIT, OrderState.CANCELLED, OrderState.DISPUTED],
  [OrderState.IN_TRANSIT]:      [OrderState.AT_DELIVERY, OrderState.CANCELLED, OrderState.DISPUTED],
  [OrderState.AT_DELIVERY]:     [OrderState.DELIVERED, OrderState.DISPUTED],
  [OrderState.DELIVERED]:       [OrderState.COMPLETED, OrderState.DISPUTED],
  [OrderState.COMPLETED]:       [],
  [OrderState.CANCELLED]:       [],
  [OrderState.DISPUTED]:        [OrderState.IN_TRANSIT, OrderState.CANCELLED, OrderState.COMPLETED],
}

// -----------------------------------------------------------
// transitionOrder
//
// Validates that `to` is a legal next state for this booking,
// then atomically:
//   1. Writes a row to order_events
//   2. Updates currentState on the orders row
// Both writes must happen in a single DB transaction.
// -----------------------------------------------------------

export async function transitionOrder(
  bookingId: string,
  to: OrderState,
  actorId: string,
): Promise<void> {
  // TODO: load current booking state from DB (repository.getBookingById)
  // TODO: verify VALID_TRANSITIONS[currentState].includes(to); throw BookingError if not
  // TODO: open a DB transaction:
  //         - appendEvent(bookingId, { from: currentState, to }, actorId)
  //         - UPDATE orders SET currentState = to, updatedAt = now() WHERE id = bookingId
  // TODO: commit transaction
  void bookingId
  void to
  void actorId
}

// -----------------------------------------------------------
// replayEvents
//
// Reads the full ordered event log for `bookingId` and walks
// it from oldest → newest to reconstruct the current OrderState.
// Falls back to DRAFT when no state-bearing events exist.
//
// Use cases:
//   - Consistency checks (compare against currentState column)
//   - State recovery after a failed transaction
// -----------------------------------------------------------

export async function replayEvents(bookingId: string): Promise<OrderState> {
  // TODO: call repository.getEvents(bookingId)
  // TODO: reduce events, picking payload.to as the running state on each entry
  // TODO: return final derived state
  void bookingId
  return OrderState.DRAFT
}
