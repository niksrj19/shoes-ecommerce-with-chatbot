import { apiClient } from "@/lib/api-client";
import { ContactMessagePayload } from "@/types/contact";

export const ContactService = {
  /**
   * POST /api/contact
   */
  async submitMessage(payload: ContactMessagePayload): Promise<void> {
    await apiClient.post<void>("api/contact", payload);
  },
};
