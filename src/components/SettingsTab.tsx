import React from "react";

export const SettingsTab: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold font-display text-slate-900">System Settings</h2>
          <p className="text-sm text-slate-500">Manage global application settings.</p>
        </div>
      </div>
      
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
        <p className="text-slate-600 mb-4">Global system configurations will be managed here.</p>
        <div className="space-y-4 max-w-md">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Platform Name</label>
            <input type="text" className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50" defaultValue="PropertyLog SaaS" disabled />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Support Email</label>
            <input type="email" className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50" defaultValue="support@propertylog.com" disabled />
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl opacity-50 cursor-not-allowed">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
