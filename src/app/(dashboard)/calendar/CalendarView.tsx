"use client";

import { useState } from "react";
import { CalendarEvent, FollowUp } from "@/db/schema";
import { ChevronLeft, ChevronRight, Calendar, Clock } from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  isToday,
} from "date-fns";

interface CalendarViewProps {
  events: { event: CalendarEvent; vendorName: string | null }[];
  followUps: { followUp: FollowUp; vendorName: string | null }[];
}

export default function CalendarView({ events, followUps }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getEventsForDay = (day: Date) => {
    return events.filter((e) => isSameDay(new Date(e.event.startTime), day));
  };

  const getFollowUpsForDay = (day: Date) => {
    return followUps.filter((f) => isSameDay(new Date(f.followUp.dueDate), day));
  };

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentMonth(new Date())}
            className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            Today
          </button>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Week Days Header */}
      <div className="grid grid-cols-7 border-b border-slate-200">
        {weekDays.map((day) => (
          <div
            key={day}
            className="px-2 py-3 text-center text-sm font-medium text-slate-500"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {days.map((day, index) => {
          const dayEvents = getEventsForDay(day);
          const dayFollowUps = getFollowUpsForDay(day);
          const hasItems = dayEvents.length > 0 || dayFollowUps.length > 0;

          return (
            <div
              key={index}
              className={`min-h-[100px] border-b border-r border-slate-100 p-1 ${
                !isSameMonth(day, currentMonth) ? "bg-slate-50" : ""
              }`}
            >
              <div
                className={`text-sm font-medium mb-1 w-7 h-7 flex items-center justify-center rounded-full ${
                  isToday(day)
                    ? "bg-primary-600 text-white"
                    : isSameMonth(day, currentMonth)
                    ? "text-slate-900"
                    : "text-slate-400"
                }`}
              >
                {format(day, "d")}
              </div>

              {hasItems && (
                <div className="space-y-0.5">
                  {dayEvents.slice(0, 2).map((e) => (
                    <div
                      key={e.event.id}
                      className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded truncate"
                      title={e.event.title}
                    >
                      {e.event.title}
                    </div>
                  ))}
                  {dayFollowUps.slice(0, 2).map((f) => (
                    <div
                      key={f.followUp.id}
                      className="text-xs px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded truncate"
                      title={f.followUp.title}
                    >
                      {f.followUp.title}
                    </div>
                  ))}
                  {(dayEvents.length + dayFollowUps.length > 4) && (
                    <div className="text-xs text-slate-500 px-1">
                      +{dayEvents.length + dayFollowUps.length - 4} more
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="px-6 py-3 border-t border-slate-200 flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-xs text-slate-600">
          <div className="w-3 h-3 bg-blue-100 rounded" />
          <span>Events</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-600">
          <div className="w-3 h-3 bg-amber-100 rounded" />
          <span>Follow-ups</span>
        </div>
      </div>
    </div>
  );
}
