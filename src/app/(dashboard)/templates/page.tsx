import Header from "@/components/layout/Header";
import { getDemoStore } from "@/lib/demo-store";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { FileText, BarChart2 } from "lucide-react";
import AddTemplateButton from "./AddTemplateButton";
import TemplateActions from "./TemplateActions";

export const dynamic = "force-dynamic";

function getTemplates() {
  return [...getDemoStore().templates].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export default async function TemplatesPage() {
  const templates = await getTemplates();

  const categories = [
    { value: "initial_outreach", label: "Initial Outreach", color: "info" },
    { value: "follow_up", label: "Follow-up", color: "purple" },
    { value: "application", label: "Application", color: "warning" },
    { value: "thank_you", label: "Thank You", color: "success" },
    { value: "pricing", label: "Pricing Request", color: "default" },
  ] as const;

  const getCategoryBadge = (category: string | null) => {
    const cat = categories.find((c) => c.value === category);
    return cat ? (
      <Badge variant={cat.color}>{cat.label}</Badge>
    ) : (
      <Badge variant="default">General</Badge>
    );
  };

  return (
    <>
      <Header
        title="Email Templates"
        subtitle="Create and manage reusable email templates"
      />

      <div className="p-6 space-y-6">
        {/* Info Card */}
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-white">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Template Variables</h3>
              <p className="text-sm text-slate-600 mt-1">
                Use these placeholders in your templates and they'll be automatically replaced:
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <code className="px-2 py-1 bg-white rounded text-xs text-purple-600">{"{{vendor_name}}"}</code>
                <code className="px-2 py-1 bg-white rounded text-xs text-purple-600">{"{{contact_name}}"}</code>
              </div>
            </div>
          </div>
        </Card>

        {/* Add Template Button */}
        <div className="flex justify-end">
          <AddTemplateButton />
        </div>

        {/* Templates Grid */}
        {templates.length === 0 ? (
          <Card className="text-center py-12">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No templates yet</h3>
            <p className="text-sm text-slate-500 mb-4">
              Create your first email template to speed up your outreach.
            </p>
            <AddTemplateButton />
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      <FileText className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900">{template.name}</h3>
                      {getCategoryBadge(template.category)}
                    </div>
                  </div>
                  <TemplateActions template={template} />
                </div>

                <div className="space-y-2 mb-4">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Subject</p>
                    <p className="text-sm text-slate-700 truncate">{template.subject}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Body</p>
                    <p className="text-sm text-slate-600 line-clamp-3">{template.body}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <BarChart2 className="w-3.5 h-3.5" />
                    Used {template.usageCount} times
                  </div>
                  <Badge variant={template.isActive ? "success" : "default"} size="sm">
                    {template.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
