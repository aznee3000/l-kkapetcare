import {
  BOOKING_STATUS_LABELS,
  BOOKING_STATUS_STYLES,
  SITTER_STATUS_LABELS,
  SITTER_STATUS_STYLES,
} from "@/lib/constants";
import type { BookingStatus, SitterStatus } from "@/lib/types";

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${BOOKING_STATUS_STYLES[status]}`}
    >
      {BOOKING_STATUS_LABELS[status]}
    </span>
  );
}

export function SitterStatusBadge({ status }: { status: SitterStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${SITTER_STATUS_STYLES[status]}`}
    >
      {SITTER_STATUS_LABELS[status]}
    </span>
  );
}
