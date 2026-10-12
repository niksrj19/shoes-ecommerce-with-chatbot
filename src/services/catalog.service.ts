import { apiClient } from "@/lib/api-client";
import { Product, ProductFilterParams, ProductListResponse } from "@/types/product";

export const CatalogService = {
  /**
   * GET /api/products with optional filter parameters
   */
  async getProducts(params?: ProductFilterParams): Promise<ProductListResponse> {
    const response = await apiClient.get<ProductListResponse>("api/products", {
      params,
    });
    return response.data;
  },

  /**
   * GET /api/products/:id
   */
  async getProductById(id: string): Promise<Product> {
    const response = await apiClient.get<Product>(`api/product/${id}`);
    return response.data;
  },
};