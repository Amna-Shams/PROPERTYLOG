/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Building2, Mail, Lock, Phone, User, ArrowRight, ShieldCheck, HelpCircle } from "lucide-react";
import { useApp } from "../context/AppContext";
import { UserRole } from "../types";

interface AuthProps {
  view: "login" | "register" | "forgot-password";
  setView: (view: "login" | "register" | "forgot-password") => void;
  setCurrentPath: (path: string) => void;
}

export const AuthPages: React.FC<AuthProps> = ({ view, setView, setCurrentPath }) => {
  const { login, register, forgotPassword } = useApp();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<UserRole>(UserRole.OWNER);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleQuickLogin = (quickEmail: string, quickRole: UserRole) => {
    setEmail(quickEmail);
    setRole(quickRole);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email.trim()) {
      setErrorMsg("Email address is required.");
      return;
    }

    if (view === "register" && !name.trim()) {
      setErrorMsg("Full name is required.");
      return;
    }

    setSubmitting(true);
    try {
      if (view === "login") {
        const success = await login(email, role);
        if (success) {
          setCurrentPath("/dashboard");
        }
      } else if (view === "register") {
        const success = await register(name, email, phone, role);
        if (success) {
          setCurrentPath("/dashboard");
        }
      } else if (view === "forgot-password") {
        const success = await forgotPassword(email);
        if (success) {
          setView("login");
        }
      }
    } catch (err) {
      setErrorMsg("An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background radial effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-15 pointer-events-none" />
      <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-md w-full space-y-8 relative z-10">
        
        {/* Logo and header */}
        <div className="text-center space-y-3">
          <div 
            onClick={() => setCurrentPath("/")} 
            className="flex items-center justify-center gap-2 cursor-pointer mx-auto w-max"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-600/25">
              <Building2 className="h-6 w-6" />
            </div>
            <span className="font-display text-2xl font-bold tracking-tight text-white">
              PROPERTY<span className="text-blue-500">LOG</span>
            </span>
          </div>
          
          <h2 className="font-display text-2xl font-extrabold text-slate-100 tracking-tight">
            {view === "login" && "Welcome to Your Workspace"}
            {view === "register" && "Create Your Free Account"}
            {view === "forgot-password" && "Reset Your Password"}
          </h2>
          <p className="text-slate-400 text-sm">
            {view === "login" && (
              <>
                New to PROPERTYLOG?{" "}
                <button onClick={() => setView("register")} className="text-blue-400 hover:text-blue-300 font-semibold underline">
                  Create account
                </button>
              </>
            )}
            {view === "register" && (
              <>
                Already have an account?{" "}
                <button onClick={() => setView("login")} className="text-blue-400 hover:text-blue-300 font-semibold underline">
                  Sign in
                </button>
              </>
            )}
            {view === "forgot-password" && (
              <>
                Remember your password?{" "}
                <button onClick={() => setView("login")} className="text-blue-400 hover:text-blue-300 font-semibold underline">
                  Go back to sign in
                </button>
              </>
            )}
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl space-y-6">
          
          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* ROLE SELECTOR (ONLY for Register &amp; Login) */}
            {view !== "forgot-password" && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Select Workspace Role</label>
                <div className="grid grid-cols-3 gap-2">
                  {[UserRole.OWNER, UserRole.TENANT, UserRole.ADMIN].map((r) => {
                    const isActive = role === r;
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                          isActive
                            ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/10"
                            : "bg-slate-800/50 border-slate-700/50 text-slate-300 hover:border-slate-600"
                        }`}
                      >
                        {r}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* FULL NAME (ONLY for Register) */}
            {view === "register" && (
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Jane Doe"
                    className="w-full bg-slate-800/50 border border-slate-700/50 focus:border-slate-600 text-white rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800 transition-all"
                  />
                </div>
              </div>
            )}

            {/* EMAIL */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. name@domain.com"
                  className="w-full bg-slate-800/50 border border-slate-700/50 focus:border-slate-600 text-white rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800 transition-all"
                />
              </div>
            </div>

            {/* PHONE (ONLY for Register) */}
            {view === "register" && (
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Phone Number (Optional)</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +1 (555) 019-2834"
                    className="w-full bg-slate-800/50 border border-slate-700/50 focus:border-slate-600 text-white rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800 transition-all"
                  />
                </div>
              </div>
            )}

            {/* PASSWORD FIELD - SIMULATED FOR DEPLOYMENT READY COMPLIANCE */}
            {view !== "forgot-password" && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Password</label>
                  {view === "login" && (
                    <button
                      type="button"
                      onClick={() => setView("forgot-password")}
                      className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 underline"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                  <input
                    type="password"
                    defaultValue="••••••••"
                    disabled
                    className="w-full bg-slate-800/50 border border-slate-700/30 text-slate-500 rounded-xl py-3 pl-10 pr-4 text-sm cursor-not-allowed select-none"
                  />
                </div>
                <p className="text-[10px] text-slate-500 font-medium">Secured with Firebase OAuth Google Sign-in flow simulation</p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-bold rounded-xl shadow-lg shadow-blue-600/10 text-sm transition-all flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {view === "login" && "Sign In To Workspace"}
                  {view === "register" && "Create Free Workspace"}
                  {view === "forgot-password" && "Send Reset Link"}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* QUICK DEMO CREDENTIALS PICKERS - EXTREMELY HELPFUL FOR CONVENIENCE */}
          {view === "login" && (
            <div className="border-t border-slate-800 pt-5 mt-5 space-y-3">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
                <HelpCircle className="h-4 w-4 text-blue-400" />
                <span>Quick Workspace Simulation Logins:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleQuickLogin("owner@propertylog.com", UserRole.OWNER)}
                  className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-200 hover:bg-slate-800 hover:text-white transition-all text-left flex flex-col"
                >
                  <span className="font-bold text-slate-100 flex items-center justify-between">
                    <span>Owner Account</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-extrabold font-sans">Alex</span>
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">owner@propertylog.com</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin("tenant@propertylog.com", UserRole.TENANT)}
                  className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-200 hover:bg-slate-800 hover:text-white transition-all text-left flex flex-col"
                >
                  <span className="font-bold text-slate-100 flex items-center justify-between">
                    <span>Tenant Account</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-extrabold font-sans">Jane</span>
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">tenant@propertylog.com</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
