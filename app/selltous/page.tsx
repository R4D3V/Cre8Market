import type { Metadata } from "next";
import SellToUsClient from "@/components/selltous/SellToUsClient";

export const metadata: Metadata = {
  title: "Sell to Us | Get an Offer Within 24 Hours in Entebbe",
  description:
    "Sell your phone, laptop or electronics to CRE8MARKET in Entebbe. Submit your item, get an offer within 24 hours and be paid on the spot. No listing fees.",
  alternates: { canonical: "/selltous" },
};

export default function SellToUsPage() {
  return <SellToUsClient />;
}
