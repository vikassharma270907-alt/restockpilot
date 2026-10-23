import { orders } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const allOrders = [...orders.values()].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return Response.json(allOrders);
}
