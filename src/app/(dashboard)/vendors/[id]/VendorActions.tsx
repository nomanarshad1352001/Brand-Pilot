"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import { Vendor } from "@/db/schema";
import { Edit2, Trash2, Mail, Phone, Calendar, MoreVertical } from "lucide-react";

interface VendorActionsProps {
  vendor: Vendor;
}

export default function VendorActions({ vendor }: VendorActionsProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
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
      const response = await fetch(`/api/vendors/${vendor.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsEditOpen(false);
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to update vendor:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/vendors/${vendor.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/vendors");
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to delete vendor:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => setIsEditOpen(true)}>
          <Edit2 className="w-4 h-4 mr-1.5" />
          Edit
        </Button>

        <div className="relative">
          <Button variant="ghost" size="sm" onClick={() => setShowMenu(!showMenu)}>
            <MoreVertical className="w-4 h-4" />
          </Button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-20 py-1">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    // Open email compose
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <Mail className="w-4 h-4" />
                  Send Email
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    // Open call
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <Phone className="w-4 h-4" />
                  Make Call
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    // Schedule follow-up
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <Calendar className="w-4 h-4" />
                  Schedule Follow-up
                </button>
                <hr className="my-1 border-slate-200" />
                <button
                  onClick={() => {
                    setShowMenu(false);
                    setIsDeleteOpen(true);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Vendor
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Vendor" size="lg">
        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Company Name"
              name="name"
              required
              defaultValue={vendor.name}
            />
            <Select
              label="Type"
              name="type"
              defaultValue={vendor.type}
              options={[
                { value: "brand", label: "Brand" },
                { value: "manufacturer", label: "Manufacturer" },
                { value: "distributor", label: "Distributor" },
              ]}
            />
            <Select
              label="Status"
              name="status"
              defaultValue={vendor.status}
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
              defaultValue={vendor.priority || "medium"}
              options={[
                { value: "low", label: "Low" },
                { value: "medium", label: "Medium" },
                { value: "high", label: "High" },
                { value: "urgent", label: "Urgent" },
              ]}
            />
            <Input label="Email" name="email" type="email" defaultValue={vendor.email || ""} />
            <Input label="Phone" name="phone" defaultValue={vendor.phone || ""} />
            <Input label="Website" name="website" defaultValue={vendor.website || ""} className="md:col-span-2" />
            <Input label="Contact Name" name="contactName" defaultValue={vendor.contactName || ""} />
            <Input label="Title/Role" name="contactTitle" defaultValue={vendor.contactTitle || ""} />
            <Input label="Contact Email" name="contactEmail" type="email" defaultValue={vendor.contactEmail || ""} />
            <Input label="Contact Phone" name="contactPhone" defaultValue={vendor.contactPhone || ""} />
          </div>
          <Textarea
            label="Notes"
            name="notes"
            rows={3}
            defaultValue={vendor.notes || ""}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Delete Vendor" size="sm">
        <p className="text-sm text-slate-600 mb-6">
          Are you sure you want to delete <strong>{vendor.name}</strong>? This action cannot be undone
          and will remove all associated activities, emails, and follow-ups.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} isLoading={isLoading}>
            Delete Vendor
          </Button>
        </div>
      </Modal>
    </>
  );
}
