"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FollowUp } from "@/db/schema";
import { CheckCircle, X, MoreVertical } from "lucide-react";

interface FollowUpActionsProps {
  followUp: FollowUp;
}

export default function FollowUpActions({ followUp }: FollowUpActionsProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const updateStatus = async (status: string) => {
    setIsLoading(true);
    try {
      await fetch(`/api/follow-ups/${followUp.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      router.refresh();
    } catch (error) {
      console.error("Failed to update follow-up:", error);
    } finally {
      setIsLoading(false);
      setShowMenu(false);
    }
  };

  const deleteFollowUp = async () => {
    if (!confirm("Are you sure you want to delete this follow-up?")) return;

    setIsLoading(true);
    try {
      await fetch(`/api/follow-ups/${followUp.id}`, {
        method: "DELETE",
      });
      router.refresh();
    } catch (error) {
      console.error("Failed to delete follow-up:", error);
    } finally {
      setIsLoading(false);
      setShowMenu(false);
    }
  };

  if (followUp.status === "completed") {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600"
        disabled={isLoading}
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {showMenu && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
          <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-slate-200 z-20 py-1">
            <button
              onClick={() => updateStatus("completed")}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-green-600 hover:bg-green-50"
            >
              <CheckCircle className="w-4 h-4" />
              Mark Complete
            </button>
            <button
              onClick={() => updateStatus("cancelled")}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
            <hr className="my-1 border-slate-100" />
            <button
              onClick={deleteFollowUp}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}
