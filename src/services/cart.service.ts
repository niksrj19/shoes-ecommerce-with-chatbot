import { apiClient } from "@/lib/api-client";
import { CartSummary, CartItemMutationDTO } from "@/types/cart";
import { getOrCreateSessionId } from "@/lib/session";

export const CartService = {
  /**
   * GET /api/cart/
   */
  async getCart(): Promise<CartSummary> {
    const response = await apiClient.get<CartSummary>("api/cart");
    return response.data;
  },

  /**
   * POST /api/cart/items
   */
  async addItem(data: CartItemMutationDTO & { quantity: number }): Promise<CartSummary> {
    const response = await apiClient.post<CartSummary>("api/cart/items", data);
    return response.data;
  },

  /**
   * PUT /api/cart/items
   */
  async updateQuantity(data: CartItemMutationDTO & { quantity: number }): Promise<CartSummary> {
    const response = await apiClient.put<CartSummary>("api/cart/items", data);
    return response.data;
  },

  /**
   * DELETE /api/cart/items
   */
  async removeItem(data: CartItemMutationDTO): Promise<CartSummary> {
    const response = await apiClient.delete<CartSummary>("api/cart/items", { data });
    return response.data;
  },

  /**
   * DELETE /api/cart/
   */
  async clearCart(): Promise<void> {
    await apiClient.delete("api/cart");
  },

  /**
   * POST /api/cart/merge (Called immediately on login)
   */
  async mergeGuestCart(): Promise<CartSummary> {
    const sessionId = getOrCreateSessionId();
    const response = await apiClient.post<CartSummary>(
      "api/cart/merge",
      {},
      { headers: { "sessionId": sessionId } }
    );
    return response.data;
  },
};