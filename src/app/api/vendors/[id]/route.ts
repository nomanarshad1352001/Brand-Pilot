import { NextRequest, NextResponse } from "next/server";
import { demoId, getDemoStore } from "@/lib/demo-store";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vendor = getDemoStore().vendors.find((item) => item.id === id);
  return vendor ? NextResponse.json(vendor) : NextResponse.json({ error: "Vendor not found" }, { status: 404 });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await request.json();
  const store = getDemoStore();
  const vendor = store.vendors.find((item) => item.id === id);
  if (!vendor) return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
  const previousStatus = vendor.status;
  Object.assign(vendor, data, { updatedAt: new Date() });
  if (data.status && data.status !== previousStatus) {
    store.activities.unshift({ id: demoId("activity"), vendorId: id, type: "status_change", subject: `Status changed to ${data.status}`, content: `Moved from ${previousStatus} to ${data.status}.`, metadata: null, createdAt: new Date() });
  }
  return NextResponse.json(vendor);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const store = getDemoStore();
  store.vendors = store.vendors.filter((item) => item.id !== id);
  store.activities = store.activities.filter((item) => item.vendorId !== id);
  store.followUps = store.followUps.filter((item) => item.vendorId !== id);
  store.emails = store.emails.filter((item) => item.vendorId !== id);
  store.calls = store.calls.filter((item) => item.vendorId !== id);
  return NextResponse.json({ success: true });
}
