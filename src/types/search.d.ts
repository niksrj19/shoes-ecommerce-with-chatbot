export interface SearchHit {
  id: string;
  title: string;
  description: string;
  brand: string;
  category: string;
  price: number;
  imageUrl: string;
  inStock: boolean;
  salesCount: number;
  isFeatured: boolean;
  discountPercentage?: number;
  rating?: number;
  reviewCount?: number;
  colorwaysCount?: number;
  availableSizes?: string[];
}

export interface FacetCount {
  name: string;
  count: number;
}

export interface PriceRangeFacet {
  range: string;
  min: number;
  max: number;
  count: number;
}

export interface SearchFacets {
  brands: FacetCount[];
  categories: FacetCount[];
  priceStats?: {
    min: number;
    max: number;
    avg: number;
  };
  priceRanges?: PriceRangeFacet[];
  availability?: {
    inStock: number;
    outOfStock: number;
  };
}

export interface SearchPagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export interface SearchResponse {
  hits: SearchHit[];
  facets: SearchFacets;
  pagination: SearchPagination;
  performance: {
    tookMs: number;
    cached: boolean;
  };
}