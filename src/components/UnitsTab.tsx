import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Unit, UnitStatus } from "../types";
import { 
  Layers, 
  Search, 
  Plus, 
  Trash2, 
  Edit, 
  X, 
  Building2, 
  DollarSign, 
  CheckCircle2, 
  Wrench, 
  AlertTriangle 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const UnitsTab: React.FC = () => {
  const { 
    units, 
    properties, 
    addUnit, 
    updateUnit, 
    deleteUnit, 
    currentUser,
    showToast 
  } = useApp();

  const isTenant = currentUser?.role === "Tenant";

  // View state: "list" | "new" | "edit"
  const [view, setView] = useState<"list" | "new" | "edit">("list");
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [propertyFilter, setPropertyFilter] = useState<string>("all");

  // Form States
  const [formPropertyId, setFormPropertyId] = useState("");
  const [formUnitNumber, setFormUnitNumber] = useState("");
  const [formFloor, setFormFloor] = useState<string>("1");
  const [formRent, setFormRent] = useState<number>(1000);
  const [formStatus, setFormStatus] = useState<UnitStatus>(UnitStatus.AVAILABLE);

  // Filter computation
  const isOwner = currentUser?.role === "Owner";
  const myPropertyIds = isOwner ? properties.filter(p => p.owner_id === currentUser?.id).map(p => p.id) : [];
  const selectableProperties = isOwner ? properties.filter(p => p.owner_id === currentUser?.id) : properties;

  const filteredUnits = units.filter((u) => {
    if (isOwner && !myPropertyIds.includes(u.property_id)) return false;
    const matchesSearch = u.unit_number.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          u.property_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || u.status === statusFilter;
    const matchesProperty = propertyFilter === "all" || u.property_id === propertyFilter;
    return matchesSearch && matchesStatus && matchesProperty;
  });

  // Handle Form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPropertyId || !formUnitNumber || !formRent) {
      showToast("Please fill in all required unit fields.", "error");
      return;
    }

    const selectedProperty = properties.find(p => p.id === formPropertyId);
    if (!selectedProperty) {
      showToast("Invalid property selected.", "error");
      return;
    }

    setIsSubmitting(true);
    let success = false;

    if (view === "new") {
      // Check if unit number already exists in this property
      const exists = units.some(u => u.property_id === formPropertyId && u.unit_number.toLowerCase() === formUnitNumber.toLowerCase());
      if (exists) {
        showToast(`Unit ${formUnitNumber} already exists in ${selectedProperty.name}`, "error");
        setIsSubmitting(false);
        return;
      }

      success = await addUnit({
        property_id: formPropertyId,
        property_name: selectedProperty.name,
        unit_number: formUnitNumber,
        rent_amount: formRent,
        status: formStatus,
        floor: isNaN(Number(formFloor)) ? formFloor : parseInt(formFloor),
        tenant_id: null,
        tenant_name: null
      });
    } else if (view === "edit" && selectedUnitId) {
      const existing = units.find(u => u.id === selectedUnitId);
      if (existing) {
        success = await updateUnit({
          ...existing,
          property_id: formPropertyId,
          property_name: selectedProperty.name,
          unit_number: formUnitNumber,
          rent_amount: formRent,
          status: formStatus,
          floor: isNaN(Number(formFloor)) ? formFloor : parseInt(formFloor)
        });
      }
    }
    
    setIsSubmitting(false);
    if (success) {
      setView("list");
      resetForm();
    }
  };

  const handleDeleteUnit = async (id: string, num: string) => {
    if (window.confirm(`Are you sure you want to delete Unit ${num}?`)) {
      setIsSubmitting(true);
      await deleteUnit(id);
      setIsSubmitting(false);
    }
  };

  const startNewUnit = () => {
    resetForm();
    if (properties.length > 0) {
      setFormPropertyId(properties[0].id);
    }
    setView("new");
  };

  const startEditUnit = (u: Unit) => {
    setSelectedUnitId(u.id);
    setFormPropertyId(u.property_id);
    setFormUnitNumber(u.unit_number);
    setFormFloor(u.floor.toString());
    setFormRent(u.rent_amount);
    setFormStatus(u.status);
    setView("edit");
  };

  const resetForm = () => {
    setFormPropertyId("");
    setFormUnitNumber("");
    setFormFloor("1");
    setFormRent(1000);
    setFormStatus(UnitStatus.AVAILABLE);
    setSelectedUnitId(null);
  };

  return (
    <div className="space-y-6">
      {/* HEADER BAR FOR FILTERS */}
      {view === "list" && (
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search unit or asset..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-slate-50 text-xs"
              />
            </div>

            {/* Filter by Property */}
            <select
              value={propertyFilter}
              onChange={(e) => setPropertyFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none text-xs"
            >
              <option value="all">All Properties</option>
              {selectableProperties.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>

            {/* Filter by Status */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none text-xs"
            >
              <option value="all">All Statuses</option>
              <option value={UnitStatus.AVAILABLE}>Available / Vacant</option>
              <option value={UnitStatus.OCCUPIED}>Occupied</option>
              <option value={UnitStatus.MAINTENANCE}>Maintenance</option>
            </select>
          </div>

          {!isTenant && (
            <button
              onClick={startNewUnit}
              className="w-full sm:w-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg text-xs transition-all"
            >
              <Plus className="h-4 w-4" />
              New Unit
            </button>
          )}
        </div>
      )}

      {/* VIEWS CONTAINER */}
      <AnimatePresence mode="wait">
        {/* VIEW 1: LISTING */}
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
                    <th className="p-4">Property</th>
                    <th className="p-4">Unit #</th>
                    <th className="p-4">Floor Level</th>
                    <th className="p-4">Monthly Rent</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Occupant</th>
                    {!isTenant && <th className="p-4 text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredUnits.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400 space-y-2">
                        <Layers className="h-10 w-10 text-slate-300 mx-auto" />
                        <p>No units found matching selection criteria.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredUnits.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0 border border-blue-100/50">
                              <Building2 className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 leading-none">{u.property_name}</p>
                              <span className="text-[10px] text-slate-400 font-mono">ID: {u.property_id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-bold text-slate-900 text-sm">Unit {u.unit_number}</td>
                        <td className="p-4 font-mono text-slate-500">Floor {u.floor}</td>
                        <td className="p-4 font-mono text-slate-900 font-bold">${u.rent_amount.toLocaleString()}/mo</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold inline-flex items-center gap-1 border ${
                            u.status === UnitStatus.OCCUPIED 
                              ? "bg-indigo-50 text-indigo-700 border-indigo-100" 
                              : u.status === UnitStatus.MAINTENANCE 
                                ? "bg-amber-50 text-amber-700 border-amber-100" 
                                : "bg-green-50 text-green-700 border-green-100"
                          }`}>
                            {u.status === UnitStatus.OCCUPIED && <CheckCircle2 className="h-2.5 w-2.5 shrink-0" />}
                            {u.status === UnitStatus.MAINTENANCE && <Wrench className="h-2.5 w-2.5 shrink-0" />}
                            {u.status === UnitStatus.AVAILABLE && <CheckCircle2 className="h-2.5 w-2.5 shrink-0" />}
                            {u.status}
                          </span>
                        </td>
                        <td className="p-4">
                          {u.tenant_name ? (
                            <span className="font-semibold text-slate-900">{u.tenant_name}</span>
                          ) : (
                            <span className="text-slate-400 italic">Unoccupied / Available</span>
                          )}
                        </td>
                        {!isTenant && (
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => startEditUnit(u)}
                                className="p-1.5 rounded-lg border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 bg-white shadow-sm"
                                title="Edit Unit"
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteUnit(u.id, u.unit_number)}
                                disabled={isSubmitting}
                                className="p-1.5 rounded-lg border border-slate-200 hover:border-rose-300 hover:bg-rose-50 text-rose-500 bg-white shadow-sm disabled:opacity-50"
                                title="Delete Unit"
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

        {/* VIEW 2: CREATE / EDIT FORM (ROUTES: /unit/new etc) */}
        {(view === "new" || view === "edit") && (
          <motion.div
            key="unit-form"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 max-w-lg mx-auto shadow-xl space-y-6"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-display font-extrabold text-slate-900 text-base md:text-lg">
                  {view === "new" ? "Add Property Unit Slot" : "Modify Property Unit Slot"}
                </h3>
                <p className="text-[11px] text-slate-400">Add physical address partitions inside a property asset.</p>
              </div>
              <button
                onClick={() => setView("list")}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {properties.length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-xs">
                <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                You must register at least one Property Asset before creating unit slots.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs text-slate-700">
                {/* Property Dropdown */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Property Asset Group *</label>
                  <select
                    value={formPropertyId}
                    required
                    onChange={(e) => setFormPropertyId(e.target.value)}
                    disabled={view === "edit"}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none font-bold"
                  >
                    {selectableProperties.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.type})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Unit Number */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Unit Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 101-B or Apt 405"
                      value={formUnitNumber}
                      onChange={(e) => setFormUnitNumber(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 bg-slate-50 font-bold"
                    />
                  </div>

                  {/* Floor */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Floor Level</label>
                    <input
                      type="text"
                      placeholder="e.g. 1, 2, Ground, Penthouse"
                      value={formFloor}
                      onChange={(e) => setFormFloor(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 bg-slate-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Rent */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Monthly Rent Amount *</label>
                    <div className="relative">
                      <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="number"
                        min={0}
                        required
                        value={formRent}
                        onChange={(e) => setFormRent(parseInt(e.target.value) || 0)}
                        className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 bg-slate-50 font-mono font-bold"
                      />
                    </div>
                  </div>

                  {/* Status */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status Setting</label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as UnitStatus)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none font-semibold"
                    >
                      <option value={UnitStatus.AVAILABLE}>Available</option>
                      <option value={UnitStatus.OCCUPIED}>Occupied</option>
                      <option value={UnitStatus.MAINTENANCE}>Maintenance</option>
                    </select>
                  </div>
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
                    {isSubmitting ? "Saving..." : (view === "new" ? "Create Unit Profile" : "Save Changes")}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
