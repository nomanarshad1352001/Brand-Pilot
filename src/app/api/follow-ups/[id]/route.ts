import { NextRequest, NextResponse } from "next/server";
import { demoId, getDemoStore } from "@/lib/demo-store";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const followUp = getDemoStore().followUps.find((item) => item.id === id);
  return followUp ? NextResponse.json(followUp) : NextResponse.json({ error: "Follow-up not found" }, { status: 404 });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await request.json();
  const store = getDemoStore();
  const followUp = store.followUps.find((item) => item.id === id);
  if (!followUp) return NextResponse.json({ error: "Follow-up not found" }, { status: 404 });
  Object.assign(followUp, data, {
    dueDate: data.dueDate ? new Date(data.dueDate) : followUp.dueDate,
    completedAt: data.status === "completed" ? new Date() : followUp.completedAt,
    updatedAt: new Date(),
  });
  if (data.status) {
    store.activities.unshift({ id: demoId("activity"), vendorId: followUp.vendorId, type: "note", subject: `Follow-up ${data.status}`, content: `${followUp.title} was marked ${data.status}.`, metadata: null, createdAt: new Date() });
  }
  return NextResponse.json(followUp);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const store = getDemoStore();
  store.followUps = store.followUps.filter((item) => item.id !== id);
  return NextResponse.json({ success: true });
}
