/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Building2, Mail, Phone, MapPin, Linkedin, Twitter, Facebook } from "lucide-react";

interface FooterProps {
  setCurrentPath: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentPath }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="main-footer" className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo & Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPath("/")}>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                <Building2 className="h-5 w-5" />
              </div>
              <span className="font-display text-xl font-bold tracking-tight text-white">
                PROPERTY<span className="text-blue-500">LOG</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              The modern property management platform designed for progressive owners, managers, and tenants. Keep your assets automated, compliant, and thriving.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a href="#" className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 hover:text-white transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 hover:text-white transition-colors">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 hover:text-white transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-white mb-4 text-sm uppercase tracking-wider">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => setCurrentPath("/")} className="hover:text-white transition-colors">Home</button>
              </li>
              <li>
                <button onClick={() => setCurrentPath("/services")} className="hover:text-white transition-colors">Services</button>
              </li>
              <li>
                <button onClick={() => setCurrentPath("/about")} className="hover:text-white transition-colors">About Company</button>
              </li>
              <li>
                <button onClick={() => setCurrentPath("/contact")} className="hover:text-white transition-colors">Contact Support</button>
              </li>
            </ul>
          </div>

          {/* Core Features */}
          <div>
            <h3 className="font-display font-semibold text-white mb-4 text-sm uppercase tracking-wider">SaaS Features</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Tenant &amp; Lease Tracking</li>
              <li>Automated Rent Invoicing</li>
              <li>Maintenance Ticketing Portal</li>
              <li>Real-time Performance Metrics</li>
              <li>Multi-role Workspace (Owner/Tenant)</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="font-display font-semibold text-white mb-4 text-sm uppercase tracking-wider">Contact Us</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-500 shrink-0" />
                <span>support@propertylog.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-blue-500 shrink-0" />
                <span>+1 (800) 555-PLOG</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-500 shrink-0" />
                <span>500 Innovation Way, Suite 100, NYC</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; {currentYear} PROPERTYLOG Systems Inc. All rights reserved. Built with pride for professional real estate.
          </div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-400">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400">Terms of Service</a>
            <a href="#" className="hover:text-slate-400">Cookie Preferences</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
