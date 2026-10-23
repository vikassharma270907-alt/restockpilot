import { captureOrder } from "@/lib/paypal";
import { orders, persistOrder } from "@/lib/store";

// PayPal redirects the buyer here after approval: ?token=<ORDER_ID>
export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("token");
  if (!id) return new Response("Missing token", { status: 400 });

  const host = req.headers.get("host") || "localhost:3000";
  const protocol = req.headers.get("x-forwarded-proto") || "http";
  const baseUrl = process.env.APP_URL || `${protocol}://${host}`;

  try {
    // If demo token or sandbox credentials not configured, handle cleanly without external network failure
    if (id.startsWith("SANDBOX-") || !process.env.PAYPAL_CLIENT_ID) {
      const rec = orders.get(id);
      if (rec) {
        rec.status = "PAID";
        persistOrder(rec);
      }
      return Response.redirect(`${baseUrl}/?paid=${id}`, 302);
    }

    const data = await captureOrder(id);
    const rec = orders.get(id);
    if (rec) {
      rec.status = data.status === "COMPLETED" ? "PAID" : "APPROVED";
      persistOrder(rec);
    }
    return Response.redirect(`${baseUrl}/?paid=${id}`, 302);
  } catch (e) {
    console.error("Payment capture error:", e);
    const rec = orders.get(id);
    if (rec) {
      rec.status = "FAILED";
      persistOrder(rec);
    }
    return Response.redirect(`${baseUrl}/?paid=${id}&error=capture_failed`, 302);
  }
}

// In-context capture for official PayPal Smart Buttons
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const id = body.orderId || body.token;
    if (!id) return Response.json({ error: "Missing orderId" }, { status: 400 });

    // Handle demo/sandbox tokens gracefully
    if (id.startsWith("SANDBOX-") || !process.env.PAYPAL_CLIENT_ID) {
      const rec = orders.get(id);
      if (rec) {
        rec.status = "PAID";
        persistOrder(rec);
      }
      return Response.json({ status: "COMPLETED", id, order: rec });
    }

    const data = await captureOrder(id);
    const rec = orders.get(id);
    if (rec) {
      rec.status = data.status === "COMPLETED" ? "PAID" : "APPROVED";
      persistOrder(rec);
    }
    return Response.json({ status: data.status, id, data, order: rec });
  } catch (e: any) {
    console.error("In-context capture failed:", e);
    const body = await req.clone().json().catch(() => ({}));
    const id = body.orderId || body.token;
    if (id) {
      const rec = orders.get(id);
      if (rec) {
        rec.status = "FAILED";
        persistOrder(rec);
      }
    }
    return Response.json({ error: e.message || "Capture failed" }, { status: 500 });
  }
}
