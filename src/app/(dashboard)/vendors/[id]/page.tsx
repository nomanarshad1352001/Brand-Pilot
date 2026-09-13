import { notFound } from "next/navigation";
import { getDemoStore } from "@/lib/demo-store";
import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import {
  Building2,
  Globe,
  Mail,
  Phone,
  MapPin,
  User,
  Calendar,
  FileText,
  Clock,
  ExternalLink,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import VendorActions from "./VendorActions";
import ActivityTimeline from "./ActivityTimeline";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

function getVendorData(id: string) {
  const store = getDemoStore();
  const vendor = store.vendors.find((item) => item.id === id);

  if (!vendor) return null;

  return {
    vendor,
    activities: store.activities
      .filter((item) => item.vendorId === id)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 20),
    followUps: store.followUps
      .filter((item) => item.vendorId === id)
      .sort((a, b) => b.dueDate.getTime() - a.dueDate.getTime()),
    emails: store.emails
      .filter((item) => item.vendorId === id)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 10),
    calls: store.calls
      .filter((item) => item.vendorId === id)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 10),
  };
}

function getStatusColor(status: string) {
  const colors: Record<string, "default" | "info" | "warning" | "success" | "danger" | "purple"> = {
    prospect: "default",
    contacted: "info",
    negotiating: "purple",
    application_sent: "warning",
    approved: "success",
    rejected: "danger",
    on_hold: "default",
  };
  return colors[status] || "default";
}

function getPriorityColor(priority: string | null) {
  const colors: Record<string, "default" | "info" | "warning" | "success" | "danger" | "purple"> = {
    low: "default",
    medium: "info",
    high: "warning",
    urgent: "danger",
  };
  return colors[priority ?? "medium"] || "default";
}

