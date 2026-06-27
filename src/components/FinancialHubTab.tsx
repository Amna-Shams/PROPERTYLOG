import React from "react";
import {
  Home,
  DollarSign,
  PieChart,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  FileText,
  MessageSquare,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { formatPKR } from "../utils/currency";

export const FinancialHubTab: React.FC = () => {
  const { properties, payments, units, leases } = useApp();

  // Metrics Calculations (Mock logic, should be improved if actual data is available)
  const totalProperties = properties.length;
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyIncome = payments
    .filter(
      (p) =>
        p.status === "Paid" &&
        new Date(p.paid_date || p.due_date).getMonth() === currentMonth &&
        new Date(p.paid_date || p.due_date).getFullYear() === currentYear
    )
    .reduce((sum, p) => sum + p.amount, 0);

  const occupiedUnits = units.filter((u) => u.status === "Occupied").length;
  const totalUnits = units.length;
  const occupancyRate = totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0;

  const ytdNetIncome = 50000; // Mock placeholder
  const cashOnCashReturn = 8.4; // Mock placeholder

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Properties"
          value={totalProperties.toString()}
          icon={<Home className="h-5 w-5 text-blue-500" />}
        />
        <MetricCard
          title="Monthly Gross Income"
          value={formatPKR(monthlyIncome)}
          icon={<DollarSign className="h-5 w-5 text-emerald-500" />}
          tooltip="Sum of all rent collected this month across your portfolio"
        />
        <MetricCard
          title="Occupied Units"
          value={`${occupancyRate.toFixed(1)}%`}
          icon={<PieChart className="h-5 w-5 text-purple-500" />}
          status={occupancyRate >= 90 ? "green" : occupancyRate >= 70 ? "yellow" : "red"}
          tooltip="Percentage of your total units currently leased to residents"
        />
        <MetricCard
          title="YTD Net Income"
          value={formatPKR(ytdNetIncome)}
          icon={<TrendingUp className="h-5 w-5 text-emerald-500" />}
          status="green"
          tooltip="Total income minus total expenses since January 1"
        />
        <MetricCard
          title="Annual Return on Investment"
          value={`${cashOnCashReturn.toFixed(1)}%`}
          icon={<TrendingUp className="h-5 w-5 text-amber-500" />}
          tooltip="Annual pre-tax cash flow divided by total cash invested."
        />
      </div>

      {/* Property List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {properties.map((property) => {
          const propertyUnits = units.filter((u) => u.property_id === property.id);
          return (
            <div key={property.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-slate-900">{property.name}</h3>
                  <p className="text-sm text-slate-500">{property.address}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {propertyUnits.map((unit) => {
                  const lease = leases.find((l) => l.unit_id === unit.id && l.status === "Active");
                  
                  if (unit.status === "Vacant") {
                    return (
                      <div key={unit.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1 text-sm">
                        <p className="font-semibold">Unit {unit.unit_number}</p>
                        <p className="text-slate-600">Location: {property.address}</p>
                        <StatusBadge status="Vacant" />
                        <p className="font-bold">Monthly Rent: {formatPKR(unit.rent_amount)}</p>
                      </div>
                    );
                  }

                  return (
                    <div key={unit.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm">Unit {unit.unit_number}</span>
                        <StatusBadge status={lease ? "Paid" : "Pending"} />
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Resident:</span>
                        <span className="font-medium">{lease?.tenant_name || "❌ Vacant"}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Monthly Rent:</span>
                        <span className="font-bold text-lg">{formatPKR(unit.rent_amount)}</span>
                      </div>
                      
                      <div className="flex gap-2 pt-2">
                        <button className="flex-1 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-lg hover:bg-slate-100">View Details</button>
                        <button className="flex-1 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-lg hover:bg-slate-100">Generate Report</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


// Helper Components
const MetricCard: React.FC<{ title: string; value: string; icon: React.ReactNode; status?: "green" | "yellow" | "red"; tooltip?: string }> = ({ title, value, icon, status, tooltip }) => (
  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
    <div className="flex items-center justify-between">
      <div className="p-2 rounded-xl bg-slate-50">{icon}</div>
      {status && <span className={`h-2 w-2 rounded-full ${status === "green" ? "bg-emerald-500" : status === "yellow" ? "bg-amber-500" : "bg-rose-500"}`} />}
    </div>
    <div>
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{title}</p>
      <p className="text-xl font-display font-extrabold text-slate-900">{value}</p>
    </div>
  </div>
);

const StatusBadge: React.FC<{ status: "Paid" | "Partial" | "Overdue" | "Vacant" | "Pending" }> = ({ status }) => {
  const styles = {
    Paid: "bg-emerald-100 text-emerald-700",
    Partial: "bg-amber-100 text-amber-700",
    Overdue: "bg-rose-100 text-rose-700",
    Vacant: "bg-slate-100 text-slate-700",
    Pending: "bg-blue-100 text-blue-700",
  };
  return <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${styles[status]}`}>{status}</span>;
};
