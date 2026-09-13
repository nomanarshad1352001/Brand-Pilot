import { NextRequest, NextResponse } from "next/server";
import type { Activity } from "@/db/schema";
import { demoId, getDemoStore } from "@/lib/demo-store";

export async function GET(request: NextRequest) {
  const vendorId = request.nextUrl.searchParams.get("vendorId");
  const limit = Number(request.nextUrl.searchParams.get("limit") || 50);
  const store = getDemoStore();
  const activities = store.activities
    .filter((activity) => !vendorId || activity.vendorId === vendorId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit)
    .map((activity) => ({ activity, vendorName: store.vendors.find((vendor) => vendor.id === activity.vendorId)?.name ?? null }));
  return NextResponse.json(activities);
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  const activity: Activity = { id: demoId("activity"), vendorId: data.vendorId, type: data.type || "note", subject: data.subject || "Note added", content: data.content || null, metadata: data.metadata || null, createdAt: new Date() };
  const store = getDemoStore();
  store.activities.unshift(activity);
  const vendor = store.vendors.find((item) => item.id === data.vendorId);
  if (vendor && ["email_sent", "call_made", "meeting"].includes(activity.type)) vendor.lastContactDate = new Date();
  return NextResponse.json(activity, { status: 201 });
}
