import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

const plans = [
  { name: "Free", price: 0, period: "Free Forever", features: ["Up to 3 active product listings", "Direct WhatsApp and phone contact"], highlight: false, icon: "user", sort_order: 0 },
  { name: "Standard", price: 10000, period: "2 Months", features: ["Up to 20 active product listings", "Verified seller badge (after verification)", "Direct WhatsApp and phone contact"], highlight: true, icon: "star", sort_order: 1 },
  { name: "Premium", price: 35000, period: "2 Months", features: ["Unlimited active product listings", "Verified seller badge (after verification)", "Featured product opportunities"], highlight: false, icon: "rocket", sort_order: 2 },
];

try {
  for (const p of plans) {
    await pool.query(
      `INSERT INTO subscription_plans (name, price, period, features, highlight, icon, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       ON CONFLICT (name) DO UPDATE SET price=$2, period=$3, features=$4, highlight=$5, icon=$6, sort_order=$7, updated_at=now()`,
      [p.name, p.price, p.period, JSON.stringify(p.features), p.highlight, p.icon, p.sort_order],
    );
  }
  console.log("Seed complete — subscription plans ensured.");
} catch (err) {
  console.error("Seed failed:", err);
  process.exitCode = 1;
} finally {
  await pool.end();
}