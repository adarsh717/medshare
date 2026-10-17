"use client";

import * as React from "react";
import Link from "next/link";
import { Bell, CheckCheck, Clock, ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { CardSkeleton } from "@/components/ui/loading-skeleton";
import { useToast } from "@/components/ui/toast";
import { InAppNotification } from "@/types";
import { formatDateTime } from "@/lib/utils";

export default function NotificationsPage() {
  const { toast } = useToast();
  const [notifications, setNotifications] = React.useState<InAppNotification[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isMarkingAll, setIsMarkingAll] = React.useState(false);

  const fetchNotifications = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      if (data.notifications) {
        setNotifications(data.notifications);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAllRead = async () => {
    setIsMarkingAll(true);
    try {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAll: true }),
      });

      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        toast({
          type: "success",
          title: "All Notifications Marked Read",
        });
      }
    } catch {
      toast({ type: "error", title: "Error", description: "Failed to mark all as read." });
    } finally {
      setIsMarkingAll(false);
    }
  };

  const handleMarkSingleRead = async (id: string) => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId: id }),
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch {
      // Non-blocking
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notification Center"
        description="Review updates regarding your assistance requests, nearby blood matches, and verification status."
        badge={
          unreadCount > 0 ? (
            <span className="bg-red-50 text-red-800 text-xs px-2.5 py-0.5 rounded border border-red-200 font-bold">
              {unreadCount} Unread
            </span>
          ) : (
            <span className="bg-slate-100 text-slate-600 text-xs px-2.5 py-0.5 rounded border border-slate-200">
              All Caught Up
            </span>
          )
        }
        action={
          unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllRead}
              isLoading={isMarkingAll}
              className="text-xs gap-1.5"
            >
              <CheckCheck className="h-4 w-4" />
              <span>Mark All as Read</span>
            </Button>
          )
        }
      />

      {isLoading ? (
        <div className="space-y-3">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : notifications.length === 0 ? (
        <EmptyState
          title="No Notifications"
          description="You do not have any notifications at this time. When there are updates to your requests or donor matches, they will appear here."
          icon={<Bell className="h-6 w-6 text-slate-400" />}
        />
      ) : (
        <div className="space-y-2.5">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => !notif.isRead && handleMarkSingleRead(notif.id)}
              className={`p-4 rounded-lg border transition-all ${
                notif.isRead
                  ? "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                  : "bg-teal-50/50 border-teal-200 text-teal-950 font-medium shadow-none"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {!notif.isRead && (
                      <span className="h-2 w-2 rounded-full bg-teal-600 shrink-0" />
                    )}
                    <h3 className="text-xs font-bold text-slate-900">{notif.title}</h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pl-4">{notif.message}</p>
                  <span className="text-[10px] text-slate-400 block pl-4 pt-0.5">
                    {formatDateTime(notif.createdAt)}
                  </span>
                </div>

                {notif.link && (
                  <Link
                    href={notif.link}
                    onClick={() => handleMarkSingleRead(notif.id)}
                    className="shrink-0"
                  >
                    <Button variant="outline" size="sm" className="text-xs h-7 px-2.5">
                      <span>View</span>
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
