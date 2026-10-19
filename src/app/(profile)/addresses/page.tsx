"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/use-auth-store";
import { AddressService } from "@/services/address.service";
import { ShippingAddress, CreateAddressDTO } from "@/types/address";
import AddAddressModal from "@/components/profile/AddAddressModal";

export default function ProfileAndAddressesPage() {
  const { user } = useAuthStore();
  const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fallbacks for display
  const displayName = user?.name || "Nitesh Tak";
  const displayEmail = user?.email || "niksrj.tak@gmail.com";
  const userInitials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // Load addresses on mount
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setIsLoadingAddresses(true);
        const data = await AddressService.getAll();
        setAddresses(data);
      } catch (err) {
        console.error("Failed to load addresses:", err);
      } finally {
        setIsLoadingAddresses(false);
      }
    };

    fetchAddresses();
  }, []);

  // Handle adding new address
  const handleAddAddress = async (newAddress: CreateAddressDTO) => {
    const created = await AddressService.create(newAddress);
    if (created.isPrimary) {
      setAddresses((prev) => [
        created,
        ...prev.map((a) => ({ ...a, isPrimary: false })),
      ]);
    } else {
      setAddresses((prev) => [...prev, created]);
    }
  };

  // Handle deleting address
  const handleDeleteAddress = async (id: string) => {
    try {
      setDeletingId(id);
      await AddressService.delete(id);
      setAddresses((prev) => prev.filter((addr) => addr.id !== id));
    } catch (err) {
      console.error("Failed to delete address:", err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFC] px-4 py-8 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Profile & Shipping Addresses
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Manage your personal information, footwear size preferences, and saved shipping destinations.
          </p>
        </div>

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
          {/* ================= Left Column: Profile Card ================= */}
          <div className="lg:col-span-5 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
            {/* User Meta Row */}
            <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-lg font-bold text-white shadow-sm">
                {userInitials}
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">{displayName}</h2>
                <div className="mt-0.5 flex items-center gap-2">
                  <span className="text-xs text-slate-500">{displayEmail}</span>
                  <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold tracking-wider text-blue-600">
                    ADMIN
                  </span>
                </div>
              </div>
            </div>

            {/* Read-Only Form Fields */}
            <div className="mt-6 space-y-5">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Full Name
                </label>
                <div className="relative flex items-center">
                  <div className="pointer-events-none absolute left-3.5 text-slate-400">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    readOnly
                    value={displayName}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-3 text-sm font-medium text-slate-800 cursor-default focus:outline-none"
                  />
                </div>
              </div>

              {/* Google Account Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Google Account (Sign-In Restricted)
                  </label>
                  <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                    Google Verified
                  </span>
                </div>
                <div className="relative flex items-center">
                  <div className="pointer-events-none absolute left-3.5">
                    <svg className="h-4 w-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    readOnly
                    value={displayEmail}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-3 text-sm font-medium text-slate-800 cursor-default focus:outline-none"
                  />
                </div>
                <p className="mt-1.5 text-[11px] text-slate-400">
                  BaseSole user login is exclusively tied to your verified Google account.
                </p>
              </div>
            </div>
          </div>

          {/* ================= Right Column: Shipping Addresses ================= */}
          <div className="lg:col-span-7 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
            {/* Top Bar */}
            <div className="flex items-center justify-between pb-6 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h3 className="text-base font-bold text-slate-900">shippingAddress</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700 active:scale-95"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add New Shipping Address
              </button>
            </div>

            {/* Address List */}
            <div className="mt-6 space-y-4">
              {isLoadingAddresses ? (
                <div className="rounded-2xl border border-slate-100 p-6 space-y-2 animate-pulse">
                  <div className="h-4 w-32 bg-slate-200 rounded"></div>
                  <div className="h-3 w-48 bg-slate-100 rounded"></div>
                  <div className="h-3 w-40 bg-slate-100 rounded"></div>
                </div>
              ) : addresses.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center">
                  <p className="text-sm font-medium text-slate-500">No shipping addresses found.</p>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="mt-2 text-xs font-bold text-blue-600 hover:underline"
                  >
                    Add your first address
                  </button>
                </div>
              ) : (
                addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`group relative rounded-2xl p-5 transition-all ${
                      addr.isPrimary
                        ? "border border-blue-500/80 bg-white shadow-sm ring-1 ring-blue-500/10"
                        : "border border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      {/* Address Info */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900">
                            {addr.firstName} {addr.lastName}
                          </span>
                          {addr.isPrimary && (
                            <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-white">
                              DEFAULT
                            </span>
                          )}
                        </div>

                        {/* Address Lines */}
                        <p className="text-xs text-slate-600 leading-relaxed pt-1">
                          {addr.addressLine1}
                          {addr.addressLine2 ? `, ${addr.addressLine2}` : ""}
                        </p>
                        <p className="text-xs text-slate-500">
                          {addr.state} {addr.pincode} • {addr.country}
                        </p>
                        {addr.phoneNumber && (
                          <p className="text-xs text-slate-500 pt-0.5">
                            Phone: {addr.phoneNumber}
                          </p>
                        )}
                        {addr.deliveryInstruction && (
                          <p className="text-[11px] italic text-slate-400 pt-1">
                            Note: {addr.deliveryInstruction}
                          </p>
                        )}
                      </div>

                      {/* Card Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          aria-label="Edit address"
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          disabled={deletingId === addr.id}
                          onClick={() => handleDeleteAddress(addr.id)}
                          aria-label="Delete address"
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 transition disabled:opacity-50"
                        >
                          {deletingId === addr.id ? (
                            <svg className="h-4 w-4 animate-spin text-slate-400" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                          ) : (
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AddAddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddAddress}
      />
    </div>
  );
}