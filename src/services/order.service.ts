import { apiClient } from "@/lib/api-client";
import { Order, CreateOrderPayload, OrderListResponse } from "@/types/order";

export const OrderService = {
  /**
   * POST /api/orders (Creates order on checkout step 2)
   */
  async createOrder(payload: CreateOrderPayload): Promise<Order> {
    const response = await apiClient.post<Order>("api/orders", payload);
    return response.data;
  },

  /**
   * GET /api/orders?page=1&limit=10
   */
  async getOrders(page: number = 1, limit: number = 10): Promise<OrderListResponse> {
   
    const response = await apiClient.get<OrderListResponse>("api/orders", {
      params: { page, limit },
    });
    return response.data;
  },

  /**
   * GET /api/orders/:id
   */
  async getOrderById(id: string): Promise<Order> {
    const response = await apiClient.get<Order>(`api/orders/${id}`);
    return response.data;
  },
};