import { verifyWebhook } from "@/lib/paypal";
import { orders, persistOrder } from "@/lib/store";

export async function POST(req: Request) {
  const event = await req.json();
  if (!(await verifyWebhook(req.headers, event))) return new Response("Bad signature", { status: 400 });

  if (event.event_type === "PAYMENT.CAPTURE.COMPLETED") {
    const orderId = event.resource?.supplementary_data?.related_ids?.order_id;
    const rec = orderId && orders.get(orderId);
    if (rec) {
      rec.status = "PAID"; // reconcile ledger from PayPal's source of truth
      persistOrder(rec);
    }
  }
  return new Response("ok");
}
