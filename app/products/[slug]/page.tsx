import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetailPageClient from "@/components/ProductDetailPageClient";
import {
  fetchProductBySlugAction,
  fetchRelatedProductsAction,
} from "@/lib/actions/products";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProductBySlugAction(slug);

  if (!product) {
    return {
      title: "Listing not found | CRE8MARKET Entebbe",
      description: "The requested listing could not be found.",
    };
  }

  const title = `${product.title} | ${product.category} for sale in Entebbe`;
  const description =
    product.description?.trim() ||
    `View ${product.title} for sale in ${product.location ?? "Entebbe"} on CRE8MARKET.`;

  return {
    title,
    description: description.slice(0, 160),
    alternates: {
      canonical: `/products/${product.slug}`,
    },
    openGraph: {
      title,
      description: description.slice(0, 160),
      url: `https://cre8market.com/products/${product.slug}`,
      type: "website",
      images: product.images?.[0]
        ? [
            {
              url: product.images[0],
              width: 1200,
              height: 630,
              alt: product.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: description.slice(0, 160),
      images: product.images?.[0] ? [product.images[0]] : undefined,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await fetchProductBySlugAction(slug);

  if (!product) {
    notFound();
  }

  const related = await fetchRelatedProductsAction(product);

  return (
    <ProductDetailPageClient
      initialProduct={product}
      initialRelated={related}
    />
  );
}
