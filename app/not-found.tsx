import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-[70vh] flex items-center justify-center px-4 py-16 pb-28 sm:pb-16">
        <div className="text-center max-w-sm">
          <div className="neu-dark-card text-white inline-flex items-center justify-center w-24 h-24 rounded-2xl mb-6 mx-auto">
            <span className="text-5xl">🔍</span>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">404</h1>
          <p className="text-gray-500 mb-2">Page not found</p>
          <p className="text-gray-400 text-sm mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <Link
            href="/"
            className="neu-pill bg-navy hover:bg-navy-hover text-white font-bold px-6 py-3 text-sm transition-all inline-block"
          >
            Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
