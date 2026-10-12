"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/use-auth-store";
import { useCartStore } from "@/store/use-cart-store";
import { AddressService } from "@/services/address.service";
import { OrderService } from "@/services/order.service";
import { ShippingAddress } from "@/types/address";
import { Order, PaymentMethodType } from "@/types/order";
import StepIndicator from "@/components/checkout/StepIndicator";
import AddAddressModal from "@/components/profile/AddAddressModal";

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const { items, subtotal, gstAmount, totalAmount, clearCart
   } = useCartStore();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [deliveryInstruction, setDeliveryInstruction] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethodType>("RAZORPAY");
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  // Auth Guard
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login?redirect=/checkout");
    }
  }, [isAuthenticated, authLoading, router]);

  // Load Shipping Addresses
  useEffect(() => {
    if (isAuthenticated) {
      AddressService.getAll().then((data) => {
        setAddresses(data);
        const primary = data.find((a) => a.isPrimary) || data[0];
        if (primary) setSelectedAddressId(primary.id);
      }).catch(console.error);
    }
  }, [isAuthenticated]);

  const activeAddress = addresses.find((a) => a.id === selectedAddressId);

  // Handle Order Placement
  const handleConfirmAndPay = async () => {
    if (!activeAddress) return;
    try {
      setIsProcessing(true);
      const payload = {
        shippingAddress: {
          fullName: `${activeAddress.firstName} ${activeAddress.lastName}`,
          addressLine1: activeAddress.addressLine1,
          city: activeAddress.state,
          state: activeAddress.state,
          postalCode: activeAddress.pincode,
          country: activeAddress.country,
          phoneNumber: activeAddress.phoneNumber || "",
        },
        paymentMethod: selectedPayment,
      };

      const orderResult = await OrderService.createOrder(payload);
      setConfirmedOrder(orderResult);
      await clearCart();
      setCurrentStep(3);
    } catch (err) {
      console.error("Order creation failed:", err);
      alert("Failed to process payment. Please verify your details.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (authLoading) return null;

  return (
    <div className="min-h-screen bg-[#FBFBFC] px-4 py-8 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-7xl">
        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} />

        {/* STEP 1: DELIVERY DETAILS */}
        {currentStep === 1 && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-6">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between pb-5 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <h2 className="text-base font-bold text-slate-900">shippingAddress</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAddressModalOpen(true)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700"
                  >
                    + Add New Shipping Address
                  </button>
                </div>

                <div className="mt-5 space-y-3">
                  <p className="text-xs font-medium text-slate-500">Select a saved shipping destination:</p>
                  {addresses.map((addr) => {
                    const isSelected = selectedAddressId === addr.id;
                    return (
                      <label
                        key={addr.id}
                        className={`flex items-start gap-3 rounded-2xl p-4 cursor-pointer transition border ${
                          isSelected
                            ? "border-blue-500 bg-white ring-2 ring-blue-500/10 shadow-sm"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="shipping_addr"
                          checked={isSelected}
                          onChange={() => setSelectedAddressId(addr.id)}
                          className="mt-1 h-4 w-4 text-blue-600 accent-blue-600 cursor-pointer"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900">{addr.firstName} {addr.lastName}</span>
                            {addr.isPrimary && (
                              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 uppercase">
                                DEFAULT
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                            {addr.addressLine1} {addr.addressLine2 ? `, ${addr.addressLine2}` : ""}<br />
                            {addr.state}, {addr.pincode} • {addr.country}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>

                <div className="mt-6">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Delivery Instructions (Optional)</label>
                  <input
                    type="text"
                    value={deliveryInstruction}
                    onChange={(e) => setDeliveryInstruction(e.target.value)}
                    placeholder="e.g. Ring bell or leave with security"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Sidebar Summary */}
            <div className="lg:col-span-5 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-6">
              <h3 className="text-base font-bold text-slate-900">Order Review ({items.length} items)</h3>
              <div className="space-y-3 max-h-[260px] overflow-y-auto">
                {items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100 last:border-b-0">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                        <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{item.title}</h4>
                        <p className="text-[11px] text-slate-400">{item.size} • {item.color} • Qty {item.quantity}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-900">₹{(item.unitPrice * item.quantity).toLocaleString("en-IN")}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
                <div className="flex justify-between"><span>Subtotal</span><span className="font-semibold text-slate-800">₹{subtotal.toLocaleString("en-IN")}</span></div>
                <div className="flex justify-between"><span>Estimated Tax (GST 18%)</span><span className="font-semibold text-slate-800">₹{0}</span></div>
                <div className="flex justify-between"><span>Shipping Dispatch</span><span className="font-bold text-emerald-600">FREE</span></div>
                <div className="flex justify-between pt-3 border-t border-slate-100 text-sm font-extrabold text-slate-900">
                  <span>Total Payable</span><span className="text-blue-600">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                disabled={!selectedAddressId || items.length === 0}
                className="w-full rounded-xl bg-[#09101D] py-3.5 text-xs font-bold text-white shadow-md hover:bg-slate-800 disabled:opacity-50 transition"
              >
                Proceed to Payment →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: PAYMENT */}
        {currentStep === 2 && (
          <div className="mt-8 max-w-2xl mx-auto rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Choose Payment Method</h2>
              <p className="text-xs text-slate-500 mt-1">Select your preferred payment processor.</p>
            </div>

            <div className="space-y-3">
              {[
                { id: "RAZORPAY", label: "Razorpay (Cards, UPI, NetBanking)", desc: "Direct UPI & instant bank settlements" },
                { id: "CREDIT_CARD", label: "Credit / Debit Card", desc: "Visa, Mastercard, RuPay, Amex" },
                { id: "COD", label: "Cash on Delivery (COD)", desc: "Pay with cash upon package receipt" },
              ].map((m) => (
                <label
                  key={m.id}
                  className={`flex items-start gap-4 rounded-xl border p-4 cursor-pointer transition ${
                    selectedPayment === m.id
                      ? "border-blue-600 bg-blue-50/20 ring-1 ring-blue-600/30"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_proc"
                    checked={selectedPayment === m.id}
                    onChange={() => setSelectedPayment(m.id as PaymentMethodType)}
                    className="mt-1 h-4 w-4 text-blue-600 accent-blue-600"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{m.label}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{m.desc}</p>
                  </div>
                </label>
              ))}
            </div>

            <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Amount Due: {subtotal}</span>
              <span className="text-sm font-extrabold text-blue-600">₹{subtotal.toLocaleString("en-IN")}</span>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="w-1/3 rounded-xl border border-slate-200 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleConfirmAndPay}
                disabled={isProcessing}
                className="w-2/3 flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isProcessing ? "Processing..." : `Confirm & Pay ₹${subtotal.toLocaleString("en-IN")}`}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: ORDER CONFIRMED */}
        {currentStep === 3 && (
          <div className="mt-8 max-w-3xl mx-auto space-y-6">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Thank you for your order!</h2>
              <p className="text-xs text-slate-500 mt-1">
                Order reference: <strong className="text-slate-800 font-mono">{confirmedOrder?.orderNumber || "order-82tsuey"}</strong>
              </p>
              <p className="text-xs text-slate-400 mt-0.5">A confirmation email has been dispatched with tracking details.</p>

              {/* Actions */}
              <div className="mt-6 flex justify-center gap-4">
                <Link
                  href="/"
                  className="rounded-xl border border-slate-200 px-6 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Go to Home
                </Link>
                <Link
                  href="/orders"
                  className="rounded-xl bg-[#09101D] px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-slate-800"
                >
                  View My Orders
                </Link>
              </div>
            </div>

            {/* Confirmed Order Summary */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Summary Details</h3>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 uppercase text-[10px] font-bold">Delivery Destination</span>
                  <p className="text-slate-800 font-semibold mt-1">
                    {confirmedOrder?.shippingAddress?.fullName || activeAddress?.firstName}<br />
                    {confirmedOrder?.shippingAddress?.addressLine1 || activeAddress?.addressLine1}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 uppercase text-[10px] font-bold">Payment Method</span>
                  <p className="text-slate-800 font-semibold mt-1">
                    {confirmedOrder?.paymentMethod || selectedPayment} (Paid)
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <AddAddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSubmit={async (newAddr) => {
          const res = await AddressService.create(newAddr);
          setAddresses((prev) => [res, ...prev]);
          setSelectedAddressId(res.id);
        }}
      />
    </div>
  );
}