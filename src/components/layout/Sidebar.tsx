"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Building2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  Kanban,
  LayoutDashboard,
  LogOut,
  Mail,
  Phone,
  Settings,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/overview", label: "Product brief", icon: Sparkles },
  { href: "/vendors", label: "Vendors", icon: Building2 },
  { href: "/pipeline", label: "Pipeline", icon: Kanban },
  { href: "/follow-ups", label: "Follow-ups", icon: Clock },
  { href: "/kpis", label: "KPIs", icon: BarChart3 },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/emails", label: "Emails", icon: Mail },
  { href: "/calls", label: "Calls", icon: Phone },
  { href: "/templates", label: "Templates", icon: FileText },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function signOut() {
    setIsSigningOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <aside
      className={`${collapsed ? "w-16" : "w-64"} sticky top-0 flex h-screen shrink-0 flex-col bg-[#07111f] text-white transition-all duration-300`}
    >
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-cyan-400 text-xs font-black text-slate-950">BP</div>
            <div>
              <span className="block text-sm font-bold leading-4">BrandPilot</span>
              <span className="text-[10px] text-slate-500">Wholesale CRM</span>
            </div>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-lg p-1.5 text-slate-500 hover:bg-white/10 hover:text-white"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 ${
                isActive
                  ? "bg-cyan-400 font-semibold text-slate-950"
                  : "text-slate-400 hover:bg-white/[0.07] hover:text-white"
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span className="text-sm">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-3">
        {!collapsed ? (
          <div className="flex items-center gap-3 rounded-xl bg-white/[0.05] p-2.5">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-cyan-400/15 text-xs font-bold text-cyan-300">AD</div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold">Alex Demo</p>
              <p className="truncate text-[10px] text-slate-500">NorthPeak Commerce</p>
            </div>
            <button
              onClick={signOut}
              disabled={isSigningOut}
              className="rounded-lg p-2 text-slate-500 hover:bg-white/10 hover:text-white"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={signOut}
            disabled={isSigningOut}
            className="grid w-full place-items-center rounded-lg p-2 text-slate-500 hover:bg-white/10 hover:text-white"
            title="Sign out"
          >
            <LogOut className="h-5 w-5" />
          </button>
        )}
      </div>
    </aside>
  );
}
