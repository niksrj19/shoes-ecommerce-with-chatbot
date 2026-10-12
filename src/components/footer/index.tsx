import Link from "next/link";
import React from "react";

export function Footer() {
  return (
    <footer className="border-t border-neutral-800/80 bg-neutral-950 text-neutral-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Brand info */}
          <div className="space-y-4 lg:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 text-neutral-950 font-black tracking-wider text-sm">
                S
              </div>
              <span className="text-base font-bold tracking-tight text-neutral-100">
                SoleVault
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Your ultimate destination for premium sneaker releases, limited drops, and curated footwear aesthetics.
            </p>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-3">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-200">
                Shop
              </h3>
              <ul className="mt-4 space-y-2.5 text-xs">
                <li>
                  <Link href="/drops" className="hover:text-neutral-100 transition-colors">
                    New Arrivals
                  </Link>
                </li>
                <li>
                  <Link href="/shop?category=limited" className="hover:text-neutral-100 transition-colors">
                    Limited Editions
                  </Link>
                </li>
                <li>
                  <Link href="/shop?category=sale" className="hover:text-neutral-100 transition-colors">
                    Sale & Vault
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-200">
                Support
              </h3>
              <ul className="mt-4 space-y-2.5 text-xs">
                <li>
                  <Link href="/contact" className="hover:text-neutral-100 transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className="hover:text-neutral-100 transition-colors">
                    Shipping & Returns
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-neutral-100 transition-colors">
                    FAQs
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-200">
                Legal
              </h3>
              <ul className="mt-4 space-y-2.5 text-xs">
                <li>
                  <Link href="/privacy" className="hover:text-neutral-100 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-neutral-100 transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-neutral-900 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500">
          <p>&copy;  SoleVault Inc. All rights reserved.</p>
          <div className="flex items-center gap-6 mt-4 sm:mt-0">
            <span>Secure Checkout Guaranteed</span>
          </div>
        </div>
      </div>
    </footer>
  );
}