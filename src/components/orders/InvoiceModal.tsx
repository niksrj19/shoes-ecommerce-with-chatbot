"use client";

import React from "react";
import { Order } from "@/types/order";

interface InvoiceModalProps {
  order: Order;
  onClose: () => void;
}

export default function InvoiceModal({ order, onClose }: InvoiceModalProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Tax Invoice Summary
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              type="button"
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print / PDF
            </button>
            <button
              onClick={onClose}
              type="button"
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 transition"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Invoice Header Details */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white font-black text-xs">
              BS
            </div>
            <h3 className="text-base font-bold text-slate-900 pt-1">BaseSole Footwear Inc.</h3>
            <p className="text-[11px] text-slate-500 leading-tight">
              100 Kicks Way, Portland, OR 97201<br />
              support@basesole.online • GST/Tax ID: US-9874521
            </p>
          </div>

          <div className="text-right space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">INVOICE</span>
            <p className="text-sm font-extrabold text-slate-900 font-mono">{order.orderNumber}</p>
            <p className="text-xs text-slate-500">Date: {order.createdAt}</p>
            <span className="inline-block rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 mt-1">
              STATUS: PAID IN FULL
            </span>
          </div>
        </div>

        {/* Billed & Payment Verification Block */}
        <div className="mt-6 rounded-2xl bg-slate-50/70 p-4 border border-slate-100 grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">BILLED & SHIPPED TO:</span>
            <p className="mt-1 font-bold text-slate-900">{order.shippingAddress.fullName}</p>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              {order.shippingAddress.addressLine1}<br />
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />
              {order.shippingAddress.phoneNumber && `Phone: ${order.shippingAddress.phoneNumber}`}
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400">PAYMENT VERIFICATION:</span>
            <p className="mt-1 font-bold text-slate-900">Exclusive QR Code Gateway</p>
            <p className="text-[11px] text-slate-500">Ref : {order.paymentReference || "UPI-TXN-742828"}</p>
            <p className="text-[10px] text-slate-400 mt-1">Verified via BaseSole Security</p>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase">
                <th className="pb-2">ITEM DESCRIPTION</th>
                <th className="pb-2">SIZE</th>
                <th className="pb-2">COLOR</th>
                <th className="pb-2 text-center">QTY</th>
                <th className="pb-2 text-right">UNIT PRICE</th>
                <th className="pb-2 text-right">TOTAL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {order.items.map((it, idx) => (
                <tr key={idx} className="text-slate-800 font-medium">
                  <td className="py-2.5 font-bold">{it.title}</td>
                  <td className="py-2.5">{it.size}</td>
                  <td className="py-2.5">{it.color}</td>
                  <td className="py-2.5 text-center">{it.quantity}</td>
                  <td className="py-2.5 text-right">₹{it.unitPrice.toLocaleString("en-IN")}</td>
                  <td className="py-2.5 text-right font-bold">₹{(it.unitPrice * it.quantity).toLocaleString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Calculation Summary */}
        <div className="mt-6 border-t border-slate-100 pt-4 space-y-1.5 text-xs text-slate-500 max-w-xs ml-auto text-right">
          <div className="flex justify-between"><span>Subtotal:</span><span className="font-semibold text-slate-800">₹{order.totalAmount}</span></div>
          <div className="flex justify-between"><span>GST (18%):</span><span className="font-semibold text-slate-800">₹{order.totalAmount}</span></div>
          <div className="flex justify-between"><span>Shipping & Handling:</span><span className="font-bold text-emerald-600">₹0</span></div>
          <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-extrabold text-slate-900">
            <span>Total Paid (INR):</span>
            <span className="text-blue-600">₹{order.totalAmount}</span>
          </div>
        </div>

        {/* Policy Footer */}
        <p className="mt-8 text-center text-[10px] text-slate-400">
          Thank you for choosing BaseSole! This order is protected by our 7-day return policy.
        </p>
      </div>
    </div>
  );
}