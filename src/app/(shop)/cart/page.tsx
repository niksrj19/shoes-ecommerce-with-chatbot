"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/use-cart-store";

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    subtotal,
    gstAmount,
    totalAmount,
    totalQuantity,
    fetchCart,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#FBFBFC] px-4 py-16 flex flex-col items-center justify-center text-center">
        <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Your Cart is Empty</h1>
        <p className="mt-1 text-sm text-slate-500">
          Looks like you haven&apos;t added any sneakers to your bag yet.
        </p>
        <Link
          href="/shop"
          className="mt-6 rounded-xl bg-[#09101D] px-6 py-3 text-xs font-bold text-white shadow-md transition hover:bg-slate-800"
        >
          Explore Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBFC] px-4 py-8 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Shopping Bag</h1>
            <p className="text-xs text-slate-500 mt-0.5">{totalQuantity} items ready for checkout</p>
          </div>
          <button
            onClick={clearCart}
            className="text-xs font-semibold text-red-500 hover:text-red-700 transition"
          >
            Clear All
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart Items Column */}
          <div className="lg:col-span-8 space-y-4">
            {items.map((item, idx) => (
              <div
                key={`${item.productId}-${item.size}-${item.color}-${idx}`}
                className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 flex items-center gap-4 sm:gap-6 shadow-sm"
              >
                <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                  <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {item.size} • {item.color}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        removeItem({
                          productId: item.productId,
                          size: item.size,
                          color: item.color,
                        })
                      }
                      className="text-slate-400 hover:text-red-500 p-1 transition"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 px-2 py-0.5">
                      <button
                        onClick={() =>
                          updateQuantity({
                            productId: item.productId,
                            size: item.size,
                            color: item.color,
                            quantity: Math.max(1, item.quantity - 1),
                          })
                        }
                        className="px-2 text-xs font-bold text-slate-600 hover:text-slate-900"
                      >
                        -
                      </button>
                      <span className="px-2 text-xs font-bold text-slate-900">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity({
                            productId: item.productId,
                            size: item.size,
                            color: item.color,
                            quantity: item.quantity + 1,
                          })
                        }
                        className="px-2 text-xs font-bold text-slate-600 hover:text-slate-900"
                      >
                        +
                      </button>
                    </div>

                    <span className="text-sm font-extrabold text-slate-900">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Box */}
          <div className="lg:col-span-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
            <h2 className="text-base font-bold text-slate-900">Order Summary</h2>

            <div className="space-y-2 text-xs text-slate-500">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-800">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax (GST 18%)</span>
                <span className="font-semibold text-slate-800">
                  ₹{gstAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Dispatch</span>
                <span className="font-bold text-emerald-600">FREE</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-slate-100 text-base font-extrabold text-slate-900">
                <span>Total Amount (INR)</span>
                <span className="text-blue-600">
                  ₹{totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <button
              onClick={() => router.push("/checkout")}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#09101D] py-3 text-xs font-bold text-white shadow-md transition hover:bg-slate-800 active:scale-95"
            >
              <span>Proceed to Checkout</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}