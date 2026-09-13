import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    app: "BrandPilot",
    dataMode: "dummy",
    databaseRequired: false,
    timestamp: new Date().toISOString(),
  });
}
