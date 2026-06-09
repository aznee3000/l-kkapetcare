// =============================================================================
// Payments — STUB for the MVP.
//
// In v1 the admin marks bookings as paid manually (see /admin/bookings).
// This module isolates all payment logic so a real provider (Stripe / Vipps)
// can be dropped in later without touching the rest of the app.
// =============================================================================

export type PaymentProvider = "manual" | "stripe" | "vipps";

export interface PaymentResult {
  provider: PaymentProvider;
  paid: boolean;
  reference?: string;
}

// Current MVP behaviour: payment is recorded by the admin toggling
// `booking_requests.paid_manually`. This helper just documents that intent.
export function recordManualPayment(): PaymentResult {
  return { provider: "manual", paid: true };
}

// FUTURE: implement real checkout sessions.
//
// export async function createStripeCheckout(bookingId: string, amountNok: number) {
//   // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
//   // return stripe.checkout.sessions.create({ ... });
//   throw new Error("Stripe not implemented yet — using manual payments for MVP");
// }
//
// export async function createVippsPayment(bookingId: string, amountNok: number) {
//   // Call Vipps eCom API here.
//   throw new Error("Vipps not implemented yet — using manual payments for MVP");
// }
