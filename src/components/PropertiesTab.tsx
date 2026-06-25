import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Property, PropertyType, PropertyStatus, UnitStatus } from "../types";
import { 
  Building2, 
  Search, 
  Filter, 
  Plus, 
  MapPin, 
  Trash2, 
  Edit, 
  Eye, 
  X, 
  Navigation, 
  Layers, 
  ArrowLeft, 
  ExternalLink,
  DollarSign,
  Wrench,
  Users,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Mock locations for Google Places Autocomplete simulation
const MOCK_PLACES_SUGGESTIONS = [
  { description: "742 Evergreen Terrace, Springfield", lat: 39.7817, lng: -89.6501 },
  { description: "1600 Amphitheatre Parkway, Mountain View, CA", lat: 37.4220, lng: -122.0841 },
  { description: "101 Broadway, New York City, NY", lat: 40.7128, lng: -74.0060 },
  { description: "890 Ocean Drive, Miami Beach, FL", lat: 25.7781, lng: -80.1313 },
  { description: "55 Pine Needle Way, Aspen, CO", lat: 39.1911, lng: -106.8175 },
  { description: "221B Baker Street, London, UK", lat: 51.5237, lng: -0.1585 },
  { description: "123 Jinnah Avenue, Blue Area, Islamabad", lat: 33.7294, lng: 73.0697 },
  { description: "45 Mall Road, Lahore, Pakistan", lat: 31.5204, lng: 74.3587 },
  { description: "88 Gulshan Avenue, Dhaka, Bangladesh", lat: 23.7925, lng: 90.4178 }
];

export const PropertiesTab: React.FC = () => {
  const { 
    properties, 
    units, 
    leases, 
    tickets, 
    addProperty, 
    updateProperty, 
    deleteProperty, 
    currentUser,
    showToast
  } = useApp();

  const isTenant = currentUser?.role === "Tenant";

  // Tab View state: "list" | "new" | "edit" | "details"
  const [view, setView] = useState<"list" | "new" | "edit" | "details">("list");
  const [selectedPropId, setSelectedPropId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // Form states
  const [formName, setFormName] = useState("");
  const [formType, setFormType] = useState<PropertyType>(PropertyType.APARTMENT);
  const [formAddress, setFormAddress] = useState("");
  const [formLat, setFormLat] = useState<number>(37.7749);
  const [formLng, setFormLng] = useState<number>(-122.4194);
  const [formDesc, setFormDesc] = useState("");
  const [formImageUrl, setFormImageUrl] = useState("");
  const [formUnitsCount, setFormUnitsCount] = useState<number>(4);

  // Google Places Autocomplete Suggestion states
  const [suggestions, setSuggestions] = useState<typeof MOCK_PLACES_SUGGESTIONS>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Filter properties based on search & type
  const isOwner = currentUser?.role === "Owner";
  
  const filteredProperties = properties.filter((p) => {
    if (isOwner && p.owner_id !== currentUser?.id) return false;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || p.type === typeFilter;
    return matchesSearch && matchesType;
  });

  // Handle Autocomplete Address typing
  const handleAddressChange = (val: string) => {
    setFormAddress(val);
    if (val.trim().length > 2) {
      const filtered = MOCK_PLACES_SUGGESTIONS.filter(item => 
        item.description.toLowerCase().includes(val.toLowerCase())
      );
      // If no matches, generate a mock suggestion based on what was typed
      if (filtered.length === 0) {
        setSuggestions([
          { description: `${val}, Downtown District`, lat: 34.0522 + (Math.random() - 0.5) * 0.1, lng: -118.2437 + (Math.random() - 0.5) * 0.1 },
          { description: `${val}, suburban Sector`, lat: 40.7128 + (Math.random() - 0.5) * 0.1, lng: -74.0060 + (Math.random() - 0.5) * 0.1 }
        ]);
      } else {
        setSuggestions(filtered);
      }
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (place: typeof MOCK_PLACES_SUGGESTIONS[0]) => {
    setFormAddress(place.description);
    setFormLat(place.lat);
    setFormLng(place.lng);
    setShowSuggestions(false);
    showToast(`Location set to coordinates: [${place.lat.toFixed(4)}, ${place.lng.toFixed(4)}]`, "success");
  };

  // Get preset images based on Type
  const getPresetImage = (type: PropertyType) => {
    switch (type) {
      case PropertyType.HOUSE:
        return "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&auto=format&fit=crop&q=80";
      case PropertyType.PLAZA:
        return "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80";
      case PropertyType.SHOP:
        return "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&auto=format&fit=crop&q=80";
      case PropertyType.HOSTEL:
        return "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&auto=format&fit=crop&q=80";
      case PropertyType.APARTMENT:
      default:
        return "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80";
    }
  };

  // Handle Form Submission (Create or Edit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formAddress) {
      showToast("Please enter a property name and address", "error");
      return;
    }

    const imgUrl = formImageUrl || getPresetImage(formType);
    setIsSubmitting(true);
    let success = false;

    if (view === "new") {
      success = await addProperty({
        name: formName,
        address: formAddress,
        type: formType,
        units_count: formUnitsCount,
        status: PropertyStatus.ACTIVE,
        image_url: imgUrl,
        latitude: formLat,
        longitude: formLng,
        description: formDesc
      });
    } else if (view === "edit" && selectedPropId) {
      const existing = properties.find(p => p.id === selectedPropId);
      if (existing) {
        success = await updateProperty({
          ...existing,
          name: formName,
          address: formAddress,
          type: formType,
          image_url: imgUrl,
          latitude: formLat,
          longitude: formLng,
          description: formDesc
        });
      }
    }
    
    setIsSubmitting(false);
    if (success) {
      setView("list");
      resetForm();
    }
  };

  const handleDeleteProperty = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}? This will delete all associated units.`)) {
      setIsSubmitting(true);
      await deleteProperty(id);
      setIsSubmitting(false);
    }
  };

  const startNewProperty = () => {
    resetForm();
    setView("new");
  };

  const startEditProperty = (p: Property) => {
    setSelectedPropId(p.id);
    setFormName(p.name);
    setFormType(p.type);
    setFormAddress(p.address);
    setFormLat(p.latitude || 37.7749);
    setFormLng(p.longitude || -122.4194);
    setFormDesc(p.description || "");
    setFormImageUrl(p.image_url);
    setView("edit");
  };

  const viewDetails = (id: string) => {
    setSelectedPropId(id);
    setView("details");
  };

  const resetForm = () => {
    setFormName("");
    setFormType(PropertyType.APARTMENT);
    setFormAddress("");
    setFormLat(37.7749);
    setFormLng(-122.4194);
    setFormDesc("");
    setFormImageUrl("");
    setFormUnitsCount(4);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // Extract selected property detail helpers
  const selectedProp = properties.find(p => p.id === selectedPropId);
  const propUnits = selectedProp ? units.filter(u => u.property_id === selectedProp.id) : [];
  const propLeases = selectedProp ? leases.filter(l => l.property_id === selectedProp.id) : [];
  const propTickets = selectedProp ? tickets.filter(t => t.property_id === selectedProp.id) : [];

  // Financial calculations
  const totalMonthlyRent = propUnits.reduce((acc, u) => acc + u.rent_amount, 0);
  const occupiedUnits = propUnits.filter(u => u.status === UnitStatus.OCCUPIED).length;

  return (
    <div className="space-y-6">
      {/* HEADER CONTROLS */}
      {view === "list" && (
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex-1 w-full flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-slate-50 text-xs"
              />
            </div>
            {/* Filter by Type */}
            <div className="relative">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full md:w-48 px-3.5 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none text-xs"
              >
                <option value="all">All Asset Types</option>
                <option value={PropertyType.HOUSE}>House</option>
                <option value={PropertyType.APARTMENT}>Apartment</option>
                <option value={PropertyType.PLAZA}>Plaza</option>
                <option value={PropertyType.SHOP}>Shop</option>
                <option value={PropertyType.HOSTEL}>Hostel</option>
              </select>
            </div>
          </div>

          {!isTenant && (
            <button
              onClick={startNewProperty}
              className="w-full sm:w-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg text-xs transition-all"
            >
              <Plus className="h-4 w-4" />
              Add Property
            </button>
          )}
        </div>
      )}

      {/* RENDER ACTIVE VIEW */}
      <AnimatePresence mode="wait">
        {/* VIEW 1: PROPERTY LIST */}
        {view === "list" && (
          <motion.div
            key="list-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {filteredProperties.length === 0 ? (
              <div className="col-span-full py-12 text-center bg-white border border-slate-200 rounded-2xl p-8 space-y-3">
                <Building2 className="h-12 w-12 text-slate-300 mx-auto" />
                <h3 className="font-display font-bold text-slate-800 text-base">No properties found</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">Try broadening your search query or add a brand new property asset to start managing.</p>
                {!isTenant && (
                  <button
                    onClick={startNewProperty}
                    className="mt-2 py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-colors shadow-lg shadow-blue-500/10"
                  >
                    Add Your First Property
                  </button>
                )}
              </div>
            ) : (
              filteredProperties.map((p) => {
                const linkedUnits = units.filter(u => u.property_id === p.id);
                const vacantCount = linkedUnits.filter(u => u.status === UnitStatus.AVAILABLE || u.status === UnitStatus.VACANT).length;
                const maintenanceCount = linkedUnits.filter(u => u.status === UnitStatus.MAINTENANCE).length;
                const occCount = linkedUnits.filter(u => u.status === UnitStatus.OCCUPIED).length;

                return (
                  <div
                    key={p.id}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col group"
                  >
                    {/* Cover image */}
                    <div className="h-44 overflow-hidden relative bg-slate-900 shrink-0">
                      <img
                        src={p.image_url}
                        alt={p.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                      />
                      <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-md border border-slate-200 text-[10px] font-bold rounded-full text-slate-800 shadow-sm capitalize">
                        {p.type}
                      </div>
                      
                      {/* Interactive Actions Overlay */}
                      <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => viewDetails(p.id)}
                          className="p-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 shadow-sm hover:text-blue-600"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {!isTenant && (
                          <>
                            <button
                              onClick={() => startEditProperty(p)}
                              className="p-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 shadow-sm hover:text-amber-600"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProperty(p.id, p.name)}
                              disabled={isSubmitting}
                              className="p-1.5 rounded-lg bg-white hover:bg-slate-50 text-rose-600 shadow-sm hover:bg-rose-50 disabled:opacity-50"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h4 className="font-display font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                          {p.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                          <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{p.address}</span>
                        </p>
                        {p.description && (
                          <p className="text-[11px] text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                            {p.description}
                          </p>
                        )}
                      </div>

                      {/* Stats Pills */}
                      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-[10px] text-center font-mono font-medium">
                        <div className="p-2 bg-green-50 text-green-700 rounded-xl border border-green-100/50">
                          <div className="font-bold text-xs">{occCount}</div>
                          <div>Occupied</div>
                        </div>
                        <div className="p-2 bg-blue-50 text-blue-700 rounded-xl border border-blue-100/50">
                          <div className="font-bold text-xs">{vacantCount}</div>
                          <div>Available</div>
                        </div>
                        <div className="p-2 bg-amber-50 text-amber-700 rounded-xl border border-amber-100/50">
                          <div className="font-bold text-xs">{maintenanceCount}</div>
                          <div>Repair</div>
                        </div>
                      </div>

                      {/* Bottom row button */}
                      <button
                        onClick={() => viewDetails(p.id)}
                        className="w-full py-2 bg-slate-50 group-hover:bg-blue-600 text-slate-700 group-hover:text-white font-semibold text-xs rounded-xl border border-slate-100 group-hover:border-blue-600 flex items-center justify-center gap-1 transition-all"
                      >
                        Manage Property Assets
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </motion.div>
        )}

        {/* VIEW 2: FORM FOR NEW/EDIT PROPERTY */}
        {(view === "new" || view === "edit") && (
          <motion.div
            key="property-form"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 max-w-2xl mx-auto shadow-xl space-y-6"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-display font-extrabold text-slate-900 text-base md:text-lg">
                  {view === "new" ? "Register Property Asset" : "Modify Property Settings"}
                </h3>
                <p className="text-[11px] text-slate-400">Fill in the fields below to establish property records.</p>
              </div>
              <button
                onClick={() => setView("list")}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs text-slate-700">
              {/* Row 1: Name and Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Property Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Oakridge Plaza Suite"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 bg-slate-50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Property Type *</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as PropertyType)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none bg-slate-50 font-medium"
                  >
                    <option value={PropertyType.HOUSE}>House</option>
                    <option value={PropertyType.APARTMENT}>Apartment</option>
                    <option value={PropertyType.PLAZA}>Plaza</option>
                    <option value={PropertyType.SHOP}>Shop</option>
                    <option value={PropertyType.HOSTEL}>Hostel</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Address with Google Places Autocomplete simulation */}
              <div className="space-y-1 relative">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  Address &amp; Location (Google Places Autocomplete) *
                  <span className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-md font-mono">Live Simulation</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Start typing an address..."
                    value={formAddress}
                    onChange={(e) => handleAddressChange(e.target.value)}
                    onFocus={() => { if(formAddress.length > 2) setShowSuggestions(true); }}
                    className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 bg-slate-50"
                  />
                </div>

                {/* Autocomplete Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden divide-y divide-slate-100 max-h-48 overflow-y-auto">
                    {suggestions.map((place, idx) => (
                      <div
                        key={idx}
                        onClick={() => selectSuggestion(place)}
                        className="p-2.5 hover:bg-slate-50 cursor-pointer flex items-center gap-2 text-slate-700 transition-colors"
                      >
                        <Navigation className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                        <div>
                          <p className="font-semibold text-[11px]">{place.description}</p>
                          <p className="text-[9px] text-slate-400 font-mono">lat: {place.lat.toFixed(4)}, lng: {place.lng.toFixed(4)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Latitude and Longitude Coordinates Display */}
              <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Latitude Coords</span>
                  <input
                    type="number"
                    step="any"
                    value={formLat}
                    onChange={(e) => setFormLat(parseFloat(e.target.value) || 0)}
                    className="w-full bg-transparent font-mono font-bold text-[11px] text-slate-700 focus:outline-none border-b border-transparent focus:border-slate-300"
                  />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Longitude Coords</span>
                  <input
                    type="number"
                    step="any"
                    value={formLng}
                    onChange={(e) => setFormLng(parseFloat(e.target.value) || 0)}
                    className="w-full bg-transparent font-mono font-bold text-[11px] text-slate-700 focus:outline-none border-b border-transparent focus:border-slate-300"
                  />
                </div>
              </div>

              {/* Row 3: Description */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Asset Description</label>
                <textarea
                  rows={3}
                  placeholder="Provide a description of the size, characteristics, local neighborhood, etc."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 bg-slate-50"
                />
              </div>

              {/* Row 4: Custom Image URL */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Custom Cover Image URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 bg-slate-50"
                />
                <p className="text-[9px] text-slate-400 leading-none">Leave empty to auto-generate a high-quality preset cover image matching your property type.</p>
              </div>

              {/* Units count (For Creation only) */}
              {view === "new" && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Initial Units Count</label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={formUnitsCount}
                    onChange={(e) => setFormUnitsCount(parseInt(e.target.value) || 1)}
                    className="w-full md:w-32 px-3 py-2 border border-slate-200 rounded-xl focus:outline-none bg-slate-50"
                  />
                  <p className="text-[9px] text-slate-400 leading-none">The system will auto-initialize these vacant unit slots inside the property for immediate leasing.</p>
                </div>
              )}

              {/* Buttons */}
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
                  {isSubmitting ? "Saving..." : (view === "new" ? "Create Asset Profile" : "Save Changes")}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* VIEW 3: PROPERTY DETAILS (PATH: /properties/[id]) */}
        {view === "details" && selectedProp && (
          <motion.div
            key="property-details"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Header / Back Action */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setView("list")}
                className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 shadow-sm text-xs font-bold"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Properties
              </button>

              {!isTenant && (
                <button
                  onClick={() => startEditProperty(selectedProp)}
                  className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-white shadow-md text-xs font-bold"
                >
                  <Edit className="h-3.5 w-3.5" />
                  Edit Settings
                </button>
              )}
            </div>

            {/* Main Details Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* LEFT COLUMN: Asset Identity CARD */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <div className="h-48 bg-slate-900 relative">
                    <img
                      src={selectedProp.image_url}
                      alt={selectedProp.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover opacity-95"
                    />
                    <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md text-white px-3 py-1.5 rounded-xl border border-white/20">
                      <span className="text-[10px] font-mono tracking-wider font-extrabold uppercase">ASSET PROFILE</span>
                    </div>
                  </div>

                  <div className="p-5 space-y-4 text-xs">
                    <div>
                      <span className="text-[9px] bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-full font-mono uppercase font-bold tracking-wider">
                        {selectedProp.type}
                      </span>
                      <h3 className="font-display font-extrabold text-slate-900 text-base md:text-lg mt-2">{selectedProp.name}</h3>
                      <p className="text-slate-500 flex items-center gap-1 mt-1 leading-relaxed">
                        <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                        <span>{selectedProp.address}</span>
                      </p>
                    </div>

                    {selectedProp.description && (
                      <div className="space-y-1">
                        <h5 className="font-bold text-slate-800">Description</h5>
                        <p className="text-slate-500 leading-relaxed text-[11px]">{selectedProp.description}</p>
                      </div>
                    )}

                    {/* Coordinates / Map Section */}
                    <div className="space-y-2">
                      <h5 className="font-bold text-slate-800 flex items-center gap-1">
                        <Navigation className="h-3.5 w-3.5 text-slate-400" />
                        Geographical Coordinates
                      </h5>
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-[10px] font-mono">
                        <div className="flex justify-between text-slate-500">
                          <span>Latitude:</span>
                          <span className="text-slate-800 font-bold">{(selectedProp.latitude || 37.7749).toFixed(5)}</span>
                        </div>
                        <div className="flex justify-between text-slate-500">
                          <span>Longitude:</span>
                          <span className="text-slate-800 font-bold">{(selectedProp.longitude || -122.4194).toFixed(5)}</span>
                        </div>
                      </div>

                      {/* Map representation mockup */}
                      <div className="h-32 border border-slate-200 rounded-xl overflow-hidden relative group">
                        <div className="absolute inset-0 bg-sky-100 flex items-center justify-center font-mono text-[10px] text-sky-700 font-bold bg-[radial-gradient(#0ea5e9_1px,transparent_1px)] [background-size:16px_16px]">
                          <div className="text-center p-3 bg-white/95 border border-sky-200 rounded-xl shadow-lg relative z-10 space-y-1">
                            <MapPin className="h-5 w-5 text-rose-500 mx-auto animate-bounce" />
                            <p className="text-slate-700">Coordinates Center</p>
                            <span className="text-[8px] text-slate-400">Map Satellite Active</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Financial Overview */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-xs space-y-3">
                  <h4 className="font-display font-extrabold text-slate-900 flex items-center gap-1.5">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    Asset Financial Status
                  </h4>
                  
                  <div className="space-y-2 divide-y divide-slate-100">
                    <div className="flex justify-between py-1.5">
                      <span className="text-slate-400">Monthly Rent Capacity:</span>
                      <span className="font-bold text-slate-800 font-mono">${totalMonthlyRent.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-slate-400">Occupancy Rate:</span>
                      <span className="font-bold text-slate-800 font-mono">
                        {propUnits.length ? Math.round((occupiedUnits / propUnits.length) * 100) : 0}%
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-slate-400">Under Lease Agreements:</span>
                      <span className="font-bold text-slate-800 font-mono">{propLeases.length} Active</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMNS: Units, Leases & Maintenance History */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* 1. UNITS LIST SECTION */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h4 className="font-display font-bold text-slate-900 text-sm flex items-center gap-2">
                      <Layers className="h-4.5 w-4.5 text-blue-500" />
                      Individual Units ({propUnits.length})
                    </h4>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs text-slate-600">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                          <th className="py-2.5">Unit Number</th>
                          <th className="py-2.5">Floor</th>
                          <th className="py-2.5">Monthly Rent</th>
                          <th className="py-2.5">Status</th>
                          <th className="py-2.5">Current Tenant</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 font-medium">
                        {propUnits.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-6 text-center text-slate-400">No units registered for this property yet.</td>
                          </tr>
                        ) : (
                          propUnits.map((u) => (
                            <tr key={u.id} className="hover:bg-slate-50/50">
                              <td className="py-3 font-bold text-slate-900">Unit {u.unit_number}</td>
                              <td className="py-3 font-mono">Floor {u.floor}</td>
                              <td className="py-3 font-mono">${u.rent_amount.toLocaleString()}</td>
                              <td className="py-3">
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                  u.status === UnitStatus.OCCUPIED 
                                    ? "bg-indigo-50 text-indigo-600 border border-indigo-100" 
                                    : u.status === UnitStatus.MAINTENANCE 
                                      ? "bg-amber-50 text-amber-600 border border-amber-100" 
                                      : "bg-green-50 text-green-600 border border-green-100"
                                }`}>
                                  {u.status}
                                </span>
                              </td>
                              <td className="py-3 text-slate-900 font-semibold">{u.tenant_name || "—"}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 2. LEASE AGREEMENTS SUMMARY */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                  <h4 className="font-display font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Users className="h-4.5 w-4.5 text-indigo-500" />
                    Active Lease Agreements
                  </h4>

                  <div className="space-y-2.5">
                    {propLeases.length === 0 ? (
                      <div className="text-center py-6 text-slate-400 text-xs">No active leases for this property asset.</div>
                    ) : (
                      propLeases.map((l) => (
                        <div
                          key={l.id}
                          className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs font-medium"
                        >
                          <div>
                            <p className="font-bold text-slate-900">{l.tenant_name}</p>
                            <p className="text-[10px] text-slate-500 font-mono">Unit {l.unit_number} • {l.start_date} to {l.end_date}</p>
                          </div>
                          <div className="text-right font-mono">
                            <p className="font-bold text-slate-800">${l.rent_amount}/mo</p>
                            <span className="text-[9px] bg-green-100 text-green-800 px-1.5 py-0.5 rounded-md font-bold">{l.status}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* 3. MAINTENANCE HISTORY */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                  <h4 className="font-display font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Wrench className="h-4.5 w-4.5 text-amber-500" />
                    Maintenance Despatched Logs
                  </h4>

                  <div className="space-y-3">
                    {propTickets.length === 0 ? (
                      <div className="text-center py-6 text-slate-400 text-xs">No maintenance history reported.</div>
                    ) : (
                      propTickets.map((t) => (
                        <div
                          key={t.id}
                          className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3 text-xs"
                        >
                          <div className={`p-1.5 rounded-lg shrink-0 ${
                            t.priority === "Urgent" || t.priority === "High" ? "bg-red-50 text-red-600" : "bg-slate-100 text-slate-600"
                          }`}>
                            <Wrench className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="font-bold text-slate-900 truncate">{t.title}</p>
                              <span className="text-[9px] font-mono font-bold bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded-md shrink-0">{t.status}</span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5">Unit {t.unit_number} • Filed on {new Date(t.created_at).toLocaleDateString()}</p>
                            <p className="text-slate-500 mt-1 line-clamp-1">{t.description}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
