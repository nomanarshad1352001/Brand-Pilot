"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Activity } from "@/db/schema";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import { format } from "date-fns";
import {
  Mail,
  Phone,
  FileText,
  MessageSquare,
  Calendar,
  TrendingUp,
  Clock,
  Plus,
} from "lucide-react";

interface ActivityTimelineProps {
  activities: Activity[];
  vendorId: string;
}

function getActivityIcon(type: string) {
  switch (type) {
    case "email_sent":
    case "email_received":
      return <Mail className="w-4 h-4" />;
    case "call_made":
    case "call_received":
      return <Phone className="w-4 h-4" />;
    case "application_submitted":
      return <FileText className="w-4 h-4" />;
    case "status_change":
      return <TrendingUp className="w-4 h-4" />;
    case "meeting":
      return <Calendar className="w-4 h-4" />;
    case "follow_up_scheduled":
      return <Clock className="w-4 h-4" />;
    default:
      return <MessageSquare className="w-4 h-4" />;
  }
}

function getActivityColor(type: string) {
  switch (type) {
    case "email_sent":
    case "email_received":
      return "bg-blue-100 text-blue-600";
    case "call_made":
    case "call_received":
      return "bg-green-100 text-green-600";
    case "application_submitted":
      return "bg-purple-100 text-purple-600";
    case "status_change":
      return "bg-amber-100 text-amber-600";
    case "meeting":
      return "bg-indigo-100 text-indigo-600";
    default:
      return "bg-slate-100 text-slate-600";
  }
}

export default function ActivityTimeline({ activities, vendorId }: ActivityTimelineProps) {
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAddNote = async () => {
    if (!noteContent.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vendorId,
          type: "note",
          subject: "Note added",
          content: noteContent,
        }),
      });

      if (response.ok) {
        setNoteContent("");
        setIsAddingNote(false);
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to add note:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Add Note */}
      <div className="mb-6">
        {isAddingNote ? (
          <div className="space-y-3">
            <Textarea
              placeholder="Add a note..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              rows={3}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAddNote} isLoading={isLoading}>
                Add Note
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setIsAddingNote(false);
                  setNoteContent("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="outline" size="sm" onClick={() => setIsAddingNote(true)}>
            <Plus className="w-4 h-4 mr-1.5" />
            Add Note
          </Button>
        )}
      </div>

      {/* Timeline */}
      {activities.length === 0 ? (
        <p className="text-sm text-slate-500 py-8 text-center">No activities recorded yet</p>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-200" />

          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="relative flex gap-4 pl-10">
                {/* Icon */}
                <div
                  className={`absolute left-0 p-2 rounded-full ${getActivityColor(activity.type)}`}
                >
                  {getActivityIcon(activity.type)}
                </div>

                {/* Content */}
                <div className="flex-1 bg-slate-50 rounded-lg p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-slate-900">
                        {activity.subject || activity.type.replace(/_/g, " ")}
                      </p>
                      {activity.content && (
                        <p className="text-sm text-slate-600 mt-1 whitespace-pre-wrap">
                          {activity.content}
                        </p>
                      )}
                    </div>
                    <time className="text-xs text-slate-400 whitespace-nowrap">
                      {format(new Date(activity.createdAt), "MMM d, h:mm a")}
                    </time>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
