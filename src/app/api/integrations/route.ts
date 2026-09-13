import { NextRequest, NextResponse } from "next/server";
import { getDemoStore } from "@/lib/demo-store";

export async function POST(request: NextRequest) {
  const { provider, action } = await request.json();
  const store = getDemoStore();
  let integration = store.integrations.find((item) => item.provider === provider);
  if (!integration) {
    integration = { provider, isEnabled: false };
    store.integrations.push(integration);
  }
  integration.isEnabled = action === "connect";
  return NextResponse.json({ success: true, connected: integration.isEnabled, demo: true });
}
