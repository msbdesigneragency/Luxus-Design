import { NextResponse } from "next/server";
import { quoteSchema } from "@/lib/quote";
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      if (
        new URL(origin).host !==
        (request.headers.get("host") || new URL(request.url).host)
      )
        return NextResponse.json({ code: "FORBIDDEN" }, { status: 403 });
    } catch {
      return NextResponse.json({ code: "FORBIDDEN" }, { status: 403 });
    }
  }
  if (Number(request.headers.get("content-length") || 0) > 20000)
    return NextResponse.json({ code: "TOO_LARGE" }, { status: 413 });
  let body;
  try {
    const raw = await request.text();
    if (raw.length > 20000)
      return NextResponse.json({ code: "TOO_LARGE" }, { status: 413 });
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ code: "INVALID" }, { status: 400 });
  }
  const result = quoteSchema.safeParse(body);
  if (!result.success)
    return NextResponse.json(
      { code: "INVALID", fields: result.error.flatten().fieldErrors },
      { status: 400 },
    );
  if (!process.env.QUOTE_WEBHOOK_URL)
    return NextResponse.json({ code: "NOT_CONFIGURED" }, { status: 503 });
  try {
    const response = await fetch(process.env.QUOTE_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.QUOTE_WEBHOOK_TOKEN
          ? { Authorization: `Bearer ${process.env.QUOTE_WEBHOOK_TOKEN}` }
          : {}),
      },
      body: JSON.stringify(result.data),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error("Delivery failed");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ code: "DELIVERY_FAILED" }, { status: 502 });
  }
}
