"use client";

import React, { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDebounce } from "@/hooks/use-debounce";
import { SearchService } from "@/services/search.service";
import { CatalogService } from "@/services/catalog.service";
import { SearchHit, SearchFacets, SearchPagination } from "@/types/search";
import { useCartStore } from "@/store/use-cart-store";

const DEFAULT_BRANDS = ["All Brands", "Adidas", "Asics", "Jordan", "New Balance", "Nike", "Puma"];
const DEFAULT_CATEGORIES = [
  "All Categories",
  "Basketball",
  "Lifestyle & Sneakers",
  "Running",
  "Training & Gym",
];
const SIZES = ["All", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12"];

export default function ShopPage() {
  const addItem = useCartStore((s) => s.addItem);

  // Search input & debouncing
  const [searchInput, setSearchInput] = useState("");
  const debouncedQuery = useDebounce(searchInput, 300);

  // Catalog items & meta
  const [products, setProducts] = useState<SearchHit[]>([]);
  const [facets, setFacets] = useState<SearchFacets | null>(null);
  const [pagination, setPagination] = useState<SearchPagination>({
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 20,
  });

  // UI States
  const [loading, setLoading] = useState(true);
  const [performanceTook, setPerformanceTook] = useState<number | null>(null);

  // Filter States
  const [selectedBrand, setSelectedBrand] = useState("All Brands");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedSize, setSelectedSize] = useState("All");
  const [maxPrice, setMaxPrice] = useState(25000);
  const [sortBy, setSortBy] = useState<"featured" | "price_asc" | "price_desc">("featured");

  // Core Data Fetcher
  const executeSearch = async (query: string, pageNum: number = 1) => {
    try {
      setLoading(true);
      const hasCatalogFilters =
        selectedBrand !== "All Brands" ||
        selectedCategory !== "All Categories" ||
        selectedSize !== "All" ||
        maxPrice < 25000 ||
        sortBy !== "featured";

      if (query.trim().length > 0 && !hasCatalogFilters) {
        // Dynamic search endpoint call
        const response = await SearchService.search(query, pageNum, 20);
        setProducts(response.hits || []);
        setFacets(response.facets || null);
        setPagination(
          response.pagination || {
            totalItems: response.hits.length,
            totalPages: 1,
            currentPage: 1,
            limit: 20,
          }
        );
        setPerformanceTook(response.performance?.tookMs || null);
      } else {
        // Standard catalog fetch when search query is empty
        const catRes = await CatalogService.getProducts({
          page: pageNum,
          limit: 20,
          brand: selectedBrand !== "All Brands" ? selectedBrand : undefined,
          category: selectedCategory !== "All Categories" ? selectedCategory : undefined,
          size: selectedSize !== "All" ? `US ${selectedSize}` : undefined,
          maxPrice: maxPrice < 25000 ? maxPrice : undefined,
          search: query.trim() || undefined,
          sortBy,
        });

        // Map catalog response to SearchHit format
        const formattedHits: SearchHit[] = (catRes.products || []).map((p) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          brand: p.brand,
          category: p.category,
          price: p.price,
          imageUrl: p.primaryImage,
          inStock: p.inStock,
          salesCount: 0,
          isFeatured: false,
          discountPercentage: p.discountPercentage,
          rating: p.rating,
          reviewCount: p.reviewCount,
          colorwaysCount: p.colorwaysCount,
          availableSizes: p.availableSizes,
        }));

        setProducts(formattedHits);
        setPagination({
          totalItems: catRes.total || formattedHits.length,
          totalPages: catRes.totalPages || 1,
          currentPage: catRes.page || 1,
          limit: 20,
        });
        setFacets(null);
        setPerformanceTook(null);
      }
    } catch (err) {
      console.error("Search / catalog query failed:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Trigger search when debounced input or filters update
  useEffect(() => {
    executeSearch(debouncedQuery, 1);
  }, [debouncedQuery, selectedBrand, selectedCategory, selectedSize, maxPrice, sortBy]);

  const handleResetFilters = () => {
    setSearchInput("");
    setSelectedBrand("All Brands");
    setSelectedCategory("All Categories");
    setSelectedSize("All");
    setMaxPrice(25000);
    setSortBy("featured");
  };

  const handleQuickAdd = (shoe: SearchHit) => {
    addItem({
      productId: shoe.id,
      size: shoe.availableSizes?.[0] || "US 9",
      color: "Standard",
      quantity: 1,
    });
  };

  return (
    <div className="min-h-screen bg-[#FBFBFC] px-4 py-8 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-7xl">
        {/* Header & Dynamic Search Bar */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Shoes Catalog
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Discover performance shoes, limited collector drops, and everyday sneakers.
            </p>
          </div>

          {/* Search Input with Clear Action */}
          <div className="relative min-w-[280px] sm:min-w-[360px]">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search shoes by model, brand, or style..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-9 text-xs font-medium text-slate-900 placeholder-slate-400 shadow-sm focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput("")}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Layout Grid */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* ================= Left Filter Sidebar (Enriched with Facets) ================= */}
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

            {/* Brand Facets */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase mb-2">
                Brand
              </label>
              <div className="flex flex-wrap gap-1.5">
                {DEFAULT_BRANDS.map((b) => {
                  const facetCount = facets?.brands?.find(
                    (f) => f.name.toLowerCase() === b.toLowerCase()
                  )?.count;

                  return (
                    <button
                      key={b}
                      onClick={() => setSelectedBrand(b)}
                      className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition flex items-center gap-1 ${
                        selectedBrand === b
                          ? "bg-[#09101D] text-white"
                          : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      <span>{b}</span>
                      {facetCount !== undefined && b !== "All Brands" && (
                        <span className={`text-[10px] ${selectedBrand === b ? "text-slate-300" : "text-slate-400"}`}>
                          ({facetCount})
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Category Facets */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase mb-2">
                Category
              </label>
              <div className="space-y-1">
                {DEFAULT_CATEGORIES.map((cat) => {
                  const facetCount = facets?.categories?.find(
                    (f) => f.name.toLowerCase() === cat.toLowerCase()
                  )?.count;

                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full flex items-center justify-between rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                        selectedCategory === cat
                          ? "bg-blue-50 text-blue-600 font-bold"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <span>{cat}</span>
                      {facetCount !== undefined && cat !== "All Categories" && (
                        <span className="text-[10px] text-slate-400 font-normal">
                          {facetCount}
                        </span>
                      )}
                    </button>
                  );
                })}
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
                    onClick={() => setSelectedSize(s)}
                    className={`rounded-lg py-1.5 text-xs font-semibold transition ${
                      selectedSize === s
                        ? "bg-[#09101D] text-white"
                        : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Slider */}
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
            {/* Top Bar Details */}
            <div className="flex items-center justify-between pb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500">
                  Showing <strong className="text-slate-800">{pagination.totalItems}</strong> styles
                </span>
                {performanceTook && (
                  <span className="text-[10px] text-slate-400">
                    • Search took {performanceTook}ms
                  </span>
                )}
              </div>

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

            {/* Loading Skeleton */}
            {loading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((idx) => (
                  <div
                    key={idx}
                    className="h-80 rounded-2xl bg-white border border-slate-100 p-4 animate-pulse space-y-3"
                  >
                    <div className="h-44 bg-slate-100 rounded-xl" />
                    <div className="h-4 w-2/3 bg-slate-100 rounded" />
                    <div className="h-4 w-1/3 bg-slate-100 rounded" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              /* Zero State */
              <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center bg-white">
                <p className="text-sm font-medium text-slate-500">
                  No kicks found matching &ldquo;{searchInput}&rdquo;.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-2 text-xs font-bold text-blue-600 hover:underline"
                >
                  Clear search and filters
                </button>
              </div>
            ) : (
              /* Product Grid */
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((shoe) => (
                  <div
                    key={shoe.id}
                    className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-3 transition hover:shadow-md"
                  >
                    <div>
                      {/* Thumbnail Container */}
                      <div className="relative h-48 w-full overflow-hidden rounded-xl bg-[#F4F4F6]">
                        {shoe.discountPercentage && shoe.discountPercentage > 0 && (
                          <span className="absolute top-2.5 left-2.5 z-10 rounded-md bg-[#FF0055] px-2 py-0.5 text-[10px] font-extrabold text-white">
                            {shoe.discountPercentage}% OFF
                          </span>
                        )}
                        <span
                          className={`absolute top-2.5 right-2.5 z-10 rounded-md px-2 py-0.5 text-[10px] font-bold ${
                            shoe.inStock
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {shoe.inStock ? "In Stock" : "Sold Out"}
                        </span>
                        <span className="absolute bottom-2.5 left-2.5 z-10 rounded-md bg-black/80 px-2 py-0.5 text-[10px] font-bold text-white">
                          {shoe.brand}
                        </span>

                        <Link href={`/shop/${shoe.id}`}>
                          <Image
                            src={shoe.imageUrl || "/images/placeholder-shoe.jpg"}
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
                          {shoe.rating && (
                            <span className="flex items-center text-amber-500 font-bold">
                              ★ {shoe.rating}{" "}
                              {shoe.reviewCount && (
                                <span className="text-slate-400 font-normal ml-0.5">
                                  ({shoe.reviewCount})
                                </span>
                              )}
                            </span>
                          )}
                        </div>

                        <Link href={`/shop/${shoe.id}`}>
                          <h3 className="text-sm font-bold text-slate-900 line-clamp-1 hover:text-blue-600 transition">
                            {shoe.title}
                          </h3>
                        </Link>
                      </div>
                    </div>

                    {/* Bottom Pricing & Action */}
                    <div className="mt-4 flex items-center justify-between pt-2 border-t border-slate-100">
                      <div>
                        <span className="text-base font-extrabold text-slate-900">
                          ₹{shoe.price.toLocaleString("en-IN")}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleQuickAdd(shoe)}
                        disabled={!shoe.inStock}
                        className="flex items-center gap-1 rounded-xl bg-[#09101D] px-3.5 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-slate-800 active:scale-95 disabled:opacity-40"
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

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between pt-8 border-t border-slate-200 mt-8">
                <button
                  disabled={pagination.currentPage <= 1 || loading}
                  onClick={() => executeSearch(debouncedQuery, pagination.currentPage - 1)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-40"
                >
                  ← Previous
                </button>
                <span className="text-xs font-medium text-slate-500">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <button
                  disabled={pagination.currentPage >= pagination.totalPages || loading}
                  onClick={() => executeSearch(debouncedQuery, pagination.currentPage + 1)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-40"
                >
                  Next →
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}