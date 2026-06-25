import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Lease, LeaseStatus, UnitStatus } from "../types";
import { 
  FileText, 
  Search, 
  Plus, 
  Trash2, 
  Edit, 
  X, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  AlertCircle, 
  Download, 
  Building2, 
  UserCheck 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const LeasesTab: React.FC = () => {
  const { 
    leases, 
    units, 
    tenants, 
    addLease, 
    updateLease, 
    deleteLease, 
    currentUser, 
    showToast 
  } = useApp();

  const isTenant = currentUser?.role === "Tenant";

  // Tab state: "list" | "new"
  const [view, setView] = useState<"list" | "new">("list");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Form states
  const [formTenantId, setFormTenantId] = useState("");
  const [formUnitId, setFormUnitId] = useState("");
  const [formStartDate, setFormStartDate] = useState("");
  const [formEndDate, setFormEndDate] = useState("");
  const [formDeposit, setFormDeposit] = useState<number>(1000);
  const [formRent, setFormRent] = useState<number>(1000);

  // Active Lease PDF Export State (Mock)
  const [pdfLease, setPdfLease] = useState<Lease | null>(null);

  // Filter leases
  const isOwner = currentUser?.role === "Owner";
  const myPropertyIds = isOwner ? properties.filter(p => p.owner_id === currentUser?.id).map(p => p.id) : [];

  const filteredLeases = leases.filter((l) => {
    if (isOwner && !myPropertyIds.includes(l.property_id)) return false;
    if (isTenant && l.tenant_id !== currentUser?.id) return false;
    const matchesSearch = l.tenant_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          l.property_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate upcoming expirations (expiring in 30 days)
  const expiringSoonLeases = filteredLeases.filter((l) => {
    if (l.status !== LeaseStatus.ACTIVE) return false;
    const end = new Date(l.end_date);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 30;
  });

  // Handle selected Unit changing to autopopulate Rent Rate
  const handleUnitSelectChange = (id: string) => {
    setFormUnitId(id);
    const selectedUnit = units.find(u => u.id === id);
    if (selectedUnit) {
      setFormRent(selectedUnit.rent_amount);
      setFormDeposit(selectedUnit.rent_amount); // Default deposit to 1 month's rent
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTenantId || !formUnitId || !formStartDate || !formEndDate) {
      showToast("Please complete all required lease parameters.", "error");
      return;
    }

    const selectedTenant = tenants.find(t => t.id === formTenantId);
    const selectedUnit = units.find(u => u.id === formUnitId);

    if (!selectedTenant || !selectedUnit) {
      showToast("Tenant or Unit details are invalid.", "error");
      return;
    }

    setIsSubmitting(true);
    const success = await addLease({
      property_id: selectedUnit.property_id,
      property_name: selectedUnit.property_name,
      unit_id: selectedUnit.id,
      unit_number: selectedUnit.unit_number,
      tenant_id: selectedTenant.id,
      tenant_name: selectedTenant.full_name,
      start_date: formStartDate,
      end_date: formEndDate,
      rent_amount: formRent,
      deposit_amount: formDeposit,
      status: LeaseStatus.ACTIVE
    });

    setIsSubmitting(false);
    if (success) {
      setView("list");
      resetForm();
    }
  };

  const resetForm = () => {
    setFormTenantId("");
    setFormUnitId("");
    setFormStartDate("");
    setFormEndDate("");
    setFormRent(1000);
    setFormDeposit(1000);
  };

  const downloadLeasePDF = (lease: Lease) => {
    setPdfLease(lease);
    showToast(`PDF Compiled: "Tenancy_Agreement_${lease.tenant_name.replace(" ", "_")}.pdf" is ready.`, "success");
  };

  // Restrict to vacant units for new leases
  const vacantUnits = units.filter(u => u.status === UnitStatus.AVAILABLE || u.status === UnitStatus.VACANT);

  return (
    <div className="space-y-6">
      {/* EXPIRY REMINDER ALERTS BANNER */}
      {expiringSoonLeases.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-xs text-rose-800 space-y-2.5 shadow-sm">
          <div className="flex items-center gap-2 font-bold text-rose-900">
            <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
            <span>Lease Expiry Reminder ({expiringSoonLeases.length} Alerts)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {expiringSoonLeases.map((l) => {
              const daysLeft = Math.ceil((new Date(l.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
              return (
                <div key={l.id} className="p-3 bg-white border border-rose-100 rounded-xl flex items-center justify-between font-medium">
                  <div>
                    <p className="font-bold text-slate-900">{l.tenant_name}</p>
                    <p className="text-[10px] text-slate-500">Unit {l.unit_number} • Expiring {l.end_date}</p>
                  </div>
                  <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-bold font-mono">
                    {daysLeft} days left
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* HEADER ROW */}
      {view === "list" && (
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex-1 w-full flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search lease by tenant name or property asset..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-slate-50 text-xs"
              />
            </div>

            {/* Filter by Status */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-48 px-3.5 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none text-xs font-semibold"
            >
              <option value="all">All Lease Statuses</option>
              <option value={LeaseStatus.ACTIVE}>Active</option>
              <option value={LeaseStatus.EXPIRED}>Expired</option>
              <option value={LeaseStatus.PENDING}>Pending Signature</option>
            </select>
          </div>

          {!isTenant && (
            <button
              onClick={() => {
                resetForm();
                if (tenants.length > 0) setFormTenantId(tenants[0].id);
                if (vacantUnits.length > 0) handleUnitSelectChange(vacantUnits[0].id);
                setView("new");
              }}
              className="w-full sm:w-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg text-xs transition-all"
            >
              <Plus className="h-4 w-4" />
              Create Lease
            </button>
          )}
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* VIEW 1: LEASES TABLE */}
        {view === "list" && (
          <motion.div
            key="list-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs text-slate-600">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[9px]">
                    <th className="p-4">Tenant Name</th>
                    <th className="p-4">Assigned Location</th>
                    <th className="p-4">Lease Duration</th>
                    <th className="p-4">Monthly Rent / Deposit</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">PDF Contracts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredLeases.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400 space-y-2">
                        <FileText className="h-10 w-10 text-slate-300 mx-auto" />
                        <p>No lease agreement history recorded.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredLeases.map((l) => (
                      <tr key={l.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center font-bold">
                              {l.tenant_name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 leading-none">{l.tenant_name}</p>
                              <span className="text-[10px] text-slate-400 font-mono mt-1 block">ID: {l.tenant_id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1">
                            <Building2 className="h-3.5 w-3.5 text-slate-400" />
                            <div>
                              <p className="font-bold text-slate-900">{l.property_name}</p>
                              <p className="text-[10px] text-slate-500">Unit {l.unit_number}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-semibold text-slate-700">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                            <span>{l.start_date}</span>
                            <span className="text-slate-400">to</span>
                            <span>{l.end_date}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-mono">
                            <p className="font-extrabold text-slate-900">${l.rent_amount.toLocaleString()}/mo</p>
                            <p className="text-[10px] text-slate-500">Sec. Dep: ${l.deposit_amount.toLocaleString()}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                            l.status === LeaseStatus.ACTIVE 
                              ? "bg-green-50 text-green-700 border-green-100" 
                              : "bg-slate-50 text-slate-500 border-slate-100"
                          }`}>
                            {l.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => downloadLeasePDF(l)}
                            className="px-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50 bg-white shadow-sm font-bold text-[10px] inline-flex items-center gap-1"
                          >
                            <Download className="h-3 w-3" />
                            Generate PDF
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* VIEW 2: CREATE LEASE AGREEMENT */}
        {view === "new" && (
          <motion.div
            key="new-lease-form"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 max-w-2xl mx-auto shadow-xl space-y-6"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-display font-extrabold text-slate-900 text-base md:text-lg">
                  Draft New Tenancy Lease Agreement
                </h3>
                <p className="text-[11px] text-slate-400">Lock in dates, rental amounts, and safety deposit obligations for onboarded tenants.</p>
              </div>
              <button
                onClick={() => setView("list")}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {tenants.length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-xs">
                You must register a Tenant in the 'Tenants' tab before establishing a lease contract.
              </div>
            ) : vacantUnits.length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-xs">
                All property units are currently occupied! Create more vacant units in the 'Units' tab first.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs text-slate-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Select Tenant */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tenant Representative *</label>
                    <select
                      value={formTenantId}
                      required
                      onChange={(e) => setFormTenantId(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none font-bold"
                    >
                      {tenants.map(t => (
                        <option key={t.id} value={t.id}>{t.full_name} ({t.email})</option>
                      ))}
                    </select>
                  </div>

                  {/* Select Vacant Unit */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Vacant Property Unit *</label>
                    <select
                      value={formUnitId}
                      required
                      onChange={(e) => handleUnitSelectChange(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none font-bold"
                    >
                      {vacantUnits.map(u => (
                        <option key={u.id} value={u.id}>{u.property_name} — Unit {u.unit_number} (Floor {u.floor})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Start Date */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Lease Term Start Date *</label>
                    <input
                      type="date"
                      required
                      value={formStartDate}
                      onChange={(e) => setFormStartDate(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none bg-slate-50 font-semibold"
                    />
                  </div>

                  {/* End Date */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Lease Term End Date *</label>
                    <input
                      type="date"
                      required
                      value={formEndDate}
                      onChange={(e) => setFormEndDate(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none bg-slate-50 font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Rent */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Monthly Rent Amount *</label>
                    <input
                      type="number"
                      required
                      value={formRent}
                      onChange={(e) => setFormRent(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none bg-slate-50 font-mono font-extrabold"
                    />
                  </div>

                  {/* Safety Deposit */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Security Deposit Required *</label>
                    <input
                      type="number"
                      required
                      value={formDeposit}
                      onChange={(e) => setFormDeposit(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none bg-slate-50 font-mono font-extrabold"
                    />
                  </div>
                </div>

                {/* Cancel / Submit Buttons */}
                <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setView("list")}
                    className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/10 disabled:opacity-50"
                  >
                    {isSubmitting ? "Registering Lease..." : "Register Lease Contract"}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* RENDER MOCK LEASE PDF VIEW FOR DIGITAL PRINTING */}
      <AnimatePresence>
        {pdfLease && (
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="bg-white border border-slate-300 rounded-2xl max-w-2xl w-full p-8 shadow-2xl space-y-6 relative font-sans my-8"
            >
              <button
                onClick={() => setPdfLease(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>

              {/* PDF Document Styling mockup */}
              <div className="p-8 border-4 border-double border-slate-800 bg-white text-slate-900 space-y-6 text-xs text-justify">
                {/* Header */}
                <div className="text-center space-y-1 pb-4 border-b-2 border-slate-800">
                  <h1 className="font-display font-black text-lg uppercase tracking-widest text-slate-950">Residential Tenancy Lease Contract</h1>
                  <p className="text-[9px] font-mono font-bold uppercase text-slate-500">Official Document Ref: PL-LEASE-{pdfLease.id.toUpperCase()}</p>
                </div>

                {/* Terms Overview */}
                <p className="leading-relaxed text-slate-800">
                  This Agreement is entered into this <strong className="font-extrabold">{pdfLease.start_date}</strong>, by and between the Landlord represented by <strong>PROPERTYLOG</strong>, and the Tenant <strong className="font-black underline">{pdfLease.tenant_name}</strong>.
                </p>

                {/* Table of terms */}
                <div className="border border-slate-800 divide-y divide-slate-800">
                  <div className="grid grid-cols-3 p-2 bg-slate-50 font-bold">
                    <span className="col-span-1">LEASE PARAMETER</span>
                    <span className="col-span-2">AGREED SPECIFICATIONS</span>
                  </div>
                  <div className="grid grid-cols-3 p-2">
                    <span className="col-span-1 font-bold">Leased Property:</span>
                    <span className="col-span-2">{pdfLease.property_name} (Unit {pdfLease.unit_number})</span>
                  </div>
                  <div className="grid grid-cols-3 p-2">
                    <span className="col-span-1 font-bold">Term Duration:</span>
                    <span className="col-span-2">{pdfLease.start_date} to {pdfLease.end_date}</span>
                  </div>
                  <div className="grid grid-cols-3 p-2">
                    <span className="col-span-1 font-bold">Monthly Rental Amount:</span>
                    <span className="col-span-2 font-mono font-bold">${pdfLease.rent_amount.toLocaleString()} USD</span>
                  </div>
                  <div className="grid grid-cols-3 p-2">
                    <span className="col-span-1 font-bold">Security Deposit:</span>
                    <span className="col-span-2 font-mono font-bold">${pdfLease.deposit_amount.toLocaleString()} USD</span>
                  </div>
                </div>

                {/* Subterms */}
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-950 uppercase text-[10px]">1. Payment of Rent</h4>
                  <p className="leading-relaxed text-slate-700 text-[10px]">
                    The tenant agrees to pay the monthly rental amount specified above in full, on or before the 1st of each calendar cycle. Payments must be processed through the PROPERTYLOG Tenant ledger system. Partial or delinquent dues are subject to immediate legal reminders and fee accrual.
                  </p>

                  <h4 className="font-bold text-slate-950 uppercase text-[10px]">2. Maintenance and Repair Dues</h4>
                  <p className="leading-relaxed text-slate-700 text-[10px]">
                    The landlord shall keep major structures, electrical, and plumbing assets in premium functional conditions. The tenant shall submit formal Maintenance Tickets for repairs and must not modify physical walls or locks without previous written permission.
                  </p>
                </div>

                {/* Signatures */}
                <div className="grid grid-cols-2 gap-12 pt-12 text-center text-[10px] font-semibold">
                  <div className="border-t border-slate-800 pt-1.5 space-y-1">
                    <p className="font-mono font-extrabold italic text-slate-500">PROPERTYLOG Agent Signature</p>
                    <p className="text-slate-400">Owner Representative</p>
                  </div>
                  <div className="border-t border-slate-800 pt-1.5 space-y-1">
                    <p className="font-mono font-extrabold italic text-slate-500">{pdfLease.tenant_name}</p>
                    <p className="text-slate-400">Onboarded Tenant Signature</p>
                  </div>
                </div>
              </div>

              {/* PDF controls */}
              <div className="flex gap-3 justify-between items-center text-xs">
                <span className="text-slate-400 font-bold font-mono text-[10px]">Status: Verified and Sealed</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPdfLease(null)}
                    className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      window.print();
                    }}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-lg shadow-blue-600/15"
                  >
                    <Download className="h-4 w-4" />
                    Print Contract Document
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
