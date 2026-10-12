"use client";

import React, { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { CatalogService } from "@/services/catalog.service";
import { Product, ProductFilterParams } from "@/types/product";
import { useCartStore } from "@/store/use-cart-store";

const BRANDS = ["All Brands", "Adidas", "Asics", "Jordan", "New Balance", "Nike", "Puma"];
const CATEGORIES = [
  "All Categories",
  "Basketball",
  "Lifestyle & Sneakers",
  "Running",
  "Training & Gym",
];
const SIZES = ["All", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12"];
const COLORWAYS = [
  { name: "All Colors", bg: "bg-slate-900", border: "border-slate-900" },
  { name: "Red", bg: "bg-red-500", border: "border-red-500" },
  { name: "Black", bg: "bg-black", border: "border-black" },
  { name: "White", bg: "bg-white", border: "border-slate-300" },
  { name: "Purple", bg: "bg-purple-600", border: "border-purple-600" },
  { name: "Grey", bg: "bg-gray-400", border: "border-gray-400" },
  { name: "Blue", bg: "bg-blue-600", border: "border-blue-600" },
  { name: "Orange", bg: "bg-orange-500", border: "border-orange-500" },
  { name: "Green", bg: "bg-emerald-500", border: "border-emerald-500" },
];

export default function ProductListingPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [, startTransition] = useTransition();

  // Filter States
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("All Brands");
  const [category, setCategory] = useState("All Categories");
  const [size, setSize] = useState("All");
  const [color, setColor] = useState("All Colors");
  const [maxPrice, setMaxPrice] = useState(25000);
  const [sortBy, setSortBy] = useState<"featured" | "price_asc" | "price_desc">("featured");

  // Inside the component:
const addItem = useCartStore((s) => s.addItem);

const handleAddToCart = (shoe: Product) => {
  addItem({
    productId: shoe.id,
    size: shoe.availableSizes.length >0 ? shoe.availableSizes[0] : "8",
    color: shoe.colors[0],
    quantity: 1,
  });
};

  const fetchFilteredProducts = async () => {
    try {
      setLoading(true);
      const params: ProductFilterParams = {
        page: 1,
        limit: 30,
        search: search.trim() || undefined,
        brand: brand !== "All Brands" ? brand : undefined,
        category: category !== "All Categories" ? category : undefined,
        size: size !== "All" ? `US ${size}` : undefined,
        color: color !== "All Colors" ? color : undefined,
        minPrice: 0,
        maxPrice: maxPrice < 25000 ? maxPrice : undefined,
        sortBy,
      };

      const res = await CatalogService.getProducts(params);
      setProducts(res.products || []);
    } catch (err) {
      console.error("Error fetching shoes catalog:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredProducts();
  }, [brand, category, size, color, maxPrice, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFilteredProducts();
  };

  const handleResetFilters = () => {
    setSearch("");
    setBrand("All Brands");
    setCategory("All Categories");
    setSize("All");
    setColor("All Colors");
    setMaxPrice(25000);
    setSortBy("featured");
  };

  console.log("Products ==",products)

  return (
    <div className="min-h-screen bg-[#FBFBFC] px-4 py-8 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Shoes Catalog
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Discover performance shoes, limited collector drops, and everyday sneakers.
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            <div className="relative min-w-[280px] sm:min-w-[340px]">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search shoes by model, brand, or style..."
                className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl bg-[#09101D] px-5 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
            >
              Search
            </button>
          </form>
        </div>

        {/* Catalog Layout */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* ================= Left Filter Sidebar ================= */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-xs font-extrabold tracking-wider text-slate-700 uppercase">
                Refine Kicks
              </span>
              <button
                type="button"
                onClick={handleResetFilters}
                className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset All
              </button>
            </div>

            {/* Brand Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase mb-2">
                Brand
              </label>
              <div className="flex flex-wrap gap-1.5">
                {BRANDS.map((b) => (
                  <button
                    key={b}
                    onClick={() => setBrand(b)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                      brand === b
                        ? "bg-[#09101D] text-white"
                        : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase mb-2">
                Category
              </label>
              <div className="space-y-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`block w-full text-left rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      category === cat
                        ? "bg-blue-50 text-blue-600 font-bold"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Shoe Size Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase mb-2">
                Shoe Size (US)
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`rounded-lg py-1.5 text-xs font-semibold transition ${
                      size === s
                        ? "bg-[#09101D] text-white"
                        : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Colorway Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase mb-2">
                Colorway
              </label>
              <div className="flex flex-wrap gap-1.5">
                {COLORWAYS.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setColor(c.name)}
                    className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition ${
                      color === c.name
                        ? "border-[#09101D] bg-[#09101D] text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    {c.name !== "All Colors" && (
                      <span className={`h-2.5 w-2.5 rounded-full ${c.bg} border ${c.border}`} />
                    )}
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-800 uppercase">
                  Price Range
                </label>
                <span className="text-xs font-bold text-blue-600">
                  ₹0 - ₹{maxPrice.toLocaleString("en-IN")}
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="25000"
                step="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
            </div>
          </aside>

          {/* ================= Right Product Grid ================= */}
          <main className="lg:col-span-9">
            {/* Top Bar Sorting & Counter */}
            <div className="flex items-center justify-between pb-4">
              <span className="text-xs font-medium text-slate-500">
                Showing <strong className="text-slate-800">{products.length}</strong> styles
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="rounded-lg border border-slate-200 bg-white py-1 px-2.5 text-xs font-medium text-slate-800 focus:outline-none"
                >
                  <option value="featured">Featured</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((idx) => (
                  <div key={idx} className="h-80 rounded-2xl bg-white border border-slate-100 p-4 animate-pulse space-y-3">
                    <div className="h-44 bg-slate-100 rounded-xl" />
                    <div className="h-4 w-2/3 bg-slate-100 rounded" />
                    <div className="h-4 w-1/3 bg-slate-100 rounded" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center bg-white">
                <p className="text-sm font-medium text-slate-500">No kicks found matching your filters.</p>
                <button
                  onClick={handleResetFilters}
                  className="mt-2 text-xs font-bold text-blue-600 hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((shoe) => (
                  <div
                    key={shoe.id}
                    className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-3 transition hover:shadow-md"
                  >
                    <div>
                      {/* Image Viewer with Badges */}
                      <div className="relative h-48 w-full overflow-hidden rounded-xl bg-[#F4F4F6]">
                        {shoe.discountPercentage && shoe.discountPercentage > 0 && (
                          <span className="absolute top-2.5 left-2.5 z-10 rounded-md bg-[#FF0055] px-2 py-0.5 text-[10px] font-extrabold text-white">
                            {shoe.discountPercentage}% OFF
                          </span>
                        )}
                        <span className="absolute top-2.5 right-2.5 z-10 rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                          In Stock
                        </span>
                        <span className="absolute bottom-2.5 left-2.5 z-10 rounded-md bg-black/80 px-2 py-0.5 text-[10px] font-bold text-white">
                          {shoe.brand}
                        </span>

                        <Link href={`/shop/${shoe.id}`}>
                          <Image
                            src={shoe.imageUrl}
                            alt={shoe.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover transition duration-300 group-hover:scale-105"
                          />
                        </Link>
                      </div>

                      {/* Content */}
                      <div className="mt-3 space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span>{shoe.category}</span>
                          <span className="flex items-center text-amber-500 font-bold">
                            ★ {shoe.rating} <span className="text-slate-400 font-normal ml-0.5">({shoe.reviewCount})</span>
                          </span>
                        </div>

                        <Link href={`/shop/${shoe.id}`}>
                          <h3 className="text-sm font-bold text-slate-900 line-clamp-1 hover:text-blue-600 transition">
                            {shoe.title}
                          </h3>
                        </Link>

                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span>{shoe.colorwaysCount} Colorways</span>
                          <span>Sizes: US {shoe.availableSizes?.[0]?.replace("US ", "")} - {shoe.availableSizes?.[shoe.availableSizes.length - 1]?.replace("US ", "")}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Pricing & Action */}
                    <div className="mt-4 flex items-center justify-between pt-2 border-t border-slate-100">
                      <div>
                        <span className="text-base font-extrabold text-slate-900">
                          ₹{shoe.price.toLocaleString("en-IN")}
                        </span>
                        {shoe.originalPrice && shoe.originalPrice > shoe.price && (
                          <span className="ml-1.5 text-xs text-slate-400 line-through">
                            ₹{shoe.originalPrice.toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={()=>handleAddToCart(shoe)}
                        className="flex items-center gap-1 rounded-xl bg-[#09101D] px-3.5 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-slate-800 active:scale-95"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}