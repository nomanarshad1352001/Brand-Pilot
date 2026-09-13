import { isAfter, startOfMonth } from "date-fns";
import {
  Activity,
  BarChart3,
  Building2,
  CheckCircle2,
  Clock3,
  Mail,
  Phone,
  Target,
  TrendingUp,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";
import { getDemoStore } from "@/lib/demo-store";

export const dynamic = "force-dynamic";

const statusConfig = [
  { status: "prospect", label: "Prospect", color: "bg-slate-400" },
  { status: "contacted", label: "Contacted", color: "bg-sky-500" },
  { status: "negotiating", label: "Negotiating", color: "bg-violet-500" },
  { status: "application_sent", label: "Application sent", color: "bg-amber-500" },
  { status: "approved", label: "Approved", color: "bg-emerald-500" },
  { status: "rejected", label: "Rejected", color: "bg-red-400" },
  { status: "on_hold", label: "On hold", color: "bg-slate-300" },
];

export default function KpisPage() {
  const store = getDemoStore();
  const monthStart = startOfMonth(new Date());
  const approved = store.vendors.filter((vendor) => vendor.status === "approved").length;
  const applied = store.vendors.filter((vendor) => ["application_sent", "approved", "rejected"].includes(vendor.status)).length;
  const conversion = Math.round((approved / Math.max(applied, 1)) * 100);
  const completed = store.followUps.filter((followUp) => followUp.status === "completed").length;
  const pending = store.followUps.filter((followUp) => followUp.status === "pending").length;
  const totalCallMinutes = Math.round(store.calls.reduce((sum, call) => sum + (call.duration || 0), 0) / 60);
  const monthlyActivities = store.activities.filter((activity) => isAfter(activity.createdAt, monthStart)).length;

  const metrics = [
    { label: "Portfolio vendors", value: store.vendors.length, detail: "+3 qualified this month", icon: Building2, tone: "bg-sky-50 text-sky-700" },
    { label: "Application conversion", value: `${conversion}%`, detail: `${approved} approved accounts`, icon: Target, tone: "bg-violet-50 text-violet-700" },
    { label: "Tracked touchpoints", value: store.emails.length + store.calls.length, detail: `${monthlyActivities} activities this month`, icon: Activity, tone: "bg-amber-50 text-amber-700" },
    { label: "Follow-up completion", value: `${Math.round((completed / Math.max(completed + pending, 1)) * 100)}%`, detail: `${pending} actions remain`, icon: CheckCircle2, tone: "bg-emerald-50 text-emerald-700" },
  ];

  return (
    <>
      <Header title="KPIs & analytics" subtitle="Understand outreach productivity and account acquisition conversion." />
      <div className="space-y-6 p-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map(({ label, value, detail, icon: Icon, tone }) => (
            <Card key={label}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{label}</p>
                  <p className="mt-2 text-3xl font-bold text-slate-950">{value}</p>
                  <p className="mt-1 text-xs text-slate-400">{detail}</p>
                </div>
                <div className={`rounded-xl p-2.5 ${tone}`}><Icon className="h-5 w-5" /></div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <Card>
            <div className="mb-6 flex items-center justify-between">
              <div><h2 className="text-lg font-bold text-slate-950">Pipeline distribution</h2><p className="text-sm text-slate-500">Account volume by current stage</p></div>
              <BarChart3 className="h-5 w-5 text-slate-400" />
            </div>
            <div className="space-y-4">
              {statusConfig.map((item) => {
                const count = store.vendors.filter((vendor) => vendor.status === item.status).length;
                const width = Math.max((count / store.vendors.length) * 100, count ? 8 : 0);
                return (
                  <div key={item.status}>
                    <div className="mb-1.5 flex justify-between text-sm"><span className="font-medium text-slate-700">{item.label}</span><span className="text-slate-500">{count} accounts</span></div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${item.color}`} style={{ width: `${width}%` }} /></div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="bg-slate-950 text-white">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">Monthly score</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {[
                { label: "Emails", value: store.emails.length, icon: Mail },
                { label: "Calls", value: store.calls.length, icon: Phone },
                { label: "Call minutes", value: totalCallMinutes, icon: Clock3 },
                { label: "Approvals", value: approved, icon: CheckCircle2 },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="rounded-xl border border-white/10 bg-white/[0.05] p-4">
                  <Icon className="h-4 w-4 text-cyan-300" />
                  <p className="mt-3 text-2xl font-bold">{value}</p>
                  <p className="mt-1 text-xs text-slate-500">{label}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-xl bg-emerald-400/10 p-4 text-sm text-emerald-200">
              <div className="flex gap-2"><TrendingUp className="h-4 w-4 shrink-0" /><span>Approval velocity is on track for the monthly target.</span></div>
            </div>
          </Card>
        </div>

        <Card>
          <div className="mb-6"><h2 className="text-lg font-bold text-slate-950">Monthly goals</h2><p className="text-sm text-slate-500">Demo targets for the wholesale acquisition team</p></div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { label: "Qualified vendors", current: store.vendors.length, target: 20, color: "bg-sky-500" },
              { label: "Communication touches", current: store.emails.length + store.calls.length, target: 30, color: "bg-violet-500" },
              { label: "Approved accounts", current: approved, target: 5, color: "bg-emerald-500" },
            ].map((goal) => (
              <div key={goal.label}>
                <div className="mb-2 flex justify-between text-sm"><span className="font-semibold text-slate-700">{goal.label}</span><span className="text-slate-500">{goal.current} / {goal.target}</span></div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${goal.color}`} style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }} /></div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
