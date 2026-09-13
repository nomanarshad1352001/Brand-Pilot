import { NextRequest, NextResponse } from "next/server";
import type { Email } from "@/db/schema";
import { demoId, getDemoStore } from "@/lib/demo-store";

export async function POST(request: NextRequest) {
  const data = await request.json();
  const now = new Date();
  const email: Email = { id: demoId("email"), vendorId: data.vendorId, gmailMessageId: demoId("gmail-demo"), gmailThreadId: demoId("thread-demo"), direction: "sent", fromEmail: "alex@northpeakcommerce.com", toEmail: data.toEmail, subject: data.subject, body: data.body, htmlBody: null, isRead: true, templateId: data.templateId || null, sentAt: now, createdAt: now };
  const store = getDemoStore();
  store.emails.unshift(email);
  store.activities.unshift({ id: demoId("activity"), vendorId: data.vendorId, type: "email_sent", subject: `Email sent: ${data.subject}`, content: data.body?.slice(0, 500) || null, metadata: null, createdAt: now });
  const vendor = store.vendors.find((item) => item.id === data.vendorId);
  if (vendor) vendor.lastContactDate = now;
  return NextResponse.json(email, { status: 201 });
}
