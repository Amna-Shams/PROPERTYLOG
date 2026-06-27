import React from "react";
import { Building2, Users, Wrench, AlertTriangle, DollarSign, CheckCircle2 } from "lucide-react";
import { useApp } from "../context/AppContext";
import { UserRole, UnitStatus, LeaseStatus, TicketStatus, PaymentStatus, TicketPriority } from "../types";
import { formatPKR } from "../utils/currency";


export const OverviewTab: React.FC = () => {
  const {
    currentUser,
    properties,
    units,
    leases,
    tickets,
    payments,
  } = useApp();

  if (!currentUser) return null;

  const isTenant = currentUser.role === UserRole.TENANT;
  const isOwner = currentUser.role === UserRole.OWNER;
  const isAdmin = currentUser.role === UserRole.ADMIN;

  const activeTenantId = isTenant ? currentUser.id : "";

  // Data Filtering for Overview
  const filteredProperties = isOwner ? properties.filter(p => p.owner_id === currentUser.id) : properties;
  const filteredUnits = isOwner 
    ? units.filter(u => filteredProperties.some(p => p.id === u.property_id))
    : units;
  const filteredLeases = isOwner
    ? leases.filter(l => filteredProperties.some(p => p.id === l.property_id))
    : isTenant
    ? leases.filter(l => l.tenant_id === activeTenantId)
    : leases;
  const filteredTickets = isOwner
    ? tickets.filter(t => filteredProperties.some(p => p.id === t.property_id))
    : isTenant
    ? tickets.filter(t => t.tenant_id === activeTenantId)
    : tickets;
  const filteredPayments = isOwner
    ? payments.filter(pay => filteredProperties.some(p => p.id === pay.property_id || pay.property_name === p.name))
    : isTenant
    ? payments.filter(pay => pay.tenant_id === activeTenantId)
    : payments;

  // Overview aggregations
  const totalProperties = filteredProperties.length;
  const occupiedUnits = filteredUnits.filter((u) => u.status === UnitStatus.OCCUPIED).length;
  
  const activeTenantsCount = filteredLeases.filter((l) => l.status === LeaseStatus.ACTIVE).length;
  
  const totalRentBilledThisMonth = filteredPayments
    .filter((p) => p.due_date.startsWith("2026-06"))
    .reduce((sum, p) => sum + p.amount, 0);

  const totalRentCollectedThisMonth = filteredPayments
    .filter((p) => p.due_date.startsWith("2026-06") && p.status === PaymentStatus.PAID)
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingDuesAmount = filteredPayments
    .filter((p) => p.status === PaymentStatus.PENDING || p.status === PaymentStatus.OVERDUE || p.status === PaymentStatus.UNPAID)
    .reduce((sum, p) => sum + p.amount, 0);

  const activeMaintenanceTickets = filteredTickets.filter(
    (t) => t.status === TicketStatus.OPEN || t.status === TicketStatus.IN_PROGRESS
  ).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stat Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        
        {/* Stat 1: Properties (Not for tenants) */}
        {!isTenant && (
          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm flex items-center gap-3 transition-all hover:border-slate-300">
            <div className="h-9 w-9 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg flex items-center justify-center shrink-0">
              <Building2 className="h-4.5 w-4.5" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Properties</div>
              <div className="text-base font-extrabold font-display text-slate-950">{totalProperties}</div>
            </div>
          </div>
        )}

        {/* Stat 2: Occupied Units (Not for tenants) */}
        {!isTenant && (
          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm flex items-center gap-3 transition-all hover:border-slate-300">
            <div className="h-9 w-9 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-lg flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-4.5 w-4.5" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Occupied</div>
              <div className="text-base font-extrabold font-display text-slate-950">
                {occupiedUnits}/{filteredUnits.length}
              </div>
            </div>
          </div>
        )}

        {/* Stat 3: Active Tenants / Lease Status */}
        {!isTenant ? (
          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm flex items-center gap-3 transition-all hover:border-slate-300">
            <div className="h-9 w-9 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg flex items-center justify-center shrink-0">
              <Users className="h-4.5 w-4.5" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tenants</div>
              <div className="text-base font-extrabold font-display text-slate-950">{activeTenantsCount}</div>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm flex items-center gap-3 transition-all hover:border-slate-300">
            <div className="h-9 w-9 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-4.5 w-4.5" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">My Lease</div>
              <div className="text-base font-extrabold font-display text-slate-950">Active</div>
            </div>
          </div>
        )}

        {/* Stat 4: Billed Rent / Collected */}
        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm flex items-center gap-3 transition-all hover:border-slate-300">
          <div className="h-9 w-9 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg flex items-center justify-center shrink-0">
            <DollarSign className="h-4.5 w-4.5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{isTenant ? "Paid This Month" : "Collections"}</div>
            <div className="text-base font-extrabold font-display text-slate-950">
              {formatPKR(totalRentCollectedThisMonth)}
            </div>
          </div>
        </div>

        {/* Stat 5: Outstanding / Pending */}
        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm flex items-center gap-3 transition-all hover:border-slate-300">
          <div className="h-9 w-9 bg-amber-50 text-amber-600 border border-amber-100 rounded-lg flex items-center justify-center shrink-0">
            <AlertTriangle className="h-4.5 w-4.5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{isTenant ? "Dues" : "Pending"}</div>
            <div className="text-base font-extrabold font-display text-slate-950">
              {formatPKR(pendingDuesAmount)}
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

      {/* Charts & Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Panel: Rent collection chart mockup */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-50 pb-3">
            <div>
              <h3 className="font-display font-bold text-slate-900 text-sm md:text-base">Monthly Rent Status (June 2026)</h3>
              <p className="text-xs text-slate-400">{isTenant ? "Your payment status" : "Total rent collection rate for June"}</p>
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

          <div className="h-44 w-full flex items-end gap-4 md:gap-8 pt-4">
            {filteredPayments.filter(p => p.due_date.startsWith("2026-06")).map((pay, i) => {
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

        {/* Right Panel: Operations expenses & unit stats */}
        {!isTenant && (
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="font-display font-bold text-slate-900 text-sm md:text-base">Operations Allocation</h3>
            
            <div className="space-y-3 pt-2">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-600">Maintenance & Repairs</span>
                  <span className="text-slate-500 font-mono">45%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full" style={{ width: "45%" }} />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-600">Utility Allocations</span>
                  <span className="text-slate-500 font-mono">30%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: "30%" }} />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-600">Staff & Operations</span>
                  <span className="text-slate-500 font-mono">25%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: "25%" }} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Widgets Row: Recent Activity & Upcoming Leases */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Tickets Activity feed */}
        <div className={`lg:col-span-${isTenant ? '12' : '7'} bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-4`}>
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-display font-bold text-slate-950 text-xs md:text-sm">Active Maintenance Feed</h3>
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
            {filteredTickets.length === 0 && (
              <p className="text-sm text-slate-500 py-4 text-center">No active maintenance tickets.</p>
            )}
          </div>
        </div>

        {/* Upcoming Leases Expiring warnings */}
        {!isTenant && (
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-display font-bold text-slate-950 text-xs md:text-sm">Upcoming Leases</h3>
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
        )}
      </div>
    </div>
  );
};
