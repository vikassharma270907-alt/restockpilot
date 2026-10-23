import { Channel3 } from "@channel3/sdk";

export type Product = { title: string; price: number | null; url: string | null; image?: string };

/** Search products across retailers. Field names are mapped defensively:
 *  log one raw result on first run and adjust to the current Channel3 response shape. */
export async function searchProducts(query: string, limit = 5): Promise<Product[]> {
  try {
    const client = new Channel3({ apiKey: process.env.CHANNEL3_API_KEY });
    const res: any = await (client as any).search?.perform?.({ query, limit });
    const list: any[] = Array.isArray(res) ? res : res?.products ?? res?.data ?? [];
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
    console.warn("Channel3 search failed, returning empty list:", err);
    return [];
  }
}
