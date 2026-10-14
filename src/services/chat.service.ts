import { ChatStreamRequestPayload } from "@/types/chat";

const BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const ChatService = {
  async streamMessage(
    payload: ChatStreamRequestPayload,
    onChunk: (token: string) => void,
    onComplete: () => void,
    onError: (error: Error) => void
  ): Promise<void> {
    try {
      const response = await fetch(`${BACKEND_BASE_URL}/ai/chat/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`Stream failed: ${response.statusText}`);
      if (!response.body) throw new Error("ReadableStream not supported");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      
      let buffer = "";
      let currentEvent = "message"; // default SSE event type

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || ""; // keep incomplete line in buffer

        for (const line of lines) {
          const trimmed = line.trim();
          
          if (!trimmed) {
            // Empty line means end of an SSE message block; reset event type
            currentEvent = "message";
            continue;
          }

          if (trimmed.startsWith("event:")) {
            currentEvent = trimmed.replace(/^event:\s*/, "").trim();
          } else if (trimmed.startsWith("data:")) {
            const dataStr = trimmed.replace(/^data:\s*/, "");
            
            try {
              const parsed = JSON.parse(dataStr);

              if (currentEvent === "token") {
                // Matches StreamService.emitToken -> { token: "..." }
                if (parsed.token) onChunk(parsed.token);
              } else if (currentEvent === "tool_call") {
                // Matches StreamService.emitToolCall -> { name: "...", args: "..." }
                console.log(`Tool executing: ${parsed.name} with args: ${parsed.args}`);
              } else if (currentEvent === "done") {
                onComplete();
                return;
              } else if (currentEvent === "error") {
                throw new Error(parsed.error || "Unknown stream error");
              }
            } catch (err) {
              // Handle non-JSON fallback data if any
              if (currentEvent === "token" && dataStr) {
                onChunk(dataStr);
              }
            }
          }
        }
      }

      onComplete();
    } catch (err: any) {
      onError(err instanceof Error ? err : new Error(String(err)));
    }
  },
};