/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare, ShieldAlert, CheckCircle } from "lucide-react";
import { useApp } from "../context/AppContext";

export const ContactPage: React.FC = () => {
  const { addContactInquiry, showToast } = useApp();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    message: ""
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors = { name: "", email: "", message: "" };
    let valid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required.";
      valid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required.";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
      valid = false;
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message text cannot be empty.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const success = await addContactInquiry({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: formData.message
    });
    setSubmitting(false);

    if (success) {
      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
    }
  };

  return (
    <div id="contact-page" className="bg-slate-50/50 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 text-xs font-semibold">
            <MessageSquare className="h-4 w-4" />
            Contact Support &amp; Sales
          </div>
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            We're Here to Help You Thrived
          </h1>
          <p className="text-slate-600 text-lg">
            Have a question about our features, pricing, or workspace structure? Drop us a line. Our professional team responds within 1 business day.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-6xl mx-auto">
          
          {/* Left panel - info cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md space-y-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20" />
              <h3 className="font-display text-xl font-bold relative z-10">Contact Information</h3>
              <p className="text-slate-400 text-sm leading-relaxed relative z-10">
                Connect directly with our NYC-based solutions team. We offer phone consultations, video onboarding walks, and custom setups.
              </p>

              <hr className="border-slate-800" />

              <div className="space-y-4 relative z-10 text-sm">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-blue-400 shrink-0" />
                  <span>support@propertylog.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-blue-400 shrink-0" />
                  <span>+1 (800) 555-PLOG</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-blue-400 shrink-0" />
                  <span>500 Innovation Way, Suite 100, New York City, NY</span>
                </div>
              </div>
            </div>

            {/* Quick trust card */}
            <div className="bg-white rounded-2xl border border-slate-150 p-6 shadow-sm space-y-3">
              <h4 className="font-display font-bold text-slate-800 text-base">Frictionless Support SLA</h4>
              <p className="text-slate-500 text-xs leading-relaxed">
                All registered property owners and active tenants have access to our priority response ticketing desk inside the dashboard, guaranteeing Urgent ticket action in under 2 hours.
              </p>
            </div>
          </div>

          {/* Right panel - contact form */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-150 p-6 md:p-8 shadow-sm">
            {submitted ? (
              <div className="text-center py-10 space-y-4">
                <div className="h-16 w-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="font-display text-2xl font-bold text-slate-950">Inquiry Sent Successfully!</h3>
                <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
                  Thank you for contacting PROPERTYLOG. Our property specialists have received your details and will get back to you shortly at the provided email.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-sm transition-all mt-4"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Name field */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. John Doe"
                      className={`w-full rounded-xl border px-4 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 ${
                        errors.name
                          ? "border-rose-400 focus:ring-rose-200"
                          : "border-slate-200 focus:border-slate-900 focus:ring-slate-100"
                      }`}
                    />
                    {errors.name && <p className="text-xs text-rose-500 font-medium">{errors.name}</p>}
                  </div>

                  {/* Email field */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. john@domain.com"
                      className={`w-full rounded-xl border px-4 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 ${
                        errors.email
                          ? "border-rose-400 focus:ring-rose-200"
                          : "border-slate-200 focus:border-slate-900 focus:ring-slate-100"
                      }`}
                    />
                    {errors.email && <p className="text-xs text-rose-500 font-medium">{errors.email}</p>}
                  </div>

                </div>

                {/* Phone field */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Phone Number (Optional)</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. +1 (555) 019-2834"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:border-slate-900 focus:ring-slate-100"
                  />
                </div>

                {/* Message field */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Message *</label>
                  <textarea
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="How can we support your property portfolio?"
                    className={`w-full rounded-xl border px-4 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 ${
                      errors.message
                        ? "border-rose-400 focus:ring-rose-200"
                        : "border-slate-200 focus:border-slate-900 focus:ring-slate-100"
                    }`}
                  />
                  {errors.message && <p className="text-xs text-rose-500 font-medium">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-md text-sm transition-all flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
