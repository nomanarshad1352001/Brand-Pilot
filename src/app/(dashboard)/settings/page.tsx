import Header from "@/components/layout/Header";
import { getDemoStore } from "@/lib/demo-store";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Mail, Calendar, Phone, Settings, Shield, Bell, Database } from "lucide-react";
import IntegrationCard from "./IntegrationCard";

export const dynamic = "force-dynamic";

function getIntegrations() {
  const settings = getDemoStore().integrations;
  return {
    gmail: settings.find((item) => item.provider === "gmail"),
    googleCalendar: settings.find((item) => item.provider === "google_calendar"),
    twilio: settings.find((item) => item.provider === "twilio"),
  };
}

export default async function SettingsPage() {
  const integrations = await getIntegrations();

  return (
    <>
      <Header
        title="Settings"
        subtitle="Configure your CRM and integrations"
      />

      <div className="p-6 space-y-6">
        {/* Integrations Section */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Integrations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <IntegrationCard
              name="Gmail"
              description="Send emails directly from BrandPilot and sync your communication history."
              icon={Mail}
              iconColor="text-red-600"
              iconBg="bg-red-100"
              isConnected={integrations.gmail?.isEnabled ?? false}
              provider="gmail"
            />
            
            <IntegrationCard
              name="Google Calendar"
              description="Sync follow-ups and events with your Google Calendar."
              icon={Calendar}
              iconColor="text-blue-600"
              iconBg="bg-blue-100"
              isConnected={integrations.googleCalendar?.isEnabled ?? false}
              provider="google_calendar"
            />
            
            <IntegrationCard
              name="Twilio"
              description="Enable click-to-call and automatic call logging."
              icon={Phone}
              iconColor="text-green-600"
              iconBg="bg-green-100"
              isConnected={integrations.twilio?.isEnabled ?? false}
              provider="twilio"
            />
          </div>
        </div>

        {/* General Settings */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">General Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-slate-100">
                  <Bell className="w-6 h-6 text-slate-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">Notifications</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Configure email and browser notifications for follow-ups and activities.
                  </p>
                  <div className="mt-4 space-y-3">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-slate-700">Email reminders for follow-ups</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-slate-700">Daily digest of activities</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-slate-700">Browser notifications</span>
                    </label>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-slate-100">
                  <Database className="w-6 h-6 text-slate-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">Data Management</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Export your data or import vendors from a CSV file.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg">
                      Export Vendors (CSV)
                    </button>
                    <button className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg">
                      Import Vendors
                    </button>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-slate-100">
                  <Settings className="w-6 h-6 text-slate-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">Pipeline Stages</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Customize pipeline stages to match your workflow.
                  </p>
                  <div className="mt-4 space-y-2">
                    {["Prospect", "Contacted", "Negotiating", "Application Sent", "Approved", "Rejected", "On Hold"].map(
                      (stage, index) => (
                        <div
                          key={stage}
                          className="flex items-center gap-2 text-sm text-slate-600"
                        >
                          <span className="w-5 text-slate-400">{index + 1}.</span>
                          {stage}
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-slate-100">
                  <Shield className="w-6 h-6 text-slate-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">Security</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Manage your account security settings.
                  </p>
                  <div className="mt-4 space-y-3">
                    <button className="w-full px-3 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg text-left">
                      Change Password
                    </button>
                    <button className="w-full px-3 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg text-left">
                      Enable Two-Factor Authentication
                    </button>
                    <button className="w-full px-3 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg text-left">
                      View Active Sessions
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* API Keys Section */}
        <Card>
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-purple-100">
              <Settings className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900">API Configuration</h3>
              <p className="text-sm text-slate-500 mt-1">
                Configure API keys for external integrations. These are stored securely as environment variables.
              </p>
              <div className="mt-4 space-y-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">Gmail API</span>
                    <Badge variant={process.env.GOOGLE_CLIENT_ID ? "success" : "default"}>
                      {process.env.GOOGLE_CLIENT_ID ? "Configured" : "Not Set"}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500">
                    Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">Twilio API</span>
                    <Badge variant={process.env.TWILIO_ACCOUNT_SID ? "success" : "default"}>
                      {process.env.TWILIO_ACCOUNT_SID ? "Configured" : "Not Set"}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500">
                    Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER environment variables
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
