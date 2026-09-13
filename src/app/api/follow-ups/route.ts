import { NextRequest, NextResponse } from "next/server";
import type { FollowUp } from "@/db/schema";
import { demoId, getDemoStore } from "@/lib/demo-store";

export async function GET(request: NextRequest) {
  const vendorId = request.nextUrl.searchParams.get("vendorId");
  const store = getDemoStore();
  const items = store.followUps
    .filter((followUp) => !vendorId || followUp.vendorId === vendorId)
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
    .map((followUp) => ({ followUp, vendorName: store.vendors.find((vendor) => vendor.id === followUp.vendorId)?.name ?? null }));
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  const now = new Date();
  const followUp: FollowUp = { id: demoId("follow"), vendorId: data.vendorId, title: data.title, description: data.description || null, dueDate: new Date(data.dueDate), status: "pending", priority: data.priority || "medium", reminderSent: false, calendarEventId: null, completedAt: null, createdAt: now, updatedAt: now };
  const store = getDemoStore();
  store.followUps.push(followUp);
  store.activities.unshift({ id: demoId("activity"), vendorId: data.vendorId, type: "follow_up_scheduled", subject: `Follow-up scheduled: ${data.title}`, content: data.description || null, metadata: null, createdAt: now });
  const vendor = store.vendors.find((item) => item.id === data.vendorId);
  if (vendor) vendor.nextFollowUpDate = followUp.dueDate;
  return NextResponse.json(followUp, { status: 201 });
}
