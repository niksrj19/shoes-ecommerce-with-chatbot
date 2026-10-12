export interface OrderItem {
  productId: string;
  title: string;
  imageUrl: string;
  size: string;
  color: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface ShippingAddressDTO {
  fullName: string;
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneNumber?: string;
}

export type PaymentMethodType = "RAZORPAY" | "CREDIT_CARD" | "COD" | "QR_CODE";

export interface CreateOrderPayload {
  shippingAddress: ShippingAddressDTO;
  paymentMethod: PaymentMethodType;
}

export interface Order {
  id: string;
  orderNumber: string;
  paymentStatus: "PENDING", "PAID","FAILED", "REFUNDED";
  paymentMethod :string;
  totalAmount :string;
  addressId :string;
  status: "PENDING", "CONFIRMED","PROCESSING", "SHIPPED" , 'DELIVERED', 'CANCELLED';
  gatewayOrderId : string;
  paymentId : string;
  items: OrderItem[];
  subtotal: number;
  gstAmount: number;
  shippingFee: number;
  totalAmount: number;
  shippingAddress: ShippingAddressDTO;
  paymentMethod: PaymentMethodType;
  paymentReference?: string;
  createdAt: string;
}

export interface OrderListResponse {
  orders: Order[];
  total: number;
  page: number;
  totalPages: number;
}