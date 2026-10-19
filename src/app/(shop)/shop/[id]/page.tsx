"use client";

import React, { useEffect, useState } from "react";
import { useCartStore } from "@/store/use-cart-store";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CatalogService } from "@/services/catalog.service";
import { Product } from "@/types/product";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // Interaction State
  const [activeImage, setActiveImage] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);

  // Inside the component:
const addItem = useCartStore((s) => s.addItem);

const handleAddToCart = () => {
  addItem({
    productId: productId,
    size: selectedSize,
    color: selectedColor,
    quantity: quantity,
  });
};

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const data: Product = await CatalogService.getProductById(productId);
        setProduct(data);
        setActiveImage(data.imageUrl || data.images[0].url || "");
        setSelectedColor(data.colors?.[0] || "");
        setSelectedSize(data.availableSizes?.[2] || data.availableSizes?.[0] || "US 9");
      } catch (err) {
        console.error("Failed to fetch product details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchDetail();
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBFBFC] p-8 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FBFBFC] p-8 text-center">
        <h2 className="text-xl font-bold text-slate-800">Product Not Found</h2>
        <Link href="/shop" className="mt-4 inline-block text-sm font-semibold text-blue-600">
          ← Back to Shoes
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBFC] px-4 py-6 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-7xl">
        {/* Back Link */}
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition mb-6"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Shoes
        </Link>

        {/* Main Grid: Gallery vs Info */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-start">
          {/* ================= Left: Media Gallery ================= */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative h-[420px] w-full overflow-hidden rounded-3xl border border-slate-200/80 bg-[#F4F4F6] shadow-sm">
              <span className="absolute top-4 right-4 z-10 rounded-md bg-white/90 px-2.5 py-1 text-xs font-bold text-slate-900 shadow-sm backdrop-blur">
                {product.brand}
              </span>
              <Image
                src={activeImage}
                alt={product.title}
                fill
                priority
                className="object-cover"
              />
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {[...(product.images || [])].map((img, idx) => (
                <button
                  key={img?.id || idx}
                  onClick={() => setActiveImage(img.url)}
                  className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition ${
                    (activeImage === img?.url) ? "border-blue-600 ring-2 ring-blue-600/20" : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <Image src={img.url} alt={img.altText || "shoes"} fill className="object-cover" />
                </button>
              ))}
            </div>

            {/* Specifications Card */}
            <div className="mt-8 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h4 className="text-sm font-bold text-slate-900">Footwear Specifications</h4>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-50 p-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Upper Material</span>
                  <p className="mt-1 text-xs font-bold text-slate-800">
                    {product.specifications?.upperMaterial || "Breathable engineered textile with haptic print"}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Midsole Cushioning</span>
                  <p className="mt-1 text-xs font-bold text-slate-800">
                    {product.specifications?.midsoleCushioning || "Dual-density foam"}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Shoe Weight</span>
                  <p className="mt-1 text-xs font-bold text-slate-800">
                    {product.specifications?.shoeWeight || "345g (US Men 9)"}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">SKU Reference</span>
                  <p className="mt-1 text-xs font-bold text-slate-800">
                    {product.specifications?.skuReference || "NIKE-MC9-007"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ================= Right: Product Details ================= */}
          <div className="lg:col-span-6 space-y-6">
            {/* Meta Tags & Title */}
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600">
                <span>{product.brand}</span>
                <span>•</span>
                <span>{product.category}</span>
                <span>•</span>
                <span>Men</span>
              </div>
              <h1 className="mt-1 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {product.title}
              </h1>

              <div className="mt-2 flex items-center gap-3">
                <div className="flex items-center text-xs font-bold text-amber-500">
                  ★ {product.rating} <span className="text-slate-400 font-normal ml-1">({product.reviewCount} reviews)</span>
                </div>
                <span className="text-slate-300">|</span>
                <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                  In Stock & Ready to Ship
                </span>
              </div>
            </div>

            {/* Price */}
            <div>
              <span className="text-3xl font-black text-slate-900">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="ml-3 text-base text-slate-400 line-through">
                  ₹{product.originalPrice.toLocaleString("en-IN")}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-xs text-slate-600 leading-relaxed">
              {product.description ||
                "The gold standard for lifting, conditioning, and HIIT. Features a wider Hyperlift plate in the heel and durable rubber rope wrap for maximum power and grip."}
            </p>

            {/* Colorway Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  Select Color:
                </label>
                <span className="text-xs font-medium text-slate-500">{selectedColor}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.colors?.map((col) => (
                  <button
                    key={col}
                    onClick={() => setSelectedColor(col)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                      selectedColor === col
                        ? "bg-[#09101D] text-white"
                        : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  Select Size (US Men): <span className="text-blue-600">{selectedSize.replace("US ", "")}</span>
                </label>
                <button type="button" className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.828 2.828a2 2 0 01-2.828 0L3.515 9.172a2 2 0 010-2.828L6.343 3.515a2 2 0 012.828 0L12 6.343" />
                  </svg>
                  Size Chart & Fit Guide
                </button>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {product.availableSizes?.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`rounded-xl py-2 text-xs font-bold transition ${
                      selectedSize === sz
                        ? "bg-blue-600 text-white shadow-sm"
                        : "border border-slate-200 bg-white text-slate-800 hover:border-slate-300"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Stepper & Add to Cart Action */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center rounded-xl border border-slate-200 bg-white px-2 py-1">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-2 py-1 text-sm font-bold text-slate-500 hover:text-slate-800"
                >
                  -
                </button>
                <span className="px-3 text-xs font-bold text-slate-900">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-2 py-1 text-sm font-bold text-slate-500 hover:text-slate-800"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#09101D] py-3 text-xs font-bold text-white shadow-md transition hover:bg-slate-800 active:scale-95"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Add to Cart
              </button>
            </div>

            {/* Buy Now With QR Button */}
            <button
              type="button"
              className="w-full rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700 active:scale-95"
            >
              Buy Now with QR Code
            </button>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200">
              <div className="flex flex-col items-center text-center">
                <svg className="h-5 w-5 text-blue-600 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-[11px] font-bold text-slate-800">100% Authentic</span>
                <span className="text-[10px] text-slate-400">Verified by BaseSole</span>
              </div>

              <div className="flex flex-col items-center text-center">
                <svg className="h-5 w-5 text-blue-600 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20" />
                </svg>
                <span className="text-[11px] font-bold text-slate-800">Free Shipping</span>
                <span className="text-[10px] text-slate-400">Orders over ₹5,000</span>
              </div>

              <div className="flex flex-col items-center text-center">
                <svg className="h-5 w-5 text-blue-600 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="text-[11px] font-bold text-slate-800">Easy Returns</span>
                <span className="text-[10px] text-slate-400">30-day trial policy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}