"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

export default function VendorFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/vendors?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-3">
      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search vendors..."
          defaultValue={searchParams.get("search") || ""}
          onChange={(e) => updateFilters("search", e.target.value)}
          className="w-64 pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {/* Status Filter */}
      <select
        defaultValue={searchParams.get("status") || "all"}
        onChange={(e) => updateFilters("status", e.target.value)}
        className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <option value="all">All Statuses</option>
        <option value="prospect">Prospect</option>
        <option value="contacted">Contacted</option>
        <option value="negotiating">Negotiating</option>
        <option value="application_sent">Application Sent</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
        <option value="on_hold">On Hold</option>
      </select>

      {/* Type Filter */}
      <select
        defaultValue={searchParams.get("type") || "all"}
        onChange={(e) => updateFilters("type", e.target.value)}
        className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <option value="all">All Types</option>
        <option value="manufacturer">Manufacturer</option>
        <option value="distributor">Distributor</option>
        <option value="brand">Brand</option>
      </select>
    </div>
  );
}
