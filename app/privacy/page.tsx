import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy | CRE8MARKET Entebbe",
  description: "How CRE8MARKET ENTEBBE collects, uses, and protects your personal information.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      description="This policy explains what information we collect, how we use it, and the choices you have when using CRE8MARKET ENTEBBE."
      updated="October 22, 2026"
      sections={[
        {
          title: "Information We Collect",
          paragraphs: [
            'CRE8MARKET ENTEBBE ("we", "us", or "our") operates the cre8market.com website. This page informs you of our policies regarding the collection, use, and disclosure of personal information we receive from users of the Site.',
            "We collect information you provide directly to us, such as your name, phone number, and the content of listings you post. We also collect usage data through cookies and similar technologies.",
          ],
        },
        {
          title: "How We Use Your Information",
          paragraphs: [
            "We use the information we collect to operate and improve our marketplace, communicate with you about listings and transactions, and send deal alerts you've subscribed to.",
          ],
        },
        {
          title: "WhatsApp",
          paragraphs: [
            "When you subscribe to deal alerts or contact sellers through WhatsApp links on our platform, you are subject to WhatsApp's Privacy Policy in addition to ours.",
          ],
        },
        {
          title: "Contact Us",
          paragraphs: [
            "If you have any questions about this Privacy Policy, contact us at raymonjohns@gmail.com.",
          ],
        },
      ]}
    />
  );
}
