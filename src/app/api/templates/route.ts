import { NextRequest, NextResponse } from "next/server";
import type { EmailTemplate } from "@/db/schema";
import { demoId, getDemoStore } from "@/lib/demo-store";

export async function GET() {
  const templates = getDemoStore().templates.filter((template) => template.isActive).sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0));
  return NextResponse.json(templates);
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  const now = new Date();
  const template: EmailTemplate = { id: demoId("template"), name: data.name, subject: data.subject, body: data.body, category: data.category || null, isActive: true, usageCount: 0, createdAt: now, updatedAt: now };
  getDemoStore().templates.unshift(template);
  return NextResponse.json(template, { status: 201 });
}
