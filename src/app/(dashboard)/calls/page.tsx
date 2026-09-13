import Header from "@/components/layout/Header";
import { getDemoStore } from "@/lib/demo-store";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Link from "next/link";
import { Phone, PhoneOutgoing, PhoneIncoming, Clock, BarChart2 } from "lucide-react";
import { format } from "date-fns";
import LogCallButton from "./LogCallButton";

export const dynamic = "force-dynamic";

function getCalls() {
  const store = getDemoStore();
  const calls = [...store.calls]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .map((call) => ({
      call,
      vendorName: store.vendors.find((vendor) => vendor.id === call.vendorId)?.name ?? null,
    }));
  const outbound = calls.filter((item) => item.call.direction === "outbound");
  const inbound = calls.filter((item) => item.call.direction === "inbound");

  return {
    calls,
    stats: {
      total: calls.length,
      outbound: outbound.length,
      inbound: inbound.length,
      totalDuration: calls.reduce((sum, item) => sum + (item.call.duration || 0), 0),
    },
  };
}

function formatDuration(seconds: number | null) {
  if (!seconds) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default async function CallsPage() {
  const { calls, stats } = await getCalls();

  return (
    <>
      <Header
        title="Call Logs"
        subtitle="Track and manage your phone communications"
      />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-100">
                <Phone className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Calls</p>
                <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-green-100">
                <PhoneOutgoing className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Outgoing</p>
                <p className="text-2xl font-bold text-slate-900">{stats.outbound}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-purple-100">
                <PhoneIncoming className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Incoming</p>
                <p className="text-2xl font-bold text-slate-900">{stats.inbound}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-amber-100">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Duration</p>
                <p className="text-2xl font-bold text-slate-900">
                  {Math.floor(stats.totalDuration / 60)}m
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Twilio Integration Notice */}
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-white">
              <Phone className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Twilio Integration</h3>
              <p className="text-sm text-slate-600 mt-1">
                Connect Twilio to enable click-to-call functionality directly from vendor records.
                Calls will be automatically logged with duration and recording links.
              </p>
              <Link
                href="/settings"
                className="inline-flex items-center mt-3 text-sm font-medium text-green-600 hover:text-green-700"
              >
                Configure Twilio Integration →
              </Link>
            </div>
          </div>
        </Card>

        {/* Action */}
        <div className="flex justify-end">
          <LogCallButton />
        </div>

        {/* Call List */}
        {calls.length === 0 ? (
          <Card className="text-center py-12">
            <Phone className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No calls logged yet</h3>
            <p className="text-sm text-slate-500 mb-4">
              Log your first call or connect Twilio for automatic call tracking.
            </p>
            <LogCallButton />
          </Card>
        ) : (
          <Card padding="none">
            <div className="divide-y divide-slate-200">
              {calls.map((item) => (
                <div
                  key={item.call.id}
                  className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className={`p-2 rounded-lg ${
                    item.call.direction === "outbound" 
                      ? "bg-green-100" 
                      : "bg-purple-100"
                  }`}>
                    {item.call.direction === "outbound" ? (
                      <PhoneOutgoing className={`w-5 h-5 ${
                        item.call.direction === "outbound" 
                          ? "text-green-600" 
                          : "text-purple-600"
                      }`} />
                    ) : (
                      <PhoneIncoming className="w-5 h-5 text-purple-600" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-slate-900">
                        {item.call.direction === "outbound" ? "Outgoing call" : "Incoming call"}
                      </p>
                      <Badge
                        variant={
                          item.call.status === "completed"
                            ? "success"
                            : item.call.status === "failed"
                            ? "danger"
                            : "default"
                        }
                        size="sm"
                      >
                        {item.call.status || "logged"}
                      </Badge>
                    </div>
                    {item.vendorName && (
                      <Link
                        href={`/vendors/${item.call.vendorId}`}
                        className="text-sm text-primary-600 hover:underline"
                      >
                        {item.vendorName}
                      </Link>
                    )}
                    {item.call.notes && (
                      <p className="text-sm text-slate-500 mt-1 line-clamp-1">{item.call.notes}</p>
                    )}
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-900">
                      {formatDuration(item.call.duration)}
                    </p>
                    <p className="text-xs text-slate-500">
                      {format(new Date(item.call.createdAt), "MMM d, h:mm a")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </>
  );
}
