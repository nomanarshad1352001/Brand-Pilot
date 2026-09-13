import { NextRequest, NextResponse } from "next/server";
import { getDemoStore } from "@/lib/demo-store";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const template = getDemoStore().templates.find((item) => item.id === id);
  return template ? NextResponse.json(template) : NextResponse.json({ error: "Template not found" }, { status: 404 });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await request.json();
  const template = getDemoStore().templates.find((item) => item.id === id);
  if (!template) return NextResponse.json({ error: "Template not found" }, { status: 404 });
  Object.assign(template, data, { updatedAt: new Date() });
  return NextResponse.json(template);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const store = getDemoStore();
  store.templates = store.templates.filter((item) => item.id !== id);
  return NextResponse.json({ success: true });
}
