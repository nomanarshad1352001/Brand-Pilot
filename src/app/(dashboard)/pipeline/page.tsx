import Header from "@/components/layout/Header";
import { getDemoStore } from "@/lib/demo-store";
import PipelineBoard from "./PipelineBoard";

export const dynamic = "force-dynamic";

export default function PipelinePage() {
  const allVendors = [...getDemoStore().vendors].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  const columns = {
    prospect: allVendors.filter((vendor) => vendor.status === "prospect"),
    contacted: allVendors.filter((vendor) => vendor.status === "contacted"),
    negotiating: allVendors.filter((vendor) => vendor.status === "negotiating"),
    application_sent: allVendors.filter((vendor) => vendor.status === "application_sent"),
    approved: allVendors.filter((vendor) => vendor.status === "approved"),
    rejected: allVendors.filter((vendor) => vendor.status === "rejected"),
    on_hold: allVendors.filter((vendor) => vendor.status === "on_hold"),
  };

  return (
    <>
      <Header title="Pipeline" subtitle="Drag vendors between stages to simulate your acquisition workflow." />
      <div className="p-6">
        <PipelineBoard initialColumns={columns} />
      </div>
    </>
  );
}
