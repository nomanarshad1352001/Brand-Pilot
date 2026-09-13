"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { LucideIcon, Check, X } from "lucide-react";

interface IntegrationCardProps {
  name: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  isConnected: boolean;
  provider: string;
}

export default function IntegrationCard({
  name,
  description,
  icon: Icon,
  iconColor,
  iconBg,
  isConnected,
  provider,
}: IntegrationCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleConnect = async () => {
    setIsLoading(true);

    // In a real implementation, this would:
    // 1. For Gmail/Google Calendar: Redirect to OAuth flow
    // 2. For Twilio: Open a modal to enter API credentials

    // Simulating a connection for demo
    try {
      await fetch("/api/integrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, action: "connect" }),
      });
      router.refresh();
    } catch (error) {
      console.error("Failed to connect:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm(`Are you sure you want to disconnect ${name}?`)) return;

    setIsLoading(true);
    try {
      await fetch("/api/integrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, action: "disconnect" }),
      });
      router.refresh();
    } catch (error) {
      console.error("Failed to disconnect:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl ${iconBg}`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-slate-900">{name}</h3>
            <Badge variant={isConnected ? "success" : "default"}>
              {isConnected ? "Connected" : "Not Connected"}
            </Badge>
          </div>
          <p className="text-sm text-slate-500">{description}</p>
          <div className="mt-4">
            {isConnected ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 text-sm text-green-600">
                  <Check className="w-4 h-4" />
                  Active
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDisconnect}
                  isLoading={isLoading}
                >
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={handleConnect}
                isLoading={isLoading}
              >
                Connect {name}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
