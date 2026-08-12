"use client";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/components/context/AuthContext";
import { sendChatMessage, getApiErrorMessage, type ChatMessage } from "@/lib/api";

const STORAGE_KEY = "bustix_chat_history";

const ChatIcon = () => (
  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const CloseIcon = () => (
  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M18 6 6 18" />
    <path d="M6 6l12 12" />
  </svg>
);

const ChatWidget = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
    }
  }, [messages, isOpen]);

  if (!user) return null;

  const handleSend = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    const history = messages;
    setMessages([...history, { role: "user", content: trimmed }]);
    setInput("");
    setError(null);
    setIsSending(true);

    try {
      const reply = await sendChatMessage(trimmed, history);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setError(getApiErrorMessage(err, "No se pudo enviar el mensaje. Intenta de nuevo."));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Cerrar chat" : "Abrir chat de ayuda"}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105"
      >
        {isOpen ? <CloseIcon /> : <ChatIcon />}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 flex max-h-[70vh] w-[calc(100vw-3rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
          <div className="border-b border-border p-4">
            <h3 className="font-display text-base text-card-foreground">Asistente BusTix</h3>
            <p className="text-xs text-muted-foreground">Resolvemos tus dudas al instante.</p>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                ¡Hola{user.name ? `, ${user.name.split(" ")[0]}` : ""}! ¿En qué te puedo ayudar hoy?
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm ${
                      message.role === "user"
                        ? "ml-auto bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {message.content}
                  </div>
                ))}
              </div>
            )}
            {isSending && (
              <p className="mt-3 text-xs text-muted-foreground">Escribiendo…</p>
            )}
            {error && <p className="mt-3 text-xs text-destructive">{error}</p>}
          </div>

          <form onSubmit={handleSend} className="flex gap-2 border-t border-border p-3">
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Escribe tu pregunta..."
              disabled={isSending}
              className="flex-1 rounded-full border border-border bg-muted px-4 py-2 text-sm text-card-foreground outline-none focus:border-primary disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={isSending || !input.trim()}
              className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-60"
            >
              Enviar
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
