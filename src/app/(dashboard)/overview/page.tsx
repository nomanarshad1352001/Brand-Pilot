import {
  ArrowRight,
  BarChart3,
  Blocks,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  Database,
  FileCheck2,
  Gauge,
  Kanban,
  Layers3,
  Mail,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Workflow,
  Zap,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { productProfile } from "@/lib/mock-data";

const capabilities = [
  { icon: Search, title: "Brand prospecting", text: "Capture qualified manufacturers, brands, and distributors with contact details, category fit, priority, and commercial potential." },
  { icon: Kanban, title: "Pipeline management", text: "Move every account from prospect to contact, negotiation, application, approval, rejection, or nurture—without losing context." },
  { icon: Mail, title: "Email outreach", text: "Send personalized Gmail messages, use reusable templates, preserve threads, and associate every conversation with its vendor." },
  { icon: CalendarDays, title: "Follow-up automation", text: "Create reminders and calendar events, surface overdue work, and keep every opportunity moving at the right cadence." },
  { icon: Phone, title: "Call workflows", text: "Start Twilio calls from vendor records, capture outcomes and duration, and automatically add calls to the relationship timeline." },
  { icon: FileCheck2, title: "Application control", text: "Track applications, reseller documents, price sheets, MAP policies, MOQs, payment terms, and approval milestones." },
  { icon: BarChart3, title: "KPI intelligence", text: "Measure prospecting volume, outreach activity, response rates, applications, approvals, conversion, and team follow-through." },
  { icon: Workflow, title: "Unified activity history", text: "Give the team one chronological record of notes, emails, calls, meetings, status changes, and next actions." },
];

const buyerNeeds = [
  { pain: "Vendor data lives in spreadsheets", outcome: "A searchable, structured supplier database" },
  { pain: "Follow-ups are missed in busy inboxes", outcome: "Prioritized reminders and calendar synchronization" },
  { pain: "Applications lack clear ownership", outcome: "Visible stages, next actions, and accountability" },
  { pain: "Communication history is fragmented", outcome: "Vendor-linked Gmail, calls, notes, and meetings" },
  { pain: "Leaders cannot see conversion", outcome: "Actionable acquisition and productivity KPIs" },
];

const productionPhases = [
  { phase: "01", title: "Audit & stabilize", text: "Review Firebase architecture, access rules, code quality, performance, dependencies, deployment flow, defects, and technical debt." },
  { phase: "02", title: "Connect communication", text: "Implement secure Google OAuth, Gmail send/sync, Calendar events and reminders, plus Twilio click-to-call and callbacks." },
  { phase: "03", title: "Harden workflows", text: "Add validation, error handling, idempotent sync, audit trails, permissions, monitoring, and data recovery paths." },
  { phase: "04", title: "Launch confidently", text: "Complete end-to-end QA, integration tests, production configuration, security review, documentation, CI/CD, and release checks." },
];

export default function ProductOverviewPage() {
  return (
    <>
      <Header title="Product brief" subtitle="Commercial positioning, capabilities, and implementation blueprint." />
      <div className="space-y-8 p-6">
        <section className="relative overflow-hidden rounded-3xl bg-[#07111f] px-7 py-10 text-white sm:px-10">
          <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-cyan-400/15 blur-3xl" />
          <div className="relative max-w-4xl">
            <Badge variant="info">SaaS product blueprint</Badge>
            <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">{productProfile.title}</p>
            <h1 className="mt-3 text-4xl font-bold tracking-[-0.04em] sm:text-5xl">{productProfile.subtitle}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">{productProfile.promise}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <div className="rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3">
                <p className="text-xs text-slate-500">Product category</p>
                <p className="mt-1 text-sm font-semibold">Vertical CRM SaaS</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3">
                <p className="text-xs text-slate-500">Primary market</p>
                <p className="mt-1 text-sm font-semibold">Amazon wholesale sellers</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3">
                <p className="text-xs text-slate-500">Core value</p>
                <p className="mt-1 text-sm font-semibold">More approved accounts, less admin</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-5 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">Ideal customer profile</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">Who will buy this platform?</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">BrandPilot is sold to operators whose growth depends on consistently finding, contacting, qualifying, and winning direct wholesale supplier accounts.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {productProfile.idealCustomers.map((customer, index) => {
              const BuyerIcon = [Building2, Users, Layers3, Target][index];
              return (
                <Card key={customer}>
                  <div className="mb-4 grid h-10 w-10 place-items-center rounded-xl bg-sky-50 text-sky-700">
                    <BuyerIcon className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-semibold leading-6 text-slate-800">{customer}</p>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <Card className="bg-slate-950 text-white">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-xl bg-cyan-400/15 p-2.5 text-cyan-300"><Gauge className="h-5 w-5" /></div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-cyan-300">Business result</p>
                <h2 className="text-xl font-bold">What BrandPilot changes</h2>
              </div>
            </div>
            <p className="text-sm leading-6 text-slate-400">Instead of managing acquisition through inbox searches, disconnected sheets, and memory, a wholesale team gets a single operating rhythm from research to first purchase order.</p>
            <div className="mt-6 space-y-3">
              {["Shorter time from prospect to decision", "Higher follow-up consistency", "More complete application handoffs", "Clear manager visibility", "Reusable outreach playbooks"].map((result) => (
                <div key={result} className="flex items-center gap-2.5 text-sm text-slate-200">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-cyan-300" /> {result}
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div className="mb-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">Pain to outcome</p>
              <h2 className="mt-2 text-xl font-bold text-slate-950">Why customers pay for it</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {buyerNeeds.map((item) => (
                <div key={item.pain} className="grid gap-2 py-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                  <p className="text-sm text-slate-500">{item.pain}</p>
                  <ArrowRight className="hidden h-4 w-4 text-slate-300 sm:block" />
                  <p className="text-sm font-semibold text-slate-800">{item.outcome}</p>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section>
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">Feature suite</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">Everything the platform does</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {capabilities.map(({ icon: Icon, title, text }) => (
              <Card key={title}>
                <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-slate-100 text-slate-700"><Icon className="h-5 w-5" /></div>
                <h3 className="font-bold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <Card>
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-xl bg-violet-50 p-2.5 text-violet-700"><Sparkles className="h-5 w-5" /></div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-violet-700">Product qualities</p>
                <h2 className="text-xl font-bold text-slate-950">What makes it strong</h2>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {productProfile.qualities.map((quality) => (
                <div key={quality} className="flex items-start gap-2.5 rounded-xl border border-slate-200 p-3">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  <p className="text-sm leading-5 text-slate-700">{quality}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-700"><Blocks className="h-5 w-5" /></div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Connected workflow</p>
                <h2 className="text-xl font-bold text-slate-950">Integration responsibilities</h2>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { icon: Mail, name: "Gmail", text: "OAuth sign-in, send, thread sync, vendor matching, templates, and communication history." },
                { icon: CalendarDays, name: "Google Calendar", text: "Create events, sync edits, reminders, meeting links, and follow-up visibility." },
                { icon: Phone, name: "Twilio", text: "Click-to-call, inbound/outbound status, duration, recordings, and vendor-linked call logs." },
              ].map(({ icon: Icon, name, text }) => (
                <div key={name} className="flex gap-3 rounded-xl bg-slate-50 p-4">
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-sky-700" />
                  <div><p className="text-sm font-bold text-slate-900">{name}</p><p className="mt-1 text-sm leading-5 text-slate-500">{text}</p></div>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section>
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">Recommended architecture</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">Technology stack</h2>
            <p className="mt-2 text-sm text-slate-500">This preview runs entirely on dummy data. The production recommendation preserves the client's Firebase and Netlify direction.</p>
          </div>
          <Card padding="none">
            <div className="grid md:grid-cols-2 xl:grid-cols-3">
              {productProfile.techStack.map((item, index) => (
                <div key={item.layer} className="border-b border-slate-100 p-5 md:border-r xl:[&:nth-child(3n)]:border-r-0">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{item.layer}</p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-800">{item.value}</p>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section>
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">Delivery plan</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">How this becomes launch-ready</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {productionPhases.map((item) => (
              <Card key={item.phase}>
                <p className="text-3xl font-black text-slate-200">{item.phase}</p>
                <h3 className="mt-3 font-bold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{item.text}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-cyan-200 bg-cyan-50 p-6 sm:p-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-800">Commercial summary</p>
              <h2 className="mt-2 text-xl font-bold text-cyan-950">A focused CRM for a high-value, repeatable acquisition process.</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-cyan-800">BrandPilot is not a generic contact manager. Its value is the complete wholesale workflow, Amazon-specific account context, disciplined follow-through, and measurable conversion from brand prospect to approved supplier.</p>
            </div>
            <div className="shrink-0 rounded-xl bg-white px-5 py-4 text-center shadow-sm">
              <ShieldCheck className="mx-auto h-6 w-6 text-cyan-700" />
              <p className="mt-2 text-xs font-bold text-slate-800">Launch-ready direction</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
