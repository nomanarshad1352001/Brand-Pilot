import Header from "@/components/layout/Header";
import { getDemoStore } from "@/lib/demo-store";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Link from "next/link";
import { Mail, Send, Inbox, Clock } from "lucide-react";
import { format } from "date-fns";
import ComposeEmailButton from "./ComposeEmailButton";

export const dynamic = "force-dynamic";

function getEmails() {
  const store = getDemoStore();
  const allEmails = [...store.emails]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .map((email) => ({
      email,
      vendorName: store.vendors.find((vendor) => vendor.id === email.vendorId)?.name ?? null,
    }));
  const templates = [...store.templates]
    .filter((template) => template.isActive)
    .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0));

  return {
    sent: allEmails.filter((item) => item.email.direction === "sent"),
    received: allEmails.filter((item) => item.email.direction === "received"),
    templates,
  };
}

export default async function EmailsPage() {
  const { sent, received, templates } = await getEmails();

  return (
    <>
      <Header
        title="Emails"
        subtitle="Manage your email communications with vendors"
      />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-100">
                <Send className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Sent Emails</p>
                <p className="text-2xl font-bold text-slate-900">{sent.length}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-green-100">
                <Inbox className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Received</p>
                <p className="text-2xl font-bold text-slate-900">{received.length}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-purple-100">
                <Mail className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Templates</p>
                <p className="text-2xl font-bold text-slate-900">{templates.length}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <ComposeEmailButton />
          <Link
            href="/templates"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            Manage Templates
          </Link>
        </div>

        {/* Email Integration Notice */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-white">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Gmail Integration</h3>
              <p className="text-sm text-slate-600 mt-1">
                Connect your Gmail account to send emails directly from BrandPilot and automatically
                sync your communication history with vendors.
              </p>
              <Link
                href="/settings"
                className="inline-flex items-center mt-3 text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Configure Gmail Integration →
              </Link>
            </div>
          </div>
        </Card>

        {/* Email List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sent Emails */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Send className="w-5 h-5 text-blue-600" />
                Sent
              </h2>
            </div>

            {sent.length === 0 ? (
              <p className="text-sm text-slate-500 py-8 text-center">No sent emails yet</p>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {sent.map((item) => (
                  <div
                    key={item.email.id}
                    className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 truncate">
                          {item.email.subject || "(No subject)"}
                        </p>
                        {item.vendorName && (
                          <Link
                            href={`/vendors/${item.email.vendorId}`}
                            className="text-sm text-primary-600 hover:underline"
                          >
                            {item.vendorName}
                          </Link>
                        )}
                        <p className="text-xs text-slate-500 mt-1">
                          To: {item.email.toEmail}
                        </p>
                      </div>
                      <span className="text-xs text-slate-400 whitespace-nowrap">
                        {format(new Date(item.email.createdAt), "MMM d, h:mm a")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Received Emails */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Inbox className="w-5 h-5 text-green-600" />
                Received
              </h2>
            </div>

            {received.length === 0 ? (
              <p className="text-sm text-slate-500 py-8 text-center">
                No received emails yet. Connect Gmail to sync emails.
              </p>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {received.map((item) => (
                  <div
                    key={item.email.id}
                    className={`p-3 border rounded-lg hover:bg-slate-50 transition-colors ${
                      item.email.isRead ? "border-slate-200" : "border-blue-300 bg-blue-50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium truncate ${item.email.isRead ? "text-slate-900" : "text-blue-900"}`}>
                          {item.email.subject || "(No subject)"}
                        </p>
                        {item.vendorName && (
                          <Link
                            href={`/vendors/${item.email.vendorId}`}
                            className="text-sm text-primary-600 hover:underline"
                          >
                            {item.vendorName}
                          </Link>
                        )}
                        <p className="text-xs text-slate-500 mt-1">
                          From: {item.email.fromEmail}
                        </p>
                      </div>
                      <span className="text-xs text-slate-400 whitespace-nowrap">
                        {format(new Date(item.email.createdAt), "MMM d, h:mm a")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
