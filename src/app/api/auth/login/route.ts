import { NextRequest, NextResponse } from "next/server";

const DEMO_EMAIL = "demo@brandpilot.app";
const DEMO_PASSWORD = "demo1234";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  if (email !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
    return NextResponse.json(
      { error: "Use the demo credentials shown below the form." },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set("brandpilot_demo_session", "active", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return response;
}
