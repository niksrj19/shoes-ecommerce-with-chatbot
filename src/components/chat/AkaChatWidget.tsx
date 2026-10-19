"use client";

import React, { useState, useRef, useEffect } from "react";
import { useChatStore } from "@/store/use-chat-store";

const QUICK_PROMPTS = [
  "Track order status",
  "Return & refund policy",
  "Search Nike kicks",
  "Cart assistance",
];

export default function AkaChatWidget() {
  const {
    isOpen,
    isStreaming,
    messages,
    toggleChat,
    closeChat,
    sendMessage,
    clearHistory,
  } = useChatStore();

  const [input, setInput] = useState("");
  const chatRef = useRef<HTMLElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) container.scrollTop = container.scrollHeight;
  }, [messages, isStreaming]);

  // Keep the chat above the on-screen keyboard on mobile browsers.
  useEffect(() => {
    if (!isOpen) return;
    const chatElement = chatRef.current;
    if (!chatElement) return;
    const mobileViewport = window.matchMedia("(max-width: 639px)");
    let animationFrame = 0;

    const updateViewport = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(() => {
        if (!mobileViewport.matches) {
          chatElement.style.removeProperty("top");
          chatElement.style.removeProperty("left");
          chatElement.style.removeProperty("right");
          chatElement.style.removeProperty("bottom");
          chatElement.style.removeProperty("width");
          chatElement.style.removeProperty("height");
          return;
        }

      const viewport = window.visualViewport;
        chatElement.style.top = `${viewport?.offsetTop ?? 0}px`;
        chatElement.style.left = `${viewport?.offsetLeft ?? 0}px`;
        chatElement.style.right = "auto";
        chatElement.style.bottom = "auto";
        chatElement.style.width = `${viewport?.width ?? window.innerWidth}px`;
        chatElement.style.height = `${viewport?.height ?? window.innerHeight}px`;
      });
    };

    updateViewport();
    window.visualViewport?.addEventListener("resize", updateViewport);
    window.visualViewport?.addEventListener("scroll", updateViewport);
    window.addEventListener("resize", updateViewport);
    mobileViewport.addEventListener("change", updateViewport);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.visualViewport?.removeEventListener("resize", updateViewport);
      window.visualViewport?.removeEventListener("scroll", updateViewport);
      window.removeEventListener("resize", updateViewport);
      mobileViewport.removeEventListener("change", updateViewport);
      chatElement.style.removeProperty("top");
      chatElement.style.removeProperty("left");
      chatElement.style.removeProperty("right");
      chatElement.style.removeProperty("bottom");
      chatElement.style.removeProperty("width");
      chatElement.style.removeProperty("height");
    };
  }, [isOpen]);

  // Avoid opening the mobile keyboard (and shifting the page) just to open chat.
  useEffect(() => {
    if (!isOpen || window.matchMedia("(max-width: 639px)").matches) return;

    const timeoutId = window.setTimeout(() => inputRef.current?.focus(), 150);
    return () => window.clearTimeout(timeoutId);
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;
    const text = input;
    setInput("");
    await sendMessage(text);
  };

  const handleQuickPrompt = async (prompt: string) => {
    if (isStreaming) return;
    await sendMessage(prompt);
  };
  // Helper to render chat text with styled internal links
const renderMessageContent = (content: string) => {
  // Simple regex to catch markdown-style links [Text](/path)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    // Push text before the link
    if (match.index > lastIndex) {
      parts.push(content.substring(lastIndex, match.index));
    }
    
    const linkText = match[1];
    const linkUrl = match[2];

    // Push styled button/link component
    parts.push(
      <a
        key={match.index}
        href={linkUrl}
        className="my-1.5 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-blue-500 transition"
      >
        <span>{linkText}</span>
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </a>
    );
    lastIndex = linkRegex.lastIndex;
  }

  if (lastIndex < content.length) {
    parts.push(content.substring(lastIndex));
  }

  return parts.length > 0 ? parts : content;
};

  return (
    <aside
      ref={chatRef}
      aria-label="AI Support Chat"
      className={`fixed z-50 flex flex-col ${
        isOpen
          ? "inset-x-0 top-0 h-dvh items-stretch sm:inset-auto sm:bottom-6 sm:right-6 sm:top-auto sm:h-auto sm:items-end"
          : "bottom-4 right-4 items-end sm:bottom-6 sm:right-6"
      }`}
    >
      {/* ================= OPEN CHAT WINDOW ================= */}
      {isOpen && (
        <div className="mb-0 flex h-full min-h-0 w-full flex-col overflow-hidden border border-neutral-800 bg-neutral-900 shadow-2xl backdrop-blur-xl sm:mb-3 sm:h-[min(540px,calc(100dvh-3rem))] sm:w-[410px] sm:max-w-[calc(100vw-3rem)] sm:rounded-2xl animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between border-b border-neutral-800 bg-neutral-950 px-4 py-3.5">
            <div className="flex items-center gap-3">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 font-black text-xs text-white shadow-md shadow-blue-500/20">
                A
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-neutral-950 bg-emerald-500" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                  Aka
                  <span className="rounded bg-blue-500/10 px-1.5 py-0.2 text-[9px] font-semibold text-blue-400">
                    Support AI
                  </span>
                </h3>
                <p className="text-[10px] text-neutral-400">BaseSole Virtual Assistant</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={clearHistory}
                title="Clear Chat"
                className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 transition"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <button
                type="button"
                onClick={closeChat}
                className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 transition"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div ref={messagesContainerRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 space-y-3.5 [webkit-overflow-scrolling:touch] scrollbar-thin scrollbar-thumb-neutral-700">
            {messages.map((msg) => {
              const isUser = msg.role === "user";
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                      isUser
                        ? "bg-blue-600 text-white rounded-br-none shadow-md shadow-blue-600/10"
                        : "bg-neutral-800 text-neutral-200 border border-neutral-700/60 rounded-bl-none"
                    }`}
                  >
                    {msg.content ? (
                      <div className="whitespace-pre-wrap flex flex-col">
    {renderMessageContent(msg.content)}
  </div>
                    ) : (
                      /* Typing Indicator */
                      <div className="flex items-center gap-1.5 py-1 px-1">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400 [animation-delay:-0.3s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400 [animation-delay:-0.15s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400" />
                      </div>
                    )}
                  </div>
                  <span className="mt-1 text-[9px] text-neutral-500 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Quick Action Suggestion Chips */}
          <div className="flex shrink-0 gap-1.5 overflow-x-auto border-t border-neutral-800/80 bg-neutral-950/40 px-3 py-2 no-scrollbar">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleQuickPrompt(prompt)}
                disabled={isStreaming}
                className="whitespace-nowrap rounded-lg border border-neutral-700 bg-neutral-800/80 px-2 py-1 text-[10px] font-medium text-neutral-300 hover:border-neutral-500 hover:text-white transition disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSubmit}
            className="flex shrink-0 items-center gap-2 border-t border-neutral-800 bg-neutral-950 p-2.5"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Aka about orders, refunds, shoes..."
              disabled={isStreaming}
              className="min-w-0 flex-1 rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-base text-neutral-100 placeholder-neutral-500 focus:border-blue-500 focus:outline-none sm:text-xs"
            />
            <button
              type="submit"
              disabled={!input.trim() || isStreaming}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md hover:bg-blue-500 disabled:opacity-40 transition"
              aria-label="Send message"
            >
              {isStreaming ? (
                <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </form>
        </div>
      )}

      {/* ================= FLOATING ACTION BUTTON (FAB) ================= */}
      <button
        type="button"
        onClick={toggleChat}
        className={`group relative h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-700 to-blue-500 text-white shadow-xl shadow-blue-500/25 transition-all duration-200 hover:scale-105 active:scale-95 ${
          isOpen ? "hidden sm:flex" : "flex"
        }`}
        aria-label="Toggle Aka Support Chat"
      >
        {isOpen ? (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex h-4 w-4 rounded-full bg-blue-500 text-[9px] font-black items-center justify-center text-white">
                1
              </span>
            </span>
          </>
        )}
      </button>
    </aside>
  );
}