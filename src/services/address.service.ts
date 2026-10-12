import { apiClient } from "@/lib/api-client";
import { ShippingAddress, CreateAddressDTO } from "@/types/address";

export const AddressService = {
  /**
   * GET /api/addresses
   */
  async getAll(): Promise<ShippingAddress[]> {
    const response = await apiClient.get<ShippingAddress[]>("api/addresses");
    return response.data;
  },

  /**
   * POST /api/addresses
   */
  async create(data: CreateAddressDTO): Promise<ShippingAddress> {
    // debugger
    const response = await apiClient.post<ShippingAddress>("api/addresses", data);
    return response.data;
  },

  /**
   * DELETE /api/addresses/:id
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`api/addresses/${id}`);
  },
};