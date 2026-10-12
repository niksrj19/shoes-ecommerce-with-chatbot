"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AuthService } from "@/services/auth.service";

function LoginContent() {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();

  const isSessionExpired = searchParams.get("session_expired") === "true";
  const redirectTarget = searchParams.get("redirect") || "/";

  const handleGoogleLogin = () => {
    setIsLoading(true);
    AuthService.initiateGoogleLogin(redirectTarget);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-950 px-4 py-12 selection:bg-neutral-800">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-neutral-800/80 bg-neutral-900/60 p-8 shadow-2xl backdrop-blur-xl">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 text-neutral-950 font-black tracking-wider text-xl shadow-lg">
            S
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-100">
            Welcome to SoleVault
          </h1>
          <p className="text-sm text-neutral-400">
            Premium footwear releases, curated drops, and exclusive access.
          </p>
        </div>

        {/* Feedback / Alert notification */}
        {isSessionExpired && (
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-center text-xs text-amber-300">
            Your session has expired. Please sign in again to continue.
          </div>
        )}

        {/* OAuth Trigger */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="group relative flex w-full items-center justify-center gap-3 rounded-xl border border-neutral-700 bg-neutral-800/90 px-4 py-3.5 text-sm font-semibold text-neutral-100 transition-all duration-200 hover:border-neutral-500 hover:bg-neutral-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 shadow-sm"
          >
            {isLoading ? (
              <svg
                className="h-5 w-5 animate-spin text-neutral-300"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>
              {isLoading ? "Redirecting to Google..." : "Continue with Google"}
            </span>
          </button>
        </div>

        <p className="text-center text-xs text-neutral-500">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center bg-neutral-950 px-4 py-12">
        <div className="h-8 w-8 animate-spin text-neutral-400 border-2 border-current border-t-transparent rounded-full" />
      </main>
    }>
      <LoginContent />
    </Suspense>
  );
}