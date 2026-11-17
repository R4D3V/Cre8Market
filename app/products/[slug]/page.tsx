import type { Metadata } from "next";
import ProductDetailPageClient from "@/components/ProductDetailPageClient";
import { fetchProductBySlugAction, fetchRelatedProductsAction } from "@/lib/actions/products";
import {
  buildBreadcrumbJsonLd,
  buildProductDescription,
  buildProductJsonLd,
  buildProductTitle,
  jsonLdString,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo";

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

  const title = buildProductTitle(product);
  const description = buildProductDescription(product);
  const image = product.images?.[0];

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: `/products/${product.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/products/${product.slug}`,
      siteName: SITE_NAME,
      type: "website",
      images: image ? [{ url: image, alt: product.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ProductDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ from?: string }>;
}) {
  const { slug } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const isFromDeals = resolvedSearchParams.from === "deals";

  // Fetch on the server so the product's title, price, description and
  // images are in the HTML that search engines and WhatsApp/Facebook link
  // previews read, and so buyers see the listing without a loading skeleton.
  // If the lookup fails (for example a Neon cold-start timeout) we fall back
  // to the client component's own fetch, which is how the page worked before.
  let product: Awaited<ReturnType<typeof fetchProductBySlugAction>> = null;
  let related: Awaited<ReturnType<typeof fetchRelatedProductsAction>> = [];
  try {
    product = await fetchProductBySlugAction(slug);
    if (product) related = await fetchRelatedProductsAction(product);
  } catch {
    product = null;
  }

  return (
    <>
      {product && (
        <>
          <script
            type="application/ld+json"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD is generated locally
            dangerouslySetInnerHTML={{
              __html: jsonLdString(buildProductJsonLd(product)),
            }}
          />
          <script
            type="application/ld+json"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD is generated locally
            dangerouslySetInnerHTML={{
              __html: jsonLdString(buildBreadcrumbJsonLd(product)),
            }}
          />
        </>
      )}
      <ProductDetailPageClient
        initialProduct={product}
        initialRelated={related}
        slug={slug}
        backHref={isFromDeals ? "/deals" : "/products"}
        backLabel={isFromDeals ? "Back to Deals" : "Back to Listings"}
      />
    </>
  );
}
