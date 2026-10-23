import fs from "fs";
import path from "path";

// In-memory + persistent file ledger for the hackathon demo.
export type OrderRecord = {
  id: string;
  status: "PENDING_APPROVAL" | "APPROVED" | "PAID" | "FAILED";
  total: number;
  items: { name: string; qty: number; unit: number; url?: string }[];
  approveUrl?: string;
  createdAt: string;
};

const DATA_FILE = path.join(process.cwd(), ".data", "orders.json");

function loadOrders(): Map<string, OrderRecord> {
  const map = new Map<string, OrderRecord>();
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
      if (Array.isArray(data)) {
        for (const item of data) {
          map.set(item.id, item);
        }
      }
    }
  } catch (err) {
    console.error("Failed to load orders from disk:", err);
  }
  return map;
}

const g = globalThis as unknown as { __orders?: Map<string, OrderRecord> };
export const orders = (g.__orders ??= loadOrders());

export function persistOrder(rec: OrderRecord) {
  orders.set(rec.id, rec);
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify([...orders.values()], null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to persist order:", err);
  }
}
