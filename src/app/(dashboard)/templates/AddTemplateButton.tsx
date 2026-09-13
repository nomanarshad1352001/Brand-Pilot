"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import { Plus } from "lucide-react";

export default function AddTemplateButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      subject: formData.get("subject") as string,
      body: formData.get("body") as string,
      category: formData.get("category") as string,
    };

    try {
      const response = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsOpen(false);
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to create template:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <Plus className="w-4 h-4 mr-1.5" />
        Add Template
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Create Email Template" size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Template Name"
            name="name"
            required
            placeholder="e.g., Initial Outreach"
          />

          <Select
            label="Category"
            name="category"
            options={[
              { value: "", label: "Select a category..." },
              { value: "initial_outreach", label: "Initial Outreach" },
              { value: "follow_up", label: "Follow-up" },
              { value: "application", label: "Application" },
              { value: "thank_you", label: "Thank You" },
              { value: "pricing", label: "Pricing Request" },
            ]}
          />

          <Input
            label="Subject Line"
            name="subject"
            required
            placeholder="e.g., Partnership Inquiry - {{vendor_name}}"
          />

          <div>
            <Textarea
              label="Email Body"
              name="body"
              required
              rows={10}
              placeholder="Write your template here. Use {{vendor_name}} and {{contact_name}} for personalization."
            />
            <p className="mt-1 text-xs text-slate-500">
              Available variables: {"{{vendor_name}}"}, {"{{contact_name}}"}
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              Create Template
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
