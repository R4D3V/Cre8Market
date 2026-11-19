import { ProfilePanel } from "@/components/dashboard/ProfilePanel";

// Buyers have no public storefront, so the banner field is hidden.
export default function BuyerProfilePage() {
  return (
    <ProfilePanel
      eyebrow="Buyer hub"
      backHref="/buyer"
      backLabel="Back to Dashboard"
      showBanner={false}
      showWhatsapp={false}
    />
  );
}
