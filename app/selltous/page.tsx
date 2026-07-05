'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ScrollReveal from '@/components/ScrollReveal'
import { categories } from '@/lib/data'

export default function SellToUsPage() {
  const [name, setName] = useState('')
  const [itemTitle, setItemTitle] = useState('')
  const [category, setCategory] = useState('')
  const [condition, setCondition] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    setLoading(false)
    const msg = encodeURIComponent(
      `Hi CRE8MARKET ENTEBBE! I'd like to sell:\n\n📦 Item: ${itemTitle}\n📂 Category: ${category}\n🏷️ Condition: ${condition}\n📝 Details: ${description}\n\nName: ${name}`
    )
    window.open(`https://wa.me/256751621506?text=${msg}`, '_blank')
    setSubmitted(true)
  }

  return (
    <>
      <Navbar />

      {/* Hero */}
      <ScrollReveal>
        <div className="bg-surface px-3 sm:px-4 pt-2 pb-2">
          <div className="max-w-3xl mx-auto">
            <div className="neu-dark-card text-white py-12 px-6 text-center">
            <p className="eyebrow text-accent">We Buy &amp; Sell</p>
            <h1 className="text-3xl font-extrabold mb-3">Got Something to Sell?</h1>
            <p className="text-white/60 text-base max-w-xl mx-auto mb-6">
              Send us your item — phone, TV, laptop, appliance, or anything. We'll review it and send you a cash offer on WhatsApp, usually within a day.
            </p>
            <div className="flex justify-center gap-6 flex-wrap">
              {[
                { icon: '⚡', label: 'Offer within 24hrs' },
                { icon: '💵', label: 'Instant cash payment' },
                { icon: '🤝', label: 'No obligation' },
              ].map((f) => (
                <div key={f.label} className="flex items-center gap-2 text-sm text-white/70 font-medium">
                  <span>{f.icon}</span>
                  <span>{f.label}</span>
                </div>
              ))}
            </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      <main className="max-w-xl mx-auto px-4 py-8 pb-28 sm:pb-8">
        {submitted ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Request Sent!</h2>
            <p className="text-gray-500 mb-6">
              We've received your item details via WhatsApp. Expect a cash offer within 24 hours.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="neu-pill bg-navy text-white font-bold px-5 py-2.5 text-sm hover:bg-navy-hover transition-all"
            >
              Submit Another Item
            </button>
          </div>
        ) : (
          <>
            <ScrollReveal>
              <h2 className="text-xl font-extrabold text-gray-900 mb-6 text-center">Tell us about your item</h2>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <form onSubmit={handleSubmit} className="neu-card p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Your Name *</label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  className="neu-inset w-full px-4 py-2.5 text-sm focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Item Name *</label>
                <input
                  required
                  type="text"
                  value={itemTitle}
                  onChange={(e) => setItemTitle(e.target.value)}
                  placeholder="e.g. Samsung Galaxy S22, LG 43 inch TV"
                  className="neu-inset w-full px-4 py-2.5 text-sm focus:outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="neu-inset w-full px-4 py-2.5 text-sm focus:outline-none transition-all"
                  >
                    <option value="">Select…</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.icon} {c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Condition</label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="neu-inset w-full px-4 py-2.5 text-sm focus:outline-none transition-all"
                  >
                    <option value="">Select…</option>
                    {['New', 'Like New', 'Used - Good', 'Used - Fair', 'For Parts'].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description / Specs</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Storage, RAM, model number, accessories included, any defects…"
                  className="neu-inset w-full px-4 py-2.5 text-sm focus:outline-none resize-none transition-all"
                />
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
                📸 <strong>Tip:</strong> After submitting, send clear photos of your item on WhatsApp for a faster and more accurate offer.
              </div>

              <button
                type="submit"
                disabled={loading}
                className="neu-pill w-full bg-wa hover:bg-wa-dark text-white font-bold py-3.5 text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                {loading ? 'Sending…' : 'Get a Cash Offer via WhatsApp'}
              </button>
            </form>
            </ScrollReveal>
          </>
        )}

        {/* How it works */}
        <ScrollReveal delay={100}>
          <div className="mt-8 space-y-3">
            <h3 className="text-base font-extrabold text-gray-900 mb-4">How it works</h3>
            {[
              { n: '1', title: 'Submit your item details', desc: 'Fill the form above with your item info and contact number.' },
              { n: '2', title: 'We review & respond', desc: 'Our team evaluates your item and sends a cash offer on WhatsApp within 24 hours.' },
              { n: '3', title: 'Get paid', desc: 'Accept the offer, bring your item to us in Kitoro, Entebbe and receive instant cash payment.' },
            ].map((step) => (
              <div key={step.n} className="neu-card flex items-start gap-4 p-4">
                <span className="w-8 h-8 rounded-full bg-navy text-white font-bold text-sm flex items-center justify-center shrink-0">
                  {step.n}
                </span>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{step.title}</p>
                  <p className="text-gray-500 text-sm mt-0.5">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </main>
      <Footer />
    </>
  )
}
