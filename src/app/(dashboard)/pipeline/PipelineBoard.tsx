"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Vendor } from "@/db/schema";
import Badge from "@/components/ui/Badge";
import { Building2, GripVertical } from "lucide-react";
import Link from "next/link";

interface PipelineColumns {
  prospect: Vendor[];
  contacted: Vendor[];
  negotiating: Vendor[];
  application_sent: Vendor[];
  approved: Vendor[];
  rejected: Vendor[];
  on_hold: Vendor[];
}

interface PipelineBoardProps {
  initialColumns: PipelineColumns;
}

const columnConfig = [
  { id: "prospect", label: "Prospect", color: "bg-slate-500" },
  { id: "contacted", label: "Contacted", color: "bg-blue-500" },
  { id: "negotiating", label: "Negotiating", color: "bg-purple-500" },
  { id: "application_sent", label: "Application Sent", color: "bg-amber-500" },
  { id: "approved", label: "Approved", color: "bg-green-500" },
  { id: "rejected", label: "Rejected", color: "bg-red-500" },
  { id: "on_hold", label: "On Hold", color: "bg-gray-400" },
];

export default function PipelineBoard({ initialColumns }: PipelineBoardProps) {
  const [columns, setColumns] = useState<PipelineColumns>(initialColumns);
  const [draggedVendor, setDraggedVendor] = useState<Vendor | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const router = useRouter();

  const handleDragStart = (vendor: Vendor) => {
    setDraggedVendor(vendor);
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setDragOverColumn(columnId);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = async (e: React.DragEvent, targetColumn: string) => {
    e.preventDefault();
    setDragOverColumn(null);

    if (!draggedVendor || draggedVendor.status === targetColumn) {
      setDraggedVendor(null);
      return;
    }

    const sourceColumn = draggedVendor.status;

    // Optimistically update the UI
    setColumns((prev) => {
      const newColumns = { ...prev };
      newColumns[sourceColumn as keyof PipelineColumns] = prev[sourceColumn as keyof PipelineColumns].filter(
        (v) => v.id !== draggedVendor.id
      );
      newColumns[targetColumn as keyof PipelineColumns] = [
        { ...draggedVendor, status: targetColumn as Vendor["status"] },
        ...prev[targetColumn as keyof PipelineColumns],
      ];
      return newColumns;
    });

    // Update the vendor status in the database
    try {
      await fetch(`/api/vendors/${draggedVendor.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: targetColumn }),
      });
      router.refresh();
    } catch (error) {
      console.error("Failed to update vendor status:", error);
      // Revert on error
      setColumns(initialColumns);
    }

    setDraggedVendor(null);
  };

  const handleDragEnd = () => {
    setDraggedVendor(null);
    setDragOverColumn(null);
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columnConfig.map((column) => {
        const vendorsInColumn = columns[column.id as keyof PipelineColumns];
        const isOver = dragOverColumn === column.id;

        return (
          <div
            key={column.id}
            className={`flex-shrink-0 w-72 bg-slate-100 rounded-xl p-3 transition-colors ${
              isOver ? "bg-slate-200 ring-2 ring-primary-500" : ""
            }`}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${column.color}`} />
                <h3 className="font-medium text-slate-700">{column.label}</h3>
              </div>
              <span className="text-sm text-slate-500 bg-white px-2 py-0.5 rounded-full">
                {vendorsInColumn.length}
              </span>
            </div>

            {/* Cards */}
            <div className="space-y-2 min-h-[400px]">
              {vendorsInColumn.map((vendor) => (
                <div
                  key={vendor.id}
                  draggable
                  onDragStart={() => handleDragStart(vendor)}
                  onDragEnd={handleDragEnd}
                  className={`bg-white rounded-lg p-3 shadow-sm border border-slate-200 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow ${
                    draggedVendor?.id === vendor.id ? "opacity-50" : ""
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <GripVertical className="w-4 h-4 text-slate-300 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/vendors/${vendor.id}`}
                        className="font-medium text-slate-900 hover:text-primary-600 line-clamp-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {vendor.name}
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant={
                            vendor.type === "manufacturer"
                              ? "purple"
                              : vendor.type === "distributor"
                              ? "info"
                              : "default"
                          }
                          size="sm"
                        >
                          {vendor.type}
                        </Badge>
                        {vendor.priority === "high" && (
                          <Badge variant="warning" size="sm">
                            High
                          </Badge>
                        )}
                        {vendor.priority === "urgent" && (
                          <Badge variant="danger" size="sm">
                            Urgent
                          </Badge>
                        )}
                      </div>
                      {vendor.contactName && (
                        <p className="text-xs text-slate-500 mt-2 truncate">
                          {vendor.contactName}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {vendorsInColumn.length === 0 && (
                <div className="flex items-center justify-center h-32 text-sm text-slate-400 border-2 border-dashed border-slate-200 rounded-lg">
                  Drop vendors here
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
