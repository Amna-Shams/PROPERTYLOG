/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  ArrowRight, 
  Building2, 
  ShieldCheck, 
  Users, 
  Wrench, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  ChevronDown, 
  ChevronUp,
  MessageSquare,
  FileText,
  Percent
} from "lucide-react";
import { initialTestimonials, initialFAQs } from "../data/mockData";
import { motion } from "motion/react";

interface LandingPageProps {
  setCurrentPath: (path: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ setCurrentPath }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const stats = [
    { value: "$12.4M+", label: "Rent Collected Monthly", icon: DollarSign },
    { value: "4,500+", label: "Units Under Management", icon: Building2 },
    { value: "98.7%", label: "On-Time Rent Rate", icon: TrendingUp },
    { value: "24 Mins", label: "Avg Maintenance Response", icon: Clock }
  ];

  const features = [
    {
      title: "Automated Rent Collection",
      desc: "Instantly generate monthly invoices, track status as Pending or Paid, and automatically flag Overdue payments with graceful alerts.",
      icon: DollarSign,
      color: "bg-blue-500/10 text-blue-600"
    },
    {
      title: "Tenant Portals",
      desc: "Give tenants their own dashboards to view leases, submit maintenance requests, see current rent status, and review active notifications.",
      icon: Users,
      color: "bg-indigo-500/10 text-indigo-600"
    },
    {
      title: "Maintenance Dispatch",
      desc: "Receive, prioritize (Low to Urgent), track, and close maintenance requests. Keep tenants notified instantly at every stage.",
      icon: Wrench,
      color: "bg-rose-500/10 text-rose-600"
    },
    {
      title: "Smart Lease Tracking",
      desc: "Securely record lease documents, term dates, deposits, and receive automatic warnings for leases expiring within 30 days.",
      icon: FileText,
      color: "bg-emerald-500/10 text-emerald-600"
    }
  ];

  const benefits = [
    {
      title: "Zero-Stress Operations",
      desc: "Ditch the paper trails, text chains, and endless spreadsheets. Manage your entire real estate portfolio in a single source of truth."
    },
    {
      title: "Immediate Financial Clarity",
      desc: "Track active revenue pipelines, monitor delinquent rents, and log operations expenses instantly from your financial cockpit."
    },
    {
      title: "Better Tenant Relationships",
      desc: "Improve tenant retention by offering professional, lightning-fast responses to repair issues and frictionless payment tracking."
    }
  ];

