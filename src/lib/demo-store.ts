import type {
  Activity,
  CalendarEvent,
  CallLog,
  Email,
  EmailTemplate,
  FollowUp,
  Vendor,
} from "@/db/schema";
import {
  mockActivities,
  mockCalls,
  mockEmails,
  mockEvents,
  mockFollowUps,
  mockIntegrations,
  mockTemplates,
  mockVendors,
} from "@/lib/mock-data";

type DemoIntegration = { provider: string; isEnabled: boolean };

export interface DemoStore {
  vendors: Vendor[];
  activities: Activity[];
  followUps: FollowUp[];
  emails: Email[];
  calls: CallLog[];
  events: CalendarEvent[];
  templates: EmailTemplate[];
  integrations: DemoIntegration[];
}

declare global {
  // eslint-disable-next-line no-var
  var __brandPilotDemoStore: DemoStore | undefined;
}

function createStore(): DemoStore {
  return {
    vendors: [...mockVendors],
    activities: [...mockActivities],
    followUps: [...mockFollowUps],
    emails: [...mockEmails],
    calls: [...mockCalls],
    events: [...mockEvents],
    templates: [...mockTemplates],
    integrations: [...mockIntegrations],
  };
}

export function getDemoStore() {
  if (!globalThis.__brandPilotDemoStore) {
    globalThis.__brandPilotDemoStore = createStore();
  }
  return globalThis.__brandPilotDemoStore;
}

export function demoId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
