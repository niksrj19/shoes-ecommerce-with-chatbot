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
    <main className="flex min-h-[64vh] items-center justify-center bg-neutral-950 px-4 py-10 selection:bg-neutral-800 sm:px-6 sm:py-12">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900 shadow-2xl shadow-black/30 md:grid-cols-2">
        <section className="relative flex min-h-72 flex-col justify-between overflow-hidden bg-gradient-to-br from-[#35111f] via-[#1c1019] to-neutral-950 p-7 sm:p-10 md:min-h-[440px] md:p-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#ff0055]/20 blur-3xl"
          />
          <div className="relative">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white text-lg font-black tracking-wider text-neutral-950 shadow-lg shadow-black/20">
              B
            </div>
            <p className="mt-10 text-xs font-bold uppercase tracking-[0.22em] text-[#ff8db1]">
              Built for sneaker people
            </p>
            <h1 className="mt-4 max-w-sm text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
              Your next favorite pair starts here.
            </h1>
            <p className="mt-5 max-w-sm text-sm leading-6 text-neutral-300 sm:text-base sm:leading-7">
              Sign in to keep your orders, discover new drops, and make every
              pair yours.
            </p>
          </div>
          <div className="relative mt-10 flex items-center gap-3 text-sm text-neutral-300">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#ff8db1]">
              <svg
                aria-hidden="true"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m5 12 4 4L19 6"
                />
              </svg>
            </span>
            Curated drops. The pairs you came for.
          </div>
        </section>

        <section className="flex flex-col justify-center p-7 sm:p-10 md:p-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff5c91]">
              Welcome back
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-neutral-100">
              Sign in to BaseSole
            </h2>
            <p className="mt-3 text-sm leading-6 text-neutral-400">
              One secure step to get back to your account.
            </p>
          </div>

          {isSessionExpired && (
            <div
              role="alert"
              className="mt-7 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm leading-5 text-amber-300"
            >
              Your session has expired. Please sign in again to continue.
            </div>
          )}

          <div className="mt-8">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="group flex w-full items-center justify-center gap-3 rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-4 text-sm font-semibold text-neutral-100 shadow-sm transition hover:border-neutral-500 hover:bg-neutral-700/80 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
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
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
              ) : (
                <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
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

          <p className="mt-7 text-center text-xs leading-5 text-neutral-500">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </section>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
      <main className="flex min-h-[64vh] items-center justify-center bg-neutral-950 px-4 py-10">
        <div className="h-8 w-8 animate-spin text-neutral-400 border-2 border-current border-t-transparent rounded-full" />
      </main>
      }
    >
      <LoginContent />
    </Suspense>
  );
}