"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EmailTemplate } from "@/db/schema";
import { MoreVertical, Edit2, Trash2, Copy } from "lucide-react";

interface TemplateActionsProps {
  template: EmailTemplate;
}

export default function TemplateActions({ template }: TemplateActionsProps) {
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this template?")) return;

    try {
      await fetch(`/api/templates/${template.id}`, {
        method: "DELETE",
      });
      router.refresh();
    } catch (error) {
      console.error("Failed to delete template:", error);
    }
    setShowMenu(false);
  };

  const handleDuplicate = async () => {
    try {
      await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${template.name} (Copy)`,
          subject: template.subject,
          body: template.body,
          category: template.category,
        }),
      });
      router.refresh();
    } catch (error) {
      console.error("Failed to duplicate template:", error);
    }
    setShowMenu(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {showMenu && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
          <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-slate-200 z-20 py-1">
            <button
              onClick={handleDuplicate}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
            >
              <Copy className="w-4 h-4" />
              Duplicate
            </button>
            <hr className="my-1 border-slate-100" />
            <button
              onClick={handleDelete}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}
