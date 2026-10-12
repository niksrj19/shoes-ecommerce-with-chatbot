export interface ShippingAddress {
  id: string;
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  pincode: string;
  state: string;
  country: string;
  deliveryInstruction?: string;
  isPrimary: boolean;
  phoneNumber?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateAddressDTO = Omit<ShippingAddress, "id" | "createdAt" | "updatedAt">;