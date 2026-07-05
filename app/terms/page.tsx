import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-10 pb-28 sm:pb-10">
        <Link href="/" className="text-sm text-navy font-semibold hover:underline mb-6 inline-block">← Home</Link>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Terms of Service</h1>
        <div className="neu-card p-6 sm:p-8 prose prose-sm text-gray-600 space-y-4">
          <p>Last updated: January 2025</p>
          <p>By using CRE8MARKET ENTEBBE, you agree to these terms. Please read them carefully.</p>
          <h2 className="text-base font-bold text-gray-900 mt-6">Marketplace Rules</h2>
          <p>CRE8MARKET ENTEBBE is a peer-to-peer marketplace. We connect buyers and sellers but are not a party to transactions. All sales are between individual users.</p>
          <h2 className="text-base font-bold text-gray-900 mt-6">Prohibited Items</h2>
          <p>You may not list stolen goods, counterfeit products, weapons, drugs, or any items prohibited by Ugandan law.</p>
          <h2 className="text-base font-bold text-gray-900 mt-6">Listing Accuracy</h2>
          <p>Sellers are responsible for accurate descriptions of their items. Misrepresentation may result in account suspension.</p>
          <h2 className="text-base font-bold text-gray-900 mt-6">Limitation of Liability</h2>
          <p>CRE8MARKET ENTEBBE is not responsible for disputes between buyers and sellers, the quality of listed items, or losses arising from transactions conducted through our platform.</p>
          <h2 className="text-base font-bold text-gray-900 mt-6">Contact</h2>
          <p>For questions about these Terms, contact us at raymonjohns@gmail.com or visit our office at Kitoro Entebbe Uganda.</p>
        </div>
      </main>
      <Footer />
    </>
  )
}
