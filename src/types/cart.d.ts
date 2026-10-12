export interface CartItem {
  id?: string;
  productId: string;
  title: string;
  imageUrl: string;
  size: string;
  color: string;
  quantity: number;
  unitPrice :number;
  price: number;
  subtotal: number;
}

export interface CartSummary {
  items: CartItem[];
  subtotal: number;
  gstAmount: number; // 18% GST
  shippingFee: number; // 0 for Free Delivery
  totalAmount: number;
  totalQuantity: number;
}

export interface CartItemMutationDTO {
  productId: string;
  size: string;
  color: string;
  quantity?: number;
}