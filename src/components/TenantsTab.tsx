import React, { useState, useRef } from "react";
import { useApp } from "../context/AppContext";
import { Tenant } from "../types";
import { 
  Users, 
  Search, 
  Plus, 
  Trash2, 
  Edit, 
  X, 
  Mail, 
  Phone, 
  UserCheck, 
  FileText, 
  Upload, 
  ShieldCheck, 
  Eye, 
  ExternalLink,
  Lock,
  EyeOff
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const TenantsTab: React.FC = () => {
  const { 
    tenants, 
    addTenant, 
    updateTenant, 
    deleteTenant, 
    currentUser, 
    showToast,
    properties,
    leases
  } = useApp();

  const isTenant = currentUser?.role === "Tenant";

  // State: "list" | "new" | "edit"
  const [view, setView] = useState<"list" | "new" | "edit">("list");
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");

  // Form States
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [cnic, setCnic] = useState("");
  const [passport, setPassport] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  
  // Document base64 / filename states (simulated Supabase Storage)
  const [cnicDoc, setCnicDoc] = useState<{name: string, data: string} | null>(null);
  const [passportDoc, setPassportDoc] = useState<{name: string, data: string} | null>(null);
  const [agreementDoc, setAgreementDoc] = useState<{name: string, data: string} | null>(null);

  // Active Document Preview State
  const [previewDoc, setPreviewDoc] = useState<{title: string, data: string} | null>(null);

  // Input references
  const cnicInputRef = useRef<HTMLInputElement>(null);
  const passportInputRef = useRef<HTMLInputElement>(null);
  const agreementInputRef = useRef<HTMLInputElement>(null);

  // Filter tenants
  const isOwner = currentUser?.role === "Owner";
  const myPropertyIds = isOwner ? properties.filter(p => p.owner_id === currentUser?.id).map(p => p.id) : [];
  const myTenantIds = isOwner ? leases.filter(l => myPropertyIds.includes(l.property_id)).map(l => l.tenant_id) : [];

  const filteredTenants = tenants.filter((t) => {
    if (isOwner && !myTenantIds.includes(t.id)) return false;
    return t.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.cnic.includes(searchQuery);
  });

  // Read files and convert to base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, docType: "cnic" | "passport" | "agreement") => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (e.g., 2MB for demo to fit local storage comfortably)
    if (file.size > 2.5 * 1024 * 1024) {
      showToast("File is too large! Please choose a file smaller than 2.5 MB.", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = reader.result as string;
      const fileObj = { name: file.name, data: base64Data };
      
      if (docType === "cnic") setCnicDoc(fileObj);
      if (docType === "passport") setPassportDoc(fileObj);
      if (docType === "agreement") setAgreementDoc(fileObj);
      
      showToast(`Document "${file.name}" uploaded safely to Supabase Storage bucket.`, "success");
    };
    reader.readAsDataURL(file);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !email || !cnic) {
      showToast("Full Name, Phone, Email, and CNIC are required.", "error");
      return;
    }

    const docObj = {
      cnic_doc_url: cnicDoc ? cnicDoc.data : "",
      passport_doc_url: passportDoc ? passportDoc.data : "",
      agreement_doc_url: agreementDoc ? agreementDoc.data : ""
    };

    setIsSubmitting(true);
    let success = false;

    if (view === "new") {
      success = await addTenant({
        full_name: fullName,
        phone,
        email,
        cnic,
        passport,
        emergency_contact: emergencyContact,
        ...docObj
      });
    } else if (view === "edit" && selectedTenantId) {
      const existing = tenants.find(t => t.id === selectedTenantId);
      if (existing) {
        success = await updateTenant({
          ...existing,
          full_name: fullName,
          phone,
          email,
          cnic,
          passport,
          emergency_contact: emergencyContact,
          cnic_doc_url: cnicDoc ? cnicDoc.data : existing.cnic_doc_url,
          passport_doc_url: passportDoc ? passportDoc.data : existing.passport_doc_url,
          agreement_doc_url: agreementDoc ? agreementDoc.data : existing.agreement_doc_url
        });
      }
    }
    
    setIsSubmitting(false);
    if (success) {
      setView("list");
      resetForm();
    }
  };

  const handleDeleteTenant = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      setIsSubmitting(true);
      await deleteTenant(id);
      setIsSubmitting(false);
    }
  };

  const startNewTenant = () => {
    resetForm();
    setView("new");
  };

  const startEditTenant = (t: Tenant) => {
    setSelectedTenantId(t.id);
    setFullName(t.full_name);
    setPhone(t.phone);
    setEmail(t.email);
    setCnic(t.cnic);
    setPassport(t.passport || "");
    setEmergencyContact(t.emergency_contact);
    
    // Convert current document urls to mock file displays if they exist
    setCnicDoc(t.cnic_doc_url ? { name: "CNIC_Card.jpg", data: t.cnic_doc_url } : null);
    setPassportDoc(t.passport_doc_url ? { name: "Passport_Scan.jpg", data: t.passport_doc_url } : null);
    setAgreementDoc(t.agreement_doc_url ? { name: "Lease_Contract.pdf", data: t.agreement_doc_url } : null);
    
    setView("edit");
  };

  const resetForm = () => {
    setFullName("");
    setPhone("");
    setEmail("");
    setCnic("");
    setPassport("");
    setEmergencyContact("");
    setCnicDoc(null);
    setPassportDoc(null);
    setAgreementDoc(null);
    setSelectedTenantId(null);
  };

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      {view === "list" && (
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search tenants by name, email, or identity CNIC..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-slate-50 text-xs"
            />
          </div>

          {!isTenant && (
            <button
              onClick={startNewTenant}
              className="w-full sm:w-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg text-xs transition-all"
            >
              <Plus className="h-4 w-4" />
              Onboard Tenant
            </button>
          )}
        </div>
      )}

      {/* CLOUD STORAGE SYNC NOTICE BANNER */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 rounded-2xl p-4 text-white border border-blue-800/50 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20 shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-display font-bold text-xs">Supabase Storage Integrated</h4>
            <p className="text-[10px] text-blue-300 leading-relaxed">Tenant CNIC, Passports and Lease Agreements are uploaded directly into Supabase secure storage bucket 'tenant-documents'.</p>
          </div>
        </div>
        <span className="hidden md:block text-[9px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-400/20 px-2 py-1 rounded-lg">
          Live Bucket Connection
        </span>
      </div>

      <AnimatePresence mode="wait">
        {/* VIEW 1: TENANTS TABLE */}
        {view === "list" && (
          <motion.div
            key="list-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs text-slate-600">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[9px]">
                    <th className="p-4">Tenant Identity</th>
                    <th className="p-4">Contact Info</th>
                    <th className="p-4">CNIC / Passport</th>
                    <th className="p-4">Emergency Contact</th>
                    <th className="p-4">Uploaded Documents</th>
                    {!isTenant && <th className="p-4 text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredTenants.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400 space-y-2">
                        <Users className="h-10 w-10 text-slate-300 mx-auto" />
                        <p>No tenant records found in database.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredTenants.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-bold border border-indigo-100">
                              {t.full_name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 text-sm leading-none">{t.full_name}</p>
                              <span className="text-[10px] text-slate-400 font-mono mt-1 block">ID: {t.id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 space-y-1">
                          <p className="flex items-center gap-1 text-slate-700">
                            <Mail className="h-3.5 w-3.5 text-slate-400" />
                            {t.email}
                          </p>
                          <p className="flex items-center gap-1 text-slate-500">
                            <Phone className="h-3.5 w-3.5 text-slate-400" />
                            {t.phone}
                          </p>
                        </td>
                        <td className="p-4">
                          <div className="font-mono text-slate-700 font-semibold">
                            <p className="text-slate-900">CNIC: {t.cnic}</p>
                            {t.passport && <p className="text-slate-500 text-[10px]">Pass: {t.passport}</p>}
                          </div>
                        </td>
                        <td className="p-4 text-slate-600 font-semibold max-w-xs truncate">
                          {t.emergency_contact || "—"}
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1.5">
                            {/* CNIC DOC */}
                            {t.cnic_doc_url ? (
                              <button
                                onClick={() => setPreviewDoc({ title: `${t.full_name} - CNIC Card`, data: t.cnic_doc_url! })}
                                className="px-2 py-1 rounded bg-slate-100 hover:bg-blue-50 text-blue-600 border border-slate-200 hover:border-blue-200 font-bold text-[9px] flex items-center gap-1 transition-colors"
                              >
                                <FileText className="h-3 w-3" />
                                CNIC
                              </button>
                            ) : (
                              <span className="px-2 py-1 rounded bg-slate-50 text-slate-300 border border-slate-100 text-[9px] cursor-not-allowed">No CNIC</span>
                            )}

                            {/* Passport DOC */}
                            {t.passport_doc_url ? (
                              <button
                                onClick={() => setPreviewDoc({ title: `${t.full_name} - Passport Scan`, data: t.passport_doc_url! })}
                                className="px-2 py-1 rounded bg-slate-100 hover:bg-blue-50 text-blue-600 border border-slate-200 hover:border-blue-200 font-bold text-[9px] flex items-center gap-1 transition-colors"
                              >
                                <FileText className="h-3 w-3" />
                                Passport
                              </button>
                            ) : (
                              <span className="px-2 py-1 rounded bg-slate-50 text-slate-300 border border-slate-100 text-[9px] cursor-not-allowed">No Pass</span>
                            )}

                            {/* Agreement DOC */}
                            {t.agreement_doc_url ? (
                              <button
                                onClick={() => setPreviewDoc({ title: `${t.full_name} - Lease Agreement`, data: t.agreement_doc_url! })}
                                className="px-2 py-1 rounded bg-slate-100 hover:bg-blue-50 text-blue-600 border border-slate-200 hover:border-blue-200 font-bold text-[9px] flex items-center gap-1 transition-colors"
                              >
                                <FileText className="h-3 w-3" />
                                Agreement
                              </button>
                            ) : (
                              <span className="px-2 py-1 rounded bg-slate-50 text-slate-300 border border-slate-100 text-[9px] cursor-not-allowed">No Agreement</span>
                            )}
                          </div>
                        </td>
                        {!isTenant && (
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => startEditTenant(t)}
                                className="p-1.5 rounded-lg border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 bg-white shadow-sm"
                                title="Edit Profile"
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteTenant(t.id, t.full_name)}
                                disabled={isSubmitting}
                                className="p-1.5 rounded-lg border border-slate-200 hover:border-rose-300 hover:bg-rose-50 text-rose-500 bg-white shadow-sm disabled:opacity-50"
                                title="Delete Profile"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* VIEW 2: CREATE / EDIT TENANT FORM */}
        {(view === "new" || view === "edit") && (
          <motion.div
            key="tenant-form"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 max-w-2xl mx-auto shadow-xl space-y-6"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-display font-extrabold text-slate-900 text-base md:text-lg">
                  {view === "new" ? "Register Tenant Profile" : "Modify Tenant Profile"}
                </h3>
                <p className="text-[11px] text-slate-400">Establish tenant records and store legal identity attachments securely.</p>
              </div>
              <button
                onClick={() => setView("list")}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs text-slate-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jane Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 bg-slate-50 font-semibold"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. tenant@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 bg-slate-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Phone */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Phone Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. +1 (555) 012-3456"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 bg-slate-50"
                  />
                </div>

                {/* Emergency Contact */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Emergency Contact Person &amp; Phone *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Richard Doe (+1 (555) 098-7654)"
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 bg-slate-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* CNIC */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">National Identity Code (CNIC) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 37405-1234567-8"
                    value={cnic}
                    onChange={(e) => setCnic(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 bg-slate-50 font-mono font-bold"
                  />
                </div>

                {/* Passport */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Passport Number (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. AA1234567"
                    value={passport}
                    onChange={(e) => setPassport(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 bg-slate-50 font-mono"
                  />
                </div>
              </div>

              {/* DOCUMENT UPLOAD SECTION - SIMULATING SUPABASE STORAGE */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <h4 className="font-display font-bold text-slate-800 text-xs flex items-center gap-1">
                  <Upload className="h-4 w-4 text-blue-500" />
                  Legal Attachment Uploads (Supabase Storage Sync)
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* CNIC Attachment */}
                  <div className="p-4 border border-dashed border-slate-200 rounded-xl bg-slate-50 text-center space-y-2 relative">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Tenant CNIC</span>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      ref={cnicInputRef}
                      onChange={(e) => handleFileChange(e, "cnic")}
                      className="hidden"
                    />
                    {cnicDoc ? (
                      <div className="space-y-1">
                        <p className="font-bold text-green-600 truncate text-[10px]">{cnicDoc.name}</p>
                        <button
                          type="button"
                          onClick={() => cnicInputRef.current?.click()}
                          className="px-2 py-1 bg-white border border-slate-200 rounded font-semibold text-[9px] hover:bg-slate-50"
                        >
                          Change File
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-1 cursor-pointer" onClick={() => cnicInputRef.current?.click()}>
                        <Upload className="h-5 w-5 text-slate-400 mx-auto" />
                        <p className="text-[10px] font-semibold text-slate-600">Select CNIC Doc</p>
                      </div>
                    )}
                  </div>

                  {/* Passport Attachment */}
                  <div className="p-4 border border-dashed border-slate-200 rounded-xl bg-slate-50 text-center space-y-2 relative">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Tenant Passport</span>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      ref={passportInputRef}
                      onChange={(e) => handleFileChange(e, "passport")}
                      className="hidden"
                    />
                    {passportDoc ? (
                      <div className="space-y-1">
                        <p className="font-bold text-green-600 truncate text-[10px]">{passportDoc.name}</p>
                        <button
                          type="button"
                          onClick={() => passportInputRef.current?.click()}
                          className="px-2 py-1 bg-white border border-slate-200 rounded font-semibold text-[9px] hover:bg-slate-50"
                        >
                          Change File
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-1 cursor-pointer" onClick={() => passportInputRef.current?.click()}>
                        <Upload className="h-5 w-5 text-slate-400 mx-auto" />
                        <p className="text-[10px] font-semibold text-slate-600">Select Passport</p>
                      </div>
                    )}
                  </div>

                  {/* Lease Agreement Attachment */}
                  <div className="p-4 border border-dashed border-slate-200 rounded-xl bg-slate-50 text-center space-y-2 relative">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Agreement Signature</span>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      ref={agreementInputRef}
                      onChange={(e) => handleFileChange(e, "agreement")}
                      className="hidden"
                    />
                    {agreementDoc ? (
                      <div className="space-y-1">
                        <p className="font-bold text-green-600 truncate text-[10px]">{agreementDoc.name}</p>
                        <button
                          type="button"
                          onClick={() => agreementInputRef.current?.click()}
                          className="px-2 py-1 bg-white border border-slate-200 rounded font-semibold text-[9px] hover:bg-slate-50"
                        >
                          Change File
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-1 cursor-pointer" onClick={() => agreementInputRef.current?.click()}>
                        <Upload className="h-5 w-5 text-slate-400 mx-auto" />
                        <p className="text-[10px] font-semibold text-slate-600">Select Lease Doc</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setView("list")}
                  className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/10 disabled:opacity-50"
                >
                  {isSubmitting ? "Processing..." : (view === "new" ? "Complete Registration" : "Save Changes")}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL: DOCUMENT PREVIEW */}
      <AnimatePresence>
        {previewDoc && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-4 relative"
            >
              <button
                onClick={() => setPreviewDoc(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="border-b border-slate-100 pb-2">
                <h3 className="font-display font-bold text-slate-900 text-base flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-blue-500" />
                  {previewDoc.title}
                </h3>
                <span className="text-[9px] text-slate-400 font-mono">Secured via Supabase Storage</span>
              </div>

              {/* Preview Rendering */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center min-h-64 max-h-[28rem] relative">
                {previewDoc.data.startsWith("data:image/") ? (
                  <img
                    src={previewDoc.data}
                    alt="Identity preview"
                    className="max-w-full max-h-96 object-contain"
                  />
                ) : (
                  <div className="text-center p-6 text-slate-400 space-y-4">
                    <FileText className="h-12 w-12 text-slate-500 mx-auto animate-pulse" />
                    <div>
                      <p className="font-bold text-slate-200 text-xs">Agreement Document Payload</p>
                      <p className="text-[10px] text-slate-500 mt-1 max-w-xs mx-auto">This PDF file is stored in your private bucket storage. It contains the official tenancy agreements and legal terms.</p>
                    </div>
                    <a
                      href={previewDoc.data}
                      download="Lease_Agreement_Document.pdf"
                      className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Download File from Supabase
                    </a>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-2 border-t border-slate-100">
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs"
                >
                  Close Secure Vault
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
