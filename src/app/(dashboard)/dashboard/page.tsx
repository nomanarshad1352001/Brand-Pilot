import Link from "next/link";
import { format, isPast, isToday } from "date-fns";
import {
  ArrowUpRight,
  Building2,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Mail,
  Phone,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { getDemoStore } from "@/lib/demo-store";
import { productProfile } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

const stages = [
  { value: "prospect", label: "Prospect", color: "bg-slate-400" },
  { value: "contacted", label: "Contacted", color: "bg-sky-500" },
  { value: "negotiating", label: "Negotiating", color: "bg-violet-500" },
  { value: "application_sent", label: "Applied", color: "bg-amber-500" },
  { value: "approved", label: "Approved", color: "bg-emerald-500" },
];

const activityIcon = (type: string) => {
  if (type.includes("email")) return Mail;
  if (type.includes("call")) return Phone;
  if (type.includes("approved") || type === "status_change") return CheckCircle2;
  return Clock3;
};

export default function DashboardPage() {
  const store = getDemoStore();
  const approved = store.vendors.filter((vendor) => vendor.status === "approved").length;
  const activePipeline = store.vendors.filter((vendor) => !["approved", "rejected"].includes(vendor.status)).length;
  const sentEmails = store.emails.filter((email) => email.direction === "sent").length;
  const pendingFollowUps = store.followUps.filter((followUp) => followUp.status === "pending");
  const overdue = pendingFollowUps.filter((followUp) => isPast(followUp.dueDate) && !isToday(followUp.dueDate));
  const conversionRate = Math.round((approved / Math.max(store.vendors.length, 1)) * 100);
  const recentActivities = [...store.activities].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 6);
  const upcoming = [...pendingFollowUps].sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime()).slice(0, 5);

  const cards = [
    { label: "Active pipeline", value: activePipeline, note: `${store.vendors.length} total accounts`, icon: Building2, tone: "bg-sky-50 text-sky-700" },
    { label: "Approved accounts", value: approved, note: `${conversionRate}% portfolio conversion`, icon: CheckCircle2, tone: "bg-emerald-50 text-emerald-700" },
    { label: "Emails tracked", value: store.emails.length, note: `${sentEmails} sent from CRM`, icon: Mail, tone: "bg-violet-50 text-violet-700" },
    { label: "Open follow-ups", value: pendingFollowUps.length, note: `${overdue.length} need attention`, icon: CalendarClock, tone: "bg-amber-50 text-amber-700" },
  ];

  return (
    <>
      <Header title="Good morning, Alex" subtitle="Here is your wholesale acquisition command center." />
      <div className="space-y-6 p-6">
        <section className="relative overflow-hidden rounded-2xl bg-[#07111f] px-6 py-7 text-white shadow-xl shadow-slate-900/5 sm:px-8">
          <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full bg-cyan-400/15 blur-3xl" />
          <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-200">
                <Sparkles className="h-3.5 w-3.5" /> Demo workspace • fully populated
              </div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Build more authorized supplier accounts.</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                BrandPilot gives Amazon wholesale teams one operating system for prospecting, outreach, applications, pricing sheets, approvals, and relationship follow-through.
              </p>
            </div>
            <Link href="/overview" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-300">
              View product brief <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map(({ label, value, note, icon: Icon, tone }) => (
            <Card key={label} className="relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{label}</p>
                  <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">{value}</p>
                  <p className="mt-1 text-xs text-slate-400">{note}</p>
                </div>
                <div className={`rounded-xl p-2.5 ${tone}`}><Icon className="h-5 w-5" /></div>
              </div>
            </Card>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          <Card>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-950">Pipeline health</h2>
                <p className="text-sm text-slate-500">Live distribution across acquisition stages</p>
              </div>
              <Link href="/pipeline" className="text-sm font-semibold text-sky-700 hover:text-sky-900">Open board →</Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-5">
              {stages.map((stage) => {
                const count = store.vendors.filter((vendor) => vendor.status === stage.value).length;
                return (
                  <Link key={stage.value} href={`/vendors?status=${stage.value}`} className="rounded-xl border border-slate-200 bg-slate-50 p-4 hover:border-slate-300 hover:bg-white">
                    <div className={`mb-4 h-1.5 w-9 rounded-full ${stage.color}`} />
                    <p className="text-2xl font-bold text-slate-950">{count}</p>
                    <p className="mt-1 text-xs font-medium text-slate-500">{stage.label}</p>
                  </Link>
                );
              })}
            </div>
            <div className="mt-6 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-emerald-100 p-2 text-emerald-700"><TrendingUp className="h-4 w-4" /></div>
                <div>
                  <p className="text-sm font-semibold text-emerald-950">Strong mid-funnel momentum</p>
                  <p className="text-xs text-emerald-700">3 accounts are negotiating or under application review.</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-950">Next actions</h2>
                <p className="text-sm text-slate-500">Prioritized follow-up queue</p>
              </div>
              <Target className="h-5 w-5 text-slate-400" />
            </div>
            <div className="space-y-3">
              {upcoming.map((followUp) => {
                const vendor = store.vendors.find((item) => item.id === followUp.vendorId);
                const isOverdue = isPast(followUp.dueDate) && !isToday(followUp.dueDate);
                return (
                  <Link key={followUp.id} href={`/vendors/${followUp.vendorId}`} className="flex gap-3 rounded-xl border border-slate-200 p-3 hover:bg-slate-50">
                    <div className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${isOverdue ? "bg-red-500" : followUp.priority === "urgent" ? "bg-amber-500" : "bg-sky-500"}`} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-800">{followUp.title}</p>
                      <p className="mt-0.5 truncate text-xs text-slate-500">{vendor?.name}</p>
                    </div>
                    <span className={`shrink-0 text-[11px] font-semibold ${isOverdue ? "text-red-600" : "text-slate-400"}`}>
                      {isOverdue ? "Overdue" : format(followUp.dueDate, "MMM d")}
                    </span>
                  </Link>
                );
              })}
            </div>
            <Link href="/follow-ups" className="mt-4 block rounded-lg py-2 text-center text-sm font-semibold text-sky-700 hover:bg-sky-50">View all follow-ups</Link>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <Card>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-950">Recent activity</h2>
                <p className="text-sm text-slate-500">Every vendor touchpoint in one timeline</p>
              </div>
              <Badge variant="info">Live demo data</Badge>
            </div>
            <div className="divide-y divide-slate-100">
              {recentActivities.map((activity) => {
                const vendor = store.vendors.find((item) => item.id === activity.vendorId);
                const Icon = activityIcon(activity.type);
                return (
                  <div key={activity.id} className="flex items-center gap-4 py-3.5">
                    <div className="rounded-lg bg-slate-100 p-2 text-slate-600"><Icon className="h-4 w-4" /></div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-800">{activity.subject}</p>
                      <p className="truncate text-xs text-slate-500">{vendor?.name}</p>
                    </div>
                    <span className="text-xs text-slate-400">{format(activity.createdAt, "MMM d, h:mm a")}</span>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="bg-slate-950 text-white">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">Best fit</p>
            <h2 className="mt-3 text-xl font-bold">Who buys BrandPilot?</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">{productProfile.idealCustomers[0]}</p>
            <div className="my-5 h-px bg-white/10" />
            <div className="space-y-3">
              {["Replace spreadsheet-based prospect tracking", "Prevent missed follow-ups and lost applications", "Measure outreach-to-approval conversion", "Centralize Gmail, Calendar, and calling"].map((benefit) => (
                <div key={benefit} className="flex items-start gap-2 text-sm text-slate-300">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" /> {benefit}
                </div>
              ))}
            </div>
          </Card>
        </section>
      </div>
    </>
  );
}
