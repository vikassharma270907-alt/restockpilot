import { Channel3 } from "@channel3/sdk";

export type Product = { title: string; price: number | null; url: string | null; image?: string };

const FALLBACK_CATALOG: Product[] = [
  { title: "12oz compostable cold cups (case of 500)", price: 17.0, url: "https://example.com/cups" },
  { title: "16oz compostable cold cups (case of 500)", price: 19.5, url: "https://example.com/cups-16" },
  { title: "Cold brew glass bottles 16oz (case of 24)", price: 29.5, url: "https://example.com/coldbrew" },
  { title: "Barista blend oat milk cartons 32oz (case of 12)", price: 22.0, url: "https://example.com/oatmilk" },
  { title: "Kraft dispenser napkins 1-ply (case of 1000)", price: 14.5, url: "https://example.com/napkins" },
  { title: "Paper hot coffee cups 12oz (case of 1000)", price: 34.0, url: "https://example.com/hot-cups" },
  { title: "Single-origin espresso beans 5lb bulk bag", price: 38.0, url: "https://example.com/espresso" },
  { title: "Compostable beverage dome lids 12-16oz (case of 1000)", price: 21.0, url: "https://example.com/lids" },
  { title: "Organic vanilla flavoring syrup 750ml (case of 4)", price: 28.0, url: "https://example.com/syrup" },
];

function fallbackSearch(query: string, limit: number): Product[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const matched = FALLBACK_CATALOG.filter((item) => {
    const title = item.title.toLowerCase();
    return terms.some((t) => title.includes(t));
  });
  const results = matched.length > 0 ? matched : FALLBACK_CATALOG;
  return results.slice(0, limit);
}

/** Search products across retailers. Field names are mapped defensively:
 *  log one raw result on first run and adjust to the current Channel3 response shape. */
export async function searchProducts(query: string, limit = 5): Promise<Product[]> {
  if (!process.env.CHANNEL3_API_KEY) {
    return fallbackSearch(query, limit);
  }

  try {
    const client = new Channel3({ apiKey: process.env.CHANNEL3_API_KEY });
    const res: any = await (client as any).search?.perform?.({ query, limit });
    const list: any[] = Array.isArray(res) ? res : res?.products ?? res?.data ?? [];
    if (list.length === 0) {
      return fallbackSearch(query, limit);
    }
    return list.slice(0, limit).map((p) => {
      const offer = p.offers?.[0];
      const raw = offer?.price?.price ?? offer?.price ?? null;
      return {
        title: p.title ?? "Unknown product",
        price: raw == null ? null : Number(raw),
        url: offer?.url ?? null,
        image: p.image_urls?.[0] ?? p.images?.[0]?.url,
      };
    });
  } catch (err) {
    console.warn("Channel3 search failed, returning fallback catalog:", err);
    return fallbackSearch(query, limit);
  }
}
