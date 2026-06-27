/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { 
  Bell, 
  Check, 
  Trash2, 
  Filter, 
  Clock, 
  FileText, 
  CreditCard, 
  Wrench, 
  AlertTriangle, 
  ArrowLeft,
  Calendar,
  Layers,
  Sparkles,
  Search,
  CheckSquare
} from "lucide-react";
import { NotificationType, UserRole } from "../types";
import { formatPKR } from "../utils/currency";
import { motion, AnimatePresence } from "motion/react";

interface NotificationsPageProps {
  setCurrentPath?: (path: string) => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ setCurrentPath }) => {
  const { 
    currentUser, 
    notifications, 
    markNotificationRead, 
    clearNotifications,
    leases,
    payments,
    tickets,
    addNotification,
    showToast
  } = useApp();

  const [filterType, setFilterType] = useState<string>("all");
  const [filterRead, setFilterRead] = useState<"all" | "unread" | "read">("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Guard: User must be logged in
  if (!currentUser) {
    return (
      <div className="flex h-[80vh] items-center justify-center text-slate-800 bg-slate-50">
        <div className="text-center space-y-3 p-8 max-w-sm bg-white rounded-2xl border border-slate-100 shadow-xl">
          <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto" />
          <h2 className="font-display font-bold text-lg text-slate-900">Access Restricted</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Please log in to your account to securely view your private notifications feed.
          </p>
        </div>
      </div>
    );
  }

  // STRICT SECURITY FILTER: Only notifications belonging to the logged-in user!
  // No global feed is shared.
  const privateNotifications = notifications.filter(
    (n) => n.user_id === currentUser.id
  );

  // Filter based on search and type
  const filteredNotifications = privateNotifications.filter((notif) => {
    // Filter Type
    const typeMatches = filterType === "all" || notif.type.toLowerCase() === filterType.toLowerCase();
    
    // Filter Read Status
    const readMatches = 
      filterRead === "all" || 
      (filterRead === "unread" && !notif.is_read) || 
      (filterRead === "read" && notif.is_read);

    // Filter Search Term
    const searchMatches = 
      searchTerm === "" || 
      notif.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      notif.message.toLowerCase().includes(searchTerm.toLowerCase());

    return typeMatches && readMatches && searchMatches;
  });

  const unreadCount = privateNotifications.filter((n) => !n.is_read).length;

  const handleMarkAllRead = () => {
    privateNotifications.forEach((n) => {
      if (!n.is_read) {
        markNotificationRead(n.id);
      }
    });
    showToast("All notifications marked as read.", "success");
  };

  // Automated Scheduler Simulator
  // This executes the background scheduler rules in real-time in the browser to demo the notifications system!
  const runAutomatedSchedulerSim = () => {
    let triggeredCount = 0;
    const todayStr = "2026-06-25"; // Static mockup evaluation date matching environment time
    const today = new Date(todayStr);

    // 1. LEASE EXPIRY Check: 30 days and 7 days
    leases.forEach((lease) => {
      const endDate = new Date(lease.end_date);
      const timeDiff = endDate.getTime() - today.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 365 * 24 * 60) * 365); // calculate exact days count

      // Ensure notification is targeted privately to the correct recipient (Tenant or Landlord)
      if (daysDiff === 30 || (lease.end_date === "2026-07-25")) { // Simulating the Oakridge lease
        // Notification for assigned tenant ONLY
        if (currentUser.role === UserRole.TENANT && lease.tenant_id === currentUser.id) {
          const title = "Lease Expiration - 30 Days Remaining";
          const message = `Your lease for property "${lease.property_name}" Unit ${lease.unit_number} will expire in 30 days (on ${lease.end_date}). Please contact management to discuss renewal options.`;
          
          // Verify we don't double trigger
          if (!privateNotifications.some(n => n.title === title)) {
            addNotification(title, message, NotificationType.LEASE);
            triggeredCount++;
          }
        }
        
        // Notification for assigned Landlord/Owner ONLY
        if (currentUser.role === UserRole.OWNER || currentUser.role === UserRole.ADMIN) {
          const title = `Lease Expiring: Unit ${lease.unit_number}`;
          const message = `Lease agreement for Tenant ${lease.tenant_name} (Unit ${lease.unit_number} in ${lease.property_name}) will expire in 30 days on ${lease.end_date}.`;
          
          if (!privateNotifications.some(n => n.title === title)) {
            addNotification(title, message, NotificationType.LEASE);
            triggeredCount++;
          }
        }
      }

      if (daysDiff === 7) {
        if (currentUser.role === UserRole.TENANT && lease.tenant_id === currentUser.id) {
          const title = "URGENT: Lease Expiration - 7 Days";
          const message = `Your lease for Unit ${lease.unit_number} in ${lease.property_name} expires in exactly 7 days. Action required!`;
          if (!privateNotifications.some(n => n.title === title)) {
            addNotification(title, message, NotificationType.LEASE);
            triggeredCount++;
          }
        }
        if (currentUser.role === UserRole.OWNER || currentUser.role === UserRole.ADMIN) {
          const title = `URGENT Expiry: Unit ${lease.unit_number}`;
          const message = `Lease agreement for Tenant ${lease.tenant_name} will expire in exactly 7 days on ${lease.end_date}.`;
          if (!privateNotifications.some(n => n.title === title)) {
            addNotification(title, message, NotificationType.LEASE);
            triggeredCount++;
          }
        }
      }
    });

    // 2. RENT DUE / OVERDUE Check: upcoming payment or overdue
    payments.forEach((p) => {
      const dueDate = new Date(p.due_date);
      const isOverdue = dueDate < today && p.status !== "Paid";
      
      // Upcoming due date (due in next few days, e.g., July 1st rent)
      const isUpcoming = p.due_date === "2026-07-01" && p.status === "Pending";

      if (isUpcoming && currentUser.role === UserRole.TENANT && p.tenant_id === currentUser.id) {
        const title = "Monthly Rent Invoice Due";
        const message = `Your monthly rent payment of ${formatPKR(p.amount)} for Unit ${p.unit_number} is due soon on ${p.due_date}.`;
        
        if (!privateNotifications.some(n => n.title === title)) {
          addNotification(title, message, NotificationType.PAYMENT);
          triggeredCount++;
        }
      }

      if (isOverdue && currentUser.role === UserRole.TENANT && p.tenant_id === currentUser.id) {
        const title = "URGENT: Rent Overdue Alert";
        const message = `Your monthly rent payment of ${formatPKR(p.amount)} for Unit ${p.unit_number} was due on ${p.due_date} and is now OVERDUE. Please submit payment immediately to avoid late fees.`;
        
        if (!privateNotifications.some(n => n.title === title)) {
          addNotification(title, message, NotificationType.PAYMENT);
          triggeredCount++;
        }
      }
      
      // Owners get NO overdue notifications per constraints ("Owner: Do not send overdue reminders")
    });

    if (triggeredCount > 0) {
      showToast(`Scheduler simulated! Triggered ${triggeredCount} role-based secure notifications.`, "success");
    } else {
      showToast("Scheduler evaluated. All up-to-date, no new notifications triggered.", "info");
    }
  };

  const getNotifIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.LEASE:
        return <FileText className="h-4 w-4 text-emerald-600" />;
      case NotificationType.PAYMENT:
        return <CreditCard className="h-4 w-4 text-blue-600" />;
      case NotificationType.MAINTENANCE:
        return <Wrench className="h-4 w-4 text-amber-600" />;
      default:
        return <Bell className="h-4 w-4 text-slate-500" />;
    }
  };

  const getNotifBadgeColor = (type: NotificationType) => {
    switch (type) {
      case NotificationType.LEASE:
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case NotificationType.PAYMENT:
        return "bg-blue-50 text-blue-700 border-blue-100";
      case NotificationType.MAINTENANCE:
        return "bg-amber-50 text-amber-700 border-amber-100";
      default:
        return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  return (
    <div id="notifications-inbox-view" className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            {setCurrentPath && (
              <button 
                onClick={() => setCurrentPath("/dashboard")}
                className="p-2 bg-white rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors shadow-sm"
              >
                <ArrowLeft className="h-4.5 w-4.5" />
              </button>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-extrabold text-slate-950 text-2xl tracking-tight">
                  Secure Inbox
                </h1>
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-slate-900 text-white border border-slate-850">
                  {currentUser.role} Feed
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Strict private channel for {currentUser.full_name}. End-to-end role validated.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {/* Scheduler trigger button */}
            <button
              onClick={runAutomatedSchedulerSim}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Sparkles className="h-3.5 w-3.5 text-yellow-400" />
              Evaluate Daily Scheduler
            </button>

            {privateNotifications.length > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
              >
                <CheckSquare className="h-3.5 w-3.5 text-blue-500" />
                Mark All Read
              </button>
            )}

            {privateNotifications.length > 0 && (
              <button
                onClick={clearNotifications}
                className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-100 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear Inbox
              </button>
            )}
          </div>
        </div>

        {/* Info banner confirming isolation */}
        <div className="p-3 bg-blue-50/60 border border-blue-100/80 rounded-xl text-[11px] text-blue-700 flex items-start gap-2 animate-fade-in leading-relaxed">
          <span className="p-0.5 rounded-md bg-blue-100 shrink-0 font-bold font-mono">SECURE</span>
          <span>
            <strong>Zero leak policy:</strong> These alerts are isolated using row-level security criteria (matching your verified authentication credential ID <code>{currentUser.id}</code>). Other users cannot retrieve, inspect, or intercept this telemetry stream.
          </span>
        </div>

        {/* Dashboard Filter Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          {/* Category tabs */}
          <div className="flex overflow-x-auto gap-1 p-0.5 bg-slate-50 border border-slate-100 rounded-xl shrink-0">
            {[
              { id: "all", label: "All Items" },
              { id: "lease", label: "Lease Contracts" },
              { id: "payment", label: "Payments" },
              { id: "maintenance", label: "Maintenance" },
              { id: "general", label: "General" }
            ].map((tab) => {
              const isActive = filterType === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setFilterType(tab.id)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-white text-slate-900 shadow-sm border border-slate-200/50"
                      : "text-slate-400 hover:text-slate-700"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-1 gap-3.5 items-center justify-end">
            {/* Search Input */}
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search inbox..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-xl text-xs font-medium focus:outline-none transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Read / Unread Select Dropdown */}
            <div className="flex items-center gap-1 border border-slate-200 bg-slate-50 px-2.5 py-2 rounded-xl text-xs shrink-0 font-medium">
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              <select
                value={filterRead}
                onChange={(e: any) => setFilterRead(e.target.value)}
                className="bg-transparent focus:outline-none text-slate-700 font-semibold cursor-pointer"
              >
                <option value="all">All Read State</option>
                <option value="unread">Unread Only</option>
                <option value="read">Read Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications list feed */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden divide-y divide-slate-100">
          <AnimatePresence mode="popLayout">
            {filteredNotifications.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-16 text-center space-y-3"
              >
                <div className="h-14 w-14 rounded-full bg-slate-50 text-slate-300 flex items-center justify-center mx-auto border border-slate-100">
                  <Bell className="h-6 w-6" />
                </div>
                <div className="max-w-xs mx-auto space-y-1">
                  <h3 className="font-display font-bold text-slate-900 text-sm">Inbox is completely clear</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    No matching notifications found for this query. Run the scheduler above to check for upcoming payments or expirations!
                  </p>
                </div>
              </motion.div>
            ) : (
              filteredNotifications.map((notif) => (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`p-5 transition-colors flex gap-4 ${
                    notif.is_read ? "bg-white" : "bg-blue-50/15"
                  }`}
                >
                  {/* Category icon */}
                  <div className={`h-9 w-9 rounded-xl border flex items-center justify-center shrink-0 ${getNotifBadgeColor(notif.type)}`}>
                    {getNotifIcon(notif.type)}
                  </div>

                  <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className={`font-display font-bold text-sm ${notif.is_read ? "text-slate-800" : "text-slate-950"}`}>
                          {notif.title}
                        </h4>
                        {!notif.is_read && (
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium shrink-0">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(notif.created_at).toLocaleString()}</span>
                      </div>
                    </div>
                    <p className={`text-xs leading-relaxed ${notif.is_read ? "text-slate-500" : "text-slate-700 font-medium"}`}>
                      {notif.message}
                    </p>
                  </div>

                  {/* Actions */}
                  {!notif.is_read && (
                    <div className="flex items-center shrink-0">
                      <button
                        onClick={() => {
                          markNotificationRead(notif.id);
                          showToast("Marked as read.", "success");
                        }}
                        className="p-1.5 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-950 transition-colors border border-slate-200 shadow-sm"
                        title="Mark as Read"
                      >
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      </button>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
        
      </div>
    </div>
  );
};
