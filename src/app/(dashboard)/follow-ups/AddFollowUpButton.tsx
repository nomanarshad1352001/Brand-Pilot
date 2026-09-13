"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import { Plus } from "lucide-react";
import { Vendor } from "@/db/schema";

export default function AddFollowUpButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      fetch("/api/vendors")
        .then((res) => res.json())
        .then(setVendors)
        .catch(console.error);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      vendorId: formData.get("vendorId") as string,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      dueDate: formData.get("dueDate") as string,
      priority: formData.get("priority") as string,
    };

    try {
      const response = await fetch("/api/follow-ups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsOpen(false);
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to create follow-up:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Default to tomorrow at 9am
  const defaultDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);
    return tomorrow.toISOString().slice(0, 16);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <Plus className="w-4 h-4 mr-1.5" />
        Add Follow-up
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Schedule Follow-up" size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Vendor"
            name="vendorId"
            required
            options={[
              { value: "", label: "Select a vendor..." },
              ...vendors.map((v) => ({ value: v.id, label: v.name })),
            ]}
          />

          <Input
            label="Title"
            name="title"
            required
            placeholder="e.g., Follow up on pricing sheet"
          />

          <Textarea
            label="Description"
            name="description"
            rows={3}
            placeholder="Add any notes or context..."
          />

          <Input
            label="Due Date & Time"
            name="dueDate"
            type="datetime-local"
            required
            defaultValue={defaultDate()}
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

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              Schedule Follow-up
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
