"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import { Plus } from "lucide-react";

export default function AddVendorButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      type: formData.get("type") as string,
      status: formData.get("status") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      website: formData.get("website") as string,
      contactName: formData.get("contactName") as string,
      contactEmail: formData.get("contactEmail") as string,
      contactPhone: formData.get("contactPhone") as string,
      contactTitle: formData.get("contactTitle") as string,
      notes: formData.get("notes") as string,
      priority: formData.get("priority") as string,
    };

    try {
      const response = await fetch("/api/vendors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsOpen(false);
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to create vendor:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <Plus className="w-4 h-4 mr-1.5" />
        Add Vendor
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Add New Vendor" size="lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div>
            <h3 className="text-sm font-medium text-slate-700 mb-3">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Company Name"
                name="name"
                required
                placeholder="Enter company name"
              />
              <Select
                label="Type"
                name="type"
                options={[
                  { value: "brand", label: "Brand" },
                  { value: "manufacturer", label: "Manufacturer" },
                  { value: "distributor", label: "Distributor" },
                ]}
              />
              <Select
                label="Status"
                name="status"
                options={[
                  { value: "prospect", label: "Prospect" },
                  { value: "contacted", label: "Contacted" },
                  { value: "negotiating", label: "Negotiating" },
                  { value: "application_sent", label: "Application Sent" },
                  { value: "approved", label: "Approved" },
                  { value: "rejected", label: "Rejected" },
                  { value: "on_hold", label: "On Hold" },
                ]}
              />
              <Select
                label="Priority"
                name="priority"
                options={[
                  { value: "low", label: "Low" },
                  { value: "medium", label: "Medium" },
                  { value: "high", label: "High" },
                  { value: "urgent", label: "Urgent" },
                ]}
              />
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-medium text-slate-700 mb-3">Company Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Email" name="email" type="email" placeholder="company@example.com" />
              <Input label="Phone" name="phone" placeholder="+1 (555) 000-0000" />
              <Input label="Website" name="website" placeholder="https://example.com" className="md:col-span-2" />
            </div>
          </div>

          {/* Primary Contact */}
          <div>
            <h3 className="text-sm font-medium text-slate-700 mb-3">Primary Contact Person</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Contact Name" name="contactName" placeholder="John Smith" />
              <Input label="Title/Role" name="contactTitle" placeholder="Sales Manager" />
              <Input label="Contact Email" name="contactEmail" type="email" placeholder="john@example.com" />
              <Input label="Contact Phone" name="contactPhone" placeholder="+1 (555) 000-0000" />
            </div>
          </div>

          {/* Notes */}
          <div>
            <Textarea
              label="Notes"
              name="notes"
              rows={3}
              placeholder="Add any notes about this vendor..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              Create Vendor
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
