"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { OrderService } from "@/services/order.service";
import { Order } from "@/types/order";
import InvoiceModal from "@/components/orders/InvoiceModal";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState<Order | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        const res = await OrderService.getOrders(page, 5);
        setOrders(res.orders || []);
        setTotalPages(res.totalPages || 1);
      } catch (err) {
        console.error("Failed to load orders:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [page]);

  return (
    <div className="min-h-screen bg-[#FBFBFC] px-4 py-8 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-6xl">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">orderHistory</h1>
            <p className="mt-1 text-xs text-slate-500">
              Review your past sneaker purchases, download tax invoices, and check email notifications.
            </p>
          </div>
          <Link
            href="/shop"
            className="flex items-center gap-1.5 rounded-xl bg-[#09101D] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-slate-800 transition"
          >
            <span>Explore More Shoes</span>
            <span>→</span>
          </Link>
        </div>

        {/* Order Cards List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-64 rounded-2xl bg-white border border-slate-100 p-6 animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
            <p className="text-sm font-medium text-slate-500">You haven&apos;t placed any orders yet.</p>
            <Link href="/shop" className="mt-3 inline-block text-xs font-bold text-blue-600 hover:underline">
              Start shopping kicks
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const isProcessing = order.status === "PENDING";
              return (
                <div
                  key={order.id}
                  className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-5"
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 font-mono">{order.orderNumber}</span>
                        <span
                          className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            isProcessing
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-blue-50 text-blue-700 border border-blue-200"
                          }`}
                        >
                          {isProcessing ? "⏱" : "🛡"} {order.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">Placed on {order.createdAt}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right mr-2">
                        <span className="text-[10px] uppercase font-bold text-slate-400">TOTAL</span>
                        <p className="text-sm font-extrabold text-slate-900">
                          ₹{order.totalAmount}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setActiveInvoiceOrder(order)}
                        className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                      >
                        <svg className="w-3.5 h-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Invoice Summary
                      </button>

                      <button
                        type="button"
                        className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                      >
                        <svg className="w-3.5 h-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Email Receipt
                      </button>
                    </div>
                  </div>

                  {/* Items Listing */}
                  <div className="space-y-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-14 w-14 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                            {/*
                              will add image later
                            <Image src={item.imageUrl} alt={item.title} fill className="object-cover" /> */}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              Size: <strong className="text-slate-800">{item.size}</strong> • Color:{" "}
                              <strong className="text-slate-800">{item.color}</strong> • Qty:{" "}
                              <strong className="text-slate-800">{item.quantity}</strong>
                            </p>
                            <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1 mt-0.5">
                              Payment: QR Code Verified
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-bold text-slate-900">
                            ₹{(item.unitPrice * item.quantity).toLocaleString("en-IN")}
                          </span>
                          <p className="text-[10px] text-slate-400">
                            (₹{item.unitPrice.toLocaleString("en-IN")} each)
                          </p>
                          
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Card Footer: Delivery Meta */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <p>
                      Delivering to: <strong className="text-slate-700">{order.shippingAddress.fullName}</strong>,{" "}
                      {order.shippingAddress.addressLine1}, {order.shippingAddress.city}
                    </p>
                    <span>Ref: {order.paymentReference || "UPI-TXN-742828"}</span>
                  </div>
                </div>
              );
            })}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="text-xs text-slate-500">
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Invoice Summary Modal */}
      {activeInvoiceOrder && (
        <InvoiceModal
          order={activeInvoiceOrder}
          onClose={() => setActiveInvoiceOrder(null)}
        />
      )}
    </div>
  );
}