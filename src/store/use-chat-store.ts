import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ChatMessage } from "@/types/chat";
import { ChatService } from "@/services/chat.service";
import { getOrCreateSessionId } from "@/lib/session";

interface ChatStoreState {
  isOpen: boolean;
  isStreaming: boolean;
  messages: ChatMessage[];
  sessionId: string;

  toggleChat: () => void;
  openChat: () => void;
  closeChat: () => void;
  sendMessage: (prompt: string) => Promise<void>;
  clearHistory: () => void;
}

export const useChatStore = create<ChatStoreState>()(
  persist(
    (set, get) => ({
      isOpen: false,
      isStreaming: false,
      sessionId: "",
      messages: [
        {
          id: "welcome-msg",
          role: "assistant",
          content:
            "Hi, I'm Aka! 👋 I can help you check order statuses, process refunds, search kicks, or answer policy questions. How can I help today?",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ],

      toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
      openChat: () => set({ isOpen: true }),
      closeChat: () => set({ isOpen: false }),

      sendMessage: async (prompt: string) => {
        const trimmed = prompt.trim();
        if (!trimmed || get().isStreaming) return;

        // Ensure session ID exists
        let currentSessionId = get().sessionId;
        if (!currentSessionId) {
          currentSessionId = getOrCreateSessionId() || `chat_${Date.now()}`;
          set({ sessionId: currentSessionId });
        }

        const userMessage: ChatMessage = {
          id: `usr_${Date.now()}`,
          role: "user",
          content: trimmed,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        const assistantMessageId = `bot_${Date.now()}`;
        const assistantPlaceholder: ChatMessage = {
          id: assistantMessageId,
          role: "assistant",
          content: "",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        // Append user message and blank assistant bubble
        set((state) => ({
          messages: [...state.messages, userMessage, assistantPlaceholder],
          isStreaming: true,
        }));

        await ChatService.streamMessage(
          { sessionId: currentSessionId, prompt: trimmed },
          (chunk) => {
            // Append incoming tokens incrementally
            set((state) => ({
              messages: state.messages.map((msg) =>
                msg.id === assistantMessageId
                  ? { ...msg, content: msg.content + chunk }
                  : msg
              ),
            }));
          },
          () => {
            set({ isStreaming: false });
          },
          (error) => {
            console.error("Streaming error:", error);
            set((state) => ({
              isStreaming: false,
              messages: state.messages.map((msg) =>
                msg.id === assistantMessageId
                  ? {
                      ...msg,
                      content:
                        "Sorry, I encountered an issue connecting to the assistant. Please try again in a moment.",
                    }
                  : msg
              ),
            }));
          }
        );
      },

      clearHistory: () =>
        set({
          messages: [
            {
              id: "welcome-msg",
              role: "assistant",
              content:
                "Hi, I'm Aka! 👋 How can I assist you with your sneakers or orders today?",
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ],
        }),
    }),
    {
      name: "solevault-aka-chat",
      partialize: (state) => ({ messages: state.messages, sessionId: state.sessionId }),
    }
  )
);