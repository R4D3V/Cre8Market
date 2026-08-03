"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { resetUserPasswordAction } from "@/lib/actions/auth";
import { PhoneInput, toFullNumber } from "@/components/PhoneInput";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      await resetUserPasswordAction(toFullNumber(phone), password, pin);
      setMessage("Password reset successfully! You can now log in.");
      const result = await signIn("user-credentials", { phone, password, redirect: false });
      if (!result?.error) {
        const session = await getSession();
        if (session?.user?.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
        router.refresh();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-[70vh] flex items-center justify-center px-4 py-12 pb-28 sm:pb-12">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <Image
                src="/brand/logo.webp"
                alt="Cre8 Market"
                width={1080}
                height={1080}
                className="w-24 h-24 object-contain mx-auto"
              />
            </Link>
            <h1 className="text-xl font-extrabold text-gray-900 mt-4 mb-1">
              Reset your password
            </h1>
            <p className="text-gray-500 text-sm">
              Enter your phone number and a new password
            </p>
          </div>

          <div className="neu-card p-7">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Phone Number
                </label>
                <PhoneInput
                  required
                  value={phone}
                  onChange={setPhone}
                  placeholder="700 000 000"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="neu-inset w-full px-4 py-2.5 text-sm focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  4-Digit Reset Pin
                </label>
                <input
                  type="password"
                  required
                  inputMode="numeric"
                  pattern="\d{4}"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                  placeholder="Pin you set when registering"
                  className="neu-inset w-full px-4 py-2.5 text-sm focus:outline-none transition-all"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Verification pin set when you created your account.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                  {error}
                </div>
              )}

              {message && (
                <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="neu-pill w-full bg-navy hover:bg-navy-hover text-white font-bold py-3 text-sm transition-all disabled:opacity-60"
              >
                {loading ? "Resetting…" : "Reset Password"}
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-gray-100 text-center space-y-2">
              <p className="text-sm text-gray-500">
                Remembered it?{" "}
                <Link href="/login" className="text-navy font-bold hover:underline">
                  Sign In
                </Link>
              </p>
              <p className="text-sm text-gray-500">
                New to Cre8Market?{" "}
                <Link href="/register" className="text-navy font-bold hover:underline">
                  Register Free
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
