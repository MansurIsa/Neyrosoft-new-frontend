"use client";

import { useEffect, useRef, useState } from "react";

import { useI18n } from "@/i18n/client";
import { apiGet } from "@/lib/api";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { greet, sendChatMessage } from "@/store/slices/chatSlice";
import { setChatOpen } from "@/store/slices/uiSlice";

import { IconChat, IconClose, IconSend } from "./Icons";

export default function Chatbot() {
  const { dict, locale } = useI18n();
  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.ui.chatOpen);
  const { messages, quickReplies, status } = useAppSelector((state) => state.chat);

  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Seed the transcript the first time the panel opens. The starter chips come
  // from the backend so the team can change them without a deploy.
  useEffect(() => {
    if (!open || messages.length > 0) return;
    let cancelled = false;

    (async () => {
      const data = await apiGet<{ suggestions: string[] }>("/chatbot/suggestions/", {
        locale,
        revalidate: 0,
      });
      if (cancelled) return;
      dispatch(
        greet({
          text: dict.chat.greeting,
          suggestions: data?.suggestions ?? [],
        }),
      );
    })();

    return () => {
      cancelled = true;
    };
  }, [open, messages.length, locale, dict.chat.greeting, dispatch]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, status]);

  // Escape closes the panel.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") dispatch(setChatOpen(false));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, dispatch]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || status === "sending") return;
    setDraft("");
    void dispatch(sendChatMessage({ text: trimmed, locale }));
  };

  return (
    <>
      <button
        type="button"
        onClick={() => dispatch(setChatOpen(!open))}
        aria-label={open ? dict.chat.close : dict.chat.open}
        aria-expanded={open}
        className="bg-signal hover:bg-signal-dark shadow-pop fixed right-4 bottom-4 z-50 flex h-14 w-14 items-center justify-center rounded-full text-white transition-transform duration-200 hover:scale-105 active:scale-95 sm:right-6 sm:bottom-6"
      >
        {open ? <IconClose width={22} height={22} /> : <IconChat width={22} height={22} />}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={dict.chat.title}
          className="border-line bg-surface animate-rise shadow-pop fixed right-0 bottom-0 z-50 flex h-[min(560px,82vh)] w-full flex-col overflow-hidden rounded-t-[24px] border sm:right-6 sm:bottom-24 sm:w-[380px] sm:rounded-[24px]"
        >
          <header className="border-line flex items-center justify-between gap-3 border-b px-4 py-3.5">
            <div className="flex items-center gap-3">
              <span className="icon-plate h-10 w-10 rounded-full">
                <IconChat width={19} height={19} />
              </span>
              <div>
                <p className="text-body text-sm font-semibold">{dict.chat.title}</p>
                <p className="text-muted text-xs">{dict.chat.subtitle}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => dispatch(setChatOpen(false))}
              aria-label={dict.chat.close}
              className="text-muted hover:bg-surface-2 hover:text-body rounded-full p-1.5 transition-colors"
            >
              <IconClose width={18} height={18} />
            </button>
          </header>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <p
                  className={`max-w-[86%] px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                    message.role === "user"
                      ? "bg-signal rounded-2xl rounded-br-md text-white"
                      : "bg-surface-2 text-body rounded-2xl rounded-bl-md"
                  }`}
                >
                  {message.text}
                </p>
              </div>
            ))}

            {status === "sending" && (
              <p className="text-muted text-xs">{dict.chat.typing}</p>
            )}
            {status === "failed" && (
              <p className="text-signal text-xs">{dict.chat.error}</p>
            )}

            {quickReplies.length > 0 && status !== "sending" && (
              <div className="flex flex-wrap gap-2 pt-1">
                {quickReplies.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => send(chip)}
                    className="border-line text-muted hover:border-signal hover:bg-signal-soft hover:text-signal rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="border-line flex items-center gap-2 border-t p-3">
            <input
              ref={inputRef}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") send(draft);
              }}
              placeholder={dict.chat.placeholder}
              aria-label={dict.chat.placeholder}
              maxLength={1000}
              className="field"
            />
            <button
              type="button"
              onClick={() => send(draft)}
              disabled={!draft.trim() || status === "sending"}
              aria-label={dict.chat.send}
              className="btn btn-primary h-11 w-11 shrink-0 p-0"
            >
              <IconSend width={18} height={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
