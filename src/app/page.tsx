"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CatalogService } from "@/services/catalog.service";
import { useCartStore } from "@/store/use-cart-store";
import { Product } from "@/types/product";

const BRANDS = ["Nike", "Adidas", "Puma", "New Balance", "Jordan", "Reebok", "Under Armour"];

const SLIDES = [
  {
    image: "/images/products/admin_11.png",
    eyebrow: "New season",
    title: "Step into something fresh",
    subtitle: "Authentic sneakers from the brands you love.",
    cta: "Shop new arrivals",
    href: "/shop",
  },
  {
    image: "/images/products/admin_15.png",
    eyebrow: "Up to 40% off",
    title: "Performance for every run",
    subtitle: "Lightweight, cushioned, built to last.",
    cta: "Shop running",
    href: "/shop?category=running",
  },
  {
    image: "/images/products/admin_16.png",
    eyebrow: "Iconic styles",
    title: "Classics that never fade",
    subtitle: "Streetwear staples, back in stock.",
    cta: "Shop classics",
    href: "/shop?category=lifestyle",
  },
];

const PERKS = [
  { title: "Free delivery", text: "On orders above ₹1,999", icon: "M3 7h11v8H3zM14 10h4l3 3v2h-7zM7 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM17 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" },
  { title: "7-day returns", text: "Easy, no-questions exchange", icon: "M4 4v6h6M20 20v-6h-6M20 10A8 8 0 006.3 6.3L4 10m16 4l-2.3 3.7A8 8 0 014 14" },
  { title: "100% authentic", text: "Sourced from official brands", icon: "M9 12l2 2 4-4M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6z" },
  { title: "Secure payments", text: "UPI, cards & COD available", icon: "M5 11V8a7 7 0 0114 0v3M5 11h14v10H5z" },
];

type Sort = "featured" | "price-asc" | "price-desc";

function Icon({ d, className = "h-5 w-5" }: { d: string; className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

function ProductSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="aspect-square bg-slate-100" />
      <div className="space-y-3 p-4">
        <div className="h-3 w-1/3 rounded bg-slate-100" />
        <div className="h-4 w-3/4 rounded bg-slate-100" />
        <div className="h-5 w-1/2 rounded bg-slate-100" />
      </div>
    </div>
  );
}

