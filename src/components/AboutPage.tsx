/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Building2, Compass, Eye, Heart, ShieldAlert, Award, Star } from "lucide-react";

interface AboutPageProps {
  setCurrentPath: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ setCurrentPath }) => {
  const values = [
    {
      title: "Absolute Integrity",
      icon: Compass,
      desc: "We prioritize security, compliance, and transparent auditing in all rental records."
    },
    {
      title: "User-Centered Elegance",
      icon: Eye,
      desc: "Software shouldn't look like a 90's spreadsheet. We design luxury workflows for modern builders."
    },
    {
      title: "Tenant First Care",
      icon: Heart,
      desc: "A property is a home. We build quick communication tunnels to resolve repair tickets with pride."
    }
  ];

  const stats = [
    { label: "Founded", value: "2024" },
    { label: "Active Properties", value: "18,000+" },
    { label: "On-Time Payments", value: "99.2%" },
    { label: "Client Retention", value: "98.4%" }
  ];

  const teamMembers = [
    {
      name: "Marcus Sterling",
      role: "CEO &amp; Founder",
      bio: "Former Real Estate Portfolio Principal with 15+ years managing multifamily investments across the US.",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=80"
    },
    {
      name: "Sophia Lin",
      role: "Chief Technology Officer",
      bio: "Distinguished engineer and cloud specialist formerly leading distributed scale systems at major fintech platforms.",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80"
    },
    {
      name: "David Vance",
      role: "VP of Product Quality",
      bio: "Passionate designer specializing in SaaS ergonomics, micro-animations, and visual portfolio charts.",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80"
    }
  ];

  return (
    <div id="about-page" className="bg-slate-50/50">
      
      {/* Intro Hero banner */}
      <section className="bg-slate-900 text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-25" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight">Our Mission is Property Automation</h1>
          <p className="text-slate-300 text-base sm:text-lg md:text-xl max-w-3xl mx-auto font-light leading-relaxed">
            Founded by landlords who grew tired of messy wire transcripts and offline lease trackers. We built PROPERTYLOG to make real estate assets autonomous, transparent, and beautiful.
          </p>
        </div>
      </section>

      {/* Stats Row */}
      <section className="py-12 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {stats.map((stat, idx) => (
              <div key={idx} className="p-4 border-r last:border-0 border-slate-100">
                <div className="text-3xl font-extrabold font-display text-blue-600">{stat.value}</div>
                <div className="text-sm font-medium text-slate-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Sections */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">Company Story</span>
              <h2 className="font-display text-3xl font-extrabold text-slate-900 tracking-tight">
                Born From Real Operational Friction
              </h2>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                In late 2023, our founding team managed forty properties across Springfield. Between managing early lease terminations, parsing phone camera repair receipts, and tracking cash receipts, we found that nearly half our work hours went to low-value back-and-forth communication.
              </p>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                Existing systems were either heavy legacy softwares meant for 1,000-unit enterprises or unsecured notes apps. PROPERTYLOG was created as the perfect middle ground: a premium, high-speed, secure workspace for independent owners, managers, and tenants.
              </p>
            </div>
            
            {/* Mission / Vision Cards */}
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-3">
                <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-bold">
                  M
                </div>
                <h3 className="font-display font-bold text-slate-900 text-lg">Our Mission</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  To eliminate rental transaction anxiety by providing secure automation tools that guarantee transparent rent invoicing, lease durability, and real-time repair lifecycles.
                </p>
              </div>

              <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-3">
                <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center font-bold">
                  V
                </div>
                <h3 className="font-display font-bold text-slate-900 text-lg">Our Vision</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  To become the global standard for independent real estate operations, where every tenant-owner interaction is automated, friction-free, and respectful.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-slate-100/60 border-t border-b border-slate-200/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <h2 className="text-xs uppercase font-extrabold tracking-widest text-blue-600">Our Anchors</h2>
            <h3 className="font-display text-3xl font-extrabold text-slate-900">Core Values We Live By</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3">
                  <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h4 className="font-display font-semibold text-slate-900 text-base">{v.title}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Team Layout */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">Founding Minds</span>
            <h2 className="font-display text-3xl font-extrabold text-slate-900">Led By Industry Operators</h2>
            <p className="text-slate-500 text-sm sm:text-base">
              A balanced team of real estate managers, software architects, and design specialists dedicated to your success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl border border-slate-100 p-6 text-center space-y-4 shadow-sm hover:shadow-md transition-shadow">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="h-20 w-20 rounded-full object-cover mx-auto border-2 border-blue-500/20"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h3 className="font-display font-bold text-slate-900 text-lg leading-tight">{member.name}</h3>
                  <p className="text-sm font-semibold text-blue-600 mt-1">{member.role}</p>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
};
