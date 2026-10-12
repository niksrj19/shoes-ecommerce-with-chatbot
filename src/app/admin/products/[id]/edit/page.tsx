"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ProductForm from "@/components/admin/ProductForm";
import {
  ProductAdminService,
  ProductPayload,
} from "@/services/admin-product.service";

export default function EditProductPage() {
  const params = useParams();
  const id = params?.id as string;

  const [productData, setProductData] = useState<
    (ProductPayload & { id: string }) | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        const data = await ProductAdminService.getProduct(id);
        setProductData(data);
      } catch (err: any) {
        console.error("Failed to fetch product for editing:", err);
        setError("Unable to retrieve product details from backend.");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (error || !productData) {
    return (
      <div className="min-h-screen bg-neutral-950 px-4 py-12 text-center text-neutral-300">
        <h2 className="text-xl font-bold text-red-400">Error</h2>
        <p className="mt-2 text-sm text-neutral-400">{error || "Product not found"}</p>
        <Link href="/shop" className="mt-4 inline-block text-xs font-bold text-blue-400 hover:underline">
          Return to Shoes Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 px-4 py-10 sm:px-6 lg:px-12 selection:bg-neutral-800">
      <div className="mx-auto max-w-4xl space-y-6">
        <Link
          href={`/shop/${id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-neutral-200 transition"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Product Detail
        </Link>

        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-100">
            Edit Sneaker Release
          </h1>
          <p className="mt-1 text-sm text-neutral-400">
            Modifying specifications and inventory for{" "}
            <span className="text-neutral-200 font-semibold">{productData.title}</span>.
          </p>
        </div>

        <ProductForm initialData={productData} isEditMode={true} />
      </div>
    </div>
  );
}