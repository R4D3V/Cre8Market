import type { MetadataRoute } from "next";

// Served at /manifest.webmanifest; Next.js adds the <link rel="manifest"> tag
// automatically. Replaces the old static public/manifest.json.
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "CRE8MARKET Entebbe",
    short_name: "Cre8Market",
    description:
      "Entebbe's #1 marketplace — buy and sell new and secondhand electronics, phones and more.",
    lang: "en-UG",
    start_url: "/?source=pwa",
    scope: "/",
    display: "standalone",
    display_override: ["standalone", "minimal-ui"],
    orientation: "portrait",
    // Matches --color-background so the launch splash doesn't flash white.
    background_color: "#001f3d",
    theme_color: "#021e40",
    categories: ["shopping", "business"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Shop", url: "/products?source=shortcut", description: "Browse all listings" },
      { name: "Deals", url: "/deals?source=shortcut", description: "Today's best deals" },
      { name: "Sell to Us", url: "/selltous?source=shortcut", description: "Get an instant cash offer" },
    ],
  };
}
