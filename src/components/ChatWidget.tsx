import { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { STORE_INFO } from '@/src/data/menu';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

const INITIAL_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'model',
  text: 'أهلاً وسهلاً بك في طبخ البيت! اسألني عن أي طبق في المنيو، المكونات، التوصيل في جدة، أو طريقة الطلب وسأساعدك فوراً.',
};

const QUICK_PROMPTS = [
  'ما هي أطباق الرز المتوفرة؟',
  'كيف أطلب عبر السلة؟',
  'هل يوجد توصيل لجميع أحياء جدة؟',
];

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, isOpen, isLoading]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const sendMessage = async (rawText: string) => {
    const trimmed = rawText.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: trimmed,
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput('');
    setIsLoading(true);

    // Build bounded conversation history (exclude initial greeting and error bubbles)
    const apiMessages = nextMessages
      .filter((m) => m.id !== 'welcome' && !m.isError)
      .slice(-16)
      .map((m) => ({ role: m.role, text: m.text }));

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const data = (await response.json()) as { reply?: string; error?: string };

      if (!response.ok || !data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            id: `e-${Date.now()}`,
            role: 'model',
            text:
              data.error ||
              `عذراً، تعذر الاتصال حالياً. يمكنك التواصل معنا عبر واتساب: ${STORE_INFO.phoneDisplay}`,
            isError: true,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `m-${Date.now()}`,
            role: 'model',
            text: data.reply as string,
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `e-${Date.now()}`,
          role: 'model',
          text: `عذراً، لا يمكن الاتصال الآن. تواصل معنا عبر واتساب: ${STORE_INFO.phoneDisplay}`,
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void sendMessage(input);
  };

  return (
    <>
      {/* Floating Chat Toggle Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="فتح مساعد طبخ البيت"
          className="fixed bottom-20 left-4 z-40 flex h-13 w-13 items-center justify-center rounded-full bg-gradient-to-l from-[#ea7ca2] to-[#c95b82] text-[#140b0f] shadow-[0_8px_24px_rgba(234,124,162,0.35)] transition-transform duration-150 hover:scale-105 focus-visible:outline-2 focus-visible:outline-white md:bottom-6 md:left-6 md:h-14 md:w-14"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat Box */}
      {isOpen && (
        <section
          aria-label="مساعد طبخ البيت"
          className="fixed bottom-20 left-4 z-50 flex max-h-[520px] w-[360px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-[20px] border border-[#ea7ca2]/40 bg-[#141318] shadow-2xl md:bottom-6 md:left-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-l from-[#ea7ca2] to-[#c95b82] px-4 py-3 text-[#140b0f]">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 shrink-0" />
              <h3 className="text-sm font-black">مساعد طبخ البيت</h3>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="إغلاق المساعد"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#140b0f] transition-colors hover:bg-black/10"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={listRef}
            className="flex min-h-[280px] max-h-[340px] flex-1 flex-col gap-3 overflow-y-auto bg-[#0d0c10] p-4"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-[85%] whitespace-pre-line break-words rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'self-start rounded-br-sm bg-[#ea7ca2] font-semibold text-[#140b0f]'
                    : msg.isError
                      ? 'self-end rounded-bl-sm border border-red-400/30 bg-red-500/10 text-red-200'
                      : 'self-end rounded-bl-sm border border-white/8 bg-[#1b1821] text-white/95'
                }`}
              >
                {msg.text}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 self-end rounded-2xl rounded-bl-sm border border-white/8 bg-[#1b1821] px-3.5 py-2.5 text-xs font-semibold text-[#b8b1c0]">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-[#ea7ca2]" />
                <span>جاري كتابة الرد...</span>
              </div>
            )}

            {messages.length === 1 && !isLoading && (
              <div className="mt-1 flex flex-wrap gap-1.5">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => void sendMessage(prompt)}
                    className="rounded-lg border border-[#ea7ca2]/30 bg-[#141318] px-2.5 py-1.5 text-xs font-semibold text-[#ea7ca2] transition-colors hover:bg-[#1b1821]"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 border-t border-white/10 bg-[#141318] p-3"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="اكتب سؤالك هنا..."
              aria-label="اكتب سؤالك لمساعد طبخ البيت"
              maxLength={500}
              disabled={isLoading}
              className="min-w-0 flex-1 rounded-xl border border-white/12 bg-[#0d0c10] px-3.5 py-2 text-sm text-white placeholder:text-[#b8b1c0]/60 focus:border-[#ea7ca2] focus:outline-none disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              aria-label="إرسال"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ea7ca2] text-[#140b0f] transition-opacity hover:opacity-95 disabled:opacity-45"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </section>
      )}
    </>
  );
}
