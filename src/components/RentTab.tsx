import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { RentPayment, PaymentStatus, Lease } from "../types";
import { 
  DollarSign, 
  Search, 
  Plus, 
  Trash2, 
  Edit, 
  X, 
  Calendar, 
  CreditCard, 
  FileCheck, 
  Download, 
  Building2, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Wallet 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const RentTab: React.FC = () => {
  const { 
    payments, 
    leases, 
    addPayment, 
    updatePayment, 
    deletePayment, 
    markPaymentPaid, 
    currentUser, 
    showToast 
  } = useApp();

  const isTenant = currentUser?.role === "Tenant";

  // State: "list" | "new"
  const [view, setView] = useState<"list" | "new">("list");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Rent Invoice Generator states
  const [formLeaseId, setFormLeaseId] = useState("");
  const [formAmount, setFormAmount] = useState<number>(1200);
  const [formDueDate, setFormDueDate] = useState("");
  const [formStatus, setFormStatus] = useState<PaymentStatus>(PaymentStatus.PENDING);

  // Mark Paid Drawer states
  const [selectedPayId, setSelectedPayId] = useState<string | null>(null);
  const [payMethod, setPayMethod] = useState("Bank Transfer");
  const [receivedAmount, setReceivedAmount] = useState<number>(0);

  // Active Receipt PDF State (Mock)
  const [receiptPdf, setReceiptPdf] = useState<RentPayment | null>(null);

  // Filtering payments
  const filteredPayments = payments.filter((p) => {
    // If tenant, they only see their own rent history!
    const matchesUser = !isTenant || p.tenant_name.toLowerCase() === currentUser?.name.toLowerCase();
    
    const matchesSearch = p.tenant_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.property_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    
    return matchesUser && matchesSearch && matchesStatus;
  });

  // Calculations
  const totalInvoiced = filteredPayments.reduce((acc, p) => acc + p.amount, 0);
  const totalPaid = filteredPayments.filter(p => p.status === PaymentStatus.PAID).reduce((acc, p) => acc + p.amount, 0);
  const totalPartial = filteredPayments.filter(p => p.status === PaymentStatus.PARTIAL).reduce((acc, p) => acc + p.amount, 0);
  const totalUnpaid = filteredPayments.filter(p => p.status === PaymentStatus.UNPAID || p.status === PaymentStatus.PENDING).reduce((acc, p) => acc + p.amount, 0);

  const handleLeaseSelectChange = (leaseId: string) => {
    setFormLeaseId(leaseId);
    const lease = leases.find(l => l.id === leaseId);
    if (lease) {
      setFormAmount(lease.rent_amount);
    }
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formLeaseId || !formDueDate) {
      showToast("Please select a lease and choose a due date.", "error");
      return;
    }

    const lease = leases.find(l => l.id === formLeaseId);
    if (!lease) {
      showToast("Selected lease profile is invalid.", "error");
      return;
    }

    setIsSubmitting(true);
    const success = await addPayment({
      tenant_id: lease.tenant_id,
      tenant_name: lease.tenant_name,
      unit_id: lease.unit_id,
      unit_number: lease.unit_number,
      property_name: lease.property_name,
      amount: formAmount,
      due_date: formDueDate,
      status: formStatus
    });

    setIsSubmitting(false);
    if (success) {
      setView("list");
      resetForm();
    }
  };

  const resetForm = () => {
    setFormLeaseId("");
    setFormAmount(1200);
    setFormDueDate("");
    setFormStatus(PaymentStatus.PENDING);
  };

  const triggerRecordPayment = (pay: RentPayment) => {
    setSelectedPayId(pay.id);
    setReceivedAmount(pay.amount); // Default to full amount
  };

  const handleSavePaymentRecord = async () => {
    if (!selectedPayId) return;

    const paymentItem = payments.find(p => p.id === selectedPayId);
    if (!paymentItem) return;

    if (receivedAmount <= 0) {
      showToast("Amount received must be greater than zero.", "error");
      return;
    }

    setIsSubmitting(true);
    let success = false;

    if (receivedAmount < paymentItem.amount) {
      // Partial Payment
      success = await updatePayment({
        ...paymentItem,
        status: PaymentStatus.PARTIAL,
        paid_date: new Date().toISOString().split("T")[0],
        payment_method: payMethod,
        amount: receivedAmount // adjust amount to what was actually paid
      });
      if (success) {
        showToast(`Logged partial payment of $${receivedAmount} via ${payMethod}.`, "success");
      }
    } else {
      // Full Payment
      success = await markPaymentPaid(selectedPayId, payMethod);
    }
    
    setIsSubmitting(false);
    if (success) {
      setSelectedPayId(null);
    }
  };

  const handleDeletePayment = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this rent payment entry?")) {
      setIsSubmitting(true);
      await deletePayment(id);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* LEDGER STATS WIDGETS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* STAT 1: Invoiced */}
        <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Invoiced</span>
            <p className="font-mono font-extrabold text-slate-900 text-lg">${totalInvoiced.toLocaleString()}</p>
          </div>
          <div className="h-10 w-10 bg-slate-50 text-slate-600 rounded-xl border border-slate-100 flex items-center justify-center">
            <Wallet className="h-5 w-5" />
          </div>
        </div>

        {/* STAT 2: Collected */}
        <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] text-green-500 font-bold uppercase tracking-wider">Rent Collected</span>
            <p className="font-mono font-extrabold text-green-700 text-lg">${totalPaid.toLocaleString()}</p>
          </div>
          <div className="h-10 w-10 bg-green-50 text-green-600 rounded-xl border border-green-100 flex items-center justify-center">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>

        {/* STAT 3: Partial Collection */}
        <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] text-amber-500 font-bold uppercase tracking-wider">Partial Cleared</span>
            <p className="font-mono font-extrabold text-amber-700 text-lg">${totalPartial.toLocaleString()}</p>
          </div>
          <div className="h-10 w-10 bg-amber-50 text-amber-600 rounded-xl border border-amber-100 flex items-center justify-center">
            <CreditCard className="h-5 w-5" />
          </div>
        </div>

        {/* STAT 4: Outstanding */}
        <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] text-rose-500 font-bold uppercase tracking-wider">Outstanding Dues</span>
            <p className="font-mono font-extrabold text-rose-700 text-lg">${totalUnpaid.toLocaleString()}</p>
          </div>
          <div className="h-10 w-10 bg-rose-50 text-rose-600 rounded-xl border border-rose-100 flex items-center justify-center">
            <TrendingDown className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* FILTER HEADER ROW */}
      {view === "list" && (
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex-1 w-full flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search rent history by tenant or property asset..."
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
              <option value="all">All Payment Statuses</option>
              <option value={PaymentStatus.PAID}>Paid</option>
              <option value={PaymentStatus.PARTIAL}>Partial</option>
              <option value={PaymentStatus.UNPAID}>Unpaid</option>
              <option value={PaymentStatus.PENDING}>Pending</option>
              <option value={PaymentStatus.OVERDUE}>Overdue</option>
            </select>
          </div>

          {!isTenant && (
            <button
              onClick={() => {
                resetForm();
                if (leases.length > 0) handleLeaseSelectChange(leases[0].id);
                setView("new");
              }}
              className="w-full sm:w-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg text-xs transition-all"
            >
              <Plus className="h-4 w-4" />
              Generate Rent Invoice
            </button>
          )}
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* VIEW 1: RENT INVOICES TABLE */}
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
                    <th className="p-4">Billing Tenant</th>
                    <th className="p-4">Property / Unit</th>
                    <th className="p-4">Amount Invoiced</th>
                    <th className="p-4">Due Date</th>
                    <th className="p-4">Billing Status</th>
                    <th className="p-4">Receipt Details</th>
                    <th className="p-4 text-right">Ledger Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredPayments.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400 space-y-2">
                        <DollarSign className="h-10 w-10 text-slate-300 mx-auto" />
                        <p>No rent invoices or ledger items found.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredPayments.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-bold">
                              {p.tenant_name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 leading-none">{p.tenant_name}</p>
                              <span className="text-[10px] text-slate-400 font-mono mt-1 block">ID: {p.tenant_id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1.5">
                            <Building2 className="h-3.5 w-3.5 text-slate-400" />
                            <div>
                              <p className="font-bold text-slate-900">{p.property_name}</p>
                              <p className="text-[10px] text-slate-500">Unit {p.unit_number}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-mono font-extrabold text-slate-950 text-sm">
                          ${p.amount.toLocaleString()}
                        </td>
                        <td className="p-4">
                          <span className="flex items-center gap-1 font-semibold text-slate-700">
                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                            {p.due_date}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border inline-flex items-center gap-1 ${
                            p.status === PaymentStatus.PAID 
                              ? "bg-green-50 text-green-700 border-green-100" 
                              : p.status === PaymentStatus.PARTIAL 
                                ? "bg-amber-50 text-amber-700 border-amber-100" 
                                : p.status === PaymentStatus.OVERDUE 
                                  ? "bg-red-50 text-red-700 border-red-100" 
                                  : "bg-slate-50 text-slate-500 border-slate-200"
                          }`}>
                            <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                              p.status === PaymentStatus.PAID 
                                ? "bg-green-500" 
                                : p.status === PaymentStatus.PARTIAL 
                                  ? "bg-amber-500" 
                                  : p.status === PaymentStatus.OVERDUE 
                                    ? "bg-red-500" 
                                    : "bg-slate-400"
                            }`} />
                            {p.status}
                          </span>
                        </td>
                        <td className="p-4">
                          {p.paid_date ? (
                            <div className="text-[10px] text-slate-500 leading-tight">
                              <p className="font-bold text-slate-800">Paid: {p.paid_date}</p>
                              <p className="font-mono text-[9px]">{p.payment_method}</p>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">Unpaid Ledger</span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Receipt button (Only if PAID or PARTIAL) */}
                            {(p.status === PaymentStatus.PAID || p.status === PaymentStatus.PARTIAL) && (
                              <button
                                onClick={() => setReceiptPdf(p)}
                                className="p-1.5 rounded-lg border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 bg-white shadow-sm"
                                title="Download Receipt PDF"
                              >
                                <Download className="h-3.5 w-3.5" />
                              </button>
                            )}

                            {/* Mark Paid action */}
                            {p.status !== PaymentStatus.PAID && (
                              <button
                                onClick={() => triggerRecordPayment(p)}
                                className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] flex items-center gap-1 shadow-sm transition-all"
                              >
                                <FileCheck className="h-3 w-3" />
                                {isTenant ? "Pay Bill" : "Clear dues"}
                              </button>
                            )}

                            {/* Delete ledger entry (only for Admin/Owner) */}
                            {!isTenant && (
                              <button
                                onClick={() => handleDeletePayment(p.id)}
                                disabled={isSubmitting}
                                className="p-1.5 rounded-lg border border-slate-200 hover:border-rose-300 hover:bg-rose-50 text-rose-500 bg-white shadow-sm disabled:opacity-50"
                                title="Delete Record"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* VIEW 2: GENERATE RENT INVOICES */}
        {view === "new" && (
          <motion.div
            key="new-invoice-form"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 max-w-lg mx-auto shadow-xl space-y-6"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-display font-extrabold text-slate-900 text-base md:text-lg">
                  Generate Rent Invoicing Ledger
                </h3>
                <p className="text-[11px] text-slate-400">Trigger active cycles or ledger receipts manually for registered lease terms.</p>
              </div>
              <button
                onClick={() => setView("list")}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {leases.length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-xs">
                You must establish a Lease Agreement in the 'Leases' tab before triggering monthly invoices.
              </div>
            ) : (
              <form onSubmit={handleCreateInvoice} className="space-y-4 text-xs text-slate-700">
                {/* Select Lease */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active Leased Tenant Term *</label>
                  <select
                    value={formLeaseId}
                    required
                    onChange={(e) => handleLeaseSelectChange(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none font-bold"
                  >
                    {leases.map(l => (
                      <option key={l.id} value={l.id}>{l.tenant_name} (Unit {l.unit_number} — {l.property_name})</option>
                    ))}
                  </select>
                </div>

                {/* Amount */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Billing Invoice Amount *</label>
                  <div className="relative">
                    <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      required
                      value={formAmount}
                      onChange={(e) => setFormAmount(parseInt(e.target.value) || 0)}
                      className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-xl focus:outline-none bg-slate-50 font-mono font-bold text-sm"
                    />
                  </div>
                </div>

                {/* Due Date */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Payment Due Date *</label>
                  <input
                    type="date"
                    required
                    value={formDueDate}
                    onChange={(e) => setFormDueDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none bg-slate-50 font-bold"
                  />
                </div>

                {/* Status */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Initial Ledger Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as PaymentStatus)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none font-semibold"
                  >
                    <option value={PaymentStatus.PENDING}>Pending / Issued</option>
                    <option value={PaymentStatus.UNPAID}>Unpaid / Late</option>
                    <option value={PaymentStatus.PAID}>Paid</option>
                  </select>
                </div>

                {/* Submit buttons */}
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
                    {isSubmitting ? "Generating..." : "Generate Invoice"}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL / BOTTOM SLIDE DRAWER FOR RECORDING A PAYMENT */}
      <AnimatePresence>
        {selectedPayId && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border border-slate-200 max-w-sm w-full p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="font-display font-extrabold text-slate-900 text-sm flex items-center gap-1">
                  <CreditCard className="h-4.5 w-4.5 text-blue-500" />
                  Record Rent Collection
                </h3>
                <button
                  onClick={() => setSelectedPayId(null)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <div className="space-y-4 text-xs text-slate-700">
                {/* Method selection */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Payment Method</label>
                  <select
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none"
                  >
                    <option value="Bank Transfer">Bank Transfer / Automated deposit</option>
                    <option value="Credit Card">Credit/Debit Card (Stripe)</option>
                    <option value="Cash">Cash Ledger handoff</option>
                    <option value="Cheque">Bank Check Document</option>
                  </select>
                </div>

                {/* Received Amount */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Amount Received (USD)</label>
                  <input
                    type="number"
                    min={1}
                    value={receivedAmount}
                    onChange={(e) => setReceivedAmount(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none font-mono font-extrabold text-slate-900 bg-slate-50"
                  />
                  <span className="text-[9px] text-slate-400">If less than full invoiced dues, it will register as a <strong>Partial</strong> payment.</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2.5 justify-end pt-3 border-t border-slate-100">
                  <button
                    onClick={() => setSelectedPayId(null)}
                    className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSavePaymentRecord}
                    disabled={isSubmitting}
                    className="px-5 py-2 bg-slate-950 hover:bg-slate-800 text-white font-bold rounded-xl disabled:opacity-50"
                  >
                    {isSubmitting ? "Logging..." : "Log Cash Payment"}
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: RENDER OFFICIAL RECEIPT PDF */}
      <AnimatePresence>
        {receiptPdf && (
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="bg-white border border-slate-300 rounded-2xl max-w-lg w-full p-8 shadow-2xl space-y-6 relative font-sans my-8"
            >
              <button
                onClick={() => setReceiptPdf(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>

              {/* PDF Invoice Receipt Style mockup */}
              <div className="p-8 border border-slate-200 bg-slate-50/50 text-slate-800 space-y-6 text-xs rounded-xl">
                {/* Brand */}
                <div className="flex justify-between items-start border-b border-slate-200 pb-4">
                  <div>
                    <h2 className="font-display font-black text-sm uppercase tracking-wide text-slate-950">PROPERTYLOG</h2>
                    <p className="text-[9px] text-slate-400">Asset Management Solutions</p>
                  </div>
                  <div className="text-right">
                    <span className="px-2.5 py-1 bg-green-100 text-green-800 font-bold text-[9px] rounded-md tracking-wider uppercase border border-green-200">
                      Payment Receipt
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[8px] font-bold text-slate-400 uppercase">Received From:</span>
                    <p className="font-bold text-slate-900 text-sm mt-0.5">{receiptPdf.tenant_name}</p>
                    <p className="text-slate-500">Tenant Reference ID: {receiptPdf.tenant_id}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[8px] font-bold text-slate-400 uppercase">Property Location:</span>
                    <p className="font-bold text-slate-800 mt-0.5">{receiptPdf.property_name}</p>
                    <p className="text-slate-500">Unit Number: {receiptPdf.unit_number}</p>
                  </div>
                </div>

                {/* Ledger calculations */}
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                  <div className="grid grid-cols-3 p-2 bg-slate-100 font-bold text-[10px] text-slate-500 uppercase border-b border-slate-200">
                    <span>Billing Item</span>
                    <span className="text-center">Reference Date</span>
                    <span className="text-right">Total Confirmed</span>
                  </div>
                  <div className="grid grid-cols-3 p-3">
                    <span className="font-bold">Monthly Rental dues</span>
                    <span className="text-center">{receiptPdf.paid_date || receiptPdf.due_date}</span>
                    <span className="text-right font-mono font-bold text-slate-950">${receiptPdf.amount.toLocaleString()} USD</span>
                  </div>
                </div>

                {/* Transaction details */}
                <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1.5 font-mono text-[10px]">
                  <div className="flex justify-between text-slate-500">
                    <span>Payment Method:</span>
                    <span className="text-slate-800 font-bold">{receiptPdf.payment_method || "Direct Transfer"}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Cleared Date:</span>
                    <span className="text-slate-800 font-bold">{receiptPdf.paid_date || "—"}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Authentication:</span>
                    <span className="text-green-600 font-bold">SECURE_LEDGER_CONFIRMED</span>
                  </div>
                </div>

                {/* Footer seal */}
                <div className="text-center text-[9px] text-slate-400 space-y-1 pt-4 border-t border-slate-200">
                  <p>Thank you for choosing PROPERTYLOG! Your dues are fully processed.</p>
                  <p className="font-mono text-[8px]">Ref Transaction payload hash: sha256_pay_{receiptPdf.id}</p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setReceiptPdf(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 font-bold"
                >
                  Close Receipt
                </button>
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-md"
                >
                  <Download className="h-4 w-4" />
                  Print Receipt Document
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
