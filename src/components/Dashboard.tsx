/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Building2, 
  Users, 
  FileText, 
  Wrench, 
  CreditCard, 
  Bell, 
  LogOut, 
  Plus, 
  Menu, 
  X, 
  ArrowUpRight, 
  ArrowDownRight, 
  AlertTriangle, 
  TrendingUp, 
  DollarSign, 
  CheckCircle2, 
  HelpCircle,
  Home,
  User,
  MapPin,
  Calendar,
  Layers,
  ChevronRight,
  Sparkles,
  Inbox,
  LayoutGrid,
  FileSpreadsheet
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { 
  UserRole, 
  PropertyType, 
  PropertyStatus, 
  UnitStatus, 
  LeaseStatus, 
  TicketPriority, 
  TicketStatus, 
  PaymentStatus,
  NotificationType,
  Property,
  Unit,
  Lease,
  MaintenanceTicket,
  RentPayment
} from "../types";

// Import custom high-density modular tabs
import { PropertiesTab } from "./PropertiesTab";
import { UnitsTab } from "./UnitsTab";
import { TenantsTab } from "./TenantsTab";
import { LeasesTab } from "./LeasesTab";
import { RentTab } from "./RentTab";
import { MaintenanceTab } from "./MaintenanceTab";
import { ReportsTab } from "./ReportsTab";

