"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { OrderService } from "@/services/order.service";
import { Order } from "@/types/order";
import InvoiceModal from "@/components/orders/InvoiceModal";

export default function SingleOrderPage() {
  const params = useParams();
  const id = params?.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      OrderService.getOrderById(id)
        .then(setOrder)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBFBFC] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#FBFBFC] p-8 text-center">
        <h2 className="text-lg font-bold text-slate-800">Order Not Found</h2>
        <Link href="/orders" className="text-xs font-bold text-blue-600 underline mt-2 inline-block">
          Return to My Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBFC] px-4 py-8 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-4xl space-y-4">
        <Link href="/orders" className="text-xs font-bold text-slate-500 hover:text-slate-800">
          ← Back to All Orders
        </Link>
        <InvoiceModal order={order} onClose={() => window.history.back()} />
      </div>
    </div>
  );
}