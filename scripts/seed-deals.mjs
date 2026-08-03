// One-off seed for the /deals page.
// Moves the previously static deal products into the database (marked is_deal = true)
// and adds 5 new ones with images. Idempotent: existing slugs are skipped.
//
// Run:  node --env-file=.env.local scripts/seed-deals.mjs

import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

const img = (slug) => `https://picsum.photos/seed/${slug}/600/450`;

const deals = [
  {
    slug: "midea-inverter-quattro-microwave-oven-25l",
    title: "Midea Inverter Quattro Microwave Oven - 25L",
    price: 200000,
    category: "Home Appliances",
    categorySlug: "home-appliances",
    condition: "New",
    location: "Entebbe",
    description:
      "Midea Inverter Quattro Microwave Oven, 25 litres. Advanced inverter technology for even, precise cooking. Multiple power levels and pre-set cooking functions. Brand new in box.",
    specs: [
      { label: "Capacity", value: "25 Litres" },
      { label: "Technology", value: "Inverter" },
      { label: "Power Levels", value: "Multiple" },
      { label: "Type", value: "Quattro" },
      { label: "Condition", value: "Brand New" },
    ],
  },
  {
    slug: "iphone-8-white-64gb-excellent-condition",
    title: "iPhone 8 White 64GB - Excellent Condition",
    price: 250000,
    category: "Phones & Tablets",
    categorySlug: "phones-tablets",
    condition: "Like New",
    location: "Entebbe",
    description:
      "iPhone 8 in white, 64GB storage. Excellent condition with no cracks or scratches on screen. Battery health at 82%. Includes original charger and cable. Screen protector applied.",
    specs: [
      { label: "Storage", value: "64GB" },
      { label: "Color", value: "White" },
      { label: "Battery Health", value: "82%" },
      { label: "Condition", value: "Excellent" },
      { label: "Accessories", value: "Charger + Cable" },
    ],
  },
  {
    slug: "samsung-a05-67-hd-display",
    title: 'Samsung A05 | 6.7" HD+ Display | UGX 150,000',
    price: 150000,
    category: "Phones & Tablets",
    categorySlug: "phones-tablets",
    condition: "Used - Good",
    location: "Entebbe",
    description:
      'Samsung Galaxy A05. 6.7" HD+ display, 64GB storage, 4GB RAM, Android 13. Good battery life at 5000mAh. Minor wear on body, screen is perfect. Includes charger.',
    specs: [
      { label: "Display", value: '6.7" HD+' },
      { label: "Storage", value: "64GB" },
      { label: "RAM", value: "4GB" },
      { label: "Battery", value: "5000mAh" },
      { label: "OS", value: "Android 13" },
    ],
  },
  {
    slug: "chiq-50-inch-4k-smart-tv-google-tv",
    title: "CHiQ 50 inch 4K Smart TV | Google TV | UGX 900,000",
    price: 900000,
    category: "Electronics",
    categorySlug: "electronics",
    condition: "New",
    location: "Entebbe",
    description:
      "CHiQ 50 inch 4K Ultra HD Smart TV with Google TV. Built-in Chromecast, Google Assistant, Netflix, YouTube pre-installed. 3 HDMI ports, 2 USB ports. Dolby Audio. Brand new with warranty.",
    specs: [
      { label: "Size", value: "50 inches" },
      { label: "Resolution", value: "4K UHD" },
      { label: "Smart TV", value: "Google TV" },
      { label: "HDMI", value: "3 Ports" },
      { label: "Audio", value: "Dolby Audio" },
    ],
  },
  {
    slug: "wireless-earbuds-charging-case-black",
    title: "Wireless Earbuds with Charging Case - Black",
    price: 50000,
    category: "Electronics",
    categorySlug: "electronics",
    condition: "New",
    location: "Entebbe",
    description:
      "True wireless earbuds with compact charging case. 6 hours battery life per charge, 18 hours total with case. Touch controls, built-in microphone, IPX5 sweat resistance. Black colour.",
    specs: [
      { label: "Battery Life", value: "6 hrs (18 hrs w/ case)" },
      { label: "Water Resistance", value: "IPX5" },
      { label: "Controls", value: "Touch" },
      { label: "Microphone", value: "Built-in" },
      { label: "Color", value: "Black" },
    ],
  },
  {
    slug: "tozo-a1-true-wireless-stereo-earbuds",
    title: "TOZO A1 True Wireless Stereo Earbuds - Brand New Sealed",
    price: 50000,
    category: "Electronics",
    categorySlug: "electronics",
    condition: "New",
    location: "Entebbe",
    description:
      "TOZO A1 Mini Wireless Earbuds. Brand new in sealed box. IPX5 waterproof rating, 6-hour playtime with up to 24 hours using charging case. Deep bass Bluetooth 5.3 sound. Excellent deal.",
    specs: [
      { label: "Battery Life", value: "6 hrs (24 hrs w/ case)" },
      { label: "Water Resistance", value: "IPX5" },
      { label: "Bluetooth", value: "5.3" },
      { label: "Playtime", value: "6 hours" },
      { label: "Condition", value: "Brand New Sealed" },
    ],
  },
  {
    slug: "anker-soundcore-portable-bluetooth-speaker",
    title: "Anker SoundCore Portable Bluetooth Speaker - New",
    price: 150000,
    category: "Electronics",
    categorySlug: "electronics",
    condition: "New",
    location: "Entebbe",
    description:
      "Anker SoundCore Bluetooth Speaker. 24-hour battery life, 360° full sound, IPX5 waterproof, built-in microphone. Brand new in original packaging. Connects to 2 phones simultaneously.",
    specs: [
      { label: "Battery Life", value: "24 hours" },
      { label: "Sound", value: "360° Full" },
      { label: "Water Resistance", value: "IPX5" },
      { label: "Microphone", value: "Built-in" },
      { label: "Condition", value: "Brand New" },
    ],
  },
  {
    slug: "oppo-a15-android-phone-32gb-3gb-ram",
    title: "OPPO A15 Android Phone - 32GB Storage, 3GB RAM",
    price: 100000,
    category: "Phones & Tablets",
    categorySlug: "phones-tablets",
    condition: "Used - Good",
    location: "Entebbe",
    description:
      "OPPO A15 in good condition. 32GB storage, 3GB RAM, Android 10. Triple camera setup with 13MP main lens. 4230mAh battery. Fingerprint sensor on back.",
    specs: [
      { label: "Storage", value: "32GB" },
      { label: "RAM", value: "3GB" },
      { label: "Camera", value: "13MP Triple" },
      { label: "Battery", value: "4230mAh" },
      { label: "OS", value: "Android 10" },
      { label: "Security", value: "Fingerprint" },
    ],
  },
  {
    slug: "samsung-galaxy-a05s-black-128gb-4gb",
    title: "Samsung Galaxy A05s Black - Triple Camera 128GB 4GB",
    price: 150000,
    category: "Phones & Tablets",
    categorySlug: "phones-tablets",
    condition: "Used - Good",
    location: "Entebbe",
    description:
      "Samsung Galaxy A05s in black. 128GB storage, 4GB RAM. 50MP triple camera system. 5000mAh long-life battery. Minor scratches on back cover, screen is perfect. Comes with charger.",
    specs: [
      { label: "Storage", value: "128GB" },
      { label: "RAM", value: "4GB" },
      { label: "Camera", value: "50MP Triple" },
      { label: "Battery", value: "5000mAh" },
      { label: "Color", value: "Black" },
    ],
  },
  {
    slug: "hp-zbook-firefly",
    title: "HP ZBook Firefly",
    price: 2800000,
    category: "Computers & Laptops",
    categorySlug: "computers-laptops",
    condition: "Used - Good",
    location: "Entebbe",
    description:
      'HP ZBook Firefly G8 mobile workstation. Intel Core i7 11th Gen, 16GB RAM, 512GB NVMe SSD. NVIDIA T500 4GB GPU. 14" FHD IPS display. ISV certified for professional creative work.',
    specs: [
      { label: "Processor", value: "Core i7 11th Gen" },
      { label: "RAM", value: "16GB" },
      { label: "Storage", value: "512GB NVMe" },
      { label: "GPU", value: "NVIDIA T500 4GB" },
      { label: "Display", value: '14" FHD IPS' },
      { label: "Certification", value: "ISV Certified" },
    ],
  },
  {
    slug: "macbook-pro-2020",
    title: "MacBook Pro 2020",
    price: 2500000,
    category: "Computers & Laptops",
    categorySlug: "computers-laptops",
    condition: "Like New",
    location: "Entebbe",
    description:
      "MacBook Pro 13-inch 2020, Apple M1 chip. 8GB unified memory, 256GB SSD. Space Gray. Battery cycle count under 100. Runs macOS Sonoma. Includes original MagSafe charger. Excellent condition.",
    specs: [
      { label: "Chip", value: "Apple M1" },
      { label: "RAM", value: "8GB Unified" },
      { label: "Storage", value: "256GB SSD" },
      { label: "Display", value: '13.3" Retina' },
      { label: "Color", value: "Space Gray" },
      { label: "OS", value: "macOS Sonoma" },
    ],
  },
  {
    slug: "saachi-iron-box",
    title: "Saachi Iron Box",
    price: 45000,
    category: "Home Appliances",
    categorySlug: "home-appliances",
    condition: "Used - Good",
    location: "Entebbe",
    description:
      "Saachi electric steam iron box. Variable temperature control, steam burst function, self-cleaning mode. Working perfectly. Good soleplate.",
    specs: [
      { label: "Type", value: "Steam Iron" },
      { label: "Temperature", value: "Variable" },
      { label: "Steam Burst", value: "Yes" },
      { label: "Self-Cleaning", value: "Yes" },
      { label: "Brand", value: "Saachi" },
    ],
  },
  {
    slug: "apple-airpods-pro-2",
    title: "Apple AirPods Pro 2",
    price: 80000,
    category: "Electronics",
    categorySlug: "electronics",
    condition: "Used - Good",
    location: "Entebbe",
    description:
      "Apple AirPods Pro 2nd generation. Active Noise Cancellation, Transparency mode, Adaptive Audio. MagSafe charging case included. Battery health good. One ear tip size missing.",
    specs: [
      { label: "Noise Cancellation", value: "Active" },
      { label: "Transparency Mode", value: "Yes" },
      { label: "Adaptive Audio", value: "Yes" },
      { label: "Charging", value: "MagSafe" },
      { label: "Generation", value: "2nd" },
    ],
  },
  {
    slug: "dell-latitude-7490",
    title: "Dell Latitude 7490",
    price: 1400000,
    category: "Computers & Laptops",
    categorySlug: "computers-laptops",
    condition: "Used - Good",
    location: "Entebbe",
    description:
      'Dell Latitude 7490. Intel Core i7 8th Gen, 16GB DDR4, 512GB SSD. 14" FHD IPS display. LTE 4G modem built-in. Backlit keyboard, fingerprint reader. In great working condition.',
    specs: [
      { label: "Processor", value: "Core i7 8th Gen" },
      { label: "RAM", value: "16GB DDR4" },
      { label: "Storage", value: "512GB SSD" },
      { label: "Display", value: '14" FHD IPS' },
      { label: "Connectivity", value: "LTE 4G" },
      { label: "Security", value: "Fingerprint" },
    ],
  },
  {
    slug: "zte-mf935-4g-lte-mobile-wifi-router-mtn",
    title: "ZTE MF935 4G LTE Mobile WiFi Router - MTN",
    price: 50000,
    category: "Electronics",
    categorySlug: "electronics",
    condition: "Used - Good",
    location: "Entebbe",
    description:
      "ZTE MF935 4G LTE Mobile WiFi Hotspot router, MTN Uganda locked. Connect up to 10 devices simultaneously. Compact pocket-size design. Includes original charger.",
    specs: [
      { label: "Network", value: "4G LTE" },
      { label: "Carrier", value: "MTN Locked" },
      { label: "Devices", value: "Up to 10" },
      { label: "Form Factor", value: "Pocket-size" },
      { label: "Condition", value: "Used - Good" },
    ],
  },
  {
    slug: "digital-voice-recorder-hd-speakers-rec007",
    title: "Digital Voice Recorder with HD Speakers - REC007",
    price: 180000,
    category: "Electronics",
    categorySlug: "electronics",
    condition: "New",
    location: "Entebbe",
    description:
      "REC007 Digital Voice Recorder with HD stereo speakers. 32GB built-in memory, up to 15 hours continuous recording. Noise reduction technology, MP3/WAV playback, USB transfer.",
    specs: [
      { label: "Memory", value: "32GB Built-in" },
      { label: "Recording", value: "15 hours" },
      { label: "Playback", value: "MP3/WAV" },
      { label: "Speakers", value: "HD Stereo" },
      { label: "Noise Reduction", value: "Yes" },
      { label: "Interface", value: "USB" },
    ],
  },
  // ── 5 new products with images ──
  {
    slug: "jbl-go-3-portable-bluetooth-speaker",
    title: "JBL Go 3 Portable Bluetooth Speaker - New",
    price: 95000,
    category: "Electronics",
    categorySlug: "electronics",
    condition: "New",
    location: "Entebbe",
    description:
      "JBL Go 3 ultra-portable Bluetooth speaker. Big JBL Pro Sound in a pocket-size design. IP67 waterproof and dustproof. Up to 5 hours of playtime. USB-C charging. Brand new in box.",
    specs: [
      { label: "Battery Life", value: "5 hours" },
      { label: "Waterproof", value: "IP67" },
      { label: "Bluetooth", value: "5.1" },
      { label: "Charging", value: "USB-C" },
      { label: "Condition", value: "Brand New" },
    ],
  },
  {
    slug: "nikon-d3500-dslr-camera-18-55mm-lens",
    title: "Nikon D3500 DSLR Camera with 18-55mm Lens",
    price: 1900000,
    category: "Electronics",
    categorySlug: "electronics",
    condition: "Like New",
    location: "Entebbe",
    description:
      "Nikon D3500 DSLR with 18-55mm VR kit lens. 24.2MP DX-format sensor, Full HD video, Bluetooth/WiFi sharing. Shutter count under 3,000. Includes charger, battery and strap. Like new.",
    specs: [
      { label: "Sensor", value: "24.2MP DX-format" },
      { label: "Lens", value: "18-55mm VR" },
      { label: "Video", value: "Full HD 1080p" },
      { label: "Connectivity", value: "Bluetooth + WiFi" },
      { label: "Condition", value: "Like New" },
    ],
  },
  {
    slug: "three-seater-fabric-sofa-light-grey",
    title: "Comfortable 3-Seater Fabric Sofa - Light Grey",
    price: 850000,
    category: "Furniture",
    categorySlug: "furniture",
    condition: "New",
    location: "Entebbe",
    description:
      "Modern 3-seater fabric sofa in light grey. Sturdy wooden frame, high-density foam cushions, removable washable covers. Perfect for living rooms and offices. New from showroom.",
    specs: [
      { label: "Seats", value: "3 Seater" },
      { label: "Material", value: "Fabric + Wood" },
      { label: "Color", value: "Light Grey" },
      { label: "Covers", value: "Removable & Washable" },
      { label: "Condition", value: "Brand New" },
    ],
  },
  {
    slug: "hp-elitebook-840-g7-laptop-i5",
    title: "HP EliteBook 840 G7 Laptop - i5, 8GB RAM, 256GB SSD",
    price: 1600000,
    category: "Computers & Laptops",
    categorySlug: "computers-laptops",
    condition: "Used - Good",
    location: "Entebbe",
    description:
      'HP EliteBook 840 G7 business laptop. Intel Core i5 10th Gen, 8GB RAM, 256GB SSD. 14" FHD display, backlit keyboard, fingerprint reader. Great battery life. In good working condition.',
    specs: [
      { label: "Processor", value: "Core i5 10th Gen" },
      { label: "RAM", value: "8GB" },
      { label: "Storage", value: "256GB SSD" },
      { label: "Display", value: '14" FHD' },
      { label: "Security", value: "Fingerprint" },
    ],
  },
  {
    slug: "samsung-galaxy-s21-128gb-excellent",
    title: "Samsung Galaxy S21 128GB - Excellent Condition",
    price: 1200000,
    category: "Phones & Tablets",
    categorySlug: "phones-tablets",
    condition: "Like New",
    location: "Entebbe",
    description:
      "Samsung Galaxy S21 128GB, Phantom Grey. 64MP triple camera, 120Hz AMOLED display, 4000mAh battery. Battery health 91%. Includes box, cable and a free case. Excellent condition.",
    specs: [
      { label: "Storage", value: "128GB" },
      { label: "Camera", value: "64MP Triple" },
      { label: "Display", value: '6.2" 120Hz AMOLED' },
      { label: "Battery", value: "4000mAh (91%)" },
      { label: "Color", value: "Phantom Grey" },
    ],
  },
];

