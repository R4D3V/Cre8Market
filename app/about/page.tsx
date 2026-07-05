import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ScrollReveal from '@/components/ScrollReveal'

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-10 pb-28 sm:pb-10">
        <Link href="/" className="text-sm text-navy font-semibold hover:underline mb-6 inline-block">← Home</Link>

        {/* Hero */}
        <ScrollReveal>
          <div className="neu-dark-card text-white text-center py-12 px-6 mb-8 relative overflow-hidden">
            <Image
              src="/brand/hero.jpeg"
              alt=""
              fill
              priority
              className="absolute inset-0 object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-navy/90 via-navy/80 to-navy/90" />
            <h1 className="text-3xl font-extrabold relative z-10 mb-3">About CRE8MARKET ENTEBBE</h1>
            <p className="text-white/70 text-base max-w-lg mx-auto relative z-10">
              Uganda&apos;s trusted marketplace — buy, sell, and connect directly.
            </p>
          </div>
        </ScrollReveal>

        {/* Who we are */}
        <ScrollReveal delay={100}>
          <div className="neu-card p-6 sm:p-8 mb-6">
            <h2 className="text-lg font-extrabold text-gray-900 mb-3">Who We Are</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              CRE8MARKET ENTEBBE is a Ugandan-owned and operated marketplace based in Entebbe. We connect local
              buyers and sellers directly — no middleman, no hidden fees. From phones and laptops to furniture
              and vehicles, our platform makes it easy to find great deals or sell your items fast.
            </p>
          </div>
        </ScrollReveal>

        {/* Our Mission */}
        <ScrollReveal delay={200}>
          <div className="neu-card p-6 sm:p-8 mb-6">
            <h2 className="text-lg font-extrabold text-gray-900 mb-3">Our Mission</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              To make buying and selling in Uganda simple, direct, and accessible to everyone. We believe
              marketplace transactions should happen without unnecessary middlemen, hidden fees, or complicated
              processes.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed">
              By leveraging WhatsApp — Uganda&apos;s most widely used messaging platform — we remove barriers
              and let buyers and sellers connect instantly. Whether you&apos;re upgrading your phone, clearing
              out used electronics, or looking for a fair cash offer, CRE8MARKET ENTEBBE is built to serve
              the local community with speed and trust.
            </p>
          </div>
        </ScrollReveal>

        {/* What we do */}
        <ScrollReveal delay={300}>
          <div className="neu-card p-6 sm:p-8 mb-6">
            <h2 className="text-lg font-extrabold text-gray-900 mb-3">What We Do</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: '🛒', title: 'Marketplace', desc: 'List and browse items for sale across dozens of categories. Direct seller contact, no commissions.' },
                { icon: '💰', title: 'Sell to Us', desc: 'Have something valuable? Send us your item details and get a cash offer via WhatsApp within 24 hours.' },
                { icon: '🔥', title: 'Daily Deals', desc: 'We curate the best deals on electronics, phones, laptops, and more — updated daily.' },
                { icon: '📢', title: 'Wanted Board', desc: 'Looking for something specific? Post what you need and sellers will reach out to you.' },
              ].map((item) => (
                <div key={item.title} className="neu-card p-4">
                  <span className="text-2xl">{item.icon}</span>
                  <h3 className="font-bold text-gray-900 text-sm mt-2 mb-1">{item.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Stats */}
        <ScrollReveal delay={400}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {[
              { number: '200+', label: 'Listings' },
              { number: '50+', label: 'Sellers' },
              { number: '24hrs', label: 'Offer Response' },
              { number: '100%', label: 'Direct Contact' },
            ].map((stat) => (
              <div key={stat.label} className="neu-card text-center py-5 px-3">
                <p className="text-2xl font-extrabold text-navy">{stat.number}</p>
                <p className="text-gray-500 text-xs mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Why choose us */}
        <ScrollReveal delay={500}>
          <div className="neu-card p-6 sm:p-8 mb-6">
            <h2 className="text-lg font-extrabold text-gray-900 mb-3">Why Choose Us</h2>
            <ul className="space-y-3">
              {[
                { title: 'No Middleman', desc: 'Contact the seller directly. No commissions, no platform fees, no bureaucracy.' },
                { title: 'Local & Trusted', desc: 'Based in Kitoro, Entebbe. We verify sellers and ensure a safe marketplace for everyone.' },
                { title: 'Fast Cash Offers', desc: 'Selling to us? Get a WhatsApp cash offer within 24 hours. Instant payment upon acceptance.' },
                { title: 'WhatsApp Integrated', desc: 'All communication happens on WhatsApp — Uganda&apos;s favourite messaging platform. Fast and familiar.' },
              ].map((item) => (
                <li key={item.title} className="flex items-start gap-3">
                  <span className="text-accent text-lg shrink-0 mt-0.5">✓</span>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{item.title}</p>
                    <p className="text-gray-500 text-sm">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </ScrollReveal>

        {/* Contact */}
        <ScrollReveal delay={600}>
          <div className="neu-dark-card text-white text-center py-8 px-6">
            <h2 className="text-lg font-extrabold mb-2">Get in Touch</h2>
            <p className="text-white/60 text-sm mb-4">Have questions? We&apos;d love to hear from you.</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <a href="mailto:raymonjohns@gmail.com" className="neu-dark-pill bg-accent text-navy font-bold px-5 py-2.5 transition-all">
                Email Us
              </a>
              <a href="https://wa.me/256751621506" target="_blank" rel="noreferrer" className="neu-dark-pill text-white font-bold px-5 py-2.5 transition-all">
                WhatsApp Us
              </a>
            </div>
          </div>
        </ScrollReveal>
      </main>
      <Footer />
    </>
  )
}
