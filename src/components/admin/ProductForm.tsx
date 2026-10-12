"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ProductAdminService,
  ProductPayload,
} from "@/services/admin-product.service";

const productSchema = z.object({
  title: z.string().min(2, "Product title is required"),
  brand: z.string().min(1, "Brand is required"),
  category: z.string().min(1, "Category is required"),
  price: z.coerce.number().positive("Price must be greater than zero"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  imageUrl: z.string().min(1, "Primary image is required"),
  inStock: z.boolean(),
  sizes: z.array(z.string()).min(1, "At least one shoe size is required"),
  colors: z.array(z.string()).min(1, "At least one color is required"),
  galleryImages: z.array(
    z.object({
      url: z.string().min(1, "Image URL is required"),
      altText: z.string().min(1, "Alt text is required"),
    })
  ),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: ProductPayload & { id?: string };
  isEditMode?: boolean;
}

const AVAILABLE_SIZES = [
  "US 7", "US 7.5", "US 8", "US 8.5", "US 9", "US 9.5",
  "US 10", "US 10.5", "US 11", "US 11.5", "US 12", "US 13"
];

const PRESET_BRANDS = ["Jordan", "Nike", "Adidas", "New Balance", "Puma", "Asics"];
const PRESET_CATEGORIES = ["shoes", "running", "basketball", "lifestyle", "training"];

export default function ProductForm({ initialData, isEditMode = false }: ProductFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [newColorInput, setNewColorInput] = useState("");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: initialData || {
      title: "",
      brand: "Jordan",
      category: "shoes",
      price: 0,
      description: "",
      imageUrl: "",
      inStock: true,
      sizes: ["US 8", "US 9", "US 10"],
      colors: ["Black / White"],
      galleryImages: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "galleryImages",
  });

  const currentImageUrl = watch("imageUrl");
  const selectedSizes = watch("sizes") || [];
  const selectedColors = watch("colors") || [];
  const inStock = watch("inStock");

  // Handle Primary Image Upload
  const handlePrimaryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploading(true);
      const paths = await ProductAdminService.uploadImages([files[0]]);
      if (paths.length > 0) {
        setValue("imageUrl", paths[0], { shouldValidate: true });
      }
    } catch (err) {
      console.error(err);
      setFeedback({ type: "error", message: "Failed to upload primary image." });
    } finally {
      setIsUploading(false);
    }
  };

  // Handle Multi-file Gallery Image Upload
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploading(true);
      const uploadedPaths = await ProductAdminService.uploadImages(Array.from(files));
      uploadedPaths.forEach((url, index) => {
        append({
          url,
          altText: `Angle view ${fields.length + index + 1}`,
        });
      });
    } catch (err) {
      console.error(err);
      setFeedback({ type: "error", message: "Failed to upload gallery images." });
    } finally {
      setIsUploading(false);
    }
  };

  // Size toggle helper
  const toggleSize = (size: string) => {
    const current = [...selectedSizes];
    const index = current.indexOf(size);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(size);
    }
    setValue("sizes", current, { shouldValidate: true });
  };

  // Color addition helper
  const addColor = () => {
    const trimmed = newColorInput.trim();
    if (trimmed && !selectedColors.includes(trimmed)) {
      setValue("colors", [...selectedColors, trimmed], { shouldValidate: true });
      setNewColorInput("");
    }
  };

  const removeColor = (color: string) => {
    setValue(
      "colors",
      selectedColors.filter((c) => c !== color),
      { shouldValidate: true }
    );
  };

  // Form Submit Handler
  const onSubmit = async (data: ProductFormData) => {
    try {
      setIsSubmitting(true);
      setFeedback(null);

      if (isEditMode && initialData?.id) {
        await ProductAdminService.updateProduct(initialData.id, data);
        setFeedback({ type: "success", message: "Product updated successfully!" });
      } else {
        await ProductAdminService.createProduct(data);
        setFeedback({ type: "success", message: "Product published successfully!" });
      }

      setTimeout(() => {
        router.push("/shop");
        router.refresh();
      }, 1200);
    } catch (err: any) {
      console.error("Submission failed:", err);
      setFeedback({
        type: "error",
        message: err.response?.data?.message || "Failed to save product. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Toast Feedback */}
      {feedback && (
        <div
          className={`rounded-xl p-4 border text-sm font-medium ${
            feedback.type === "success"
              ? "bg-emerald-950/30 border-emerald-500/30 text-emerald-300"
              : "bg-red-950/30 border-red-500/30 text-red-300"
          }`}
        >
          {feedback.message}
        </div>
      )}

      {/* Card 1: Basic Information */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 backdrop-blur-sm space-y-6">
        <h2 className="text-lg font-bold text-neutral-100 flex items-center gap-2">
          <span>General Information</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
              Product Title *
            </label>
            <input
              {...register("title")}
              placeholder="e.g. Niks Jordan Heritage One"
              className="w-full rounded-xl border border-neutral-700 bg-neutral-800/80 px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 focus:border-blue-500 focus:outline-none"
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-400">{errors.title.message}</p>
            )}
          </div>

          {/* Brand */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
              Brand *
            </label>
            <select
              {...register("brand")}
              className="w-full rounded-xl border border-neutral-700 bg-neutral-800/80 px-4 py-2.5 text-sm text-neutral-100 focus:border-blue-500 focus:outline-none"
            >
              {PRESET_BRANDS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
              Category *
            </label>
            <select
              {...register("category")}
              className="w-full rounded-xl border border-neutral-700 bg-neutral-800/80 px-4 py-2.5 text-sm text-neutral-100 focus:border-blue-500 focus:outline-none"
            >
              {PRESET_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
              Price (INR / USD) *
            </label>
            <input
              type="number"
              step="0.01"
              {...register("price")}
              placeholder="499.99"
              className="w-full rounded-xl border border-neutral-700 bg-neutral-800/80 px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 focus:border-blue-500 focus:outline-none"
            />
            {errors.price && (
              <p className="mt-1 text-xs text-red-400">{errors.price.message}</p>
            )}
          </div>

          {/* Stock Availability Toggle */}
          <div className="flex flex-col justify-center">
            <span className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
              Stock Availability
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => setValue("inStock", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-sm font-medium text-neutral-200">
                {inStock ? "In Stock & Ready to Ship" : "Mark as Out of Stock"}
              </span>
            </label>
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
              Product Narrative / Description *
            </label>
            <textarea
              rows={4}
              {...register("description")}
              placeholder="Crafted with premium full-grain leather, dual Air cushioning..."
              className="w-full rounded-xl border border-neutral-700 bg-neutral-800/80 px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 focus:border-blue-500 focus:outline-none"
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-400">{errors.description.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Card 2: Media Management & Sequential Upload */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 backdrop-blur-sm space-y-6">
        <div>
          <h2 className="text-lg font-bold text-neutral-100">Product Imagery</h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Images are saved to <code className="text-blue-400">public/images/products/</code> using the sequential format <code className="text-blue-400">admin_&lt;n&gt;.ext</code>.
          </p>
        </div>

        {/* Primary Image Upload */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
            Primary Catalog Image *
          </label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {currentImageUrl ? (
              <div className="relative h-28 w-28 rounded-xl overflow-hidden border border-neutral-700 bg-neutral-800 flex-shrink-0">
                <Image
                  src={currentImageUrl}
                  alt="Primary product preview"
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="h-28 w-28 rounded-xl border border-dashed border-neutral-700 bg-neutral-800/40 flex items-center justify-center text-xs text-neutral-500 text-center p-2">
                No image uploaded
              </div>
            )}

            <div className="flex-1 space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={handlePrimaryImageUpload}
                disabled={isUploading}
                className="text-xs text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-neutral-800 file:text-neutral-200 hover:file:bg-neutral-700 file:cursor-pointer"
              />
              <p className="text-xs text-neutral-500 font-mono">
                Assigned path: {currentImageUrl || "None"}
              </p>
            </div>
          </div>
          {errors.imageUrl && (
            <p className="mt-1 text-xs text-red-400">{errors.imageUrl.message}</p>
          )}
        </div>

        {/* Gallery Images Upload */}
        <div className="pt-4 border-t border-neutral-800">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
              Additional Gallery Angles
            </label>
            <label className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-800 px-3 py-1.5 text-xs font-semibold text-neutral-200 hover:bg-neutral-700 cursor-pointer border border-neutral-700">
              <span>+ Upload Gallery Files</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleGalleryUpload}
                disabled={isUploading}
                className="hidden"
              />
            </label>
          </div>

          {fields.length === 0 ? (
            <div className="rounded-xl border border-dashed border-neutral-800 p-6 text-center text-xs text-neutral-500">
              No gallery images added yet. Upload multi-angle shots of outsoles, tongues, or boxes.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fields.map((field, idx) => (
                <div
                  key={field.id}
                  className="flex items-center gap-3 rounded-xl border border-neutral-800 bg-neutral-800/40 p-3"
                >
                  <div className="relative h-16 w-16 rounded-lg overflow-hidden border border-neutral-700 bg-neutral-900 flex-shrink-0">
                    <Image
                      src={watch(`galleryImages.${idx}.url`)}
                      alt="Gallery item preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <input
                      {...register(`galleryImages.${idx}.altText`)}
                      placeholder="e.g. Outsole traction pattern view"
                      className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-2.5 py-1 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                    />
                    <p className="text-[10px] text-neutral-500 font-mono truncate">
                      {watch(`galleryImages.${idx}.url`)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(idx)}
                    className="p-1.5 text-neutral-400 hover:text-red-400 rounded-lg hover:bg-neutral-800"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Card 3: Variants (Sizes & Colors) */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 backdrop-blur-sm space-y-6">
        <h2 className="text-lg font-bold text-neutral-100">Shoe Sizes & Colorways</h2>

        {/* Sizes Chips */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
            Selectable Sizes (US) *
          </label>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_SIZES.map((size) => {
              const active = selectedSizes.includes(size);
              return (
                <button
                  type="button"
                  key={size}
                  onClick={() => toggleSize(size)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                    active
                      ? "bg-blue-600 text-white shadow-sm ring-2 ring-blue-500/20"
                      : "border border-neutral-700 bg-neutral-800 text-neutral-300 hover:border-neutral-600"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
          {errors.sizes && (
            <p className="mt-1.5 text-xs text-red-400">{errors.sizes.message}</p>
          )}
        </div>

        {/* Colors */}
        <div className="pt-4 border-t border-neutral-800">
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
            Available Colorways *
          </label>
          <div className="flex gap-2 max-w-md mb-3">
            <input
              value={newColorInput}
              onChange={(e) => setNewColorInput(e.target.value)}
              placeholder="e.g. Bred Red/Black"
              className="flex-1 rounded-xl border border-neutral-700 bg-neutral-800/80 px-3 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500"
            />
            <button
              type="button"
              onClick={addColor}
              className="rounded-xl bg-neutral-800 px-4 py-2 text-xs font-bold text-neutral-200 border border-neutral-700 hover:bg-neutral-700"
            >
              Add Color
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {selectedColors.map((color) => (
              <span
                key={color}
                className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-1 text-xs text-neutral-200"
              >
                {color}
                <button
                  type="button"
                  onClick={() => removeColor(color)}
                  className="text-neutral-400 hover:text-red-400"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          {errors.colors && (
            <p className="mt-1.5 text-xs text-red-400">{errors.colors.message}</p>
          )}
        </div>
      </div>

      {/* Submit Action Row */}
      <div className="flex items-center justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-xl border border-neutral-800 bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-neutral-300 hover:bg-neutral-800 transition"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting || isUploading}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500 active:scale-95 transition disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <svg className="w-4 h-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span>{isEditMode ? "Saving Changes..." : "Publishing..."}</span>
            </>
          ) : (
            <span>{isEditMode ? "Save Changes" : "Publish Product"}</span>
          )}
        </button>
      </div>
    </form>
  );
}