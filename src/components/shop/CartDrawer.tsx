"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/use-cart-store";

export default function CartDrawer() {
  const router = useRouter();
  const {
    items,
    subtotal,
    gstAmount,
    totalAmount,
    totalQuantity,
    isDrawerOpen,
    isLoading,
    closeDrawer,
    fetchCart,
    updateQuantity,
    removeItem,
  } = useCartStore();

  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Click outside to dismiss
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (isDrawerOpen && drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        closeDrawer();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isDrawerOpen, closeDrawer]);

  if (!isDrawerOpen) return null;

  const handleCheckoutClick = () => {
    closeDrawer();
    router.push("/checkout");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm transition-opacity">
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div
          ref={drawerRef}
          className="w-screen max-w-md transform bg-white shadow-2xl transition-all duration-300 ease-in-out flex flex-col justify-between"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <h2 className="text-base font-bold text-slate-900">
                Cart ({totalQuantity})
              </h2>
            </div>
            <button
              onClick={closeDrawer}
              className="rounded-lg p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              aria-label="Close cart"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Cart Item Cards List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-slate-700">Your shopping cart is empty</p>
                <p className="text-xs text-slate-400">Add kicks from our catalog to proceed.</p>
              </div>
            ) : (
              items.map((item, index) => (
                <div
                  key={`${item.productId}-${item.size}-${item.color}-${index}`}
                  className="rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-sm flex items-center gap-4 transition hover:border-slate-300"
                >
                  {/* Thumbnail */}
                  <div className="relative h-16 w-16 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                    <Image
                      src={item.imageUrl || "/images/placeholder-shoe.jpg"}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Information & Controls */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h3 className="text-xs font-bold text-slate-900 truncate">
                        {item.title}
                      </h3>
                      <button
                        onClick={() =>
                          removeItem({
                            productId: item.productId,
                            size: item.size,
                            color: item.color,
                          })
                        }
                        className="text-slate-400 hover:text-red-500 transition p-0.5"
                        aria-label="Remove item"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {item.size} • {item.color.toLowerCase()}
                    </p>

                    <div className="flex items-center justify-between mt-3">
                      {/* Stepper */}
                      <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50/50 px-2 py-0.5">
                        <button
                          onClick={() =>
                            updateQuantity({
                              productId: item.productId,
                              size: item.size,
                              color: item.color,
                              quantity: Math.max(1, item.quantity - 1),
                            })
                          }
                          className="text-xs font-bold text-slate-500 hover:text-slate-900 px-1"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold text-slate-800 px-2">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity({
                              productId: item.productId,
                              size: item.size,
                              color: item.color,
                              quantity: item.quantity + 1,
                            })
                          }
                          className="text-xs font-bold text-slate-500 hover:text-slate-900 px-1"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-xs font-extrabold text-slate-900">
                        ₹{(item.unitPrice * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Calculations */}
          {items.length > 0 && (
            <div className="border-t border-slate-100 bg-white p-6 space-y-4">
              <div className="space-y-1.5 text-xs text-slate-500">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-800">
                    ₹{subtotal}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>GST (18%)</span>
                  <span className="font-semibold text-slate-800">
                    ₹{"500"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Standard Delivery</span>
                  <span className="font-bold text-emerald-600">Free Delivery</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-100 text-sm font-extrabold text-slate-900">
                  <span>Total Amount (INR)</span>
                  <span className="text-blue-600">
                    ₹{subtotal}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
                <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Secure QR Code UPI Payment Only</span>
              </div>

              <button
                type="button"
                onClick={handleCheckoutClick}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#09101D] py-3 text-xs font-bold text-white shadow-md transition hover:bg-slate-800 active:scale-95 disabled:opacity-50"
              >
                <span>Proceed to Checkout</span>
                <span>→</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}