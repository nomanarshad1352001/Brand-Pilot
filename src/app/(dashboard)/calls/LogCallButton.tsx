"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import { Phone } from "lucide-react";
import { Vendor } from "@/db/schema";

export default function LogCallButton() {
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
    const durationMinutes = parseInt(formData.get("durationMinutes") as string) || 0;
    const durationSeconds = parseInt(formData.get("durationSeconds") as string) || 0;

    const data = {
      vendorId: formData.get("vendorId") as string,
      direction: formData.get("direction") as string,
      status: formData.get("status") as string,
      duration: durationMinutes * 60 + durationSeconds,
      notes: formData.get("notes") as string,
    };

    try {
      const response = await fetch("/api/calls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsOpen(false);
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to log call:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <Phone className="w-4 h-4 mr-1.5" />
        Log Call
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Log Call" size="md">
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

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Direction"
              name="direction"
              options={[
                { value: "outbound", label: "Outgoing Call" },
                { value: "inbound", label: "Incoming Call" },
              ]}
            />

            <Select
              label="Status"
              name="status"
              options={[
                { value: "completed", label: "Completed" },
                { value: "no_answer", label: "No Answer" },
                { value: "busy", label: "Busy" },
                { value: "voicemail", label: "Left Voicemail" },
                { value: "failed", label: "Failed" },
              ]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Duration</label>
            <div className="flex items-center gap-2">
              <Input
                name="durationMinutes"
                type="number"
                min="0"
                placeholder="0"
                className="w-20"
              />
              <span className="text-slate-500">min</span>
              <Input
                name="durationSeconds"
                type="number"
                min="0"
                max="59"
                placeholder="0"
                className="w-20"
              />
              <span className="text-slate-500">sec</span>
            </div>
          </div>

          <Textarea
            label="Notes"
            name="notes"
            rows={4}
            placeholder="Add any notes from the call..."
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              Log Call
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
