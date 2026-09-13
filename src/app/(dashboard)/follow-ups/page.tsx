import type { FollowUp } from "@/db/schema";
import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Link from "next/link";
import { Clock, CheckCircle, AlertCircle, Calendar } from "lucide-react";
import { format, addDays, isToday, isTomorrow, isPast } from "date-fns";
import { getDemoStore } from "@/lib/demo-store";
import AddFollowUpButton from "./AddFollowUpButton";
import FollowUpActions from "./FollowUpActions";

export const dynamic = "force-dynamic";

function getFollowUps() {
  const store = getDemoStore();
  const nextWeek = addDays(new Date(), 7);
  const allFollowUps = [...store.followUps]
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
    .map((followUp) => ({
      followUp,
      vendorName: store.vendors.find((vendor) => vendor.id === followUp.vendorId)?.name ?? null,
    }));

  const pending = allFollowUps.filter((item) => item.followUp.status === "pending");
  const completed = allFollowUps.filter((item) => item.followUp.status === "completed");
  const overdue = pending.filter((item) => isPast(item.followUp.dueDate) && !isToday(item.followUp.dueDate));
  const todayFollowUps = pending.filter((item) => isToday(item.followUp.dueDate));
  const tomorrowFollowUps = pending.filter((item) => isTomorrow(item.followUp.dueDate));
  const upcoming = pending.filter((item) => !isPast(item.followUp.dueDate) && !isToday(item.followUp.dueDate) && !isTomorrow(item.followUp.dueDate));

  return {
    overdue,
    today: todayFollowUps,
    tomorrow: tomorrowFollowUps,
    upcoming,
    completed: completed.slice(0, 10),
    stats: {
      total: pending.length,
      overdue: overdue.length,
      today: todayFollowUps.length,
      thisWeek: pending.filter((item) => item.followUp.dueDate < nextWeek).length,
    },
  };
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

interface FollowUpCardProps {
  followUp: FollowUp;
  vendorName: string | null;
  showDate?: boolean;
}

function FollowUpCard({ followUp, vendorName, showDate = true }: FollowUpCardProps) {
  const isOverdue = isPast(new Date(followUp.dueDate)) && followUp.status === "pending";

  return (
    <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-slate-200 hover:shadow-sm transition-shadow">
      <div className={`p-2 rounded-lg ${isOverdue ? "bg-red-100" : "bg-slate-100"}`}>
        {isOverdue ? (
          <AlertCircle className="w-5 h-5 text-red-500" />
        ) : followUp.status === "completed" ? (
          <CheckCircle className="w-5 h-5 text-green-500" />
        ) : (
          <Clock className="w-5 h-5 text-slate-500" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-medium text-slate-900">{followUp.title}</h3>
            {vendorName && (
              <Link
                href={`/vendors/${followUp.vendorId}`}
                className="text-sm text-primary-600 hover:underline"
              >
                {vendorName}
              </Link>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={getPriorityColor(followUp.priority)} size="sm">
              {followUp.priority}
            </Badge>
            <FollowUpActions followUp={followUp} />
          </div>
        </div>

        {followUp.description && (
          <p className="text-sm text-slate-500 mt-1 line-clamp-2">{followUp.description}</p>
        )}

        {showDate && (
          <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            <span className={isOverdue ? "text-red-500 font-medium" : ""}>
              {format(new Date(followUp.dueDate), "EEEE, MMM d 'at' h:mm a")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default async function FollowUpsPage() {
  const data = await getFollowUps();

  return (
    <>
      <Header title="Follow-ups" subtitle="Stay on top of your vendor communications" />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 rounded-lg">
                <Clock className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Pending</p>
                <p className="text-xl font-semibold text-slate-900">{data.stats.total}</p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Overdue</p>
                <p className="text-xl font-semibold text-red-600">{data.stats.overdue}</p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Due Today</p>
                <p className="text-xl font-semibold text-blue-600">{data.stats.today}</p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">This Week</p>
                <p className="text-xl font-semibold text-amber-600">{data.stats.thisWeek}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Add Follow-up Button */}
        <div className="flex justify-end">
          <AddFollowUpButton />
        </div>

        {/* Overdue */}
        {data.overdue.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-red-600 mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Overdue ({data.overdue.length})
            </h2>
            <div className="space-y-2">
              {data.overdue.map((item) => (
                <FollowUpCard
                  key={item.followUp.id}
                  followUp={item.followUp}
                  vendorName={item.vendorName}
                />
              ))}
            </div>
          </div>
        )}

        {/* Today */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-3">
            Today ({data.today.length})
          </h2>
          {data.today.length === 0 ? (
            <Card className="text-center py-8">
              <p className="text-slate-500">No follow-ups scheduled for today</p>
            </Card>
          ) : (
            <div className="space-y-2">
              {data.today.map((item) => (
                <FollowUpCard
                  key={item.followUp.id}
                  followUp={item.followUp}
                  vendorName={item.vendorName}
                  showDate={false}
                />
              ))}
            </div>
          )}
        </div>

        {/* Tomorrow */}
        {data.tomorrow.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">
              Tomorrow ({data.tomorrow.length})
            </h2>
            <div className="space-y-2">
              {data.tomorrow.map((item) => (
                <FollowUpCard
                  key={item.followUp.id}
                  followUp={item.followUp}
                  vendorName={item.vendorName}
                  showDate={false}
                />
              ))}
            </div>
          </div>
        )}

        {/* Upcoming */}
        {data.upcoming.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">
              Upcoming ({data.upcoming.length})
            </h2>
            <div className="space-y-2">
              {data.upcoming.map((item) => (
                <FollowUpCard
                  key={item.followUp.id}
                  followUp={item.followUp}
                  vendorName={item.vendorName}
                />
              ))}
            </div>
          </div>
        )}

        {/* Completed */}
        {data.completed.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-slate-500 mb-3">
              Recently Completed
            </h2>
            <div className="space-y-2 opacity-60">
              {data.completed.map((item) => (
                <FollowUpCard
                  key={item.followUp.id}
                  followUp={item.followUp}
                  vendorName={item.vendorName}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
