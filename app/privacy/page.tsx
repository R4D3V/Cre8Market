import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-10 pb-28 sm:pb-10">
        <Link href="/" className="text-sm text-navy font-semibold hover:underline mb-6 inline-block">← Home</Link>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Privacy Policy</h1>
        <div className="neu-card p-6 sm:p-8 prose prose-sm text-gray-600 space-y-4">
          <p>Last updated: January 2025</p>
          <p>CRE8MARKET ENTEBBE ("we", "us", or "our") operates the cre8market.com website. This page informs you of our policies regarding the collection, use, and disclosure of personal information we receive from users of the Site.</p>
          <h2 className="text-base font-bold text-gray-900 mt-6">Information We Collect</h2>
          <p>We collect information you provide directly to us, such as your name, phone number, and the content of listings you post. We also collect usage data through cookies and similar technologies.</p>
          <h2 className="text-base font-bold text-gray-900 mt-6">How We Use Your Information</h2>
          <p>We use the information we collect to operate and improve our marketplace, communicate with you about listings and transactions, and send deal alerts you've subscribed to.</p>
          <h2 className="text-base font-bold text-gray-900 mt-6">WhatsApp</h2>
          <p>When you subscribe to deal alerts or contact sellers through WhatsApp links on our platform, you are subject to WhatsApp's Privacy Policy in addition to ours.</p>
          <h2 className="text-base font-bold text-gray-900 mt-6">Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, contact us at raymonjohns@gmail.com</p>
        </div>
      </main>
      <Footer />
    </>
  )
}
