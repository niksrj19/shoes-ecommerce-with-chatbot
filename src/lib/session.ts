export const SESSION_COOKIE_NAME = "sessionId";

export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";

  const match = document.cookie.match(new RegExp(`(^| )${SESSION_COOKIE_NAME}=([^;]+)`));
  if (match && match[2]) {
    return match[2];
  }

  const newSessionId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const expires = new Date();
  expires.setDate(expires.getDate() + 30); // 30-day session TTL
  document.cookie = `${SESSION_COOKIE_NAME}=${newSessionId}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;

  return newSessionId;
}