export const Dashboard: React.FC = () => {
  const {
    currentUser,
    properties,
    units,
    leases,
    tickets,
    payments,
    notifications,
    logout,
    switchRole,
    addProperty,
    addLease,
    addTicket,
    updateTicketStatus,
    markPaymentPaid,
    markNotificationRead,
    clearNotifications,
    showToast
  } = useApp();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "properties" | "units" | "tenants" | "leases" | "payments" | "maintenance" | "reports">("overview");
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Modal States
  const [showPropModal, setShowPropModal] = useState(false);
  const [showLeaseModal, setShowLeaseModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);

  // Form States
  const [newProp, setNewProp] = useState({
    name: "",
    address: "",
    type: PropertyType.APARTMENT,
    units_count: 4,
    status: PropertyStatus.ACTIVE,
    image_url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80"
  });

  const [newLease, setNewLease] = useState({
    property_id: "",
    unit_id: "",
    tenant_name: "",
    start_date: "",
    end_date: "",
    deposit_amount: 1500
  });

  const [newTicket, setNewTicket] = useState({
    property_id: "",
    unit_id: "",
    title: "",
    description: "",
    priority: TicketPriority.MEDIUM
  });

  if (!currentUser) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center space-y-4">
          <p className="text-sm text-slate-400 font-mono">WORKSPACE_UNAUTHORIZED</p>
          <h1 className="text-2xl font-bold font-display">Please log in to continue</h1>
        </div>
      </div>
    );
  }

  // Filter lists based on role
  // Tenants only see their own tickets, leases, payments
  const isTenant = currentUser.role === UserRole.TENANT;
  
  // Simulated tenant key mapping
  // Since Jane Doe is tenant 't1' in our mock data:
  const activeTenantId = isTenant ? "t1" : "";
  
  const filteredProperties = properties; // Admins/owners see all properties
  
  const filteredUnits = isTenant 
    ? units.filter((u) => u.tenant_id === activeTenantId)
    : units;

  const filteredLeases = isTenant
    ? leases.filter((l) => l.tenant_id === activeTenantId)
    : leases;

  const filteredTickets = isTenant
    ? tickets.filter((t) => t.tenant_id === activeTenantId)
    : tickets;

  const filteredPayments = isTenant
    ? payments.filter((p) => p.tenant_id === activeTenantId)
    : payments;

  const filteredNotifications = notifications.filter((n) => n.user_id === currentUser.id || n.user_id === "all");

  const unreadNotificationsCount = filteredNotifications.filter((n) => !n.is_read).length;

  // Overview aggregations (for owners/admins vs. tenants)
  const totalProperties = properties.length;
  const occupiedUnits = units.filter((u) => u.status === UnitStatus.OCCUPIED).length;
  const vacantUnits = units.filter((u) => u.status === UnitStatus.VACANT).length;
  
  const activeTenantsCount = leases.filter((l) => l.status === LeaseStatus.ACTIVE).length;
  
  const totalRentBilledThisMonth = payments
    .filter((p) => p.due_date.startsWith("2026-06"))
    .reduce((sum, p) => sum + p.amount, 0);

  const totalRentCollectedThisMonth = payments
    .filter((p) => p.due_date.startsWith("2026-06") && p.status === PaymentStatus.PAID)
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingDuesAmount = payments
    .filter((p) => p.status === PaymentStatus.PENDING || p.status === PaymentStatus.OVERDUE)
    .reduce((sum, p) => sum + p.amount, 0);

  const activeMaintenanceTickets = tickets.filter(
    (t) => t.status === TicketStatus.OPEN || t.status === TicketStatus.IN_PROGRESS
  ).length;

  // Submission Handlers
  const handleAddPropertySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProp.name || !newProp.address) {
      showToast("Please enter property name and address.", "error");
      return;
    }
    addProperty(newProp);
    setShowPropModal(false);
    setNewProp({
      name: "",
      address: "",
      type: PropertyType.APARTMENT,
      units_count: 4,
      status: PropertyStatus.ACTIVE,
      image_url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80"
    });
  };

  const handleAddLeaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLease.property_id || !newLease.unit_id || !newLease.tenant_name || !newLease.start_date || !newLease.end_date) {
      showToast("Please complete all lease form fields.", "error");
      return;
    }

    const selectedProp = properties.find((p) => p.id === newLease.property_id);
    const selectedUnit = units.find((u) => u.id === newLease.unit_id);

    if (!selectedProp || !selectedUnit) {
      showToast("Error locating property or unit record.", "error");
      return;
    }

    addLease({
      property_id: newLease.property_id,
      property_name: selectedProp.name,
      unit_id: newLease.unit_id,
      unit_number: selectedUnit.unit_number,
      tenant_id: "t_" + Math.random().toString(36).substr(2, 9), // auto-gen tenant ID
      tenant_name: newLease.tenant_name,
      start_date: newLease.start_date,
      end_date: newLease.end_date,
      rent_amount: selectedUnit.rent_amount,
      deposit_amount: newLease.deposit_amount,
      status: LeaseStatus.ACTIVE
    });

    setShowLeaseModal(false);
    setNewLease({
      property_id: "",
      unit_id: "",
      tenant_name: "",
      start_date: "",
      end_date: "",
      deposit_amount: 1500
    });
  };

  const handleAddTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isTenant) {
      // Find the tenant's rented unit
      const tenantUnit = units.find((u) => u.tenant_id === activeTenantId);
      if (!tenantUnit) {
        showToast("Error locating your assigned lease unit.", "error");
        return;
      }
      if (!newTicket.title || !newTicket.description) {
        showToast("Please provide a ticket title and description.", "error");
        return;
      }
      addTicket({
        property_id: tenantUnit.property_id,
        property_name: tenantUnit.property_name,
        unit_id: tenantUnit.id,
        unit_number: tenantUnit.unit_number,
        tenant_id: activeTenantId,
        tenant_name: currentUser.full_name,
        title: newTicket.title,
        description: newTicket.description,
        priority: newTicket.priority
      });
    } else {
      // Owner/Admin filing a ticket
      if (!newTicket.property_id || !newTicket.unit_id || !newTicket.title || !newTicket.description) {
        showToast("Please complete all ticket fields.", "error");
        return;
      }
      const selectedProp = properties.find((p) => p.id === newTicket.property_id);
      const selectedUnit = units.find((u) => u.id === newTicket.unit_id);
      if (!selectedProp || !selectedUnit) return;

      addTicket({
        property_id: newTicket.property_id,
        property_name: selectedProp.name,
        unit_id: newTicket.unit_id,
        unit_number: selectedUnit.unit_number,
        tenant_id: selectedUnit.tenant_id || "guest",
        tenant_name: selectedUnit.tenant_name || "Unoccupied Unit",
        title: newTicket.title,
        description: newTicket.description,
        priority: newTicket.priority
      });
    }

    setShowTicketModal(false);
    setNewTicket({
      property_id: "",
      unit_id: "",
      title: "",
      description: "",
      priority: TicketPriority.MEDIUM
    });
  };

  return (
    <div id="dashboard-workspace" className="min-h-screen bg-slate-50 flex text-slate-800">
      
      {/* 1. SIDEBAR */}
      <aside
        id="dashboard-sidebar"
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } shrink-0 bg-slate-900 text-slate-300 transition-all duration-300 flex flex-col justify-between hidden md:flex border-r border-slate-800`}
      >
        <div className="flex flex-col">
          {/* Sidebar Brand header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/60 bg-slate-950">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="h-9 w-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-blue-600/10">
                <Building2 className="h-5 w-5" />
              </div>
              {sidebarOpen && (
                <span className="font-display font-extrabold text-white text-base tracking-tight truncate">
                  PROPERTY<span className="text-blue-500">LOG</span>
                </span>
              )}
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>

          {/* Nav groups */}
          <nav className="p-3 space-y-1 pt-6 overflow-y-auto max-h-[calc(100vh-10rem)]">
            {/* Overview */}
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all border ${
                activeTab === "overview"
                  ? "bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-sm"
                  : "border-transparent text-slate-400 hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              <Home className="h-4.5 w-4.5" />
              {sidebarOpen && <span>Overview Cockpit</span>}
            </button>

            {/* Properties */}
            <button
              onClick={() => setActiveTab("properties")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all border ${
                activeTab === "properties"
                  ? "bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-sm"
                  : "border-transparent text-slate-400 hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              <Building2 className="h-4.5 w-4.5" />
              {sidebarOpen && <span>Properties Suite</span>}
            </button>

            {/* Units Inventory */}
            <button
              onClick={() => setActiveTab("units")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all border ${
                activeTab === "units"
                  ? "bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-sm"
                  : "border-transparent text-slate-400 hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              <Layers className="h-4.5 w-4.5" />
              {sidebarOpen && <span>Units Inventory</span>}
            </button>

            {/* Tenants Directory (Hidden for Tenants) */}
            {!isTenant && (
              <button
                onClick={() => setActiveTab("tenants")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all border ${
                  activeTab === "tenants"
                    ? "bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-sm"
                    : "border-transparent text-slate-400 hover:bg-slate-800/60 hover:text-white"
                }`}
              >
                <Users className="h-4.5 w-4.5" />
                {sidebarOpen && <span>Tenants Directory</span>}
              </button>
            )}

            {/* Leases Tab */}
            <button
              onClick={() => setActiveTab("leases")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all border ${
                activeTab === "leases"
                  ? "bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-sm"
                  : "border-transparent text-slate-400 hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              <FileText className="h-4.5 w-4.5" />
              {sidebarOpen && <span>Lease Agreements</span>}
            </button>

            {/* Rent & Payments */}
            <button
              onClick={() => setActiveTab("payments")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all border ${
                activeTab === "payments"
                  ? "bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-sm"
                  : "border-transparent text-slate-400 hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              <CreditCard className="h-4.5 w-4.5" />
              {sidebarOpen && <span>{isTenant ? "Rent Ledger" : "Rent & Payments"}</span>}
            </button>

            {/* Maintenance */}
            <button
              onClick={() => setActiveTab("maintenance")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all border ${
                activeTab === "maintenance"
                  ? "bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-sm"
                  : "border-transparent text-slate-400 hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              <Wrench className="h-4.5 w-4.5" />
              {sidebarOpen && <span>Maintenance Desk</span>}
            </button>

            {/* Reports & Analytics */}
            <button
              onClick={() => setActiveTab("reports")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all border ${
                activeTab === "reports"
                  ? "bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-sm"
                  : "border-transparent text-slate-400 hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              <FileSpreadsheet className="h-4.5 w-4.5" />
              {sidebarOpen && <span>Reports &amp; Analytics</span>}
            </button>

            {/* Secure Inbox Link */}
            <button
              onClick={() => {
                window.location.hash = "notifications";
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all border border-transparent text-slate-400 hover:bg-slate-800/60 hover:text-white relative"
            >
              <Bell className="h-4.5 w-4.5 text-blue-400 animate-pulse" />
              {sidebarOpen && (
                <div className="flex items-center justify-between w-full">
                  <span>Secure Inbox</span>
                  {unreadNotificationsCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-[10px] font-extrabold text-white">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </div>
              )}
            </button>
          </nav>
        </div>

        {/* Footer Area with user profile details */}
        <div className="p-3 border-t border-slate-800/60 bg-slate-950/40">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-800/40 border border-slate-800/50">
            <div className="h-9 w-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
              {currentUser.full_name.charAt(0)}
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-100 truncate">{currentUser.full_name}</div>
                <div className="text-[10px] text-slate-400 font-mono truncate">{currentUser.role} Account</div>
              </div>
            )}
          </div>
          
          {sidebarOpen && (
            <div className="grid grid-cols-2 gap-1.5 mt-3">
              <button
                onClick={() => switchRole(currentUser.role === UserRole.OWNER ? UserRole.TENANT : UserRole.OWNER)}
                className="py-1 px-2 text-[10px] font-bold rounded-lg bg-slate-800 hover:bg-slate-700 text-center text-slate-300"
              >
                Switch Role
              </button>
              <button
                onClick={logout}
                className="py-1 px-2 text-[10px] font-bold rounded-lg bg-rose-950/20 hover:bg-rose-900/30 text-rose-400 text-center flex items-center justify-center gap-1"
              >
                <LogOut className="h-3 w-3" />
                Exit
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* 2. MAIN AREA */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header Navbar */}
        <header className="h-16 shrink-0 bg-white border-b border-slate-100 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm shadow-slate-100/10">
          <div className="flex items-center gap-3">
            {/* Hamburger button for small screens */}
            <button className="md:hidden p-1.5 rounded-lg bg-slate-50 border border-slate-200">
              <Menu className="h-5 w-5 text-slate-600" />
            </button>
            <h1 className="font-display font-extrabold text-slate-900 text-lg md:text-xl capitalize">
              {activeTab === "overview" && "Workspace Overview"}
              {activeTab === "properties" && "Property Assets"}
              {activeTab === "units" && "Units Inventory"}
              {activeTab === "tenants" && "Tenants Directory"}
              {activeTab === "leases" && "Leases Contracts"}
              {activeTab === "payments" && "Rent Ledger & Payments"}
              {activeTab === "maintenance" && "Maintenance Dispatch Board"}
              {activeTab === "reports" && "Financial Analytics & Reports"}
            </h1>
          </div>

          <div className="flex items-center gap-3 relative">
            
            {/* Quick Demo Workspace toggle notification */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-100 hover:bg-slate-200/80 px-2.5 py-1.5 rounded-full border border-slate-200 transition-colors">
              <Sparkles className="h-3.5 w-3.5 text-blue-500 animate-pulse" />
              <button
                onClick={() => switchRole(currentUser.role === UserRole.OWNER ? UserRole.TENANT : UserRole.OWNER)}
                className="text-[10px] font-bold text-slate-700"
              >
                Simulate: {currentUser.role === UserRole.OWNER ? "Tenant UI" : "Owner UI"}
              </button>
            </div>

            {/* Notifications Bell Widget */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotifDropdownOpen(!notifDropdownOpen);
                  setUserDropdownOpen(false);
                }}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors border border-slate-100 bg-slate-50 relative"
              >
                <Bell className="h-4.5 w-4.5" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500" />
                )}
              </button>

              {/* Notification Dropdown List */}
              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-slate-200 shadow-2xl p-4 space-y-3 z-50">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="font-display font-bold text-slate-900 text-sm">Notifications ({unreadNotificationsCount})</span>
                    {filteredNotifications.length > 0 && (
                      <button
                        onClick={clearNotifications}
                        className="text-[10px] font-semibold text-rose-500 hover:underline"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                  
                  <div className="max-h-60 overflow-y-auto space-y-2.5 pr-1">
                    {filteredNotifications.length === 0 ? (
                      <div className="text-center py-6 space-y-1">
                        <Inbox className="h-6 w-6 text-slate-300 mx-auto" />
                        <p className="text-xs text-slate-400">All caught up!</p>
                      </div>
                    ) : (
                      filteredNotifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            markNotificationRead(notif.id);
                            setNotifDropdownOpen(false);
                          }}
                          className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                            notif.is_read
                              ? "bg-white border-slate-100 text-slate-500"
                              : "bg-blue-50/40 border-blue-100 text-slate-800 font-medium"
                          }`}
                        >
                          <div className="flex justify-between items-start gap-2 mb-1">
                            <span className="font-bold text-slate-900">{notif.title}</span>
                            <span className="text-[9px] font-mono text-slate-400">
                              {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="leading-relaxed">{notif.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                  
                  <div className="border-t border-slate-100 pt-2.5">
                    <button
                      onClick={() => {
                        setNotifDropdownOpen(false);
                        window.location.hash = "notifications";
                      }}
                      className="w-full text-center py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1"
                    >
                      <Bell className="h-3 w-3 text-blue-400" />
                      View Secure Inbox Page
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Dropdown trigger */}
            <div className="relative">
              <button
                onClick={() => {
                  setUserDropdownOpen(!userDropdownOpen);
                  setNotifDropdownOpen(false);
                }}
                className="flex items-center gap-1.5 p-1 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <div className="h-8 w-8 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center shadow-md">
                  {currentUser.full_name.charAt(0)}
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 rotate-90 hidden sm:block" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl border border-slate-200 shadow-2xl p-3 space-y-1.5 z-50 text-xs">
                  <div className="p-2 border-b border-slate-100">
                    <div className="font-bold text-slate-900">{currentUser.full_name}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{currentUser.email}</div>
                  </div>
                  <button
                    onClick={() => {
                      switchRole(currentUser.role === UserRole.OWNER ? UserRole.TENANT : UserRole.OWNER);
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left p-2 hover:bg-slate-50 rounded-xl font-medium text-slate-700"
                  >
                    Switch Workspace Role
                  </button>
                  <hr className="border-slate-100" />
                  <button
                    onClick={logout}
                    className="w-full text-left p-2 hover:bg-rose-50 text-rose-600 rounded-xl font-bold flex items-center gap-1.5"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* 3. DYNAMIC WORKSPACE TABS */}
        <div id="workspace-container" className="p-4 md:p-6 flex-1 space-y-6">
          
          {/* =========================================================================
              TAB: OVERVIEW
              ========================================================================= */}
          {activeTab === "overview" && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Stat Cards Row */}
              <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                
                {/* Stat 1: Properties */}
                <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm flex items-center gap-3 transition-all hover:border-slate-300">
                  <div className="h-9 w-9 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg flex items-center justify-center shrink-0">
                    <Building2 className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Properties</div>
                    <div className="text-base font-extrabold font-display text-slate-950">{totalProperties}</div>
                  </div>
                </div>

                {/* Stat 2: Occupied Units */}
                <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm flex items-center gap-3 transition-all hover:border-slate-300">
                  <div className="h-9 w-9 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-lg flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Occupied</div>
                    <div className="text-base font-extrabold font-display text-slate-950">
                      {occupiedUnits}/{units.length}
                    </div>
                  </div>
                </div>

                {/* Stat 3: Active Tenants */}
                <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm flex items-center gap-3 transition-all hover:border-slate-300">
                  <div className="h-9 w-9 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg flex items-center justify-center shrink-0">
                    <Users className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tenants</div>
                    <div className="text-base font-extrabold font-display text-slate-950">{activeTenantsCount}</div>
                  </div>
                </div>

                {/* Stat 4: Billed Rent / Collected */}
                <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm flex items-center gap-3 transition-all hover:border-slate-300">
                  <div className="h-9 w-9 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg flex items-center justify-center shrink-0">
                    <DollarSign className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Collections</div>
                    <div className="text-base font-extrabold font-display text-slate-950">
                      ${totalRentCollectedThisMonth.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Stat 5: Outstanding / Pending */}
                <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm flex items-center gap-3 transition-all hover:border-slate-300">
                  <div className="h-9 w-9 bg-amber-50 text-amber-600 border border-amber-100 rounded-lg flex items-center justify-center shrink-0">
                    <AlertTriangle className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Pending</div>
                    <div className="text-base font-extrabold font-display text-slate-950">
                      ${pendingDuesAmount.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Stat 6: Active Tickets */}
                <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm flex items-center gap-3 transition-all hover:border-slate-300">
                  <div className="h-9 w-9 bg-rose-50 text-rose-600 border border-rose-100 rounded-lg flex items-center justify-center shrink-0">
                    <Wrench className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tickets</div>
                    <div className="text-base font-extrabold font-display text-slate-950">{activeMaintenanceTickets}</div>
                  </div>
                </div>

              </div>

              {/* Charts &amp; Analytics Section */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Panel: Rent collection chart mockup */}
                <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                    <div>
                      <h3 className="font-display font-bold text-slate-900 text-sm md:text-base">Monthly Rent Collection (June 2026)</h3>
                      <p className="text-xs text-slate-400">Total rent collection rate for June</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-extrabold text-emerald-600">
                        {totalRentBilledThisMonth > 0 
                          ? Math.round((totalRentCollectedThisMonth / totalRentBilledThisMonth) * 100) 
                          : 80}%
                      </div>
                      <div className="text-[10px] text-slate-400">Collection rate</div>
                    </div>
                  </div>

                  {/* SVG Bar Chart representing June Rent statuses */}
                  <div className="h-44 w-full flex items-end gap-4 md:gap-8 pt-4">
                    {payments.filter(p => p.due_date.startsWith("2026-06")).map((pay, i) => {
                      const isPaid = pay.status === PaymentStatus.PAID;
                      const barColor = isPaid ? "bg-emerald-500" : "bg-amber-500";
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2">
                          <div className="w-full bg-slate-100 h-24 rounded-lg relative overflow-hidden flex items-end">
                            <div className={`${barColor} w-full`} style={{ height: `${isPaid ? "100%" : "50%"}` }} />
                          </div>
                          <div className="text-[10px] font-bold text-slate-600 truncate max-w-[60px] text-center">
                            {pay.tenant_name.split(" ")[0]}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Panel: Operations expenses &amp; unit stats */}
                <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                  <h3 className="font-display font-bold text-slate-900 text-sm md:text-base">Operations Allocation</h3>
                  
                  <div className="space-y-3 pt-2">
                    
                    {/* Allocation item 1 */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-600">Maintenance &amp; Repairs</span>
                        <span className="text-slate-500 font-mono">45%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-rose-500 h-full rounded-full" style={{ width: "45%" }} />
                      </div>
                    </div>

                    {/* Allocation item 2 */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-600">Utility Allocations</span>
                        <span className="text-slate-500 font-mono">30%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full rounded-full" style={{ width: "30%" }} />
                      </div>
                    </div>

                    {/* Allocation item 3 */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-600">Staff &amp; Operations</span>
                        <span className="text-slate-500 font-mono">25%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-indigo-500 h-full rounded-full" style={{ width: "25%" }} />
                      </div>
                    </div>

                  </div>
                </div>

              </div>

              {/* Bottom Widgets Row: Recent Activity &amp; Upcoming Leases */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Recent Tickets Activity feed */}
                <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h3 className="font-display font-bold text-slate-950 text-xs md:text-sm">Active Maintenance Feed</h3>
                    <button onClick={() => setActiveTab("maintenance")} className="text-[10px] font-bold text-blue-600 hover:underline">Manage All</button>
                  </div>

                  <div className="space-y-2.5">
                    {filteredTickets.slice(0, 3).map((t) => (
                      <div key={t.id} className="p-3 bg-slate-50/50 rounded-lg border border-slate-200 flex items-stretch gap-3 hover:border-slate-300 transition-colors">
                        <div className={`w-1 shrink-0 rounded-full ${
                          t.priority === TicketPriority.URGENT 
                            ? "bg-rose-500" 
                            : t.priority === TicketPriority.HIGH
                            ? "bg-amber-500"
                            : "bg-blue-500"
                        }`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <div className="text-xs font-bold text-slate-900 truncate">{t.title}</div>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase border ${
                              t.priority === TicketPriority.URGENT
                                ? "bg-rose-50 text-rose-600 border-rose-100"
                                : t.priority === TicketPriority.HIGH
                                ? "bg-amber-50 text-amber-600 border-amber-100"
                                : "bg-blue-50 text-blue-600 border-blue-100"
                            }`}>{t.priority}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{t.description}</p>
                          <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1.5">
                            <span>{t.property_name} Unit {t.unit_number}</span>
                            <span>&bull;</span>
                            <span className="font-bold text-slate-500 uppercase text-[9px]">{t.status}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upcoming Leases Expiring warnings */}
                <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h3 className="font-display font-bold text-slate-950 text-xs md:text-sm">Upcoming Leases</h3>
                    {!isTenant && (
                      <button onClick={() => setActiveTab("leases")} className="text-[10px] font-bold text-blue-600 hover:underline">View All</button>
                    )}
                  </div>

                  <div className="space-y-2.5">
                    {filteredLeases.map((l) => (
                      <div key={l.id} className="p-3 bg-slate-50/50 rounded-lg border border-slate-200 flex items-center justify-between hover:border-slate-300 transition-colors">
                        <div>
                          <div className="text-xs font-bold text-slate-900">{l.tenant_name}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">{l.property_name} &bull; Unit {l.unit_number}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] font-bold text-slate-700">Expires {l.end_date}</div>
                          <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full mt-1 ${
                            l.status === LeaseStatus.EXPIRING 
                              ? "bg-rose-500/10 text-rose-500 border border-rose-100/20" 
                              : "bg-blue-500/10 text-blue-500 border border-blue-100/20"
                          }`}>
                            {l.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* =========================================================================
              MODULAR SAAS TABS
              ========================================================================= */}
          {activeTab === "properties" && <PropertiesTab />}
          {activeTab === "units" && <UnitsTab />}
          {activeTab === "tenants" && <TenantsTab />}

          {/* =========================================================================
              TAB: LEASES & TENANTS
              ========================================================================= */}
          {activeTab === "leases" && <LeasesTab />}

          {/* =========================================================================
              TAB: PAYMENTS & RENT
              ========================================================================= */}
          {activeTab === "payments" && <RentTab />}

          {/* =========================================================================
              TAB: MAINTENANCE TICKETS
              ========================================================================= */}
          {activeTab === "maintenance" && <MaintenanceTab />}

          {/* =========================================================================
              TAB: REPORTS & ANALYTICS
              ========================================================================= */}
          {activeTab === "reports" && <ReportsTab />}

        </div>
      </main>

      {/* =========================================================================
          MODAL: ADD PROPERTY
          ========================================================================= */}
      {showPropModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setShowPropModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>
            
            <h3 className="font-display font-bold text-slate-900 text-base md:text-lg">Register New Property Asset</h3>
            
            <form onSubmit={handleAddPropertySubmit} className="space-y-4 text-xs">
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Property Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Oakridge Heights"
                  value={newProp.name}
                  onChange={(e) => setNewProp({ ...newProp, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Property Address</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 742 Evergreen Terrace, Springfield"
                  value={newProp.address}
                  onChange={(e) => setNewProp({ ...newProp, address: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Asset Type</label>
                  <select
                    value={newProp.type}
                    onChange={(e) => setNewProp({ ...newProp, type: e.target.value as PropertyType })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none bg-white"
                  >
                    <option value={PropertyType.APARTMENT}>{PropertyType.APARTMENT}</option>
                    <option value={PropertyType.HOUSE}>{PropertyType.HOUSE}</option>
                    <option value={PropertyType.COMMERCIAL}>{PropertyType.COMMERCIAL}</option>
                    <option value={PropertyType.CONDO}>{PropertyType.CONDO}</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Units</label>
                  <input
                    type="number"
                    min={1}
                    value={newProp.units_count}
                    onChange={(e) => setNewProp({ ...newProp, units_count: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/10 transition-colors"
              >
                Register Asset
              </button>

            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: ADD LEASE (ONBOARD TENANT)
          ========================================================================= */}
      {showLeaseModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setShowLeaseModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>
            
            <h3 className="font-display font-bold text-slate-900 text-base md:text-lg">Onboard New Tenant Lease</h3>
            
            <form onSubmit={handleAddLeaseSubmit} className="space-y-4 text-xs">
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Select Property</label>
                <select
                  value={newLease.property_id}
                  required
                  onChange={(e) => {
                    const propId = e.target.value;
                    const linkedUnits = units.filter((u) => u.property_id === propId && u.status === UnitStatus.VACANT);
                    setNewLease({ 
                      ...newLease, 
                      property_id: propId,
                      unit_id: linkedUnits[0]?.id || "" 
                    });
                  }}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none bg-white"
                >
                  <option value="">-- Choose Building Asset --</option>
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              {newLease.property_id && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Select Vacant Unit</label>
                  <select
                    value={newLease.unit_id}
                    required
                    onChange={(e) => setNewLease({ ...newLease, unit_id: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none bg-white"
                  >
                    <option value="">-- Choose Vacant Unit --</option>
                    {units
                      .filter((u) => u.property_id === newLease.property_id && u.status === UnitStatus.VACANT)
                      .map((u) => (
                        <option key={u.id} value={u.id}>Unit {u.unit_number} (${u.rent_amount}/mo)</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tenant Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Smith"
                  value={newLease.tenant_name}
                  onChange={(e) => setNewLease({ ...newLease, tenant_name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Start Date</label>
                  <input
                    type="date"
                    required
                    value={newLease.start_date}
                    onChange={(e) => setNewLease({ ...newLease, start_date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">End Date</label>
                  <input
                    type="date"
                    required
                    value={newLease.end_date}
                    onChange={(e) => setNewLease({ ...newLease, end_date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/10 transition-colors"
              >
                Approve &amp; Onboard
              </button>

            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: ADD MAINTENANCE TICKET (REPAIR REQUEST)
          ========================================================================= */}
      {showTicketModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setShowTicketModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>
            
            <h3 className="font-display font-bold text-slate-900 text-base md:text-lg">Submit Maintenance Request</h3>
            
            <form onSubmit={handleAddTicketSubmit} className="space-y-4 text-xs">
              
              {!isTenant && (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Select Property</label>
                    <select
                      value={newTicket.property_id}
                      required
                      onChange={(e) => {
                        const propId = e.target.value;
                        const linkedUnits = units.filter((u) => u.property_id === propId);
                        setNewTicket({ 
                          ...newTicket, 
                          property_id: propId,
                          unit_id: linkedUnits[0]?.id || "" 
                        });
                      }}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none bg-white"
                    >
                      <option value="">-- Choose Asset --</option>
                      {properties.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  {newTicket.property_id && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Select Occupied Unit</label>
                      <select
                        value={newTicket.unit_id}
                        required
                        onChange={(e) => setNewTicket({ ...newTicket, unit_id: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none bg-white"
                      >
                        <option value="">-- Choose Occupied Unit --</option>
                        {units
                          .filter((u) => u.property_id === newTicket.property_id)
                          .map((u) => (
                            <option key={u.id} value={u.id}>Unit {u.unit_number} ({u.tenant_name || "Vacant"})</option>
                        ))}
                      </select>
                    </div>
                  )}
                </>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Short Issue Summary</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hot water supplier leaking sink"
                  value={newTicket.title}
                  onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Detailed Description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Explain exactly what is happening, where, and what support you require."
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Urgency Priority</label>
                <select
                  value={newTicket.priority}
                  onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value as TicketPriority })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none bg-white"
                >
                  <option value={TicketPriority.LOW}>{TicketPriority.LOW}</option>
                  <option value={TicketPriority.MEDIUM}>{TicketPriority.MEDIUM}</option>
                  <option value={TicketPriority.HIGH}>{TicketPriority.HIGH}</option>
                  <option value={TicketPriority.URGENT}>{TicketPriority.URGENT}</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/10 transition-colors"
              >
                File Request
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
