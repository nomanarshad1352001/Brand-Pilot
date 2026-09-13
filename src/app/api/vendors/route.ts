import { NextRequest, NextResponse } from "next/server";
import type { Vendor } from "@/db/schema";
import { demoId, getDemoStore } from "@/lib/demo-store";

export async function GET(request: NextRequest) {
  const status = request.nextUrl.searchParams.get("status");
  const type = request.nextUrl.searchParams.get("type");
  const search = request.nextUrl.searchParams.get("search")?.toLowerCase();
  const vendors = getDemoStore().vendors
    .filter((vendor) => !status || status === "all" || vendor.status === status)
    .filter((vendor) => !type || type === "all" || vendor.type === type)
    .filter((vendor) => !search || [vendor.name, vendor.email, vendor.contactName].some((value) => value?.toLowerCase().includes(search)))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  return NextResponse.json(vendors);
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  const now = new Date();
  const vendor: Vendor = {
    id: demoId("vendor"),
    name: data.name,
    type: data.type || "brand",
    status: data.status || "prospect",
    website: data.website || null,
    email: data.email || null,
    phone: data.phone || null,
    address: data.address || null,
    city: data.city || null,
    state: data.state || null,
    country: data.country || null,
    contactName: data.contactName || null,
    contactEmail: data.contactEmail || null,
    contactPhone: data.contactPhone || null,
    contactTitle: data.contactTitle || null,
    notes: data.notes || null,
    amazonCategories: "[]",
    estimatedRevenue: null,
    priority: data.priority || "medium",
    pipelineStage: 0,
    hasPricingSheet: false,
    hasApplication: false,
    applicationDate: null,
    approvalDate: null,
    lastContactDate: null,
    nextFollowUpDate: null,
    createdAt: now,
    updatedAt: now,
  };
  const store = getDemoStore();
  store.vendors.unshift(vendor);
  store.activities.unshift({ id: demoId("activity"), vendorId: vendor.id, type: "note", subject: "Vendor created", content: `${vendor.name} was added to the demo workspace.`, metadata: null, createdAt: now });
  return NextResponse.json(vendor, { status: 201 });
}
