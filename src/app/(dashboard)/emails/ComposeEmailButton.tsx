"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import { Send, FileText } from "lucide-react";
import { Vendor, EmailTemplate } from "@/db/schema";

export default function ComposeEmailButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      Promise.all([
        fetch("/api/vendors").then((res) => res.json()),
        fetch("/api/templates").then((res) => res.json()),
      ])
        .then(([vendorsData, templatesData]) => {
          setVendors(vendorsData);
          setTemplates(templatesData);
        })
        .catch(console.error);
    }
  }, [isOpen]);

  const handleVendorChange = (vendorId: string) => {
    const vendor = vendors.find((v) => v.id === vendorId);
    setSelectedVendor(vendor || null);
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      let processedSubject = template.subject;
      let processedBody = template.body;

      // Replace placeholders
      if (selectedVendor) {
        processedSubject = processedSubject.replace(/{{vendor_name}}/g, selectedVendor.name);
        processedSubject = processedSubject.replace(/{{contact_name}}/g, selectedVendor.contactName || "");
        processedBody = processedBody.replace(/{{vendor_name}}/g, selectedVendor.name);
        processedBody = processedBody.replace(/{{contact_name}}/g, selectedVendor.contactName || "");
      }

      setSubject(processedSubject);
      setBody(processedBody);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedVendor) return;

    setIsLoading(true);

    const data = {
      vendorId: selectedVendor.id,
      toEmail: selectedVendor.contactEmail || selectedVendor.email,
      subject,
      body,
    };

    try {
      const response = await fetch("/api/emails/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsOpen(false);
        setSubject("");
        setBody("");
        setSelectedVendor(null);
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to send email:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <Send className="w-4 h-4 mr-1.5" />
        Compose Email
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Compose Email" size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Vendor"
            required
            value={selectedVendor?.id || ""}
            onChange={(e) => handleVendorChange(e.target.value)}
            options={[
              { value: "", label: "Select a vendor..." },
              ...vendors.map((v) => ({ value: v.id, label: v.name })),
            ]}
          />

          {selectedVendor && (
            <div className="p-3 bg-slate-50 rounded-lg text-sm">
              <p className="text-slate-600">
                To: <span className="font-medium text-slate-900">
                  {selectedVendor.contactEmail || selectedVendor.email || "No email on file"}
                </span>
              </p>
              {selectedVendor.contactName && (
                <p className="text-slate-500">Contact: {selectedVendor.contactName}</p>
              )}
            </div>
          )}

          {templates.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Use Template
              </label>
              <div className="flex flex-wrap gap-2">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => handleTemplateSelect(template.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    {template.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <Input
            label="Subject"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Email subject..."
          />

          <Textarea
            label="Message"
            required
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={10}
            placeholder="Write your message..."
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
              disabled={!selectedVendor || !subject || !body}
            >
              <Send className="w-4 h-4 mr-1.5" />
              Send Email
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
