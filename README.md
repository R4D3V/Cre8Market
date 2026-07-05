# CRE8MARKET — Next.js Clone

A full clone of [cre8market.com](https://cre8market.com) built with:

- **Next.js 16.2.9** (App Router)
- **Tailwind CSS 4.3.1** (CSS-first config)
- **TypeScript 5**

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Pages

| Route | Description |
|---|---|
| `/` | Homepage — hero, deals widget, featured/latest listings, wanted board |
| `/products` | All listings with sidebar filters (category, price, search) |
| `/products/[slug]` | Product detail — contact seller, make offer, share, related |
| `/sell` | Post a listing with AI auto-fill simulation |
| `/deals` | Hot deals page |
| `/wanted` | Wanted board — buyers looking for items |
| `/wanted/post` | Post a wanted request |
| `/selltous` | Sell your item to CRE8MARKET ENTEBBE for cash |
| `/whatsapp-groups` | WhatsApp groups & channels directory |
| `/login` | Sign in |
| `/register` | Create account |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |

---

## Tech Notes

- **Tailwind v4**: configured via `@theme {}` in `app/globals.css` — no `tailwind.config.js` needed
- **PostCSS**: uses `@tailwindcss/postcss` plugin
- **Mock data**: all products/categories in `lib/data.ts` — swap in a real API/DB as needed
- **WhatsApp links**: all contact/offer buttons open real `wa.me/` URLs
- **AI listing**: simulated with a 1.6s delay + random suggestion from presets

---

## Folder Structure

```
app/
  layout.tsx          Root layout
  globals.css         Tailwind v4 + custom theme
  page.tsx            Homepage
  products/
    page.tsx          Listings with filters
    [slug]/page.tsx   Product detail
  sell/page.tsx
  deals/page.tsx
  wanted/page.tsx
  wanted/post/page.tsx
  selltous/page.tsx
  login/page.tsx
  register/page.tsx
  whatsapp-groups/page.tsx
  privacy/page.tsx
  terms/page.tsx

components/
  Navbar.tsx
  CategoryBar.tsx
  ProductCard.tsx
  HeroBanner.tsx
  WhatsAppDealsWidget.tsx
  SellToUsBanner.tsx
  ListingsSection.tsx
  WantedBoard.tsx
  WhatsAppGroupsBanner.tsx
  Footer.tsx
  MobileBottomNav.tsx

lib/
  types.ts            TypeScript interfaces
  data.ts             Mock products, categories, wanted posts
```
