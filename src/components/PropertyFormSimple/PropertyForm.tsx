import React, { useState, useEffect } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { PAKISTAN_LOCATION_DATA } from "../../data/pakistanLocations";
import { 
  Building2, 
  MapPin, 
  Sparkles, 
  Info, 
  Trash2, 
  Plus, 
  Upload, 
  Check, 
  FileText, 
  AlertCircle, 
  Camera, 
  Phone, 
  Mail, 
  User, 
  Clock, 
  DollarSign, 
  ChevronRight, 
  ChevronLeft,
  X
} from "lucide-react";

interface PropertyFormProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  isSubmitting: boolean;
  photoPreviews: string[];
  onPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemovePhoto: (index: number) => void;
  leaseDocName: string | null;
  onLeaseDocChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveLeaseDoc: () => void;
  titleDocName: string | null;
  onTitleDocChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveTitleDoc: () => void;
  otherDocNames: string[];
  onOtherDocsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveOtherDoc: (index: number) => void;
  onSubmit: (e: React.FormEvent) => void;
  onExit?: () => void;
}

export const PropertyForm: React.FC<PropertyFormProps> = ({
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  isSubmitting,
  photoPreviews,
  onPhotoChange,
  onRemovePhoto,
  leaseDocName,
  onLeaseDocChange,
  onRemoveLeaseDoc,
  titleDocName,
  onTitleDocChange,
  onRemoveTitleDoc,
  otherDocNames,
  onOtherDocsChange,
  onRemoveOtherDoc,
  onSubmit,
  onExit,
}) => {
  const { register, watch, setValue, formState: { errors } } = useFormContext();

  // Watch fields for dynamic and conditional behavior
  const selectedProvince = watch("province");
  const selectedCity = watch("city");
  const monthlyRent = watch("monthly_rent");
  const isOccupied = watch("is_occupied");

  // Filtered lists for cascade
  const provinces = PAKISTAN_LOCATION_DATA;
  const cities = provinces.find((p) => p.name === selectedProvince)?.cities || [];
  const areas = cities.find((c) => c.name === selectedCity)?.areas || [];

  // Update cascade dropdowns on change
  useEffect(() => {
    if (selectedProvince) {
      const availableCities = provinces.find((p) => p.name === selectedProvince)?.cities || [];
      if (availableCities.length > 0 && !availableCities.find((c) => c.name === selectedCity)) {
        setValue("city", "");
        setValue("area", "");
        setValue("postal_code", "");
      }
    }
  }, [selectedProvince, setValue, provinces, selectedCity]);

  useEffect(() => {
    if (selectedCity && selectedProvince) {
      const availableAreas = cities.find((c) => c.name === selectedCity)?.areas || [];
      if (availableAreas.length > 0) {
        const currentArea = watch("area");
        const foundArea = availableAreas.find((a) => a.name === currentArea);
        if (foundArea) {
          setValue("postal_code", foundArea.postalCode);
        } else {
          setValue("area", "");
          setValue("postal_code", "");
        }
      }
    }
  }, [selectedCity, selectedProvince, setValue, cities, watch]);

  // Set default security deposit (2x rent) when rent changes
  useEffect(() => {
    if (monthlyRent && !isNaN(Number(monthlyRent))) {
      setValue("security_deposit", Number(monthlyRent) * 2);
    }
  }, [monthlyRent, setValue]);

  // Format CNIC live helper
  const handleCnicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    let formatted = val;
    if (val.length > 5 && val.length <= 12) {
      formatted = `${val.slice(0, 5)}-${val.slice(5)}`;
    } else if (val.length > 12) {
      formatted = `${val.slice(0, 5)}-${val.slice(5, 12)}-${val.slice(12, 13)}`;
    }
    setValue("tenant_cnic", formatted);
  };

  // Pre-configured options
  const PROPERTY_TYPES = ["Residential", "Commercial", "Mixed-Use"];
  const CATEGORIES = ["Apartment", "House", "Villa", "Studio", "Penthouse", "Office", "Shop"];
  const STATUSES = ["Available", "Occupied", "Under Maintenance", "Renovation"];
  const FLOOR_LEVELS = ["Ground", "1st", "2nd", "3rd", "4th+"];
  const KITCHEN_TYPES = ["Open", "Closed", "Semi-Open"];
  const FLOORINGS = ["Tiles", "Marble", "Wood", "Carpet", "Cement"];
  const AC_TYPES = ["Split", "Central", "Window", "None"];
  const WATER_SUPPLIES = ["WASA", "Tubewell", "Boring", "Tanker"];
  const GAS_SUPPLIES = ["Sui Gas", "Cylinder", "None"];
  const LEASE_TYPES = ["Fixed Term", "Month-to-Month", "Yearly"];

  const AMENITY_OPTIONS = [
    "Garden",
    "Swimming Pool",
    "Gym",
    "Security Guard",
    "Cameras",
    "Elevator",
    "Generator Backup",
    "Fiber Internet"
  ];

  const RULE_OPTIONS = [
    "Smoking Not Allowed",
    "Alcohol Not Allowed",
    "Pets Conditional",
    "Subletting Not Allowed",
    "Home Business Not Allowed",
    "Quiet Hours 10PM-6AM"
  ];

  return (
    <div className="space-y-6">
      {/* Step Indicators */}
      <div className="flex items-center justify-between px-2">
        <span className="text-[11px] font-mono font-bold text-emerald-600 uppercase bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
          Step {currentStep} of {totalSteps}
        </span>
        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                i + 1 === currentStep
                  ? "w-8 bg-emerald-600"
                  : i + 1 < currentStep
                  ? "w-2.5 bg-emerald-200"
                  : "w-2.5 bg-slate-100 border border-slate-200"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-100/40 p-6 md:p-8">
        {/* STEP 1: MANDATORY INFORMATION */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-slate-900 text-base md:text-lg">Mandatory Property Information</h3>
                <p className="text-xs text-slate-400">Fill in critical parameters to catalog the property asset.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Property Name *</label>
                <input
                  type="text"
                  {...register("property_name")}
                  placeholder="e.g. Executive Heights Phase 5"
                  className={`w-full min-h-[44px] px-3.5 py-2 border rounded-xl bg-slate-50 text-slate-800 text-xs focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors ${
                    errors.property_name ? "border-rose-500" : "border-slate-200"
                  }`}
                />
                {errors.property_name && (
                  <p className="text-rose-500 text-[10px] flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.property_name.message?.toString()}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Property Type *</label>
                <select
                  {...register("property_type")}
                  className={`w-full min-h-[44px] px-3.5 py-2 border rounded-xl bg-slate-50 text-slate-800 text-xs focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors ${
                    errors.property_type ? "border-rose-500" : "border-slate-200"
                  }`}
                >
                  <option value="">Select Type</option>
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                {errors.property_type && (
                  <p className="text-rose-500 text-[10px] flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.property_type.message?.toString()}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Category *</label>
                <select
                  {...register("category")}
                  className={`w-full min-h-[44px] px-3.5 py-2 border rounded-xl bg-slate-50 text-slate-800 text-xs focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors ${
                    errors.category ? "border-rose-500" : "border-slate-200"
                  }`}
                >
                  <option value="">Select Category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-rose-500 text-[10px] flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.category.message?.toString()}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Property Status *</label>
                <select
                  {...register("property_status")}
                  className={`w-full min-h-[44px] px-3.5 py-2 border rounded-xl bg-slate-50 text-slate-800 text-xs focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors ${
                    errors.property_status ? "border-rose-500" : "border-slate-200"
                  }`}
                >
                  <option value="">Select Status</option>
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {errors.property_status && (
                  <p className="text-rose-500 text-[10px] flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.property_status.message?.toString()}
                  </p>
                )}
              </div>
            </div>

            {/* Address Cascading Section */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h4 className="text-[11px] font-bold text-emerald-600 font-mono uppercase tracking-wider">Pakistan-Specific Location Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Province *</label>
                  <select
                    {...register("province")}
                    className={`w-full min-h-[44px] px-3 py-2 border rounded-xl bg-slate-50 text-xs focus:outline-none focus:border-emerald-500 focus:bg-white ${
                      errors.province ? "border-rose-500" : "border-slate-200"
                    }`}
                  >
                    <option value="">Select Province</option>
                    {provinces.map((p) => (
                      <option key={p.name} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                  {errors.province && <p className="text-rose-500 text-[10px]">{errors.province.message?.toString()}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">City *</label>
                  <select
                    {...register("city")}
                    disabled={!selectedProvince}
                    className={`w-full min-h-[44px] px-3 py-2 border rounded-xl bg-slate-50 text-xs focus:outline-none focus:border-emerald-500 focus:bg-white disabled:opacity-50 ${
                      errors.city ? "border-rose-500" : "border-slate-200"
                    }`}
                  >
                    <option value="">Select City</option>
                    {cities.map((c) => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                  {errors.city && <p className="text-rose-500 text-[10px]">{errors.city.message?.toString()}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Area / Sector *</label>
                  <select
                    {...register("area")}
                    disabled={!selectedCity}
                    className={`w-full min-h-[44px] px-3 py-2 border rounded-xl bg-slate-50 text-xs focus:outline-none focus:border-emerald-500 focus:bg-white disabled:opacity-50 ${
                      errors.area ? "border-rose-500" : "border-slate-200"
                    }`}
                  >
                    <option value="">Select Area</option>
                    {areas.map((a) => (
                      <option key={a.name} value={a.name}>{a.name}</option>
                    ))}
                  </select>
                  {errors.area && <p className="text-rose-500 text-[10px]">{errors.area.message?.toString()}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Street Address *</label>
                  <input
                    type="text"
                    {...register("street_address")}
                    placeholder="e.g. House 44A, Street 12-C"
                    className={`w-full min-h-[44px] px-3 py-2 border rounded-xl bg-slate-50 text-xs focus:outline-none focus:border-emerald-500 focus:bg-white ${
                      errors.street_address ? "border-rose-500" : "border-slate-200"
                    }`}
                  />
                  {errors.street_address && <p className="text-rose-500 text-[10px]">{errors.street_address.message?.toString()}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Postal Code (Auto-populated)</label>
                  <input
                    type="text"
                    {...register("postal_code")}
                    readOnly
                    className="w-full min-h-[44px] px-3 py-2 border border-slate-200 bg-slate-100 text-xs rounded-xl font-mono text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Famous Landmark (Optional)</label>
                <input
                  type="text"
                  {...register("landmark")}
                  placeholder="e.g. Near Civic Center / Opp. Shell Petrol Station"
                  className="w-full min-h-[44px] px-3.5 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 text-xs focus:outline-none focus:border-emerald-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Specifications Details Section */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h4 className="text-[11px] font-bold text-emerald-600 font-mono uppercase tracking-wider">Specifications</h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Unit Number *</label>
                  <input
                    type="text"
                    {...register("unit_number")}
                    placeholder="e.g. F-3, Ground"
                    className={`w-full min-h-[44px] px-3 py-2 border rounded-xl bg-slate-50 text-xs focus:outline-none focus:border-emerald-500 focus:bg-white ${
                      errors.unit_number ? "border-rose-500" : "border-slate-200"
                    }`}
                  />
                  {errors.unit_number && <p className="text-rose-500 text-[10px]">{errors.unit_number.message?.toString()}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Area (Sq. Ft.) *</label>
                  <input
                    type="number"
                    {...register("total_area", { valueAsNumber: true })}
                    placeholder="e.g. 1200"
                    className={`w-full min-h-[44px] px-3 py-2 border rounded-xl bg-slate-50 text-xs focus:outline-none focus:border-emerald-500 focus:bg-white ${
                      errors.total_area ? "border-rose-500" : "border-slate-200"
                    }`}
                  />
                  {errors.total_area && <p className="text-rose-500 text-[10px]">{errors.total_area.message?.toString()}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Bedrooms *</label>
                  <input
                    type="number"
                    {...register("bedrooms", { valueAsNumber: true })}
                    placeholder="e.g. 3"
                    className={`w-full min-h-[44px] px-3 py-2 border rounded-xl bg-slate-50 text-xs focus:outline-none focus:border-emerald-500 focus:bg-white ${
                      errors.bedrooms ? "border-rose-500" : "border-slate-200"
                    }`}
                  />
                  {errors.bedrooms && <p className="text-rose-500 text-[10px]">{errors.bedrooms.message?.toString()}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Bathrooms *</label>
                  <input
                    type="number"
                    {...register("bathrooms", { valueAsNumber: true })}
                    placeholder="e.g. 2"
                    className={`w-full min-h-[44px] px-3 py-2 border rounded-xl bg-slate-50 text-xs focus:outline-none focus:border-emerald-500 focus:bg-white ${
                      errors.bathrooms ? "border-rose-500" : "border-slate-200"
                    }`}
                  />
                  {errors.bathrooms && <p className="text-rose-500 text-[10px]">{errors.bathrooms.message?.toString()}</p>}
                </div>

                <div className="space-y-1.5 col-span-2 md:col-span-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Floor Level *</label>
                  <select
                    {...register("floor_level")}
                    className={`w-full min-h-[44px] px-3 py-2 border rounded-xl bg-slate-50 text-xs focus:outline-none focus:border-emerald-500 focus:bg-white ${
                      errors.floor_level ? "border-rose-500" : "border-slate-200"
                    }`}
                  >
                    <option value="">Floor</option>
                    {FLOOR_LEVELS.map((fl) => (
                      <option key={fl} value={fl}>{fl}</option>
                    ))}
                  </select>
                  {errors.floor_level && <p className="text-rose-500 text-[10px]">{errors.floor_level.message?.toString()}</p>}
                </div>
              </div>

              <div className="space-y-1.5 max-w-xs">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Parking Spaces *</label>
                <input
                  type="number"
                  {...register("parking_spaces", { valueAsNumber: true })}
                  placeholder="e.g. 1"
                  className={`w-full min-h-[44px] px-3 py-2 border rounded-xl bg-slate-50 text-xs focus:outline-none focus:border-emerald-500 focus:bg-white ${
                    errors.parking_spaces ? "border-rose-500" : "border-slate-200"
                  }`}
                />
                {errors.parking_spaces && <p className="text-rose-500 text-[10px]">{errors.parking_spaces.message?.toString()}</p>}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: SPECIFICATIONS & AMENITIES */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-slate-900 text-base md:text-lg">Specifications & Amenities</h3>
                <p className="text-xs text-slate-400">Identify structural features, utilities and luxury options included.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Kitchen Layout</label>
                <select
                  {...register("kitchen_type")}
                  className="w-full min-h-[44px] px-3.5 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 text-xs focus:outline-none focus:border-emerald-500 focus:bg-white"
                >
                  {KITCHEN_TYPES.map((k) => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Balcony Included?</label>
                <select
                  {...register("has_balcony")}
                  className="w-full min-h-[44px] px-3.5 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 text-xs focus:outline-none focus:border-emerald-500 focus:bg-white"
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Flooring Type</label>
                <select
                  {...register("flooring")}
                  className="w-full min-h-[44px] px-3.5 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 text-xs focus:outline-none focus:border-emerald-500 focus:bg-white"
                >
                  {FLOORINGS.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Air Conditioning</label>
                <select
                  {...register("ac_type")}
                  className="w-full min-h-[44px] px-3.5 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 text-xs focus:outline-none focus:border-emerald-500 focus:bg-white"
                >
                  {AC_TYPES.map((ac) => (
                    <option key={ac} value={ac}>{ac}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Water Supply Provider</label>
                <select
                  {...register("water_supply")}
                  className="w-full min-h-[44px] px-3.5 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 text-xs focus:outline-none focus:border-emerald-500 focus:bg-white"
                >
                  {WATER_SUPPLIES.map((ws) => (
                    <option key={ws} value={ws}>{ws}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Gas Utility Connection</label>
                <select
                  {...register("gas_supply")}
                  className="w-full min-h-[44px] px-3.5 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 text-xs focus:outline-none focus:border-emerald-500 focus:bg-white"
                >
                  {GAS_SUPPLIES.map((gs) => (
                    <option key={gs} value={gs}>{gs}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Checkboxes Grid */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Standard & Luxury Amenities Included</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {AMENITY_OPTIONS.map((amenity) => (
                  <label
                    key={amenity}
                    className="flex items-center gap-2.5 p-3.5 border border-slate-100 hover:border-emerald-100 bg-slate-50/50 hover:bg-emerald-50/20 rounded-2xl cursor-pointer transition-all"
                  >
                    <input
                      type="checkbox"
                      value={amenity}
                      {...register("amenities")}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                    />
                    <span className="text-xs text-slate-700 font-medium">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: RENT & RULES */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                <DollarSign className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-slate-900 text-base md:text-lg">Rent & House Rules</h3>
                <p className="text-xs text-slate-400">Define financial terms, security buffers, and expectations.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Monthly Rent (PKR) *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold text-xs">
                    Rs.
                  </div>
                  <input
                    type="number"
                    {...register("monthly_rent", { valueAsNumber: true })}
                    placeholder="e.g. 85000"
                    className={`w-full min-h-[44px] pl-10 pr-3.5 py-2 border rounded-xl bg-slate-50 text-slate-800 text-xs font-bold font-mono focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors ${
                      errors.monthly_rent ? "border-rose-500" : "border-slate-200"
                    }`}
                  />
                </div>
                {errors.monthly_rent && (
                  <p className="text-rose-500 text-[10px] flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.monthly_rent.message?.toString()}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Security Deposit (PKR) - Auto-Calculated (2x Rent)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold text-xs">
                    Rs.
                  </div>
                  <input
                    type="number"
                    {...register("security_deposit", { valueAsNumber: true })}
                    placeholder="Auto Calculated"
                    className="w-full min-h-[44px] pl-10 pr-3.5 py-2 border border-slate-200 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold font-mono cursor-not-allowed"
                    readOnly
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Lease Type *</label>
                <select
                  {...register("lease_type")}
                  className={`w-full min-h-[44px] px-3.5 py-2 border rounded-xl bg-slate-50 text-slate-800 text-xs focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors ${
                    errors.lease_type ? "border-rose-500" : "border-slate-200"
                  }`}
                >
                  <option value="">Select Lease Type</option>
                  {LEASE_TYPES.map((lt) => (
                    <option key={lt} value={lt}>{lt}</option>
                  ))}
                </select>
                {errors.lease_type && (
                  <p className="text-rose-500 text-[10px] flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.lease_type.message?.toString()}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Lease Duration (Months)</label>
                <input
                  type="number"
                  {...register("lease_duration", { valueAsNumber: true })}
                  placeholder="e.g. 12"
                  className="w-full min-h-[44px] px-3.5 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 text-xs font-mono"
                />
              </div>
            </div>

            {/* House Rules Grid */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Standard House & Tenant Rules</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {RULE_OPTIONS.map((rule) => (
                  <label
                    key={rule}
                    className="flex items-center gap-2.5 p-3.5 border border-slate-100 hover:border-emerald-100 bg-slate-50/50 hover:bg-emerald-50/20 rounded-2xl cursor-pointer transition-all"
                  >
                    <input
                      type="checkbox"
                      value={rule}
                      {...register("house_rules")}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                    />
                    <span className="text-xs text-slate-700 font-medium">{rule}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: TENANT INFORMATION */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                <User className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-slate-900 text-base md:text-lg">Tenant Profile & Occupancy</h3>
                <p className="text-xs text-slate-400">Required if the property asset is actively occupied.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Is the property currently occupied?</span>
                  <span className="text-[10px] text-slate-400">Selecting YES expands the mandate to record current tenant details.</span>
                </div>
                <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                  <button
                    type="button"
                    onClick={() => setValue("is_occupied", false)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold font-mono transition-colors ${
                      !isOccupied ? "bg-emerald-600 text-white" : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    NO
                  </button>
                  <button
                    type="button"
                    onClick={() => setValue("is_occupied", true)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold font-mono transition-colors ${
                      isOccupied ? "bg-emerald-600 text-white" : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    YES
                  </button>
                </div>
              </div>

              {isOccupied && (
                <div className="space-y-5 pt-4 animate-fadeIn">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Tenant Full Name *</label>
                      <input
                        type="text"
                        {...register("tenant_name")}
                        placeholder="e.g. Muhammad Ali"
                        className={`w-full min-h-[44px] px-3 py-2 border rounded-xl bg-slate-50 text-xs focus:outline-none focus:border-emerald-500 focus:bg-white ${
                          errors.tenant_name ? "border-rose-500" : "border-slate-200"
                        }`}
                      />
                      {errors.tenant_name && <p className="text-rose-500 text-[10px]">{errors.tenant_name.message?.toString()}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Tenant CNIC (National ID) *</label>
                      <input
                        type="text"
                        {...register("tenant_cnic")}
                        onChange={handleCnicChange}
                        placeholder="e.g. 35201-1234567-3"
                        className={`w-full min-h-[44px] px-3 py-2 border rounded-xl bg-slate-50 text-xs font-mono focus:outline-none focus:border-emerald-500 focus:bg-white ${
                          errors.tenant_cnic ? "border-rose-500" : "border-slate-200"
                        }`}
                      />
                      {errors.tenant_cnic && <p className="text-rose-500 text-[10px]">{errors.tenant_cnic.message?.toString()}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Contact Phone Number *</label>
                      <input
                        type="tel"
                        {...register("tenant_phone")}
                        placeholder="e.g. 03211234567"
                        className={`w-full min-h-[44px] px-3 py-2 border rounded-xl bg-slate-50 text-xs font-mono focus:outline-none focus:border-emerald-500 focus:bg-white ${
                          errors.tenant_phone ? "border-rose-500" : "border-slate-200"
                        }`}
                      />
                      {errors.tenant_phone && <p className="text-rose-500 text-[10px]">{errors.tenant_phone.message?.toString()}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Email Address *</label>
                      <input
                        type="email"
                        {...register("tenant_email")}
                        placeholder="e.g. m.ali@example.pk"
                        className={`w-full min-h-[44px] px-3 py-2 border rounded-xl bg-slate-50 text-xs focus:outline-none focus:border-emerald-500 focus:bg-white ${
                          errors.tenant_email ? "border-rose-500" : "border-slate-200"
                        }`}
                      />
                      {errors.tenant_email && <p className="text-rose-500 text-[10px]">{errors.tenant_email.message?.toString()}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Lease Start Date *</label>
                      <input
                        type="date"
                        {...register("lease_start")}
                        className={`w-full min-h-[44px] px-3 py-2 border rounded-xl bg-slate-50 text-xs font-mono focus:outline-none focus:border-emerald-500 focus:bg-white ${
                          errors.lease_start ? "border-rose-500" : "border-slate-200"
                        }`}
                      />
                      {errors.lease_start && <p className="text-rose-500 text-[10px]">{errors.lease_start.message?.toString()}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Lease End Date *</label>
                      <input
                        type="date"
                        {...register("lease_end")}
                        className={`w-full min-h-[44px] px-3 py-2 border rounded-xl bg-slate-50 text-xs font-mono focus:outline-none focus:border-emerald-500 focus:bg-white ${
                          errors.lease_end ? "border-rose-500" : "border-slate-200"
                        }`}
                      />
                      {errors.lease_end && <p className="text-rose-500 text-[10px]">{errors.lease_end.message?.toString()}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Emergency Contact Name</label>
                      <input
                        type="text"
                        {...register("emergency_name")}
                        placeholder="e.g. Aslam Mahmood"
                        className="w-full min-h-[44px] px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Emergency Contact Phone</label>
                      <input
                        type="tel"
                        {...register("emergency_phone")}
                        placeholder="e.g. 03007654321"
                        className="w-full min-h-[44px] px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-xs font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Number of Occupants</label>
                      <input
                        type="number"
                        {...register("number_of_occupants", { valueAsNumber: true })}
                        placeholder="e.g. 4"
                        className="w-full min-h-[44px] px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-xs font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Occupation / Job Title</label>
                      <input
                        type="text"
                        {...register("occupation")}
                        placeholder="e.g. Business Manager"
                        className="w-full min-h-[44px] px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 5: DOCUMENTS & PHOTOS */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                <Camera className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-slate-900 text-base md:text-lg">Media & Document Storage</h3>
                <p className="text-xs text-slate-400">Upload key ownership files, lease drafts, and property images.</p>
              </div>
            </div>

            {/* Property Photos Upload Section */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Property Photos * (Min. 3 Required)</label>
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 bg-slate-50/50 flex flex-col items-center justify-center text-center hover:border-emerald-300 transition-colors cursor-pointer relative">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={onPhotoChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Upload className="h-8 w-8 text-slate-400 mb-2" />
                <span className="text-xs font-bold text-slate-700">Drag or Click to upload property photos</span>
                <span className="text-[10px] text-slate-400 mt-1">Accepts PNG, JPG, JPEG up to 10MB per file</span>
              </div>
              
              {photoPreviews.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold font-mono text-emerald-600">
                    Uploaded Photos ({photoPreviews.length} files total)
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {photoPreviews.map((previewUrl, index) => (
                      <div key={index} className="relative aspect-video bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-sm group">
                        <img src={previewUrl} alt={`Preview ${index + 1}`} className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => onRemovePhoto(index)}
                          className="absolute top-1 right-1 p-1 bg-slate-900/80 hover:bg-rose-600 text-white rounded-lg transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {errors.photos && (
                <p className="text-rose-500 text-[10px] flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.photos.message?.toString()}
                </p>
              )}
            </div>

            {/* Documents Upload Section */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h4 className="text-[11px] font-bold text-emerald-600 font-mono uppercase tracking-wider">Property & Lease Documentation</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Lease Agreement */}
                <div className="p-4 border border-slate-100 rounded-2xl bg-slate-50/30 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-700 block uppercase">Lease Agreement Document</span>
                    <span className="text-[9px] text-slate-400">PDF copy of signed contract or unsigned templates</span>
                  </div>
                  {leaseDocName ? (
                    <div className="flex items-center justify-between bg-white border border-slate-100 p-2.5 rounded-xl mt-3 shadow-sm">
                      <span className="text-[10px] font-mono text-slate-600 truncate max-w-[150px]">{leaseDocName}</span>
                      <button type="button" onClick={onRemoveLeaseDoc} className="text-rose-500 hover:text-rose-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="relative mt-3">
                      <input type="file" accept=".pdf,.doc,.docx" onChange={onLeaseDocChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                      <button type="button" className="w-full py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-2 shadow-sm hover:bg-slate-50">
                        <FileText className="h-4 w-4 text-slate-400" /> Upload PDF / Word
                      </button>
                    </div>
                  )}
                </div>

                {/* Title Deed */}
                <div className="p-4 border border-slate-100 rounded-2xl bg-slate-50/30 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-700 block uppercase">Title Document</span>
                    <span className="text-[9px] text-slate-400">Deed registry, LDA/DHA approval certificates</span>
                  </div>
                  {titleDocName ? (
                    <div className="flex items-center justify-between bg-white border border-slate-100 p-2.5 rounded-xl mt-3 shadow-sm">
                      <span className="text-[10px] font-mono text-slate-600 truncate max-w-[150px]">{titleDocName}</span>
                      <button type="button" onClick={onRemoveTitleDoc} className="text-rose-500 hover:text-rose-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="relative mt-3">
                      <input type="file" accept=".pdf,.jpg,.png" onChange={onTitleDocChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                      <button type="button" className="w-full py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-2 shadow-sm hover:bg-slate-50">
                        <FileText className="h-4 w-4 text-slate-400" /> Upload Document
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Other Documents */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Other Secondary Files</span>
                <div className="relative">
                  <input type="file" multiple onChange={onOtherDocsChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                  <button type="button" className="w-full min-h-[44px] bg-slate-950 border border-slate-800 text-slate-300 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
                    <Plus className="h-4 w-4 text-emerald-400" /> Click to attach other files
                  </button>
                </div>
                {otherDocNames.length > 0 && (
                  <div className="space-y-1.5 bg-slate-50 p-3 rounded-2xl border border-slate-100 mt-2">
                    {otherDocNames.map((name, index) => (
                      <div key={index} className="flex items-center justify-between bg-white p-2 border border-slate-150 rounded-xl text-xs font-mono">
                        <span className="truncate max-w-[220px] text-slate-600">{name}</span>
                        <button type="button" onClick={() => onRemoveOtherDoc(index)} className="text-rose-500 hover:text-rose-600">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Google Maps Link */}
              <div className="space-y-1.5 pt-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Google Maps coordinates link</label>
                <input
                  type="url"
                  {...register("maps_link")}
                  placeholder="https://maps.google.com/?q=..."
                  className="w-full min-h-[44px] px-3.5 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 text-xs font-mono"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* NAV FOOTER ACTION BUTTONS */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={onPrev}
          disabled={currentStep === 1 || isSubmitting}
          className="min-h-[44px] px-5 py-2 border border-slate-200 rounded-xl text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors flex items-center gap-1.5 disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" /> Back
        </button>

        <div className="flex items-center gap-3">
          {onExit && (
            <button
              type="button"
              onClick={onExit}
              className="min-h-[44px] px-5 py-2 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors"
            >
              Exit
            </button>
          )}

          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={onNext}
              disabled={isSubmitting}
              className="min-h-[44px] px-6 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 shadow-md shadow-emerald-600/10 transition-colors flex items-center gap-1.5"
            >
              Continue <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onSubmit}
              disabled={isSubmitting}
              className="min-h-[44px] px-8 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-1.5 disabled:bg-emerald-600/60"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Deploying Asset Record...
                </>
              ) : (
                <>
                  Save & Publish Profile <Check className="h-4 w-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
