const BASE = process.env.PAYPAL_BASE_URL ?? "https://api-m.sandbox.paypal.com";

async function accessToken(): Promise<string> {
  const basic = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString("base64");
  const res = await fetch(`${BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: { Authorization: `Basic ${basic}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) throw new Error(`PayPal auth failed: ${res.status} ${await res.text()}`);
  return (await res.json()).access_token;
}

export type LineItem = { name: string; qty: number; unit: number };

/** Create a sandbox order. The buyer must approve it by logging in to PayPal (human-in-the-loop). */
export async function createOrder(items: LineItem[], requestId: string) {
  const cents = (n: number) => Math.round(n * 100);
  const total = items.reduce((s, i) => s + cents(i.unit) * i.qty, 0) / 100;
  const body = {
    intent: "CAPTURE",
    purchase_units: [{
      reference_id: requestId,
      amount: {
        currency_code: "USD", value: total.toFixed(2),
        breakdown: { item_total: { currency_code: "USD", value: total.toFixed(2) } },
      },
      items: items.map((i) => ({
        name: i.name.slice(0, 127), quantity: String(i.qty),
        unit_amount: { currency_code: "USD", value: i.unit.toFixed(2) },
      })),
    }],
    payment_source: {
      paypal: { experience_context: {
        user_action: "PAY_NOW",
        return_url: `${process.env.APP_URL}/api/orders/capture`,
        cancel_url: `${process.env.APP_URL}/?cancelled=1`,
      } },
    },
  };
  const res = await fetch(`${BASE}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${await accessToken()}`, "Content-Type": "application/json",
      "PayPal-Request-Id": requestId, // idempotency: retries never create duplicate orders
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`createOrder failed: ${JSON.stringify(data)}`);
  const link = data.links?.find((l: any) => l.rel === "payer-action" || l.rel === "approve")?.href;
  return { id: data.id as string, total, approveUrl: link as string };
}

export async function captureOrder(orderId: string) {
  const res = await fetch(`${BASE}/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${await accessToken()}`, "Content-Type": "application/json",
      "PayPal-Request-Id": `capture-${orderId}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`capture failed: ${JSON.stringify(data)}`);
  return data;
}

/** Get order details from PayPal Orders v2 API */
export async function getOrder(orderId: string) {
  const res = await fetch(`${BASE}/v2/checkout/orders/${orderId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${await accessToken()}`,
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`getOrder failed: ${JSON.stringify(data)}`);
  return data;
}

/** Authorize order funds (for 2-step auth-capture if required) */
export async function authorizeOrder(orderId: string) {
  const res = await fetch(`${BASE}/v2/checkout/orders/${orderId}/authorize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${await accessToken()}`,
      "Content-Type": "application/json",
      "PayPal-Request-Id": `auth-${orderId}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`authorize failed: ${JSON.stringify(data)}`);
  return data;
}

/** Verify a webhook really came from PayPal. */
export async function verifyWebhook(headers: Headers, event: unknown): Promise<boolean> {
  const res = await fetch(`${BASE}/v1/notifications/verify-webhook-signature`, {
    method: "POST",
    headers: { Authorization: `Bearer ${await accessToken()}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      auth_algo: headers.get("paypal-auth-algo"),
      cert_url: headers.get("paypal-cert-url"),
      transmission_id: headers.get("paypal-transmission-id"),
      transmission_sig: headers.get("paypal-transmission-sig"),
      transmission_time: headers.get("paypal-transmission-time"),
      webhook_id: process.env.PAYPAL_WEBHOOK_ID,
      webhook_event: event,
    }),
  });
  return res.ok && (await res.json()).verification_status === "SUCCESS";
}
