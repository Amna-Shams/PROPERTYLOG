import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { PaymentStatus, TicketStatus } from "../types";
import { formatPKR } from "../utils/currency";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar, 
  Building2, 
  Download, 
  Filter, 
  PieChart, 
  FileSpreadsheet, 
  X, 
  Activity, 
  Layers, 
  Printer 
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  PieChart as RePieChart, 
  Pie, 
  Cell 
} from "recharts";
import { motion, AnimatePresence } from "motion/react";


export const ReportsTab: React.FC = () => {
  const { payments, tickets, properties, units, currentUser, showToast } = useApp();

  const isTenant = currentUser?.role === "Tenant";
  const isOwner = currentUser?.role === "Owner";
  const myPropertyIds = isOwner ? properties.filter(p => p.owner_id === currentUser?.id).map(p => p.id) : [];
  const selectableProperties = isOwner ? properties.filter(p => p.owner_id === currentUser?.id) : properties;

  // Filter States
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("all");
  const [startDate, setStartDate] = useState<string>("2026-01-01");
  const [endDate, setEndDate] = useState<string>("2026-12-31");

  // Print PDF state
  const [showPrintReport, setShowPrintReport] = useState(false);

  // Filter payments and tickets based on selected property & date range
  const filteredPayments = payments.filter((p) => {
    if (isOwner) {
      // Find property ID by name
      const propId = properties.find(prop => prop.name === p.property_name)?.id;
      if (propId && !myPropertyIds.includes(propId)) return false;
    }
    // If tenant, they can only report on their own payments
    const matchesUser = !isTenant || p.tenant_id === currentUser?.id;
    const matchesProp = selectedPropertyId === "all" || p.property_name === properties.find(prop => prop.id === selectedPropertyId)?.name;
    const paymentDate = p.paid_date || p.due_date;
    const matchesDate = paymentDate >= startDate && paymentDate <= endDate;
    return matchesUser && matchesProp && matchesDate;
  });

  const filteredTickets = tickets.filter((t) => {
    if (isOwner && !myPropertyIds.includes(t.property_id)) return false;
    const matchesUser = !isTenant || t.tenant_id === currentUser?.id;
    const matchesProp = selectedPropertyId === "all" || t.property_id === selectedPropertyId;
    const ticketDate = t.created_at.split("T")[0];
    const matchesDate = ticketDate >= startDate && ticketDate <= endDate;
    return matchesUser && matchesProp && matchesDate;
  });

  // Calculate high level indicators
  const totalInvoiced = filteredPayments.reduce((acc, p) => acc + p.amount, 0);
  
  const totalCollected = filteredPayments
    .filter(p => p.status === PaymentStatus.PAID)
    .reduce((acc, p) => acc + p.amount, 0);

  const totalPartial = filteredPayments
    .filter(p => p.status === PaymentStatus.PARTIAL)
    .reduce((acc, p) => acc + p.amount, 0);

  const totalCollectedWithPartial = totalCollected + totalPartial;

  const totalOutstanding = filteredPayments
    .filter(p => p.status === PaymentStatus.UNPAID || p.status === PaymentStatus.PENDING || p.status === PaymentStatus.OVERDUE)
    .reduce((acc, p) => acc + p.amount, 0);

  const totalMaintenanceExpense = filteredTickets
    .reduce((acc, t) => acc + (t.cost || 0), 0);

  const netIncome = totalCollectedWithPartial - totalMaintenanceExpense;

  // Chart Data compilation (Group by Month)
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  const monthlyData = MONTHS.map((mon, index) => {
    const monthStr = String(index + 1).padStart(2, "0");
    const yearPrefix = "2026-"; // assume 2026

    // Get payments for this month
    const rentPaid = filteredPayments
      .filter((p) => {
        const pDate = p.paid_date || p.due_date;
        return pDate.startsWith(`${yearPrefix}${monthStr}`) && (p.status === PaymentStatus.PAID || p.status === PaymentStatus.PARTIAL);
      })
      .reduce((acc, p) => acc + p.amount, 0);

    // Get maintenance costs for this month
    const maintCost = filteredTickets
      .filter((t) => t.created_at.startsWith(`${yearPrefix}${monthStr}`))
      .reduce((acc, t) => acc + (t.cost || 0), 0);

    return {
      name: mon,
      RentCollected: rentPaid,
      MaintenanceExpenses: maintCost,
      NetProfit: rentPaid - maintCost
    };
  });

  // Pie chart collection rates
  const collectionPieData = [
    { name: "Rent Collected", value: totalCollectedWithPartial, color: "#10b981" },
    { name: "Outstanding Dues", value: totalOutstanding, color: "#f43f5e" }
  ];

  const handleExportPDF = () => {
    setShowPrintReport(true);
    showToast("Opening report PDF layout preview...", "success");
  };

  return (
    <div className="space-y-6 text-slate-700 text-xs">
      {/* FILTER PANEL */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-4 items-end justify-between">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1 w-full">
          {/* Select Property */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Property Asset Group</label>
            <div className="relative">
              <Building2 className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <select
                value={selectedPropertyId}
                onChange={(e) => setSelectedPropertyId(e.target.value)}
                className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none font-semibold text-slate-900"
              >
                <option value="all">All Properties Combined</option>
                {selectableProperties.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Start Date */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Start Cycle Date</label>
            <div className="relative">
              <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none font-semibold text-slate-900"
              />
            </div>
          </div>

          {/* End Date */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">End Cycle Date</label>
            <div className="relative">
              <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none font-semibold text-slate-900"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleExportPDF}
          className="w-full md:w-auto px-4.5 py-2 bg-slate-950 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg transition-all"
        >
          <Printer className="h-4 w-4" />
          Export PDF Report
        </button>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-green-500 font-bold uppercase tracking-wider">Rent Collected</span>
            <p className="font-mono font-extrabold text-2xl text-green-600">{formatPKR(totalCollectedWithPartial)}</p>
          </div>
          <div className="text-[10px] text-slate-400 mt-2 font-mono flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5 text-green-500" />
            <span>Success Rate: {totalInvoiced ? Math.round((totalCollectedWithPartial / totalInvoiced) * 100) : 0}%</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-rose-500 font-bold uppercase tracking-wider">Pending / Unpaid Dues</span>
            <p className="font-mono font-extrabold text-2xl text-rose-600">{formatPKR(totalOutstanding)}</p>
          </div>
          <div className="text-[10px] text-slate-400 mt-2 font-mono">
            <span>Outstanding invoice lines: {filteredPayments.filter(p => p.status !== PaymentStatus.PAID).length} items</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-amber-500 font-bold uppercase tracking-wider">Maintenance Costs</span>
            <p className="font-mono font-extrabold text-2xl text-amber-600">{formatPKR(totalMaintenanceExpense)}</p>
          </div>
          <div className="text-[10px] text-slate-400 mt-2 font-mono">
            <span>Completed repair tickets: {filteredTickets.length} tasks</span>
          </div>
        </div>

        {/* Metric 4: Net Income */}
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-indigo-500 font-bold uppercase tracking-wider">Net profit margin</span>
            <p className="font-mono font-extrabold text-2xl text-indigo-600">{formatPKR(netIncome)}</p>
          </div>
          <div className="text-[10px] text-slate-400 mt-2 font-mono flex items-center gap-1">
            <Activity className="h-3.5 w-3.5 text-indigo-500" />
            <span>Earnings after repairs</span>
          </div>
        </div>
      </div>

      {/* CHARTS CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Dual Bar chart (Rent vs Expense) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h4 className="font-display font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <FileSpreadsheet className="h-4 w-4 text-blue-500" />
              Monthly Rent Collection vs. Expenses
            </h4>
            <span className="text-[9px] bg-slate-100 text-slate-500 font-mono font-bold px-2 py-0.5 rounded-full">Calendar Year 2026</span>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} stroke="#94a3b8" />
                <YAxis fontSize={10} tickLine={false} axisLine={false} stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ background: "#0f172a", border: "none", borderRadius: "12px", color: "#fff", fontSize: "11px" }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "10px", fontWeight: "bold" }} />
                <Bar dataKey="RentCollected" name="Rent Collection ($)" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={12} />
                <Bar dataKey="MaintenanceExpenses" name="Maintenance Costs ($)" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Collection rate pie chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm lg:col-span-1 space-y-4 flex flex-col justify-between">
          <div className="border-b border-slate-100 pb-3">
            <h4 className="font-display font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <PieChart className="h-4 w-4 text-emerald-500" />
              Rent Collection Efficiency
            </h4>
          </div>

          <div className="h-48 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={collectionPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {collectionPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: "11px" }} />
              </RePieChart>
            </ResponsiveContainer>
            
            {/* Center rate label */}
            <div className="absolute text-center">
              <p className="text-xl font-mono font-black text-slate-900">
                {totalInvoiced ? Math.round((totalCollectedWithPartial / totalInvoiced) * 100) : 0}%
              </p>
              <span className="text-[9px] text-slate-400 font-bold uppercase">Success</span>
            </div>
          </div>

          {/* Pie Legends */}
          <div className="space-y-2 pt-3 border-t border-slate-50 font-medium">
            <div className="flex justify-between items-center text-[10px]">
              <span className="flex items-center gap-1.5 text-slate-500">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Collected Rent
              </span>
              <span className="font-bold text-slate-800 font-mono">{formatPKR(totalCollectedWithPartial)}</span>
            </div>
            <div className="flex justify-between items-center text-[10px]">
              <span className="flex items-center gap-1.5 text-slate-500">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                Delinquent Dues
              </span>
              <span className="font-bold text-slate-800 font-mono">{formatPKR(totalOutstanding)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* DETAILED LEDGER COMPILATION TABLE */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h4 className="font-display font-bold text-slate-900 text-sm flex items-center gap-1.5">
          <FileSpreadsheet className="h-4.5 w-4.5 text-slate-500" />
          General Ledger Auditing Rows
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs text-slate-600">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[9px]">
                <th className="p-3">Reference Item</th>
                <th className="p-3">Category</th>
                <th className="p-3">Date</th>
                <th className="p-3 font-mono">Amount Debit</th>
                <th className="p-3 font-mono">Amount Credit</th>
                <th className="p-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {/* Combine payments & maintenance tickets as general ledger rows */}
              {filteredPayments.map((p) => (
                <tr key={`pay-${p.id}`} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-3 font-bold text-slate-900">Rent: {p.tenant_name} (Unit {p.unit_number})</td>
                  <td className="p-3 text-emerald-600 font-bold">Revenue</td>
                  <td className="p-3 font-mono">{p.paid_date || p.due_date}</td>
                  <td className="p-3 font-mono text-slate-400">—</td>
                  <td className="p-3 font-mono text-green-600 font-bold">{formatPKR(p.amount)}</td>
                  <td className="p-3 text-right">
                    <span className="px-1.5 py-0.5 rounded bg-green-50 text-green-700 text-[9px] font-bold border border-green-100">{p.status}</span>
                  </td>
                </tr>
              ))}
              {filteredTickets.filter(t => t.cost > 0).map((t) => (
                <tr key={`ticket-${t.id}`} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-3 font-bold text-slate-900">Repair: {t.title} (Unit {t.unit_number})</td>
                  <td className="p-3 text-amber-600 font-bold">Expense</td>
                  <td className="p-3 font-mono">{t.created_at.split("T")[0]}</td>
                  <td className="p-3 font-mono text-amber-600 font-bold">{formatPKR(t.cost)}</td>
                  <td className="p-3 font-mono text-slate-400">—</td>
                  <td className="p-3 text-right">
                    <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 text-[9px] font-bold border border-amber-100">Disbursed</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PRINT DIALOG / FULL DOCUMENT MOCK */}
      <AnimatePresence>
        {showPrintReport && (
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="bg-white border border-slate-300 rounded-2xl max-w-4xl w-full p-8 shadow-2xl space-y-6 relative font-sans my-8"
            >
              <button
                onClick={() => setShowPrintReport(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Printable Document Sheet */}
              <div className="p-8 border border-slate-300 bg-white text-slate-900 space-y-6 text-xs leading-relaxed">
                <div className="flex justify-between items-start border-b-2 border-slate-800 pb-4">
                  <div>
                    <h1 className="font-display font-black text-base uppercase tracking-wider text-slate-950">PROPERTYLOG Corporate Audit Report</h1>
                    <p className="text-[10px] text-slate-500 font-mono">Date Compiled: {new Date().toLocaleDateString()} • Date Range: {startDate} to {endDate}</p>
                  </div>
                  <div className="text-right">
                    <span className="px-3 py-1 bg-slate-100 border border-slate-300 rounded-lg text-[9px] uppercase font-black font-mono">
                      CONFIDENTIAL_AUDIT
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl text-center font-mono">
                  <div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase">Revenue Collected</p>
                    <p className="font-black text-green-600 text-sm mt-1">{formatPKR(totalCollectedWithPartial)}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase">Pending dues</p>
                    <p className="font-black text-rose-600 text-sm mt-1">{formatPKR(totalOutstanding)}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase">Expenses Disbursed</p>
                    <p className="font-black text-amber-600 text-sm mt-1">{formatPKR(totalMaintenanceExpense)}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase">Net Profit Margin</p>
                    <p className="font-black text-indigo-600 text-sm mt-1">{formatPKR(netIncome)}</p>
                  </div>
                </div>

                {/* Spreadsheet Content */}
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-950 text-xs">Summary of Operations</h4>
                  <p className="text-slate-500 text-[10px]">
                    This certified financial summary encompasses rental asset revenues and repair expenses registered in the PROPERTYLOG ledger under active scopes. Under audit parameters, total verified collections amount to <strong className="text-slate-900">{formatPKR(totalCollectedWithPartial)}</strong> with outstanding tenant balances of <strong className="text-slate-900">{formatPKR(totalOutstanding)}</strong>.
                  </p>
                </div>

                <div className="border border-slate-800 rounded-lg overflow-hidden font-mono text-[9px]">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-900 text-white font-bold border-b border-slate-800">
                        <th className="p-2">Item Category</th>
                        <th className="p-2">Reference Ref</th>
                        <th className="p-2 text-right">Debit</th>
                        <th className="p-2 text-right">Credit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr>
                        <td className="p-2 font-bold">Total Rental Collections</td>
                        <td className="p-2">REV-RENTAL</td>
                        <td className="p-2 text-right text-slate-400">—</td>
                        <td className="p-2 text-right text-green-700 font-bold">{formatPKR(totalCollectedWithPartial)}</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold">Maintenance repairs &amp; fixes</td>
                        <td className="p-2">EXP-MAINTENANCE</td>
                        <td className="p-2 text-right text-amber-700 font-bold">{formatPKR(totalMaintenanceExpense)}</td>
                        <td className="p-2 text-right text-slate-400">—</td>
                      </tr>
                      <tr className="bg-slate-50 font-black text-[10px] border-t-2 border-slate-800">
                        <td className="p-2" colSpan={2}>Net Financial Position</td>
                        <td className="p-2 text-right" colSpan={2}>
                          <span className={netIncome >= 0 ? "text-green-700" : "text-rose-700"}>{formatPKR(netIncome)}</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-between items-center pt-8 text-[9px] text-slate-400 border-t border-slate-200">
                  <p>Certified by PROPERTYLOG Auditing Engine</p>
                  <p className="font-mono">Reference verification hash: {Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
                </div>
              </div>

              {/* print layout controls */}
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowPrintReport(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 font-bold"
                >
                  Close Document
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2 bg-slate-950 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-lg"
                >
                  <Printer className="h-4 w-4" />
                  Print Full Summary
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
