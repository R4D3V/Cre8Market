import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ScrollReveal from '@/components/ScrollReveal'

const sellers = [
  {
    name: 'Uthman',
    deals: 'Phones & Accessories',
    phone: '2567512621506',
    initial: 'U',
  },
  {
    name: 'Shei Hakim',
    deals: 'Phone Spares, Repairs & Accessories',
    phone: '256751621506',
    initial: 'S',
  },
  {
    name: 'Raymonjohns',
    deals: 'Phone Repair, Accessories, Phone Spares, Software Issues',
    phone: '256751621506',
    initial: 'R',
  },
  {
    name: 'Kingstone Phone Service Center',
    deals: 'Phone Repairs — Hardware Generally',
    phone: '256706100444',
    initial: 'K',
  },
]

export default function SellersPage() {
  return (
    <>
      <Navbar />
      <div className="bg-surface px-3 sm:px-4 pt-2 pb-2">
        <div className="max-w-3xl mx-auto">
          <div className="neu-dark-card text-white py-10 px-6 text-center">
            <p className="eyebrow text-accent">Trusted Professionals</p>
            <h1 className="text-3xl font-extrabold mb-2">Our Sellers</h1>
            <p className="text-white/60 text-sm max-w-md mx-auto">
              Connect directly with trusted sellers in Entebbe, Uganda.
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-8 pb-28 sm:pb-8">
        <div className="grid gap-4">
          {sellers.map((seller, i) => (
            <ScrollReveal key={seller.name} delay={i * 80}>
              <div className="neu-card p-5 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-navy flex items-center justify-center text-white font-bold text-xl shrink-0">
                  {seller.initial}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-extrabold text-gray-900 text-base">{seller.name}</h2>
                  <p className="text-gray-500 text-sm mt-0.5">{seller.deals}</p>
                </div>
                <a
                  href={`https://wa.me/${seller.phone}?text=${encodeURIComponent(`Hi ${seller.name}, I saw your profile on CRE8MARKET ENTEBBE. I'm interested in your products.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="neu-pill shrink-0 bg-wa hover:bg-wa-dark text-white font-bold text-xs px-4 py-2.5 transition-all flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                  Chat
                </a>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}