  return (
    <div id="landing-page" className="flex flex-col min-h-screen bg-slate-50/50">
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-20 md:pt-28 md:pb-32 overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950 text-white">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left text */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold"
              >
                <ShieldCheck className="h-4 w-4" />
                Next-Gen Property Management SaaS
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight"
              >
                Manage Properties <br />
                <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-sky-400 bg-clip-text text-transparent">
                  Smarter &amp; Faster
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light"
              >
                Simplify rent tracking, tenant onboarding, lease tracking, and maintenance dispatching. Take control of your portfolio with PROPERTYLOG.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-4"
              >
                <button
                  onClick={() => setCurrentPath("/register")}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-base transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 group"
                >
                  Get Started Free
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </button>
                <button
                  onClick={() => setCurrentPath("/services")}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-base transition-all"
                >
                  Explore Services
                </button>
              </motion.div>
            </div>

            {/* Right illustration/mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-5 hidden lg:block"
            >
              <div className="relative p-6 rounded-2xl bg-slate-800/60 border border-slate-700/50 shadow-2xl backdrop-blur-sm">
                
                {/* Simulated App Header */}
                <div className="flex items-center justify-between border-b border-slate-700/50 pb-4 mb-6">
                  <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-rose-500 block" />
                    <span className="h-3 w-3 rounded-full bg-amber-500 block" />
                    <span className="h-3 w-3 rounded-full bg-emerald-500 block" />
                  </div>
                  <span className="text-xs text-slate-400 font-mono">WORKSPACE_DASHBOARD</span>
                </div>

                {/* Dashboard mock items */}
                <div className="space-y-4">
                  {/* Mock card 1 */}
                  <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                        $
                      </div>
                      <div>
                        <div className="text-xs text-slate-400">Monthly Revenue</div>
                        <div className="text-lg font-bold font-display text-white">$24,850</div>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-1 bg-emerald-500/10 text-emerald-400 font-semibold rounded-full">+12.4%</span>
                  </div>

                  {/* Mock progress block */}
                  <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">Rent Collection Rate</span>
                      <span className="text-xs font-semibold text-blue-400">96.8%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full" style={{ width: "96.8%" }} />
                    </div>
                  </div>

                  {/* Active listings/mock 3 */}
                  <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
                    <div className="text-xs text-slate-400 mb-3">Pending Tickets</div>
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between text-xs bg-slate-800/50 rounded-lg p-2 border border-slate-700/30">
                        <span className="truncate max-w-[150px] text-slate-300 font-medium">Sink leaking in Unit 102</span>
                        <span className="px-2 py-0.5 bg-rose-500/10 text-rose-400 rounded text-[10px] font-bold">Urgent</span>
                      </div>
                      <div className="flex items-center justify-between text-xs bg-slate-800/50 rounded-lg p-2 border border-slate-700/30">
                        <span className="truncate max-w-[150px] text-slate-300 font-medium">HVAC filter replacement</span>
                        <span className="px-2 py-0.5 bg-slate-500/15 text-slate-400 rounded text-[10px] font-bold">Low</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Statistics Row */}
      <section className="relative -mt-8 z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 bg-white border border-slate-100 shadow-xl rounded-2xl p-6 md:p-8">
          {stats.map((stat, i) => {
            const IconComponent = stat.icon;
            return (
              <div key={i} className="flex flex-col items-center text-center p-3 border-r last:border-0 border-slate-100 last:border-slate-0">
                <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                  <IconComponent className="h-5 w-5" />
                </div>
                <div className="text-2xl md:text-3xl font-extrabold font-display text-slate-900">{stat.value}</div>
                <div className="text-xs md:text-sm text-slate-500 mt-1 font-medium">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Core Features Section */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-xs uppercase font-extrabold tracking-widest text-blue-600">Dynamic SaaS Engine</h2>
            <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              A Complete Platform Crafted for Property Operations
            </h3>
            <p className="text-slate-600 font-normal text-base sm:text-lg">
              Everything you need to streamline properties, eliminate collection manual overhead, track contracts, and maintain asset health.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="bg-white border border-slate-100 rounded-2xl p-6 shadow-md shadow-slate-100/30 hover:shadow-xl hover:shadow-slate-100/50 transition-all group duration-200"
                >
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-5 ${feat.color} transition-transform group-hover:scale-105`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h4 className="font-display font-bold text-slate-900 text-lg mb-2">{feat.title}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Benefits Layout */}
      <section className="py-20 bg-slate-900 text-white relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Visual preview list on left */}
            <div className="space-y-6">
              <span className="text-xs font-extrabold text-blue-400 uppercase tracking-widest block">The PropertyLog Difference</span>
              <h3 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
                Why Professional Owners Shift Away From Legacy Tools
              </h3>
              <p className="text-slate-400 text-base leading-relaxed">
                Relying on paper logs, random chats, and unsecured manual wire slips causes double entries, collection leakages, and delayed maintenance responses. PROPERTYLOG automates those layers.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="p-4 bg-slate-800/50 border border-slate-800 rounded-xl flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
                  <span className="text-sm font-semibold">100% Secure Storage</span>
                </div>
                <div className="p-4 bg-slate-800/50 border border-slate-800 rounded-xl flex items-center gap-3">
                  <Clock className="h-5 w-5 text-blue-400 shrink-0" />
                  <span className="text-sm font-semibold">Real-Time In-App Alerts</span>
                </div>
              </div>
            </div>

            {/* List of benefits on right */}
            <div className="space-y-6">
              {benefits.map((benefit, i) => (
                <div key={i} className="flex gap-4 p-5 rounded-2xl bg-slate-800/30 border border-slate-800/50">
                  <div className="h-8 w-8 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm shrink-0">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-white text-base mb-1">{benefit.title}</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-xs uppercase font-extrabold tracking-widest text-blue-600">Client Stories</h2>
            <h3 className="font-display text-3xl font-extrabold text-slate-900 tracking-tight">
              Trusted by Hundreds of Asset Landlords
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {initialTestimonials.map((t) => (
              <div
                key={t.id}
                className="bg-white border border-slate-100 rounded-2xl p-6 shadow-md shadow-slate-100/20 relative flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex gap-1 text-amber-400">
                    {"★".repeat(5)}
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed italic">
                    "{t.content}"
                  </p>
                </div>
                
                <div className="flex items-center gap-3 pt-6 mt-6 border-t border-slate-50">
                  <img
                    src={t.avatar_url}
                    alt={t.name}
                    className="h-10 w-10 rounded-full object-cover shrink-0 border border-slate-100"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="text-sm font-bold text-slate-900">{t.name}</div>
                    <div className="text-xs text-slate-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-xs uppercase font-extrabold tracking-widest text-blue-600">Questions &amp; Answers</h2>
            <h3 className="font-display text-3xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="space-y-4">
            {initialFAQs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="bg-white border border-slate-200/60 rounded-xl overflow-hidden shadow-sm"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left font-semibold text-slate-900 hover:bg-slate-50 transition-colors"
                  >
                    <span className="text-base font-display">{faq.question}</span>
                    {isOpen ? <ChevronUp className="h-5 w-5 text-slate-500" /> : <ChevronDown className="h-5 w-5 text-slate-500" />}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-slate-600 text-sm leading-relaxed border-t border-slate-50">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* CTA Banner Banner */}
      <section className="py-16 bg-blue-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#2563eb_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-35 pointer-events-none" />
        
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Take Control of Your Portfolio?
          </h2>
          <p className="text-blue-100 max-w-2xl mx-auto text-base sm:text-lg">
            Create an owner or tenant account today. Discover instant automated rent lists, clear leases, and seamless maintenance tracking.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              onClick={() => setCurrentPath("/register")}
              className="w-full sm:w-auto px-8 py-3.5 bg-white text-blue-600 hover:bg-blue-50 font-bold rounded-xl shadow-lg transition-all"
            >
              Get Started Instantly
            </button>
            <button
              onClick={() => setCurrentPath("/contact")}
              className="w-full sm:w-auto px-8 py-3.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl border border-blue-500/30 transition-all"
            >
              Contact Sales
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
