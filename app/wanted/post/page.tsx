'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { categories } from '@/lib/data'

export default function PostWantedPage() {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [description, setDescription] = useState('')
  const [phone, setPhone] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    setLoading(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <>
        <Navbar />
        <main className="max-w-lg mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Request Posted!</h1>
          <p className="text-gray-500 mb-6">
            Your wanted request for <strong>{title}</strong> is now live. Sellers with matching items will contact you on WhatsApp.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/wanted" className="neu-pill bg-navy text-white font-bold px-5 py-2.5 text-sm hover:bg-navy-hover transition-all">
              View Wanted Board
            </Link>
            <Link href="/" className="neu-pill bg-surface text-gray-700 font-bold px-5 py-2.5 text-sm transition-all">
              Back to Home
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="max-w-xl mx-auto px-4 py-8 pb-28 sm:pb-8">
        <div className="mb-6">
          <Link href="/wanted" className="text-sm text-navy font-semibold hover:underline">
            ← Wanted Board
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Post a Wanted Request</h1>
          <p className="text-gray-500 text-sm">Tell sellers what you're looking for and your budget</p>
        </div>

        <form onSubmit={handleSubmit} className="neu-card p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">What are you looking for? *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. iPhone 13, Samsung 65-inch TV, Toyota Hiace"
              className="neu-inset w-full px-4 py-2.5 text-sm focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="neu-inset w-full px-4 py-2.5 text-sm focus:outline-none transition-all"
            >
              <option value="">Select a category (optional)</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>{c.icon} {c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Your Budget (UGX)</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="Min (optional)"
                  className="neu-inset w-full px-4 py-2.5 text-sm focus:outline-none transition-all"
                />
              </div>
              <div>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="Max budget"
                  className="neu-inset w-full px-4 py-2.5 text-sm focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">More Details</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Condition preference, specs, colour, location preference, etc."
              className="neu-inset w-full px-4 py-2.5 text-sm focus:outline-none resize-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Your WhatsApp Number *</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+256 700 000 000"
              className="neu-inset w-full px-4 py-2.5 text-sm focus:outline-none transition-all"
            />
            <p className="text-xs text-gray-400 mt-1">Sellers will contact you directly on WhatsApp</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="neu-pill w-full bg-navy hover:bg-navy-hover text-white font-bold py-3 text-sm transition-all disabled:opacity-60"
          >
            {loading ? 'Posting…' : 'Post Wanted Request — Free'}
          </button>
        </form>
      </main>
      <Footer />
    </>
  )
}
