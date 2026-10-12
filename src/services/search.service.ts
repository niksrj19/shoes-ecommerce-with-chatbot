import { apiClient } from "@/lib/api-client";
import { SearchResponse } from "@/types/search";

export const SearchService = {
  /**
   * GET /api/search?query=QUERY_STRING&page=1&limit=20
   */
  async search(query: string, page: number = 1, limit: number = 20): Promise<SearchResponse> {
    const response = await apiClient.get<SearchResponse>("api/search", {
      params: {
        q: query.trim(),
        page,
        limit,
      },
    });
    return response.data;
  },
};