export default function Home() {
  const addItem = useCartStore((state) => state.addItem);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeBrand, setActiveBrand] = useState<string | null>(null);
  const [sort, setSort] = useState<Sort>("featured");
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const [wishlist, setWishlist] = useState<Set<string | number>>(new Set());
  const [addingProductId, setAddingProductId] = useState<string | null>(null);
  const [justAdded, setJustAdded] = useState<string | null>(null);
  const [addFailed, setAddFailed] = useState<string | null>(null);
  const touchStartX = useRef<number | null>(null);
  const goTo = (dir: 1 | -1) => setSlide((s) => (s + dir + SLIDES.length) % SLIDES.length);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await CatalogService.getProducts({ limit: 12 });
      setProducts(res.products || []);
    } catch (err) {
      console.error("Failed to load products:", err);
      setError(true);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Hero autoplay (respects reduced-motion and pause-on-hover/focus)
  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 5000);
    return () => clearInterval(id);
  }, [paused]);

  const visible = useMemo(() => {
    let list = activeBrand
      ? products.filter((p) => p.brand?.toLowerCase() === activeBrand.toLowerCase())
      : [...products];
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    return list;
  }, [products, activeBrand, sort]);

  const toggleWish = (id: string | number) =>
    setWishlist((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const handleAdd = async (product: Product) => {
    setAddingProductId(product.id);
    setAddFailed(null);
    setJustAdded(null);

    const added = await addItem({
      productId: product.id,
      size: product.availableSizes?.[0] || "US 9",
      color: product.colors?.[0] || "Standard",
      quantity: 1,
    });

    setAddingProductId(null);
    if (!added) {
      setAddFailed(product.id);
      setTimeout(() => setAddFailed((current) => current === product.id ? null : current), 2500);
      return;
    }

    setJustAdded(product.id);
    setTimeout(() => setJustAdded((current) => current === product.id ? null : current), 1500);
  };

  const current = SLIDES[slide];

  return (
    <div className="flex w-full min-w-0 max-w-full flex-1 flex-col overflow-x-hidden bg-[#FBFBFC] px-4 pb-[env(safe-area-inset-bottom)] text-slate-900 sm:px-6">
      {/* HERO */}
      <section
        className="relative mx-auto mt-3 w-full max-w-7xl touch-pan-y overflow-hidden rounded-2xl bg-[#09101D] sm:mt-4 sm:rounded-3xl"
        aria-roledescription="carousel"
        aria-label="Featured collections"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0].clientX;
          setPaused(true);
        }}
        onTouchEnd={(e) => {
          const start = touchStartX.current;
          touchStartX.current = null;
          setPaused(false);
          if (start === null) return;
          const dx = e.changedTouches[0].clientX - start;
          if (Math.abs(dx) > 40) goTo(dx < 0 ? 1 : -1);
        }}
      >
        <div className="relative h-[440px] sm:h-[460px] lg:h-[520px]">
          {SLIDES.map((s, i) => (
            <Image
              key={s.image}
              src={s.image}
              alt=""
              fill
              priority={i === 0}
              sizes="(max-width: 1280px) 100vw, 1280px"
              className={`object-cover transition-opacity duration-700 ${i === slide ? "opacity-100" : "opacity-0"}`}
            />
          ))}
          {/* Legibility gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#09101D]/95 via-[#09101D]/55 to-transparent sm:bg-gradient-to-r sm:from-[#09101D]/90 sm:via-[#09101D]/50" />

          <div className="relative flex h-full max-w-xl flex-col justify-end gap-3 px-5 pb-14 sm:justify-center sm:gap-4 sm:px-12 sm:pb-0" aria-live="polite">
            <span className="w-fit rounded-full bg-[#FF0055] px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white">
              {current.eyebrow}
            </span>
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
              {current.title}
            </h1>
            <p className="text-sm text-slate-200 sm:text-base">{current.subtitle}</p>
            <div className="mt-2 grid grid-cols-2 gap-2.5 sm:flex sm:gap-3">
              <Link
                href={current.href}
                className="rounded-full bg-white px-4 py-3 text-center text-sm font-bold sm:px-6 text-[#09101D] transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {current.cta}
              </Link>
              <Link
                href="/shop?sale=true"
                className="rounded-full border border-white/40 px-4 py-3 text-center text-sm font-semibold sm:px-6 text-white transition hover:bg-white/10"
              >
                View deals
              </Link>
            </div>
          </div>

          {/* Controls */}
          <div className="absolute bottom-5 left-5 flex items-center gap-3 sm:left-12">
            {SLIDES.map((s, i) => (
              <button
                key={s.image}
                type="button"
                onClick={() => setSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === slide}
                className={`relative h-2 rounded-full transition-all before:absolute before:-inset-3 before:content-[''] ${i === slide ? "w-8 bg-white" : "w-2 bg-white/50 hover:bg-white/80"}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* PERKS */}
      <section aria-label="Why shop with us" className="mx-auto mt-4 flex w-full min-w-0 max-w-7xl snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain sm:mt-6 sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {PERKS.map((p) => (
          <div key={p.title} className="flex min-w-[250px] shrink-0 snap-start items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 sm:min-w-0">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <Icon d={p.icon} />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-bold">{p.title}</p>
              <p className="truncate text-xs text-slate-500">{p.text}</p>
            </div>
          </div>
        ))}
      </section>

      {/* SECTION HEADER + FILTERS */}
      <section className="mx-auto mt-8 w-full max-w-7xl sm:mt-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Trending kicks</h2>
            <p className="mt-1 text-sm text-slate-500">Fresh drops and fan favourites, picked for you.</p>
          </div>
          <label className="flex w-full items-center gap-2 text-sm text-slate-600 sm:w-auto">
            <span className="sr-only sm:not-sr-only">Sort by</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="w-full rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 focus:border-slate-500 focus:outline-none sm:w-auto"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </label>
        </div>

        {/* Brand chips — horizontal scroll on mobile, no wrapping clutter */}
        <div role="group" aria-label="Filter by brand" className="mt-5 flex max-w-[100vw] snap-x gap-2 overflow-x-auto overscroll-x-contain scroll-px-4 px-4 pb-2 sm:mx-0 sm:max-w-full sm:flex-wrap sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {["All", ...BRANDS].map((b) => {
            const selected = (b === "All" && !activeBrand) || b === activeBrand;
            return (
              <button
                key={b}
                type="button"
                aria-pressed={selected}
                onClick={() => setActiveBrand(b === "All" ? null : b)}
                className={`shrink-0 snap-start whitespace-nowrap rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors ${
                  selected
                    ? "border-[#09101D] bg-[#09101D] text-white"
                    : "border-slate-300 bg-white text-slate-600 hover:border-slate-400 hover:text-slate-900"
                }`}
              >
                {b}
              </button>
            );
          })}
        </div>

        {/* GRID */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {loading && Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)}

          {!loading &&
            visible.map((product) => {
              const hasDiscount = !!product.discountPercentage && product.discountPercentage > 0;
              // Assumes `price` is the selling price; derive the MRP for the strike-through.
              const mrp = hasDiscount
                ? Math.round(product.price / (1 - product.discountPercentage! / 100))
                : null;
              const wished = wishlist.has(product.id);

              return (
                <article
                  key={product.id}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition-shadow [@media(hover:hover)]:hover:shadow-xl"
                >
                  <Link href={`/shop/${product.id}`} className="relative block aspect-square overflow-hidden bg-slate-50">
                    <Image
                      src={product.imageUrl}
                      alt={product.title}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className={`object-contain p-3 transition-transform duration-500 sm:p-4 [@media(hover:hover)]:group-hover:scale-105 ${product.inStock ? "" : "opacity-50 grayscale"}`}
                    />
                    {hasDiscount && (
                      <span className="absolute left-3 top-3 rounded-md bg-[#FF0055] px-2 py-1 text-[11px] font-extrabold text-white">
                        {product.discountPercentage}% OFF
                      </span>
                    )}
                    {!product.inStock && (
                      <span className="absolute bottom-3 left-3 rounded-md bg-slate-900 px-2 py-1 text-[11px] font-bold text-white">
                        Sold out
                      </span>
                    )}
                  </Link>

                  <button
                    type="button"
                    onClick={() => toggleWish(product.id)}
                    aria-pressed={wished}
                    aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
                    className="absolute right-2 top-2 flex h-11 w-11 items-center justify-center rounded-full sm:right-3 sm:top-3"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur">
                      <svg className={`h-[18px] w-[18px] ${wished ? "fill-[#FF0055] text-[#FF0055]" : "fill-none text-slate-600"}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.3 6.3a4.5 4.5 0 016.4 0L12 7.6l1.3-1.3a4.5 4.5 0 116.4 6.4L12 20.4l-7.7-7.7a4.5 4.5 0 010-6.4z" />
                      </svg>
                    </span>
                  </button>

                  <div className="flex flex-1 flex-col p-3.5 sm:p-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{product.brand}</p>
                    <Link href={`/shop/${product.id}`}>
                      <h3 className="mt-1 line-clamp-2 min-h-[2.5rem] text-[13px] font-bold sm:text-sm leading-snug text-slate-900 transition hover:text-blue-600">
                        {product.title}
                      </h3>
                    </Link>

                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="text-base font-extrabold sm:text-lg">₹{product.price.toLocaleString("en-IN")}</span>
                      {mrp && (
                        <span className="text-xs text-slate-400 line-through">₹{mrp.toLocaleString("en-IN")}</span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAdd(product)}
                      disabled={!product.inStock || addingProductId === product.id}
                      aria-live="polite"
                      className={`mt-3 flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-[13px] font-bold sm:gap-2 sm:px-4 sm:text-sm text-white transition active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-300 ${
                        justAdded === product.id
                          ? "bg-emerald-600"
                          : addFailed === product.id
                            ? "bg-red-700 hover:bg-red-800"
                            : "bg-[#09101D] hover:bg-slate-800"
                      }`}
                    >
                      {addingProductId === product.id ? (
                        "Adding…"
                      ) : addFailed === product.id ? (
                        "Couldn't add — try again"
                      ) : justAdded === product.id ? (
                        <>
                          <Icon d="M5 13l4 4L19 7" className="h-4 w-4" /> Added
                        </>
                      ) : product.inStock ? (
                        <>
                          <Icon d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" className="h-4 w-4" /> Add to cart
                        </>
                      ) : (
                        "Unavailable"
                      )}
                    </button>
                  </div>
                </article>
              );
            })}
        </div>

        {/* Empty / error states */}
        {!loading && error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <p className="font-bold text-red-800">We couldn't load the shoes.</p>
            <p className="mt-1 text-sm text-red-700">Check your connection and try again.</p>
            <button onClick={load} className="mt-4 rounded-full bg-red-700 px-5 py-2 text-sm font-bold text-white hover:bg-red-800">
              Retry
            </button>
          </div>
        )}
        {!loading && !error && visible.length === 0 && (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="font-bold">No {activeBrand} shoes right now.</p>
            <button onClick={() => setActiveBrand(null)} className="mt-3 text-sm font-semibold text-blue-600 hover:underline">
              Clear filter
            </button>
          </div>
        )}

        {/* CTA */}
        <div className="my-10 text-center sm:my-12">
          <Link
            href="/shop"
            className="flex w-full items-center justify-center gap-2 rounded-full sm:inline-flex sm:w-auto bg-[#09101D] px-8 py-3.5 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            View all kicks
            <Icon d="M14 5l7 7m0 0l-7 7m7-7H3" className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
