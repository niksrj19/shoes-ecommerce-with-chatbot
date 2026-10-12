"use client";

import React from "react";
import Link from "next/link";
import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div className="min-h-screen bg-neutral-950 px-4 py-10 sm:px-6 lg:px-12 selection:bg-neutral-800">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Navigation Breadcrumb */}
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-neutral-200 transition"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Catalog
        </Link>

        {/* Title Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-100">
            Create Shoe Release
          </h1>
          <p className="mt-1 text-sm text-neutral-400">
            Publish a new sneaker model or colorway into the active inventory.
          </p>
        </div>

        {/* Form Container */}
        <ProductForm isEditMode={false} />
      </div>
    </div>
  );
}