export default async function VendorDetailPage({ params }: PageProps) {
  const { id } = await params;
  const data = await getVendorData(id);

  if (!data) {
    notFound();
  }

  const { vendor, activities: vendorActivities, followUps: vendorFollowUps, emails: vendorEmails, calls: vendorCalls } = data;

  return (
    <>
      <Header title={vendor.name} subtitle={`${vendor.type} • ${vendor.status.replace("_", " ")}`} />

      <div className="p-6 space-y-6">
        {/* Back link */}
        <Link
          href="/vendors"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Vendors
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview Card */}
            <Card>
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-slate-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">{vendor.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={getStatusColor(vendor.status)}>
                        {vendor.status.replace("_", " ")}
                      </Badge>
                      <Badge variant={getPriorityColor(vendor.priority)}>
                        {vendor.priority} priority
                      </Badge>
                    </div>
                  </div>
                </div>
                <VendorActions vendor={vendor} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Company Details */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                    Company Details
                  </h3>
                  {vendor.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <a
                        href={`mailto:${vendor.email}`}
                        className="text-sm text-primary-600 hover:underline"
                      >
                        {vendor.email}
                      </a>
                    </div>
                  )}
                  {vendor.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <a
                        href={`tel:${vendor.phone}`}
                        className="text-sm text-slate-700 hover:underline"
                      >
                        {vendor.phone}
                      </a>
                    </div>
                  )}
                  {vendor.website && (
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-slate-400" />
                      <a
                        href={vendor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary-600 hover:underline flex items-center gap-1"
                      >
                        {vendor.website}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                  {(vendor.address || vendor.city || vendor.state) && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                      <span className="text-sm text-slate-700">
                        {[vendor.address, vendor.city, vendor.state, vendor.country]
                          .filter(Boolean)
                          .join(", ")}
                      </span>
                    </div>
                  )}
                </div>

                {/* Primary Contact */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                    Primary Contact
                  </h3>
                  {vendor.contactName && (
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-700">
                        {vendor.contactName}
                        {vendor.contactTitle && (
                          <span className="text-slate-500"> ({vendor.contactTitle})</span>
                        )}
                      </span>
                    </div>
                  )}
                  {vendor.contactEmail && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <a
                        href={`mailto:${vendor.contactEmail}`}
                        className="text-sm text-primary-600 hover:underline"
                      >
                        {vendor.contactEmail}
                      </a>
                    </div>
                  )}
                  {vendor.contactPhone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <a
                        href={`tel:${vendor.contactPhone}`}
                        className="text-sm text-slate-700 hover:underline"
                      >
                        {vendor.contactPhone}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              {vendor.notes && (
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-2">
                    Notes
                  </h3>
                  <p className="text-sm text-slate-700 whitespace-pre-wrap">{vendor.notes}</p>
                </div>
              )}

              {/* Key Dates */}
              <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-slate-500">Created</p>
                  <p className="text-sm font-medium text-slate-700">
                    {format(new Date(vendor.createdAt), "MMM d, yyyy")}
                  </p>
                </div>
                {vendor.lastContactDate && (
                  <div>
                    <p className="text-xs text-slate-500">Last Contact</p>
                    <p className="text-sm font-medium text-slate-700">
                      {format(new Date(vendor.lastContactDate), "MMM d, yyyy")}
                    </p>
                  </div>
                )}
                {vendor.applicationDate && (
                  <div>
                    <p className="text-xs text-slate-500">Application Sent</p>
                    <p className="text-sm font-medium text-slate-700">
                      {format(new Date(vendor.applicationDate), "MMM d, yyyy")}
                    </p>
                  </div>
                )}
                {vendor.approvalDate && (
                  <div>
                    <p className="text-xs text-slate-500">Approved</p>
                    <p className="text-sm font-medium text-slate-700">
                      {format(new Date(vendor.approvalDate), "MMM d, yyyy")}
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {/* Activity Timeline */}
            <Card>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Activity Timeline</h3>
              <ActivityTimeline activities={vendorActivities} vendorId={vendor.id} />
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Follow-ups */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900">Follow-ups</h3>
                <Link href={`/follow-ups?vendor=${vendor.id}`} className="text-sm text-primary-600">
                  View all
                </Link>
              </div>
              {vendorFollowUps.length === 0 ? (
                <p className="text-sm text-slate-500 py-4 text-center">No follow-ups scheduled</p>
              ) : (
                <div className="space-y-3">
                  {vendorFollowUps.slice(0, 5).map((followUp) => (
                    <div
                      key={followUp.id}
                      className="p-3 bg-slate-50 rounded-lg"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-medium text-slate-900">{followUp.title}</span>
                      </div>
                      <p className="text-xs text-slate-500 ml-6">
                        Due: {format(new Date(followUp.dueDate), "MMM d, yyyy")}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Recent Emails */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900">Recent Emails</h3>
                <Link href={`/emails?vendor=${vendor.id}`} className="text-sm text-primary-600">
                  View all
                </Link>
              </div>
              {vendorEmails.length === 0 ? (
                <p className="text-sm text-slate-500 py-4 text-center">No emails yet</p>
              ) : (
                <div className="space-y-3">
                  {vendorEmails.slice(0, 5).map((email) => (
                    <div key={email.id} className="p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-medium text-slate-900 truncate">
                          {email.subject || "(No subject)"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 ml-6">
                        {email.direction === "sent" ? "Sent" : "Received"}{" "}
                        {format(new Date(email.createdAt), "MMM d, h:mm a")}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Recent Calls */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900">Recent Calls</h3>
                <Link href={`/calls?vendor=${vendor.id}`} className="text-sm text-primary-600">
                  View all
                </Link>
              </div>
              {vendorCalls.length === 0 ? (
                <p className="text-sm text-slate-500 py-4 text-center">No calls logged</p>
              ) : (
                <div className="space-y-3">
                  {vendorCalls.slice(0, 5).map((call) => (
                    <div key={call.id} className="p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Phone className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-medium text-slate-900">
                          {call.direction === "outbound" ? "Outgoing call" : "Incoming call"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 ml-6">
                        {call.duration ? `${Math.floor(call.duration / 60)}m ${call.duration % 60}s` : "No duration"}{" "}
                        • {format(new Date(call.createdAt), "MMM d, h:mm a")}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Application Status */}
            <Card>
              <h3 className="font-semibold text-slate-900 mb-4">Application Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Has Application</span>
                  <Badge variant={vendor.hasApplication ? "success" : "default"}>
                    {vendor.hasApplication ? "Yes" : "No"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Has Pricing Sheet</span>
                  <Badge variant={vendor.hasPricingSheet ? "success" : "default"}>
                    {vendor.hasPricingSheet ? "Yes" : "No"}
                  </Badge>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
