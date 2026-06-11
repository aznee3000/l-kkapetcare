"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { createClient } from "@/lib/supabase/client";
import { sendMessage } from "@/app/dashboard/chat-actions";
import { initialFormState } from "@/lib/form-state";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { Message } from "@/lib/types";

function SendButton() {
  const { pending } = useFormStatus();
  const { t } = useI18n();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? t.dashboard.sendingMessage : t.dashboard.sendMessage}
    </Button>
  );
}

export default function BookingChat({ bookingId }: { bookingId: string }) {
  const { t, locale } = useI18n();
  const [messages, setMessages] = useState<Message[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [state, formAction] = useActionState(sendMessage, initialFormState);
  const formRef = useRef<HTMLFormElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  // Load history, identify the current user, and subscribe to new messages.
  useEffect(() => {
    const supabase = createClient();
    let active = true;

    supabase.auth.getUser().then(({ data }) => {
      if (active) setUserId(data.user?.id ?? null);
    });

    supabase
      .from("messages")
      .select("*")
      .eq("booking_id", bookingId)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        if (active && data) setMessages(data as Message[]);
      });

    const channel = supabase
      .channel(`messages:${bookingId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `booking_id=eq.${bookingId}`,
        },
        (payload) => {
          setMessages((prev) => {
            const next = payload.new as Message;
            if (prev.some((m) => m.id === next.id)) return prev;
            return [...prev, next];
          });
        },
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [bookingId]);

  // Clear the input after a successful send and keep the view scrolled down.
  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const fmt = (iso: string) =>
    new Date(iso).toLocaleString(locale === "no" ? "nb-NO" : "en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-soft">
      <h2 className="font-semibold text-gray-900">{t.dashboard.messagesTitle}</h2>
      <p className="mb-3 text-xs text-gray-500">{t.dashboard.messagesIntro}</p>

      <div className="max-h-80 space-y-2 overflow-y-auto rounded-xl bg-gray-50 p-3">
        {messages.length === 0 ? (
          <p className="py-6 text-center text-sm text-gray-400">
            {t.dashboard.noMessages}
          </p>
        ) : (
          messages.map((m) => {
            const mine = m.sender_id && m.sender_id === userId;
            return (
              <div
                key={m.id}
                className={mine ? "flex justify-end" : "flex justify-start"}
              >
                <div
                  className={[
                    "max-w-[80%] rounded-2xl px-3.5 py-2 text-sm",
                    mine
                      ? "bg-brand-600 text-white"
                      : "border border-gray-200 bg-white text-gray-800",
                  ].join(" ")}
                >
                  <p className="whitespace-pre-wrap break-words">{m.body}</p>
                  <p
                    className={[
                      "mt-1 text-[10px]",
                      mine ? "text-brand-100" : "text-gray-400",
                    ].join(" ")}
                  >
                    {fmt(m.created_at)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={endRef} />
      </div>

      <form ref={formRef} action={formAction} className="mt-3 flex gap-2">
        <input type="hidden" name="booking_id" value={bookingId} />
        <Input
          name="body"
          autoComplete="off"
          placeholder={t.dashboard.messagePlaceholder}
          required
          className="flex-1"
        />
        <SendButton />
      </form>
    </div>
  );
}
