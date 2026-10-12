"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useAuthStore } from "@/store/use-auth-store";
// If you have a cart store, import it here:
// import { useCartStore } from "@/store/use-cart-store";

// Inside src/app/components/Header.tsx
import { useCartStore } from "@/store/use-cart-store";

export default function Header() {
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading, logout, initializeAuth } = useAuthStore();
  
  // Example cart count (uncomment/replace with your cart store hook if available)
  const { totalQuantity, openDrawer } = useCartStore();
  // const cartItems = useCartStore((state) => state.items);
  // const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const itemCount = 0; // Set a mock count or remove the badge span if unneeded

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Hydrate auth session state on initial application mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Click-outside listener for User Dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    await logout();
    setIsLoggingOut(false);
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "All Shoes", href: "/shop" },
    { label: "My Orders", href: "/orders", protected: true },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Side: Brand Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-neutral-950 font-black text-lg tracking-wider transition-transform group-hover:scale-105 shadow-md">
              S
            </span>
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-neutral-200 transition-colors">
              SoleVault
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              if (link.protected && !isAuthenticated) return null;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive
                      ? "text-white"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Side: Cart & Auth State */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Shopping Cart Icon Button */}
          {/* <Link
            href="/cart"
            aria-label="Shopping Cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
           
            {itemCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-neutral-950">
                {itemCount}
              </span>
            )}
          </Link> */}

          <button
            type="button"
            onClick={openDrawer}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900/80 text-neutral-300 transition-colors hover:border-neutral-700 hover:text-white"
            aria-label="Open Shopping Cart"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            {totalQuantity > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-black text-white shadow-md ring-2 ring-neutral-950 animate-in zoom-in-75">
                {totalQuantity}
              </span>
            )}
          </button>

          {/* Auth State / Profile */}
          {isLoading ? (
            <div className="h-9 w-9 animate-pulse rounded-full bg-neutral-800" />
          ) : isAuthenticated && user ? (
            /* User Avatar & Dropdown */
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-full p-1 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400"
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
              >
                {user.avatar ? (
                  <Image
                    src={'/userImage.jpg'}
                    alt={user.name || "User Avatar"}
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-full object-cover border border-neutral-700"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-800 border border-neutral-700 text-xs font-semibold text-neutral-200">
                    {getInitials(user.name)}
                  </div>
                )}
              </button>

              {/* Animated Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-neutral-800 bg-neutral-900/95 p-1.5 shadow-2xl backdrop-blur-xl focus:outline-none animate-in fade-in zoom-in-95 duration-100">
                  {/* User Meta */}
                  <div className="px-3 py-2 border-b border-neutral-800/80 mb-1">
                    <p className="text-sm font-semibold text-neutral-200 truncate">
                      {user.name || "User"}
                    </p>
                    <p className="text-xs text-neutral-400 truncate">
                      {user.email}
                    </p>
                  </div>

                  {/* Links */}
                  <div className="space-y-0.5">
                    <Link
                      href="/addresses"
                      className="flex items-center rounded-lg px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
                    >
                      Profile
                    </Link>
                    <Link
                      href="/addresses"
                      className="flex items-center rounded-lg px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
                    >
                      Shipping Addresses
                    </Link>
                    <Link
                      href="/orders"
                      className="flex items-center rounded-lg px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
                    >
                      My Orders
                    </Link>
                  </div>

                  {/* Sign Out Action */}
                  <div className="mt-1 pt-1 border-t border-neutral-800/80">
                    <button
                      type="button"
                      onClick={handleSignOut}
                      disabled={isLoggingOut}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors disabled:opacity-50"
                    >
                      <span>{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Unauthenticated CTA */
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-neutral-950 transition-all duration-150 hover:bg-neutral-200 active:scale-95 shadow-sm"
            >
              Sign In
            </Link>
          )}

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="inline-flex items-center justify-center rounded-lg p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="border-b border-neutral-800 bg-neutral-950 px-4 pt-2 pb-4 space-y-2 md:hidden"
        >
          {navLinks.map((link) => {
            if (link.protected && !isAuthenticated) return null;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block rounded-lg px-3 py-2 text-base font-medium transition-colors ${
                  isActive
                    ? "bg-neutral-800 text-white"
                    : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}