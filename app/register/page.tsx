'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) { setError('Passwords do not match'); return }
    setLoading(true)
    setError('')
    await new Promise((r) => setTimeout(r, 1200))
    setLoading(false)
    setSuccess(true)
  }

  if (success) {
    return (
      <>
        <Navbar />
        <main className="min-h-[70vh] flex items-center justify-center px-4 py-12">
          <div className="text-center max-w-sm">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Welcome, {name}!</h1>
            <p className="text-gray-500 mb-6">Your account has been created. You can now post listings and contact sellers.</p>
            <div className="flex gap-3 justify-center">
              <Link href="/selltous" className="neu-pill bg-navy text-white font-bold px-5 py-2.5 text-sm hover:bg-navy-hover transition-all">
                Sell to Us
              </Link>
              <Link href="/products" className="neu-pill bg-surface text-navy font-bold px-5 py-2.5 text-sm transition-all">
                Browse Listings
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
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
            <h1 className="text-xl font-extrabold text-gray-900 mt-4 mb-1">Create a free account</h1>
            <p className="text-gray-500 text-sm">Buy, sell and get the best deals in Uganda</p>
          </div>

          <div className="neu-card p-7">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="neu-inset w-full px-4 py-2.5 text-sm focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone / WhatsApp Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+256 700 000 000"
                  className="neu-inset w-full px-4 py-2.5 text-sm focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="neu-inset w-full px-4 py-2.5 text-sm focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
                <input
                  type="password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Repeat password"
                  className="neu-inset w-full px-4 py-2.5 text-sm focus:outline-none transition-all"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="neu-pill w-full bg-navy hover:bg-navy-hover text-white font-bold py-3 text-sm transition-all disabled:opacity-60"
              >
                {loading ? 'Creating account…' : 'Register Free'}
              </button>

              <p className="text-center text-xs text-gray-400">
                By registering you agree to our{' '}
                <Link href="/terms" className="text-navy hover:underline">Terms</Link> &{' '}
                <Link href="/privacy" className="text-navy hover:underline">Privacy Policy</Link>
              </p>
            </form>

            <div className="mt-4 pt-4 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-500">
                Already have an account?{' '}
                <Link href="/login" className="text-navy font-bold hover:underline">Sign In</Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
