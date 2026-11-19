import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service | CRE8MARKET Entebbe",
  description:
    "The rules and agreements that apply when buying and selling on CRE8MARKET ENTEBBE.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      description="By using CRE8MARKET ENTEBBE, you agree to these terms. Please read them carefully before buying or selling."
      updated="October 22, 2026"
      sections={[
        {
          title: "Marketplace Rules",
          paragraphs: [
            "By using CRE8MARKET ENTEBBE, you agree to these terms. Please read them carefully.",
            "CRE8MARKET ENTEBBE is a peer-to-peer marketplace. We connect buyers and sellers but are not a party to transactions. All sales are between individual users.",
          ],
        },
        {
          title: "Prohibited Items",
          paragraphs: [
            "You may not list stolen goods, counterfeit products, weapons, drugs, or any items prohibited by Entebbe law.",
          ],
        },
        {
          title: "Listing Accuracy",
          paragraphs: [
            "Sellers are responsible for accurate descriptions of their items. Misrepresentation may result in account suspension.",
          ],
        },
        {
          title: "Limitation of Liability",
          paragraphs: [
            "CRE8MARKET ENTEBBE is not responsible for disputes between buyers and sellers, the quality of listed items, or losses arising from transactions conducted through our platform.",
          ],
        },
        {
          title: "Contact",
          paragraphs: [
            "For questions about these Terms, contact us at raymonjohns@gmail.com or visit our office at Kitoro, Entebbe, Entebbe.",
          ],
        },
      ]}
    />
  );
}
