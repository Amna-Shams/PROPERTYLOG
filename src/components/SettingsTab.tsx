import React, { useState } from "react";
import { User, ShieldCheck, CreditCard, Save, X } from "lucide-react";

export const SettingsTab: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-display text-slate-900">👤 Personal Profile</h2>
          <p className="text-sm text-slate-500">Manage your contact details and security preferences.</p>
        </div>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors"
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </button>
      </div>
      
      {/* Personal Info Card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-2xl">
            JD
          </div>
          <div>
            <h3 className="text-lg font-bold">John Doe</h3>
            <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-xs font-bold border border-emerald-100">
              <ShieldCheck className="h-3 w-3" /> Verified Account
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">First Name *</label>
            <input type="text" className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50" defaultValue="John" disabled={!isEditing} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Last Name *</label>
            <input type="text" className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50" defaultValue="Doe" disabled={!isEditing} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address *</label>
            <input type="email" className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50" defaultValue="john.doe@example.com" disabled={!isEditing} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone Number *</label>
            <input type="tel" className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50" defaultValue="(555) 123-4567" disabled={!isEditing} />
          </div>
        </div>

        {isEditing && (
          <div className="mt-8 flex gap-3">
            <button className="px-6 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700">Save Changes</button>
          </div>
        )}
      </div>

      {/* Payment Settings Card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
          <CreditCard className="text-blue-600" /> Payment & Disbursement Settings
        </h3>
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
          <div>
            <p className="font-semibold text-sm">Active Disbursement Method</p>
            <p className="text-sm text-slate-500">Checking Account ending in •••• 4567</p>
          </div>
          <button className="px-4 py-2 text-sm font-bold text-blue-600 hover:text-blue-700">Update Method</button>
        </div>
      </div>
    </div>
  );
};
