import React, { useState, useRef } from "react";
import { useApp } from "../context/AppContext";
import { MaintenanceTicket, TicketStatus, UnitStatus } from "../types";
import { 
  Wrench, 
  Search, 
  Plus, 
  Trash2, 
  Edit, 
  X, 
  AlertTriangle, 
  Calendar, 
  DollarSign, 
  Upload, 
  Image as ImageIcon, 
  Building2, 
  Clock, 
  Settings, 
  CheckCircle2 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const MaintenanceTab: React.FC = () => {
  const { 
    tickets, 
    units, 
    addTicket, 
    updateTicketStatus, 
    updateTicketCost, 
    currentUser, 
    showToast,
    properties
  } = useApp();

  const isTenant = currentUser?.role === "Tenant";

  // State: "list" | "new"
  const [view, setView] = useState<"list" | "new">("list");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Ticket Form state
  const [formUnitId, setFormUnitId] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formPriority, setFormPriority] = useState<"Low" | "Medium" | "High" | "Urgent">("Medium");
  
  // Image attachments (simulating Supabase Storage)
  const [attachedImages, setAttachedImages] = useState<Array<{name: string, data: string}>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Status/Cost modification modal
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [modStatus, setModStatus] = useState<TicketStatus>(TicketStatus.OPEN);
  const [modCost, setModCost] = useState<number>(0);

  // Filter tickets
  const isOwner = currentUser?.role === "Owner";
  const myPropertyIds = isOwner ? properties.filter(p => p.owner_id === currentUser?.id).map(p => p.id) : [];

  const filteredTickets = tickets.filter((t) => {
    if (isOwner && !myPropertyIds.includes(t.property_id)) return false;
    
    // If tenant, they only see their own tickets!
    const matchesUser = !isTenant || t.tenant_id === currentUser?.id;
    
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.property_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.tenant_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;
    
    return matchesUser && matchesSearch && matchesStatus;
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileList = Array.from(files) as File[];
    fileList.forEach((file) => {
      if (file.size > 2.5 * 1024 * 1024) {
        showToast("Image is too large! Max size 2.5 MB.", "error");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result as string;
        setAttachedImages((prev) => [...prev, { name: file.name, data: base64Data }]);
        showToast(`Image "${file.name}" uploaded to Supabase 'maintenance-tickets' bucket.`, "success");
      };
      reader.readAsDataURL(file);
    });
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formUnitId || !formTitle || !formDesc) {
      showToast("Please select a unit and provide a title/description.", "error");
      return;
    }

    const selectedUnit = units.find(u => u.id === formUnitId);
    if (!selectedUnit) {
      showToast("Selected property unit is invalid.", "error");
      return;
    }

    // Combine uploaded image data urls into array
    const imageUrls = attachedImages.map((img) => img.data);

    setIsSubmitting(true);
    const success = await addTicket({
      property_id: selectedUnit.property_id,
      property_name: selectedUnit.property_name,
      unit_id: selectedUnit.id,
      unit_number: selectedUnit.unit_number,
      tenant_name: currentUser?.name || "System Tenant",
      title: formTitle,
      description: formDesc,
      priority: formPriority,
      cost: 0, // initially 0 resolved cost
      images: imageUrls.length > 0 ? imageUrls : [
        "https://images.unsplash.com/photo-1581094288338-2314dddb7eed?w=600&auto=format&fit=crop&q=80" // fallback maintenance tool illustration
      ]
    });

    setIsSubmitting(false);
    if (success) {
      setView("list");
      resetForm();
    }
  };

  const resetForm = () => {
    setFormUnitId("");
    setFormTitle("");
    setFormDesc("");
    setFormPriority("Medium");
    setAttachedImages([]);
  };

  const triggerModifyTicket = (ticket: MaintenanceTicket) => {
    setSelectedTicketId(ticket.id);
    setModStatus(ticket.status);
    setModCost(ticket.cost || 0);
  };

  const handleSaveModification = async () => {
    if (!selectedTicketId) return;

    setIsSubmitting(true);
    // Update status
    const statusSuccess = await updateTicketStatus(selectedTicketId, modStatus);
    
    // Update cost
    let costSuccess = true;
    if (statusSuccess && modCost >= 0) {
      costSuccess = await updateTicketCost(selectedTicketId, modCost);
    }
    
    setIsSubmitting(false);
    if (statusSuccess && costSuccess) {
      setSelectedTicketId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER FILTERS */}
      {view === "list" && (
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex-1 w-full flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search maintenance logs by title, asset, or tenant..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-slate-50 text-xs"
              />
            </div>

            {/* Filter by Status */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-48 px-3.5 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none text-xs font-semibold"
            >
              <option value="all">All Ticket Statuses</option>
              <option value={TicketStatus.OPEN}>Open / Despatched</option>
              <option value={TicketStatus.IN_PROGRESS}>In Progress</option>
              <option value={TicketStatus.RESOLVED}>Completed / Resolved</option>
            </select>
          </div>

          <button
            onClick={() => {
              resetForm();
              if (units.length > 0) setFormUnitId(units[0].id);
              setView("new");
            }}
            className="w-full sm:w-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg text-xs transition-all"
          >
            <Plus className="h-4 w-4" />
            File Ticket
          </button>
        </div>
      )}

      {/* SYNC NOTICE BANNER */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-700 rounded-2xl p-4 text-white border border-amber-500/50 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-200 flex items-center justify-center border border-amber-400/20 shrink-0">
            <Wrench className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h4 className="font-display font-bold text-xs">Supabase Storage: Media Bucket Live</h4>
            <p className="text-[10px] text-amber-200 leading-relaxed">Maintenance photo evidence and vendor invoices are automatically synchronized to the bucket 'maintenance-evidence'.</p>
          </div>
        </div>
        <span className="hidden md:block text-[9px] font-mono font-bold bg-amber-500/20 text-amber-200 border border-amber-400/20 px-2 py-1 rounded-lg">
          Simulated CDN
        </span>
      </div>

      <AnimatePresence mode="wait">
        {/* VIEW 1: TICKETS GRID */}
        {view === "list" && (
          <motion.div
            key="list-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredTickets.length === 0 ? (
              <div className="col-span-full py-12 text-center bg-white border border-slate-200 rounded-2xl p-8 space-y-3">
                <Wrench className="h-12 w-12 text-slate-300 mx-auto" />
                <h3 className="font-display font-bold text-slate-800 text-base">No tickets filed</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">There are currently no open maintenance issues or repair logs reported for this scope.</p>
              </div>
            ) : (
              filteredTickets.map((t) => (
                <div
                  key={t.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
                >
                  {/* Photo evidence slide */}
                  <div className="h-44 overflow-hidden relative bg-slate-900 shrink-0">
                    <img
                      src={t.images?.[0] || "https://images.unsplash.com/photo-1581094288338-2314dddb7eed?w=600&auto=format&fit=crop&q=80"}
                      alt={t.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    />
                    
                    {/* Status Pill */}
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold shadow-sm uppercase ${
                        t.status === TicketStatus.OPEN 
                          ? "bg-red-500 text-white" 
                          : t.status === TicketStatus.IN_PROGRESS 
                            ? "bg-amber-500 text-white" 
                            : "bg-green-600 text-white"
                      }`}>
                        {t.status}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-950/75 text-slate-100 text-[9px] font-bold shadow-sm uppercase">
                        {t.priority}
                      </span>
                    </div>

                    {/* Cost Pill */}
                    {t.cost > 0 && (
                      <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md border border-slate-200 text-slate-900 px-2 py-1 rounded-lg shadow-sm font-mono font-extrabold text-[10px]">
                        Cost: ${t.cost}
                      </div>
                    )}
                  </div>

                  {/* Body details */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4 text-xs">
                    <div className="space-y-1">
                      <p className="font-mono text-[9px] text-blue-600 font-bold tracking-wider flex items-center gap-1 uppercase">
                        <Building2 className="h-3.5 w-3.5 shrink-0 text-blue-500" />
                        {t.property_name} • Unit {t.unit_number}
                      </p>
                      <h4 className="font-display font-bold text-slate-900 text-sm leading-tight group-hover:text-blue-600 transition-colors">
                        {t.title}
                      </h4>
                      <p className="text-slate-500 text-[11px] line-clamp-2 leading-relaxed">
                        {t.description}
                      </p>
                    </div>

                    {/* Metadata section */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>Filed: {new Date(t.created_at).toLocaleDateString()}</span>
                      </div>
                      <span className="text-slate-700 font-semibold truncate max-w-[8rem]">Tenant: {t.tenant_name}</span>
                    </div>

                    {/* Admin Action Control Row */}
                    {!isTenant && (
                      <button
                        onClick={() => triggerModifyTicket(t)}
                        className="w-full py-2 bg-slate-50 hover:bg-slate-900 hover:text-white text-slate-700 font-bold rounded-xl border border-slate-100 hover:border-slate-900 flex items-center justify-center gap-1.5 transition-all text-[11px]"
                      >
                        <Settings className="h-4 w-4" />
                        Dispatch &amp; Adjust Settings
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </motion.div>
        )}

        {/* VIEW 2: TICKET CREATION (AVAILABLE ON BOTH ROLES) */}
        {view === "new" && (
          <motion.div
            key="new-ticket-form"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 max-w-lg mx-auto shadow-xl space-y-6"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-display font-extrabold text-slate-900 text-base md:text-lg">
                  Submit Maintenance Repair Ticket
                </h3>
                <p className="text-[11px] text-slate-400">Describe physical damages or repairs required. Upload images for instant routing.</p>
              </div>
              <button
                onClick={() => setView("list")}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {units.length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-xs">
                You must have a physical unit assignment before filing repair logs.
              </div>
            ) : (
              <form onSubmit={handleCreateTicket} className="space-y-4 text-xs text-slate-700 font-medium">
                {/* Select Unit */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Affected Asset &amp; Unit *</label>
                  <select
                    value={formUnitId}
                    required
                    onChange={(e) => setFormUnitId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none font-bold"
                  >
                    {units.map(u => (
                      <option key={u.id} value={u.id}>{u.property_name} — Unit {u.unit_number} (Floor {u.floor})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Title */}
                  <div className="space-y-1 col-span-1 md:col-span-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Ticket Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Living room wall water leak"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none bg-slate-50"
                    />
                  </div>

                  {/* Priority */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Severity Level</label>
                    <select
                      value={formPriority}
                      onChange={(e) => setFormPriority(e.target.value as any)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none font-semibold"
                    >
                      <option value="Low">Low (Minor annoyance)</option>
                      <option value="Medium">Medium (Normal fix)</option>
                      <option value="High">High (Damage threat)</option>
                      <option value="Urgent">Urgent (Immediate action!)</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Problem Description *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Provide exact details of the damage, when it occurred, and access codes if applicable."
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none bg-slate-50 leading-relaxed"
                  />
                </div>

                {/* DRAG AND DROP IMAGE MEDIA CAPTURE */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    Media evidence attachments (Supabase Storage upload)
                  </label>
                  
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-6 border border-dashed border-slate-200 rounded-xl bg-slate-50 text-center space-y-2 cursor-pointer hover:bg-slate-100/50 transition-colors"
                  >
                    <ImageIcon className="h-6 w-6 text-slate-400 mx-auto" />
                    <div>
                      <p className="text-[11px] font-bold text-slate-700">Select photos of damage</p>
                      <p className="text-[9px] text-slate-400 leading-none mt-1">Images upload directly to CDN bucket. Max size 2.5 MB per file.</p>
                    </div>
                  </div>

                  {/* Uploaded Photos grid */}
                  {attachedImages.length > 0 && (
                    <div className="grid grid-cols-4 gap-2.5 pt-2">
                      {attachedImages.map((img, idx) => (
                        <div key={idx} className="h-16 rounded-lg overflow-hidden border border-slate-200 relative bg-slate-900 group">
                          <img src={img.data} alt="Attached upload preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setAttachedImages((prev) => prev.filter((_, i) => i !== idx));
                            }}
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Cancel / Submit Buttons */}
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
                    {isSubmitting ? "Filing..." : "File Maintenance Ticket"}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* DISPATCH & RESOLUTION COST DRAWER (ONLY FOR ADMIN / OWNERS) */}
      <AnimatePresence>
        {selectedTicketId && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border border-slate-200 max-w-sm w-full p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="font-display font-extrabold text-slate-900 text-sm flex items-center gap-1">
                  <Settings className="h-4.5 w-4.5 text-blue-500" />
                  Dispatch Repair Resolution
                </h3>
                <button
                  onClick={() => setSelectedTicketId(null)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <div className="space-y-4 text-xs text-slate-700 font-medium">
                {/* Adjust Status */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Change Status</label>
                  <select
                    value={modStatus}
                    onChange={(e) => setModStatus(e.target.value as TicketStatus)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none font-semibold text-slate-900"
                  >
                    <option value={TicketStatus.OPEN}>Open / Vendor Dispatch Pending</option>
                    <option value={TicketStatus.IN_PROGRESS}>In Progress / Repair active</option>
                    <option value={TicketStatus.RESOLVED}>Completed / Resolved</option>
                  </select>
                </div>

                {/* Adjust Cost */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Resolution Invoice Cost (USD)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      min={0}
                      value={modCost}
                      onChange={(e) => setModCost(parseInt(e.target.value) || 0)}
                      className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-xl focus:outline-none font-mono font-extrabold text-slate-900 bg-slate-50 text-sm"
                    />
                  </div>
                  <span className="text-[9px] text-slate-400">Save exact repair costs. This binds automatically to monthly financial spreadsheets.</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2.5 justify-end pt-3 border-t border-slate-100">
                  <button
                    onClick={() => setSelectedTicketId(null)}
                    className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveModification}
                    disabled={isSubmitting}
                    className="px-5 py-2 bg-slate-950 hover:bg-slate-800 text-white font-bold rounded-xl disabled:opacity-50"
                  >
                    {isSubmitting ? "Applying..." : "Apply Settings"}
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
