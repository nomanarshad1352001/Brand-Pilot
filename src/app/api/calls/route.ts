import { NextRequest, NextResponse } from "next/server";
import type { CallLog } from "@/db/schema";
import { demoId, getDemoStore } from "@/lib/demo-store";

export async function GET(request: NextRequest) {
  const vendorId = request.nextUrl.searchParams.get("vendorId");
  const store = getDemoStore();
  const calls = store.calls
    .filter((call) => !vendorId || call.vendorId === vendorId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .map((call) => ({ call, vendorName: store.vendors.find((vendor) => vendor.id === call.vendorId)?.name ?? null }));
  return NextResponse.json(calls);
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  const now = new Date();
  const call: CallLog = { id: demoId("call"), vendorId: data.vendorId, twilioCallSid: demoId("twilio-demo"), fromNumber: data.fromNumber || "+1 (737) 555-0100", toNumber: data.toNumber || null, direction: data.direction || "outbound", status: data.status || "completed", duration: data.duration || 0, recordingUrl: null, notes: data.notes || null, createdAt: now };
  const store = getDemoStore();
  store.calls.unshift(call);
  store.activities.unshift({ id: demoId("activity"), vendorId: data.vendorId, type: data.direction === "inbound" ? "call_received" : "call_made", subject: data.direction === "inbound" ? "Incoming call" : "Outgoing call", content: data.notes || null, metadata: JSON.stringify({ duration: call.duration }), createdAt: now });
  const vendor = store.vendors.find((item) => item.id === data.vendorId);
  if (vendor) vendor.lastContactDate = now;
  return NextResponse.json(call, { status: 201 });
}
