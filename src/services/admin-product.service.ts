import { apiClient } from "@/lib/api-client";

export interface GalleryImageDTO {
  url: string;
  altText: string;
}

export interface ProductPayload {
  title: string;
  description: string;
  brand: string;
  category: string;
  price: number;
  imageUrl: string;
  sizes: string[];
  colors: string[];
  inStock: boolean;
  galleryImages: GalleryImageDTO[];
}

export const ProductAdminService = {
  /**
   * Uploads images to Next.js BFF upload endpoint
   */
  async uploadImages(files: File[]): Promise<string[]> {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Image upload failed");
    }

    const result = await response.json();
    return result.paths;
  },

  /**
   * POST /api/products
   */
  async createProduct(payload: ProductPayload): Promise<{ id: string }> {
    const response = await apiClient.post<{ id: string }>("api/products", payload);
    return response.data;
  },

  /**
   * GET /api/products/:id
   */
  async getProduct(id: string): Promise<ProductPayload & { id: string }> {
    const response = await apiClient.get<ProductPayload & { id: string }>(
      `/products/${id}`
    );
    return response.data;
  },

  /**
   * PUT /api/products/:id
   */
  async updateProduct(id: string, payload: ProductPayload): Promise<void> {
    await apiClient.put(`api/products/${id}`, payload);
  },
};