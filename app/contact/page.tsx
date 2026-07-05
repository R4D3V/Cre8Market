'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ScrollReveal from '@/components/ScrollReveal'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    setLoading(false)
    const msg = encodeURIComponent(
      `Hi CRE8MARKET ENTEBBE! I have a question:\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`
    )
    window.open(`https://wa.me/256751621506?text=${msg}`, '_blank')
    setSubmitted(true)
  }

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-10 pb-28 sm:pb-10">
        <Link href="/" className="text-sm text-navy font-semibold hover:underline mb-6 inline-block">← Home</Link>

        {/* Hero */}
        <ScrollReveal>
          <div className="neu-dark-card text-white text-center py-12 px-6 mb-8">
            <h1 className="text-3xl font-extrabold mb-3">Contact Us</h1>
            <p className="text-white/70 text-base max-w-lg mx-auto">
              Have a question, feedback, or need help? We&apos;re here for you.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-5 gap-6">
          {/* Sidebar info */}
          <ScrollReveal className="md:col-span-2 space-y-4">
            <div className="neu-card p-5">
              <h2 className="font-extrabold text-gray-900 text-sm mb-3">Get in Touch</h2>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2.5">
                  <span className="text-lg shrink-0">📍</span>
                  <span>Kitoro Entebbe Uganda</span>
                </li>
                <li>
                  <a href="mailto:raymonjohns@gmail.com" className="flex items-start gap-2.5 hover:text-navy transition-colors">
                    <span className="text-lg shrink-0">📧</span>
                    <span>raymonjohns@gmail.com</span>
                  </a>
                </li>
                <li>
                  <a href="https://wa.me/256751621506" target="_blank" rel="noreferrer" className="flex items-start gap-2.5 hover:text-wa transition-colors">
                    <span className="text-lg shrink-0">💬</span>
                    <span>WhatsApp: +256 751 621 506</span>
                  </a>
                </li>
              </ul>
            </div>

            <div className="neu-card p-5">
              <h2 className="font-extrabold text-gray-900 text-sm mb-3">Hours</h2>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex justify-between"><span>Mon – Fri</span><span className="font-medium">8:00 AM – 6:00 PM</span></li>
                <li className="flex justify-between"><span>Saturday</span><span className="font-medium">9:00 AM – 4:00 PM</span></li>
                <li className="flex justify-between"><span>Sunday</span><span className="font-medium text-gray-400">Closed</span></li>
              </ul>
            </div>
          </ScrollReveal>

          {/* Form */}
          <ScrollReveal delay={100} className="md:col-span-3">
            {submitted ? (
              <div className="neu-card text-center py-12 px-6">
                <div className="text-5xl mb-4">✅</div>
                <h2 className="text-xl font-extrabold text-gray-900 mb-2">Message Sent!</h2>
                <p className="text-gray-500 text-sm mb-6">We&apos;ll get back to you on WhatsApp shortly.</p>
                <button onClick={() => { setSubmitted(false); setName(''); setEmail(''); setSubject(''); setMessage('') }} className="neu-pill bg-navy text-white font-bold px-5 py-2.5 text-sm hover:bg-navy-hover transition-all">
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="neu-card p-6 space-y-4">
                <h2 className="text-lg font-extrabold text-gray-900">Send us a message</h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Your Name *</label>
                    <input required type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="neu-inset w-full px-4 py-2.5 text-sm focus:outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="neu-inset w-full px-4 py-2.5 text-sm focus:outline-none transition-all" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Subject *</label>
                  <input required type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="What is this about?" className="neu-inset w-full px-4 py-2.5 text-sm focus:outline-none transition-all" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Message *</label>
                  <textarea required rows={4} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell us more about your enquiry…" className="neu-inset w-full px-4 py-2.5 text-sm focus:outline-none resize-none transition-all" />
                </div>

                <button type="submit" disabled={loading} className="neu-pill w-full bg-wa hover:bg-wa-dark text-white font-bold py-3.5 text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                  {loading ? 'Sending…' : 'Send via WhatsApp'}
                </button>
              </form>
            )}
          </ScrollReveal>
        </div>
      </main>
      <Footer />
    </>
  )
}
