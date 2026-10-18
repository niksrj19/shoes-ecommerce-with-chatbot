export interface ProductVariant {
  id: string;
  sku: string;
  size: string;
  color: string;
  stock: number;
}

export interface FootwearSpecifications {
  upperMaterial: string;
  midsoleCushioning: string;
  shoeWeight: string;
  skuReference: string;
}

export interface Images {
  id : string;
  url :string;
  altText: string;
  productId : string;
}

export interface Product {
  id: string;
  title: string;
  brand: string;
  category: string;
  gender?: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  colorwaysCount: number;
  availableSizes: string[];
  colors: string[];
  primaryImage: string;
  imageUrl: string;
  images: Images[],
  galleryImages: string[];
  description: string;
  specifications: FootwearSpecifications;
  variants: ProductVariant[];
}

export interface ProductFilterParams {
  page?: number;
  limit?: number;
  brand?: string;
  category?: string;
  size?: string;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: "featured" | "price_asc" | "price_desc";
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}