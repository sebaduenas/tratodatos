"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, AlertCircle, CheckCircle, Info, XCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Notification {
  id: string;
  type: "info" | "warning" | "success" | "error";
  title: string;
  message: string;
  link?: string;
  createdAt: string;
  read: boolean;
}

const ICON_MAP = {
  info: Info,
  warning: AlertCircle,
  success: CheckCircle,
  error: XCircle,
};

const COLOR_MAP = {
  info: "text-blue-500 bg-blue-50",
  warning: "text-amber-500 bg-amber-50",
  success: "text-green-500 bg-green-50",
  error: "text-red-500 bg-red-50",
};

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
    
    // Load dismissed notifications from localStorage
    const dismissed = localStorage.getItem("dismissed_notifications");
    if (dismissed) {
      try {
        setDismissedIds(JSON.parse(dismissed));
      } catch {
        setDismissedIds([]);
      }
    }
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/notifications");
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const dismissNotification = (id: string) => {
    const newDismissed = [...dismissedIds, id];
    setDismissedIds(newDismissed);
    localStorage.setItem("dismissed_notifications", JSON.stringify(newDismissed));
  };

  const visibleNotifications = notifications.filter(
    (n) => !dismissedIds.includes(n.id)
  );

  const unreadCount = visibleNotifications.length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Hoy";
    } else if (diffDays === 1) {
      return "Ayer";
    } else if (diffDays < 7) {
      return `Hace ${diffDays} días`;
    } else {
      return date.toLocaleDateString("es-CL", {
        day: "numeric",
        month: "short",
      });
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-[10px]"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Notificaciones</h3>
          <p className="text-xs text-slate-500">
            {unreadCount > 0
              ? `Tienes ${unreadCount} notificación${unreadCount > 1 ? "es" : ""}`
              : "No tienes notificaciones nuevas"}
          </p>
        </div>
        <ScrollArea className="h-[300px]">
          {isLoading ? (
            <div className="p-4 text-center text-slate-500">
              Cargando...
            </div>
          ) : visibleNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="h-8 w-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500">Todo al día</p>
            </div>
          ) : (
            <div className="divide-y">
              {visibleNotifications.map((notification) => {
                const Icon = ICON_MAP[notification.type];
                const colorClass = COLOR_MAP[notification.type];

                return (
                  <div
                    key={notification.id}
                    className="p-3 hover:bg-slate-50 relative group"
                  >
                    <button
                      onClick={() => dismissNotification(notification.id)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4 text-slate-400 hover:text-slate-600" />
                    </button>
                    <div className="flex gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${colorClass}`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900">
                          {notification.title}
                        </p>
                        <p className="text-xs text-slate-500 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-slate-400">
                            {formatDate(notification.createdAt)}
                          </span>
                          {notification.link && (
                            <Link
                              href={notification.link}
                              onClick={() => setIsOpen(false)}
                              className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                            >
                              Ver más →
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
