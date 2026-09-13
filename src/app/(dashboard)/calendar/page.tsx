import Header from "@/components/layout/Header";
import { getDemoStore } from "@/lib/demo-store";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Link from "next/link";
import { Calendar, Clock, MapPin, Video, Users } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from "date-fns";
import CalendarView from "./CalendarView";

export const dynamic = "force-dynamic";

function getCalendarData() {
  const store = getDemoStore();
  const events = [...store.events]
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
    .map((event) => ({
      event,
      vendorName: store.vendors.find((vendor) => vendor.id === event.vendorId)?.name ?? null,
    }));
  const upcomingFollowUps = [...store.followUps]
    .filter((followUp) => followUp.status === "pending")
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
    .map((followUp) => ({
      followUp,
      vendorName: store.vendors.find((vendor) => vendor.id === followUp.vendorId)?.name ?? null,
    }));
  const upcoming = [
    ...events.map((item) => ({
      id: item.event.id,
      type: "event" as const,
      title: item.event.title,
      date: item.event.startTime,
      vendorName: item.vendorName,
      vendorId: item.event.vendorId,
      description: item.event.description,
      location: item.event.location,
      meetingLink: item.event.meetingLink,
    })),
    ...upcomingFollowUps.map((item) => ({
      id: item.followUp.id,
      type: "followUp" as const,
      title: item.followUp.title,
      date: item.followUp.dueDate,
      vendorName: item.vendorName,
      vendorId: item.followUp.vendorId,
      description: item.followUp.description,
      priority: item.followUp.priority,
    })),
  ].sort((a, b) => a.date.getTime() - b.date.getTime());

  return { events, followUps: upcomingFollowUps, upcoming };
}

export default async function CalendarPage() {
  const { events, followUps: upcomingFollowUps, upcoming } = await getCalendarData();

  return (
    <>
      <Header
        title="Calendar"
        subtitle="Manage your schedule and follow-ups"
      />

      <div className="p-6 space-y-6">
        {/* Google Calendar Integration Notice */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-white">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Google Calendar Integration</h3>
              <p className="text-sm text-slate-600 mt-1">
                Connect your Google Calendar to sync events and automatically create follow-up reminders.
                Events created in BrandPilot will appear in your Google Calendar.
              </p>
              <Link
                href="/settings"
                className="inline-flex items-center mt-3 text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Configure Google Calendar →
              </Link>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar View */}
          <div className="lg:col-span-2">
            <CalendarView events={events} followUps={upcomingFollowUps} />
          </div>

          {/* Upcoming Events Sidebar */}
          <div className="space-y-6">
            <Card>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Upcoming</h2>
              
              {upcoming.length === 0 ? (
                <p className="text-sm text-slate-500 py-4 text-center">
                  No upcoming events or follow-ups
                </p>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {upcoming.slice(0, 15).map((item) => (
                    <div
                      key={`${item.type}-${item.id}`}
                      className={`p-3 rounded-lg border ${
                        item.type === "event"
                          ? "bg-blue-50 border-blue-200"
                          : "bg-amber-50 border-amber-200"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {item.type === "event" ? (
                          <Calendar className="w-4 h-4 text-blue-600 mt-0.5" />
                        ) : (
                          <Clock className="w-4 h-4 text-amber-600 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900 text-sm">{item.title}</p>
                          {item.vendorName && (
                            <Link
                              href={`/vendors/${item.vendorId}`}
                              className="text-xs text-primary-600 hover:underline"
                            >
                              {item.vendorName}
                            </Link>
                          )}
                          <p className="text-xs text-slate-500 mt-1">
                            {format(new Date(item.date), "EEE, MMM d 'at' h:mm a")}
                          </p>
                          {"location" in item && item.location && (
                            <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                              <MapPin className="w-3 h-3" />
                              {item.location}
                            </div>
                          )}
                          {"meetingLink" in item && item.meetingLink && (
                            <a
                              href={item.meetingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 mt-1 text-xs text-blue-600 hover:underline"
                            >
                              <Video className="w-3 h-3" />
                              Join Meeting
                            </a>
                          )}
                        </div>
                        {"priority" in item && item.priority && (
                          <Badge
                            variant={
                              item.priority === "urgent"
                                ? "danger"
                                : item.priority === "high"
                                ? "warning"
                                : "default"
                            }
                            size="sm"
                          >
                            {item.priority}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Quick Stats */}
            <Card>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">This Month</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Events</span>
                  <span className="font-semibold text-slate-900">{events.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Follow-ups</span>
                  <span className="font-semibold text-slate-900">{upcomingFollowUps.length}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
