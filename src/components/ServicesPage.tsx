/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  Users, 
  FileText, 
  CreditCard, 
  Wrench, 
  BarChart3, 
  BellRing, 
  ArrowRight,
  ShieldCheck,
  Zap
} from "lucide-react";

interface ServicesPageProps {
  setCurrentPath: (path: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ setCurrentPath }) => {
  const serviceModules = [
    {
      title: "Tenant Management",
      icon: Users,
      color: "bg-blue-500/10 text-blue-600",
      description: "Manage complete tenant lifecycles. Send invites, perform frictionless onboarding, store phone and email profiles, and keep historical tenant logs safely aligned.",
      details: ["Digital tenant directory", "Pre-screen communication logs", "Switch workspaces easily", "Secure communication logs"]
    },
    {
      title: "Lease Management",
      icon: FileText,
      color: "bg-emerald-500/10 text-emerald-600",
      description: "Structure clear lease agreements. Log starting and ending times, deposit amounts, monthly rent terms, and view automatic alerts for expiring leases.",
      details: ["Automated lease agreements", "Security deposit logs", "Early termination tracking", "Auto-alert within 30 days of expiry"]
    },
    {
      title: "Rent Tracking & Invoicing",
      icon: CreditCard,
      color: "bg-indigo-500/10 text-indigo-600",
      description: "Automate rent tracking entirely. Instantly mark monthly dues as Pending, Paid, or Overdue. Track collection percentages and total outstanding balances.",
      details: ["Automated rent scheduling", "Overdue alerts", "Multi-method tracking (direct/cash/card)", "Financial balance audits"]
    },
    {
      title: "Maintenance Dispatch",
      icon: Wrench,
      color: "bg-rose-500/10 text-rose-600",
      description: "Streamline maintenance lifecycles. Receive direct tenant tickets with descriptions and priorities. Transition statuses from Open to In-Progress to Resolved.",
      details: ["Direct tenant filing", "Priority levels (Low, Medium, High, Urgent)", "Contractor and photo logs", "Instant status feedback"]
    },
    {
      title: "Financial Reporting",
      icon: BarChart3,
      color: "bg-amber-500/10 text-amber-600",
      description: "Understand your portfolio performance. Monitor rent collections rates, monthly revenue sums, and see clean visual indicators of overall asset performance.",
      details: ["Annual collection rate graph", "Pending and overdue aggregates", "Unit-by-unit profitability", "Export-ready summaries"]
    },
    {
      title: "In-App Notifications",
      icon: BellRing,
      color: "bg-sky-500/10 text-sky-600",
      description: "Never miss a beat with our real-time notifications. Receive alerts for newly filed tickets, rent payments received, and upcoming contract expiries.",
      details: ["Real-time browser notifications", "Type-categorized alerts", "One-click 'Mark Read' action", "Multi-role routing (Owner/Tenant)"]
    }
  ];

  return (
    <div id="services-page" className="bg-slate-50/50 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 text-xs font-semibold">
            <Zap className="h-4.5 w-4.5" />
            Features &amp; Modules
          </div>
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            SaaS Suite Designed For High Performance
          </h1>
          <p className="text-slate-600 text-lg">
            Say goodbye to disorganized property management. Experience our unified suite built to scale from single houses to full apartment complexes.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {serviceModules.map((srv, index) => {
            const Icon = srv.icon;
            return (
              <div
                key={index}
                className="bg-white border border-slate-100 rounded-2xl p-6 shadow-md shadow-slate-100/20 hover:shadow-xl hover:shadow-slate-100/30 transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${srv.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display font-bold text-slate-900 text-xl">{srv.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{srv.description}</p>
                  
                  {/* Bullet checkmarks */}
                  <ul className="space-y-2 pt-2">
                    {srv.details.map((detail, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs font-medium text-slate-600">
                        <ShieldCheck className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-50">
                  <button
                    onClick={() => setCurrentPath("/register")}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-500 transition-colors group"
                  >
                    Get Started Free
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Callout */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_10%_10%,#2563eb_0%,transparent_100%)] opacity-35" />
          <div className="space-y-4 max-w-xl relative z-10 text-center md:text-left">
            <h3 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight">Need a custom enterprise setup?</h3>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed">
              Have over 100 units under your portfolio? Get in touch with our solutions architects to design custom integrations or dedicated databases.
            </p>
          </div>
          <button
            onClick={() => setCurrentPath("/contact")}
            className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/25 relative z-10 shrink-0"
          >
            Contact Solutions Team
          </button>
        </div>

      </div>
    </div>
  );
};
