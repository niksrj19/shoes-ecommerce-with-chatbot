"use client";

import React from "react";

interface StepIndicatorProps {
  currentStep: 1 | 2 | 3;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const steps = [
    { number: 1, label: "Delivery Details" },
    { number: 2, label: "Payment" }, // Adjusted from "QR Payment"
    { number: 3, label: "Order Confirmed" },
  ];

  return (
    <div className="flex items-center justify-center gap-4 sm:gap-8 my-6">
      {steps.map((step, index) => {
        const isActive = currentStep === step.number;
        const isCompleted = currentStep > step.number;

        return (
          <React.Fragment key={step.number}>
            <div className="flex items-center gap-2.5">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : isCompleted
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {isCompleted ? "✓" : step.number}
              </div>
              <span
                className={`text-xs font-semibold ${
                  isActive ? "text-slate-900 font-bold" : "text-slate-500"
                }`}
              >
                {step.label}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div className="h-[1px] w-8 sm:w-16 bg-slate-200" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}