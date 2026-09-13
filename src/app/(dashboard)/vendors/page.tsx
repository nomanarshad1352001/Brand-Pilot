import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Link from "next/link";
import { Building2, Globe, Mail, Phone } from "lucide-react";
import { format } from "date-fns";
import { getDemoStore } from "@/lib/demo-store";
import VendorFilters from "./VendorFilters";
import AddVendorButton from "./AddVendorButton";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ status?: string; type?: string; search?: string }>;
}

function getVendors(filters: { status?: string; type?: string; search?: string }) {
  const query = filters.search?.trim().toLowerCase();
  return [...getDemoStore().vendors]
    .filter((vendor) => !filters.status || filters.status === "all" || vendor.status === filters.status)
    .filter((vendor) => !filters.type || filters.type === "all" || vendor.type === filters.type)
    .filter((vendor) => !query || [vendor.name, vendor.contactName, vendor.email, vendor.contactEmail]
      .some((value) => value?.toLowerCase().includes(query)))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

function getStatusColor(status: string) {
  const colors: Record<string, "default" | "info" | "warning" | "success" | "danger" | "purple"> = {
    prospect: "default",
    contacted: "info",
    negotiating: "purple",
    application_sent: "warning",
    approved: "success",
    rejected: "danger",
    on_hold: "default",
  };
  return colors[status] || "default";
}

function getTypeColor(type: string) {
  const colors: Record<string, "default" | "info" | "warning" | "success" | "danger" | "purple"> = {
    manufacturer: "purple",
    distributor: "info",
    brand: "default",
  };
  return colors[type] || "default";
}

export default async function VendorsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const vendorList = await getVendors(params);

  return (
    <>
      <Header
        title="Vendors"
        subtitle={`${vendorList.length} vendors in your database`}
      />

      <div className="p-6 space-y-6">
        {/* Filters and Actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <VendorFilters />
          <AddVendorButton />
        </div>

        {/* Vendors Grid */}
        {vendorList.length === 0 ? (
          <Card className="text-center py-12">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No vendors found</h3>
            <p className="text-sm text-slate-500 mb-4">
              Get started by adding your first vendor to the database.
            </p>
            <AddVendorButton />
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vendorList.map((vendor) => (
              <Link key={vendor.id} href={`/vendors/${vendor.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-slate-900 line-clamp-1">{vendor.name}</h3>
                        <Badge variant={getTypeColor(vendor.type)} size="sm">
                          {vendor.type}
                        </Badge>
                      </div>
                    </div>
                    <Badge variant={getStatusColor(vendor.status)}>
                      {vendor.status.replace("_", " ")}
                    </Badge>
                  </div>

                  {vendor.contactName && (
                    <p className="text-sm text-slate-600 mb-2">
                      Contact: {vendor.contactName}
                      {vendor.contactTitle && ` (${vendor.contactTitle})`}
                    </p>
                  )}

                  <div className="space-y-1.5 text-sm text-slate-500">
                    {vendor.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span className="truncate">{vendor.email}</span>
                      </div>
                    )}
                    {vendor.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{vendor.phone}</span>
                      </div>
                    )}
                    {vendor.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        <span className="truncate">{vendor.website}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span>Added {format(new Date(vendor.createdAt), "MMM d, yyyy")}</span>
                    {vendor.lastContactDate && (
                      <span>Last contact: {format(new Date(vendor.lastContactDate), "MMM d")}</span>
                    )}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