const store = {
  name: "CRE8MARKET ENTEBBE",
  phone: "256751621506",
  whatsapp: "256751621506",
  verified: true,
  memberSince: "May 2025",
};

let inserted = 0;
let skipped = 0;

try {
  await pool.query("ALTER TABLE products ADD COLUMN IF NOT EXISTS is_deal BOOLEAN DEFAULT false");

  for (const d of deals) {
    const exists = await pool.query("SELECT 1 FROM products WHERE slug = $1", [d.slug]);
    if (exists.rows.length > 0) {
      skipped++;
      continue;
    }
    await pool.query(
      `INSERT INTO products (slug, title, price, category, category_slug, featured, is_deal,
         description, specs, condition, location, seller, images, "daysAgo", "timeAgo")
       VALUES ($1,$2,$3,$4,$5,false,true,$6,$7,$8,$9,$10,$11,0,'Just now')`,
      [
        d.slug,
        d.title,
        d.price,
        d.category,
        d.categorySlug,
        d.description,
        JSON.stringify(d.specs ?? []),
        d.condition,
        d.location,
        JSON.stringify({ ...store, name: d.sellerName ?? store.name }),
        JSON.stringify([img(d.slug)]),
      ],
    );
    inserted++;
  }
  console.log(`Seed complete — ${inserted} inserted, ${skipped} skipped (already present).`);
} catch (err) {
  console.error("Seed failed:", err.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
