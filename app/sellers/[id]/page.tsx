import type { Metadata } from "next";
import SellerPageClient from "@/components/sellers/SellerPageClient";
import { fetchPublicUserAction } from "@/lib/actions/users";
import { fetchPublicUserProductsAction } from "@/lib/actions/products";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import type { AppUser, Product } from "@/lib/types";

type Props = { params: Promise<{ id: string }> };

async function load(id: string) {
  try {
    const user = await fetchPublicUserAction(id);
    if (!user) return { user: null as AppUser | null, products: [] as Product[] };
    const products = await fetchPublicUserProductsAction(id);
    return { user, products };
  } catch {
    // Database unavailable (for example a Neon cold start): the client
    // component falls back to fetching on its own.
    return { user: null as AppUser | null, products: [] as Product[], failed: true };
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { user, products } = await load(id);

  if (!user) {
    return {
      title: "Seller | CRE8MARKET Entebbe",
      description: "Browse sellers on CRE8MARKET Entebbe.",
    };
  }

  // Name, listing count and place only. Phone and WhatsApp numbers are never
  // put in page metadata.
  const count = products.length;
  const title = `${user.name} on CRE8MARKET | Seller in Entebbe`;
  const description =
    count > 0
      ? `Browse ${count} listing${count === 1 ? "" : "s"} from ${user.name} on CRE8MARKET in Entebbe. Chat with the seller directly on WhatsApp.`
      : `${user.name} is a seller on CRE8MARKET in Entebbe. Chat with the seller directly on WhatsApp.`;
  const path = id === "store" ? "/sellers/store" : `/sellers/${user.handle ?? id}`;
  const image = user.banner || user.avatar || undefined;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${path}`,
      siteName: SITE_NAME,
      type: "profile",
      images: image ? [{ url: image, alt: user.name }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function SellerPage({ params }: Props) {
  const { id } = await params;
  const { user, products } = await load(id);

  return (
    <SellerPageClient
      id={id}
      initialUser={user}
      initialProducts={products}
    />
  );
}
