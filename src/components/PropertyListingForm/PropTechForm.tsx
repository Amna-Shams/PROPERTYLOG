import React, { useState, useEffect } from "react";
import { formatPKR } from "../../utils/currency";
import { PAKISTAN_LOCATION_DATA } from "../../data/pakistanLocations";
import { 
  PropTechPropertyFormData, 
  ComparableProperty, 
  MaintenanceLogItem, 
  PlannedMaintenanceTask, 
  ComplianceItem 
} from "../../types/propTechFormTypes";
import { 
  Building2, 
  MapPin, 
  ListTodo, 
  DollarSign, 
  FileText, 
  Wrench, 
  ShieldCheck, 
  User, 
  TrendingUp, 
  Activity, 
  FolderLock, 
  Scale, 
  PhoneCall, 
  Calendar, 
  CheckCircle2, 
  Upload, 
  Trash2, 
  Plus, 
  FileDown, 
  Sparkles,
  Info
} from "lucide-react";

const FORM_SECTIONS = [
  { id: 1, label: "Basic Information", icon: Building2 },
  { id: 2, label: "Property Address", icon: MapPin },
  { id: 3, label: "Property Specifications", icon: ListTodo },
  { id: 4, label: "Utilities & Services", icon: ShieldCheck },
  { id: 5, label: "Rent & Financials", icon: DollarSign },
  { id: 6, label: "Lease & Rental Rules", icon: FileText },
  { id: 7, label: "Move-in/out Procedures", icon: Calendar },
  { id: 8, label: "Tenant Information", icon: User },
  { id: 9, label: "Property Valuation", icon: TrendingUp },
  { id: 10, label: "Property Management", icon: FolderLock },
  { id: 11, label: "Maintenance History", icon: Wrench },
  { id: 12, label: "Compliance & Legal", icon: Scale },
  { id: 13, label: "Occupancy Status", icon: Activity },
  { id: 14, label: "Manager Task List", icon: CheckCircle2 },
  { id: 15, label: "Quick Reference Card", icon: PhoneCall },
];

export const PropTechForm: React.FC<{ onSave: (data: PropTechPropertyFormData) => void; onCancel: () => void }> = ({ onSave, onCancel }) => {
  const [activeSection, setActiveSection] = useState(1);
  const [formData, setFormData] = useState<PropTechPropertyFormData>({
    propertyId: `PM-PROP-${Math.floor(1000 + Math.random() * 9000)}`,
    propertyName: "Sunset Heights",
    propertyType: "Residential",
    category: "Apartment",
    numUnits: 12,
    yearBuilt: 2022,
    propertyStatus: "Available",

    province: "Punjab",
    city: "Lahore",
    area: "DHA Phase 1-8",
    streetAddress: "Sector Y, Phase 3, DHA",
    landmark: "Near DHA Y-Block Market",
    postalCode: "54000",
    mapsLink: "https://maps.google.com/?q=Lahore+DHA",

    unitNumber: "A-304",
    floorLevel: "3rd",
    totalArea: 1650,
    carpetArea: 1450,
    bedrooms: 3,
    bathrooms: 3,
    livingRooms: 1,
    kitchenType: "Closed",
    hasBalcony: true,
    balconyCount: 2,
    parking: "Covered",
    parkingSpaces: 1,
    hasStoreRoom: true,

    flooring: "Marble",
    wallFinishing: "Paint",
    ceiling: "Gypsum",
    acType: "Split",
    hasHeating: false,
    waterSupply: "WASA",
    gasSupply: "Sui Gas",
    electricitySource: "WAPDA",
    hasSolarSystem: true,
    hasUPSInverter: true,

    hasGarden: false,
    gardenDetails: "",
    hasSwimmingPool: true,
    hasGym: true,
    securityOptions: ["Guard", "Cameras", "Gated"],
    hasElevator: true,
    hasIntercom: true,
    hasGeneratorBackup: true,
    internetType: "Fiber",
    hasCableSatellite: true,
    hasJoggingTrack: false,
    hasPlayArea: true,
    hasCommunityHall: true,
    wasteDisposal: "Private",
    waterTank: "Both",

    electricityDetails: { provider: "WAPDA", accountNumber: "12-34567-8901234 U", status: "Active" },
    gasDetails: { provider: "Sui Northern", accountNumber: "9876543210-9", status: "Active" },
    waterDetails: { provider: "WASA", accountNumber: "W-54321", status: "Active" },
    internetDetails: { provider: "StormFiber", accountNumber: "SF-887766", status: "Active" },
    securityDetails: { provider: "SecureGuard Ltd", accountNumber: "SG-909", status: "Active" },

    monthlyRent: 145000,
    securityDeposit: 290000,
    isUtilityIncluded: false,
    utilitiesIncluded: { electricity: false, gas: false, water: true, internet: false },
    maintenanceCharges: 8500,
    parkingCharges: 3000,
    paymentDueDate: "5th",
    gracePeriod: 5,
    lateFeeAmount: 5000,
    lateFeePercentage: 0,
    paymentMethods: ["Bank Transfer", "Online"],
    bankName: "Meezan Bank Ltd",
    bankAccountNumber: "0234-0102030405",
    bankBranchCode: "0234",

    rentIncreasePolicy: "10% compounding annually",
    lastRentIncreaseDate: "2025-06-01",
    nextRentIncreaseDate: "2026-06-01",

    propertyTaxes: 45000,
    insuranceCost: 35000,
    otherExpenses: 20000,

    leaseType: "Fixed Term",
    leaseDuration: 12,
    leaseStartDate: "2025-07-01",
    leaseEndDate: "2026-07-01",
    hasRenewalOption: true,
    noticePeriod: 60,
    uploadedLeaseAgreementName: "lease_agreement_draft.pdf",

    smokingPolicy: "Not Allowed",
    alcoholPolicy: "Not Allowed",
    petsPolicy: "Conditional",
    petTypes: ["Birds", "Fish"],
    petWeightLimit: 5,
    petDeposit: 15000,
    sublettingAllowed: false,
    homeBusinessAllowed: false,
    noiseRestrictions: "No loud music after 10 PM",
    maxOccupants: 5,
    visitorStayLimit: 7,

    parkingRule: "Assigned",
    hasGuestParking: true,
    bbqAllowed: true,
    poolUsageAllowed: true,
    gymUsageAllowed: true,
    laundrySetup: "In-unit",
    garbageDisposal: "Daily",
    mailDelivery: "Mailbox",
    maintenanceMethod: "Online",
    emergencyContactProvided: true,

    emergencyResponseTime: "Within 2 hours",
    urgentResponseTime: "Within 12 hours",
    routineResponseTime: "Within 36 hours",
    maintenanceContactPhone: "0300-1234567",
    ownersResponsibilityDesc: "Structural repairs, major plumbing leaks, gas lines, roof leakage, external wiring.",
    tenantsResponsibilityDesc: "Light bulbs, basic fixture wear & tear, internal cleaning, regular utility bill payments.",
    maintenanceRequestMethodDesc: "Submit photos and a brief description through the secure PropertyLog Tenant app portal.",
    vendorManagementDesc: "Pre-screened electrical, HVAC, and plumbing vendor panels stationed near DHA Lahore.",

    moveInChecklist: {
      inspection: true,
      photos: true,
      keysHandover: true,
      securityDeposit: true,
      firstRent: true,
      leaseSigned: true,
      rulesAcknowledged: true,
      dates: { inspection: "2025-06-28", keysHandover: "2025-06-30" },
      notes: { inspection: "Flat was fully repainted and detailed clean. No pre-existing cracks." }
    },
    moveOutChecklist: {
      noticeReceived: false,
      finalInspection: false,
      keyReturn: false,
      depositReturned: false,
      balanceCleared: false,
      finalBillCleared: false,
      propertyCleaned: false,
      dates: {},
      notes: {}
    },

    tenantName: "Arslan Mahmood",
    tenantCnic: "35201-1234567-3",
    tenantPhone: "0321-4567890",
    tenantWhatsapp: "0321-4567890",
    tenantEmail: "arslan.mahmood@example.pk",
    tenantOccupation: "Software Engineer",
    tenantEmployer: "Systems Limited",
    tenantEmergencyName: "Mahmood Akhtar",
    tenantEmergencyPhone: "0333-7654321",
    tenantEmergencyRelationship: "Father",
    tenantAdultsCount: 2,
    tenantChildrenCount: 1,
    tenantMoveInDate: "2025-07-01",
    tenantLeaseEndDate: "2026-07-01",

    refLandlordName: "Tariq Jameel",
    refLandlordContact: "0300-9876543",
    refLandlordVerified: true,
    refEmployerName: "Systems HR Admin",
    refEmployerContact: "042-111-797-797",
    refEmployerVerified: true,
    refPersonal1Name: "Zahid Khan",
    refPersonal1Contact: "0312-3456789",
    refPersonal1Verified: true,
    refPersonal2Name: "Kamran Shah",
    refPersonal2Contact: "0345-6789012",
    refPersonal2Verified: false,
    refBankName: "Habib Bank Limited",
    refBankContact: "021-111-111-425",
    refBankVerified: true,

    marketValue: 32000000,
    marketValueSource: "Independent Surveyor",
    marketValueDate: "2026-01-15",
    zameenEstimate: 31500000,
    golchaEstimate: 30800000,
    appraisedValue: 31800000,
    appraisedValueSource: "Meezan Valuation Service",
    appraisedValueDate: "2026-02-10",
    comparables: [
      { id: "1", name: "DHA Phase 3 Block Z Apartment", rent: 140000, size: 1600 },
      { id: "2", name: "DHA Phase 3 Block X Penthouse", rent: 160000, size: 1800 }
    ],

    propertyManagerName: "Faisal Shah",
    propertyManagerPhone: "0300-8484848",
    propertyManagerEmail: "faisal@propertylog.pk",
    propertyManagerOfficeAddress: "Office 12, Gold Crest Mall, DHA Phase 4, Lahore",
    propertyManagerEmergencyHelpline: "042-35690000",
    managementCompany: "PropertyLog Pakistan",
    managementFeeType: "Percentage",
    managementFeeValue: 8,
    lastInspectionDate: "2026-05-10",
    nextInspectionDate: "2026-11-10",
    documents: [
      { id: "doc-1", name: "Ownership Registry Deed", fileName: "dha_deed_sunset.pdf", uploadDate: "2026-05-15", notes: "Attested by LDA & DHA Lahore Authorities" }
    ],

    maintenanceLogs: [
      { id: "log-1", date: "2026-03-12", issue: "Kitchen mixer faucet leakage", actionTaken: "Replaced faucet cartridge", vendor: "Local DHA plumber", cost: 3500, status: "Completed" }
    ],
    plannedMaintenance: [
      { id: "plan-1", task: "AC Filter & Gas service", frequency: "Biannual", nextDate: "2026-09-15", vendor: "Sabir HVAC Pros", estimatedCost: 12000 }
    ],

    complianceItems: [
      { id: "comp-1", requirement: "Fire Safety Extinguisher Certification", status: "Compliant", certificateNumber: "FS-2026-004", expiryDate: "2027-05-10" },
      { id: "comp-2", requirement: "Building Structure Fitness Inspection", status: "Compliant", certificateNumber: "BS-9988-LHR", expiryDate: "2028-06-01" }
    ],
    tenantRightsChecked: { 0: true, 1: true, 2: true, 3: true, 4: true, 5: true, 6: true },
    tenantResponsibilitiesChecked: { 0: true, 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true },

    unitAvailabilityDate: "2026-07-02",
    unitAvailabilityStatus: "Available for viewing",
    unitAvailabilityPriority: "High",

    tasks: [
      { id: "task-1", text: "Conduct pre-handover walkthrough with Arslan Mahmood", completed: true, dateCompleted: "2025-06-29" },
      { id: "task-2", text: "Register lease with local police station security portal", completed: true, dateCompleted: "2025-07-02" },
      { id: "task-3", text: "Schedule winter HVAC preventive check", completed: false }
    ],

    emergencyPolice: "15",
    emergencyAmbulance: "1122",
    emergencyFire: "16",
    emergencyMaintenanceContact: "0300-8484848",
    localHospitalName: "National Hospital DHA Lahore",
    localHospitalPhone: "042-111-171-171",
    localPoliceStationName: "DHA Phase 3 Police Post",
    localPoliceStationPhone: "042-35892011",
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [showDraftToast, setShowDraftToast] = useState(false);

  // Auto-calculation effects
  useEffect(() => {
    // Security deposit: 2x monthly rent
    setFormData(prev => ({
      ...prev,
      securityDeposit: prev.monthlyRent * 2
    }));
  }, [formData.monthlyRent]);

  useEffect(() => {
    if (formData.leaseStartDate && formData.leaseDuration) {
      const start = new Date(formData.leaseStartDate);
      start.setMonth(start.getMonth() + Number(formData.leaseDuration));
      const endStr = start.toISOString().split("T")[0];
      setFormData(prev => ({
        ...prev,
        leaseEndDate: endStr,
        tenantLeaseEndDate: endStr
      }));
    }
  }, [formData.leaseStartDate, formData.leaseDuration]);

  useEffect(() => {
    if (formData.lastRentIncreaseDate) {
      const last = new Date(formData.lastRentIncreaseDate);
      last.setMonth(last.getMonth() + 12);
      const nextStr = last.toISOString().split("T")[0];
      setFormData(prev => ({
        ...prev,
        nextRentIncreaseDate: nextStr
      }));
    }
  }, [formData.lastRentIncreaseDate]);

  useEffect(() => {
    if (formData.lastInspectionDate) {
      const last = new Date(formData.lastInspectionDate);
      last.setMonth(last.getMonth() + 6);
      const nextStr = last.toISOString().split("T")[0];
      setFormData(prev => ({
        ...prev,
        nextInspectionDate: nextStr
      }));
    }
  }, [formData.lastInspectionDate]);

  // Save drafts locally
  const handleAutoSave = (updatedData: PropTechPropertyFormData) => {
    localStorage.setItem("proptech_form_draft", JSON.stringify(updatedData));
    setShowDraftToast(true);
    setTimeout(() => setShowDraftToast(false), 2000);
  };

  const loadDraft = () => {
    const saved = localStorage.getItem("proptech_form_draft");
    if (saved) {
      setFormData(JSON.parse(saved));
    }
  };

  // Province change -> cascading cities
  const handleProvinceChange = (provinceName: string) => {
    const matchedProv = PAKISTAN_LOCATION_DATA.find(p => p.name === provinceName);
    const firstCity = matchedProv?.cities[0]?.name || "";
    const firstArea = matchedProv?.cities[0]?.areas[0]?.name || "";
    const firstZip = matchedProv?.cities[0]?.areas[0]?.postalCode || "";

    setFormData(prev => ({
      ...prev,
      province: provinceName,
      city: firstCity,
      area: firstArea,
      postalCode: firstZip
    }));
  };

  const handleCityChange = (cityName: string) => {
    const matchedProv = PAKISTAN_LOCATION_DATA.find(p => p.name === formData.province);
    const matchedCity = matchedProv?.cities.find(c => c.name === cityName);
    const firstArea = matchedCity?.areas[0]?.name || "";
    const firstZip = matchedCity?.areas[0]?.postalCode || "";

    setFormData(prev => ({
      ...prev,
      city: cityName,
      area: firstArea,
      postalCode: firstZip
    }));
  };

  const handleAreaChange = (areaName: string) => {
    const matchedProv = PAKISTAN_LOCATION_DATA.find(p => p.name === formData.province);
    const matchedCity = matchedProv?.cities.find(c => c.name === formData.city);
    const matchedArea = matchedCity?.areas.find(a => a.name === areaName);

    setFormData(prev => ({
      ...prev,
      area: areaName,
      postalCode: matchedArea?.postalCode || prev.postalCode
    }));
  };

  // CNIC format helper
  const handleCnicChange = (val: string) => {
    const clean = val.replace(/\D/g, "");
    let formatted = clean;
    if (clean.length > 5 && clean.length <= 12) {
      formatted = `${clean.slice(0, 5)}-${clean.slice(5)}`;
    } else if (clean.length > 12) {
      formatted = `${clean.slice(0, 5)}-${clean.slice(5, 12)}-${clean.slice(12, 13)}`;
    }
    setFormData(prev => ({ ...prev, tenantCnic: formatted }));
  };

  const validateCurrentSection = () => {
    const errors: Record<string, string> = {};
    if (activeSection === 1) {
      if (!formData.propertyName) errors.propertyName = "Property Name is required";
      if (formData.numUnits <= 0) errors.numUnits = "Units count must be greater than 0";
      if (formData.yearBuilt < 1900 || formData.yearBuilt > new Date().getFullYear()) {
        errors.yearBuilt = `Year must be between 1900 and ${new Date().getFullYear()}`;
      }
    } else if (activeSection === 2) {
      if (!formData.province) errors.province = "Province is required";
      if (!formData.city) errors.city = "City is required";
      if (!formData.streetAddress) errors.streetAddress = "Street address is required";
      if (!/^\d{5}$/.test(formData.postalCode)) errors.postalCode = "Postal code must be exactly 5 digits";
    } else if (activeSection === 5) {
      if (formData.monthlyRent <= 0) errors.monthlyRent = "Rent must be a positive number";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentSection()) {
      setActiveSection(prev => Math.min(15, prev + 1));
    }
  };

  const handlePrev = () => {
    setActiveSection(prev => Math.max(1, prev - 1));
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateCurrentSection()) {
      onSave(formData);
    }
  };

  // Calculate annual metrics
  const totalMonthlyIncome = formData.monthlyRent + formData.maintenanceCharges + formData.parkingCharges;
  const annualGrossIncome = totalMonthlyIncome * 12;
  const annualExpenses = (formData.propertyTaxes + formData.insuranceCost + formData.otherExpenses) * 12;
  const netOperatingIncome = annualGrossIncome - annualExpenses;
  const capRate = formData.marketValue > 0 ? ((netOperatingIncome / formData.marketValue) * 100).toFixed(2) : "0.00";

  return (
    <div className="bg-slate-900 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden max-w-6xl mx-auto flex flex-col md:flex-row min-h-[750px]">
      
      {/* Dynamic draft notification */}
      {showDraftToast && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-mono flex items-center gap-2 shadow-lg animate-bounce">
          <Sparkles className="h-4 w-4" />
          Draft autosaved successfully
        </div>
      )}

      {/* LEFT NAVIGATION SIDEBAR */}
      <aside className="w-full md:w-80 bg-slate-950 p-6 border-r border-slate-800/80 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-sm text-white tracking-wide">PropertyLog Pro</h3>
              <p className="text-[10px] text-emerald-500 font-mono font-bold uppercase">PK PropTech Database</p>
            </div>
          </div>

          <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {FORM_SECTIONS.map((sec) => {
              const IconComp = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => {
                    if (validateCurrentSection()) {
                      setActiveSection(sec.id);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                    isActive 
                      ? "bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-600/10" 
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
                  }`}
                >
                  <IconComp className={`h-4.5 w-4.5 ${isActive ? "text-white" : "text-slate-500"}`} />
                  <span className="text-xs truncate">{sec.id}. {sec.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/60 mt-6 space-y-3">
          <button
            type="button"
            onClick={loadDraft}
            className="w-full py-2 border border-slate-800 hover:border-slate-700 bg-slate-900/40 rounded-xl text-[11px] font-mono font-bold text-slate-300 transition-colors flex items-center justify-center gap-1.5"
          >
            <FolderLock className="h-3.5 w-3.5" />
            Restore Draft
          </button>
          <div className="text-[10px] text-slate-500 text-center font-mono">
            V1.0.4 • Pakistan Real Estate Portal
          </div>
        </div>
      </aside>

      {/* MAIN FORM PANEL */}
      <main className="flex-1 p-6 md:p-8 flex flex-col justify-between bg-gradient-to-b from-slate-900 to-slate-950 overflow-y-auto max-h-[850px]">
        <div className="space-y-6">
          
          {/* Active section header banner */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider font-mono">
                Section {activeSection} of 15
              </span>
              <h2 className="text-xl font-display font-extrabold text-white mt-1">
                {FORM_SECTIONS.find(s => s.id === activeSection)?.label}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleAutoSave(formData)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-mono font-bold flex items-center gap-1"
              >
                <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                Save Draft
              </button>
            </div>
          </div>

          <form onSubmit={handleFinalSubmit} className="space-y-6">
            
            {/* SECTION 1: BASIC INFO */}
            {activeSection === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Property Registry ID</label>
                  <input
                    type="text"
                    disabled
                    value={formData.propertyId}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-slate-400 cursor-not-allowed"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Property Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.propertyName}
                    onChange={(e) => setFormData({ ...formData, propertyName: e.target.value })}
                    className={`w-full px-4 py-2.5 bg-slate-950 border ${validationErrors.propertyName ? "border-rose-500" : "border-slate-800"} rounded-xl text-white`}
                    placeholder="e.g. Sunset Towers"
                  />
                  {validationErrors.propertyName && <p className="text-rose-500 text-[10px]">{validationErrors.propertyName}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Property Type *</label>
                  <select
                    value={formData.propertyType}
                    onChange={(e) => setFormData({ ...formData, propertyType: e.target.value as any })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  >
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Mixed-Use">Mixed-Use</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  >
                    <option value="Apartment">Apartment</option>
                    <option value="House">House</option>
                    <option value="Villa">Villa</option>
                    <option value="Studio">Studio</option>
                    <option value="Penthouse">Penthouse</option>
                    <option value="Office">Office</option>
                    <option value="Shop">Shop</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Number of Units *</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.numUnits}
                    onChange={(e) => setFormData({ ...formData, numUnits: Number(e.target.value) || 1 })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Year Built *</label>
                  <input
                    type="number"
                    value={formData.yearBuilt}
                    onChange={(e) => setFormData({ ...formData, yearBuilt: Number(e.target.value) || 2024 })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Status *</label>
                  <select
                    value={formData.propertyStatus}
                    onChange={(e) => setFormData({ ...formData, propertyStatus: e.target.value as any })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  >
                    <option value="Available">Available</option>
                    <option value="Occupied">Occupied</option>
                    <option value="Under Maintenance">Under Maintenance</option>
                    <option value="Renovation">Renovation</option>
                  </select>
                </div>
              </div>
            )}

            {/* SECTION 2: PROPERTY ADDRESS */}
            {activeSection === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Province *</label>
                  <select
                    value={formData.province}
                    onChange={(e) => handleProvinceChange(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  >
                    {PAKISTAN_LOCATION_DATA.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">City *</label>
                  <select
                    value={formData.city}
                    onChange={(e) => handleCityChange(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  >
                    {PAKISTAN_LOCATION_DATA.find(p => p.name === formData.province)?.cities.map(c => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Area / Locality *</label>
                  <select
                    value={formData.area}
                    onChange={(e) => handleAreaChange(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  >
                    {PAKISTAN_LOCATION_DATA.find(p => p.name === formData.province)
                      ?.cities.find(c => c.name === formData.city)?.areas.map(a => (
                        <option key={a.name} value={a.name}>{a.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Postal Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Street Address *</label>
                  <input
                    type="text"
                    required
                    value={formData.streetAddress}
                    onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                    placeholder="House No, Street Number, Block Name"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Famous Landmark</label>
                  <input
                    type="text"
                    value={formData.landmark}
                    onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                    placeholder="e.g. Opposite Masjid"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Google Maps Coordinate Link</label>
                  <input
                    type="url"
                    value={formData.mapsLink}
                    onChange={(e) => setFormData({ ...formData, mapsLink: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-xs"
                    placeholder="https://maps.google.com/?q=..."
                  />
                </div>
              </div>
            )}

            {/* SECTION 3: SPECIFICATIONS */}
            {activeSection === 3 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800/60">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Unit Number</label>
                    <input type="text" value={formData.unitNumber} onChange={(e) => setFormData({ ...formData, unitNumber: e.target.value })} className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Floor Level</label>
                    <select value={formData.floorLevel} onChange={(e) => setFormData({ ...formData, floorLevel: e.target.value as any })} className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white">
                      <option value="Ground">Ground</option>
                      <option value="1st">1st</option>
                      <option value="2nd">2nd</option>
                      <option value="3rd">3rd</option>
                      <option value="4th+">4th+</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Total Sq Ft</label>
                    <input type="number" value={formData.totalArea} onChange={(e) => setFormData({ ...formData, totalArea: Number(e.target.value) || 0 })} className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Carpet Sq Ft</label>
                    <input type="number" value={formData.carpetArea} onChange={(e) => setFormData({ ...formData, carpetArea: Number(e.target.value) || 0 })} className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white" />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Bedrooms</label>
                    <input type="number" value={formData.bedrooms} onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) || 0 })} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Bathrooms</label>
                    <input type="number" value={formData.bathrooms} onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) || 0 })} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Living Rooms</label>
                    <input type="number" value={formData.livingRooms} onChange={(e) => setFormData({ ...formData, livingRooms: Number(e.target.value) || 0 })} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Kitchen Type</label>
                    <select value={formData.kitchenType} onChange={(e) => setFormData({ ...formData, kitchenType: e.target.value as any })} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white">
                      <option value="Open">Open</option>
                      <option value="Closed">Closed</option>
                      <option value="Semi-Open">Semi-Open</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-800">
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-emerald-500 font-mono uppercase">Interior Finishes</h4>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="text-[9px] text-slate-400">Flooring</label>
                        <input type="text" value={formData.flooring} onChange={(e) => setFormData({ ...formData, flooring: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-white" />
                      </div>
                      <div>
                        <label className="text-[9px] text-slate-400">AC Type</label>
                        <select value={formData.acType} onChange={(e) => setFormData({ ...formData, acType: e.target.value as any })} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-white">
                          <option value="Split">Split</option>
                          <option value="Central">Central</option>
                          <option value="Window">Window</option>
                          <option value="None">None</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-emerald-500 font-mono uppercase">Water & Gas</h4>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="text-[9px] text-slate-400">Water Supply</label>
                        <select value={formData.waterSupply} onChange={(e) => setFormData({ ...formData, waterSupply: e.target.value as any })} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-white">
                          <option value="WASA">WASA</option>
                          <option value="Tubewell">Tubewell</option>
                          <option value="Boring">Boring</option>
                          <option value="Tanker">Tanker</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[9px] text-slate-400">Gas Connection</label>
                        <select value={formData.gasSupply} onChange={(e) => setFormData({ ...formData, gasSupply: e.target.value as any })} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-white">
                          <option value="Sui Gas">Sui Gas</option>
                          <option value="Cylinder">Cylinder</option>
                          <option value="None">None</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-emerald-500 font-mono uppercase">Backup Utilities</h4>
                    <div className="space-y-2 text-xs">
                      <label className="flex items-center gap-2 text-slate-300">
                        <input type="checkbox" checked={formData.hasSolarSystem} onChange={(e) => setFormData({ ...formData, hasSolarSystem: e.target.checked })} className="rounded bg-slate-950 border-slate-800 text-emerald-600" />
                        Solar Power Grid Net-Metering
                      </label>
                      <label className="flex items-center gap-2 text-slate-300">
                        <input type="checkbox" checked={formData.hasUPSInverter} onChange={(e) => setFormData({ ...formData, hasUPSInverter: e.target.checked })} className="rounded bg-slate-950 border-slate-800 text-emerald-600" />
                        UPS Inverter Installed
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 4: UTILITIES */}
            {activeSection === 4 && (
              <div className="space-y-4">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <span className="text-xs font-bold text-white">Electricity Account</span>
                    <input
                      type="text"
                      placeholder="Account Number"
                      value={formData.electricityDetails.accountNumber}
                      onChange={(e) => setFormData({ ...formData, electricityDetails: { ...formData.electricityDetails, accountNumber: e.target.value } })}
                      className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white font-mono"
                    />
                    <select
                      value={formData.electricityDetails.status}
                      onChange={(e) => setFormData({ ...formData, electricityDetails: { ...formData.electricityDetails, status: e.target.value as any } })}
                      className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center border-t border-slate-900 pt-3">
                    <span className="text-xs font-bold text-white">Sui Gas Account</span>
                    <input
                      type="text"
                      placeholder="Account Number"
                      value={formData.gasDetails.accountNumber}
                      onChange={(e) => setFormData({ ...formData, gasDetails: { ...formData.gasDetails, accountNumber: e.target.value } })}
                      className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white font-mono"
                    />
                    <select
                      value={formData.gasDetails.status}
                      onChange={(e) => setFormData({ ...formData, gasDetails: { ...formData.gasDetails, status: e.target.value as any } })}
                      className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center border-t border-slate-900 pt-3">
                    <span className="text-xs font-bold text-white">Water Registry Account</span>
                    <input
                      type="text"
                      placeholder="Consumer Number"
                      value={formData.waterDetails.accountNumber}
                      onChange={(e) => setFormData({ ...formData, waterDetails: { ...formData.waterDetails, accountNumber: e.target.value } })}
                      className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white font-mono"
                    />
                    <select
                      value={formData.waterDetails.status}
                      onChange={(e) => setFormData({ ...formData, waterDetails: { ...formData.waterDetails, status: e.target.value as any } })}
                      className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 5: RENT & FINANCIALS */}
            {activeSection === 5 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Monthly Rent (PKR) *</label>
                    <input
                      type="number"
                      required
                      value={formData.monthlyRent}
                      onChange={(e) => setFormData({ ...formData, monthlyRent: Number(e.target.value) || 0 })}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-base font-extrabold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Security Deposit (Auto 2 Months)</label>
                    <input
                      type="text"
                      disabled
                      value={formatPKR(formData.securityDeposit)}
                      className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800/40 rounded-xl text-emerald-400 font-mono text-base font-extrabold cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Maintenance Charges (PKR)</label>
                    <input
                      type="number"
                      value={formData.maintenanceCharges}
                      onChange={(e) => setFormData({ ...formData, maintenanceCharges: Number(e.target.value) || 0 })}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                    />
                  </div>
                </div>

                {/* Auto-calculated metrics box */}
                <div className="bg-gradient-to-r from-emerald-950/30 to-slate-950 p-6 rounded-2xl border border-emerald-800/30 space-y-4">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <TrendingUp className="h-5 w-5" />
                    <span className="font-display font-bold text-sm">Automated Annual Financial Estimates</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                      <p className="text-[10px] text-slate-400">Annual Gross Income</p>
                      <p className="text-sm font-extrabold font-mono text-white mt-1">{formatPKR(annualGrossIncome)}</p>
                    </div>
                    <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                      <p className="text-[10px] text-slate-400">Annual Expenses</p>
                      <p className="text-sm font-extrabold font-mono text-rose-400 mt-1">{formatPKR(annualExpenses)}</p>
                    </div>
                    <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                      <p className="text-[10px] text-slate-400">Net Operating Income</p>
                      <p className="text-sm font-extrabold font-mono text-emerald-400 mt-1">{formatPKR(netOperatingIncome)}</p>
                    </div>
                    <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                      <p className="text-[10px] text-slate-400">Cap Rate (%)</p>
                      <p className="text-sm font-extrabold font-mono text-amber-400 mt-1">{capRate}%</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 6: LEASE & RULES */}
            {activeSection === 6 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Lease Start Date</label>
                    <input
                      type="date"
                      value={formData.leaseStartDate}
                      onChange={(e) => setFormData({ ...formData, leaseStartDate: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Duration (Months)</label>
                    <input
                      type="number"
                      value={formData.leaseDuration}
                      onChange={(e) => setFormData({ ...formData, leaseDuration: Number(e.target.value) || 12 })}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Calculated Lease End Date</label>
                    <input
                      type="text"
                      disabled
                      value={formData.leaseEndDate}
                      className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800/40 rounded-xl text-slate-400 font-mono cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                  <span className="text-xs font-bold text-emerald-500 font-mono uppercase">Key Safety Policies</span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={formData.smokingPolicy === "Allowed"} onChange={(e) => setFormData({ ...formData, smokingPolicy: e.target.checked ? "Allowed" : "Not Allowed" })} className="rounded bg-slate-900 text-emerald-600" />
                      Smoking Allowed inside flats
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={formData.petsPolicy !== "Not Allowed"} onChange={(e) => setFormData({ ...formData, petsPolicy: e.target.checked ? "Allowed" : "Not Allowed" })} className="rounded bg-slate-900 text-emerald-600" />
                      Pets Allowed (conditional rules apply)
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={formData.sublettingAllowed} onChange={(e) => setFormData({ ...formData, sublettted: e.target.checked } as any)} className="rounded bg-slate-900 text-emerald-600" />
                      Subletting permitted on registry
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 7: PROCEDURES */}
            {activeSection === 7 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                  <h4 className="text-sm font-extrabold text-white">Move-in Checklist</h4>
                  <div className="space-y-2 text-xs">
                    <label className="flex items-center gap-2.5 text-slate-300">
                      <input type="checkbox" checked={formData.moveInChecklist.inspection} onChange={(e) => setFormData({ ...formData, moveInChecklist: { ...formData.moveInChecklist, inspection: e.target.checked } })} className="rounded text-emerald-600" />
                      Move-in Property Walkthrough Inspection
                    </label>
                    <label className="flex items-center gap-2.5 text-slate-300">
                      <input type="checkbox" checked={formData.moveInChecklist.photos} onChange={(e) => setFormData({ ...formData, moveInChecklist: { ...formData.moveInChecklist, photos: e.target.checked } })} className="rounded text-emerald-600" />
                      Upload damage evidence photos / HD video
                    </label>
                    <label className="flex items-center gap-2.5 text-slate-300">
                      <input type="checkbox" checked={formData.moveInChecklist.keysHandover} onChange={(e) => setFormData({ ...formData, moveInChecklist: { ...formData.moveInChecklist, keysHandover: e.target.checked } })} className="rounded text-emerald-600" />
                      Keys & biometric access card handover
                    </label>
                  </div>
                </div>

                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                  <h4 className="text-sm font-extrabold text-white">Move-out Checklist</h4>
                  <div className="space-y-2 text-xs">
                    <label className="flex items-center gap-2.5 text-slate-300">
                      <input type="checkbox" checked={formData.moveOutChecklist.noticeReceived} onChange={(e) => setFormData({ ...formData, moveOutChecklist: { ...formData.moveOutChecklist, noticeReceived: e.target.checked } })} className="rounded text-emerald-600" />
                      Notice period acknowledgment received
                    </label>
                    <label className="flex items-center gap-2.5 text-slate-300">
                      <input type="checkbox" checked={formData.moveOutChecklist.finalInspection} onChange={(e) => setFormData({ ...formData, moveOutChecklist: { ...formData.moveOutChecklist, finalInspection: e.target.checked } })} className="rounded text-emerald-600" />
                      Final departure inspection completed
                    </label>
                    <label className="flex items-center gap-2.5 text-slate-300">
                      <input type="checkbox" checked={formData.moveOutChecklist.depositReturned} onChange={(e) => setFormData({ ...formData, moveOutChecklist: { ...formData.moveOutChecklist, depositReturned: e.target.checked } })} className="rounded text-emerald-600" />
                      Refund of security deposit with deduction invoices
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 8: TENANT INFORMATION */}
            {activeSection === 8 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Tenant Full Name</label>
                  <input
                    type="text"
                    value={formData.tenantName}
                    onChange={(e) => setFormData({ ...formData, tenantName: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">CNIC Number (Government Issued National ID) *</label>
                  <input
                    type="text"
                    value={formData.tenantCnic}
                    placeholder="35201-XXXXXXX-X"
                    onChange={(e) => handleCnicChange(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Contact Phone Number *</label>
                  <input
                    type="text"
                    value={formData.tenantPhone}
                    placeholder="0321-4567890"
                    onChange={(e) => setFormData({ ...formData, tenantPhone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Email Address</label>
                  <input
                    type="email"
                    value={formData.tenantEmail}
                    onChange={(e) => setFormData({ ...formData, tenantEmail: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-xs"
                  />
                </div>
              </div>
            )}

            {/* SECTION 9: VALUATION */}
            {activeSection === 9 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Current Market Value (PKR)</label>
                    <input
                      type="number"
                      value={formData.marketValue}
                      onChange={(e) => setFormData({ ...formData, marketValue: Number(e.target.value) || 0 })}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono font-extrabold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Zameen.com Market Index Estimate</label>
                    <input
                      type="number"
                      value={formData.zameenEstimate}
                      onChange={(e) => setFormData({ ...formData, zameenEstimate: Number(e.target.value) || 0 })}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 10: MANAGEMENT */}
            {activeSection === 10 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Assigned Property Manager</label>
                  <input
                    type="text"
                    value={formData.propertyManagerName}
                    onChange={(e) => setFormData({ ...formData, propertyManagerName: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Office Contact Number</label>
                  <input
                    type="text"
                    value={formData.propertyManagerPhone}
                    onChange={(e) => setFormData({ ...formData, propertyManagerPhone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                  />
                </div>
              </div>
            )}

            {/* SECTION 11: MAINTENANCE HISTORY */}
            {activeSection === 11 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-extrabold text-white">Recent Repairs & Maintenance Logs</h4>
                  <button
                    type="button"
                    onClick={() => {
                      const newLog: MaintenanceLogItem = {
                        id: `log-${Date.now()}`,
                        date: new Date().toISOString().split("T")[0],
                        issue: "Unscheduled repair",
                        actionTaken: "Diagnosed & fixed",
                        vendor: "External contractor",
                        cost: 5000,
                        status: "Completed"
                      };
                      setFormData(prev => ({
                        ...prev,
                        maintenanceLogs: [...prev.maintenanceLogs, newLog]
                      }));
                    }}
                    className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 rounded-lg text-xs font-bold flex items-center gap-1.5"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Log
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="py-2">Date</th>
                        <th className="py-2">Issue</th>
                        <th className="py-2">Cost</th>
                        <th className="py-2">Status</th>
                        <th className="py-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.maintenanceLogs.map((log) => (
                        <tr key={log.id} className="border-b border-slate-900 text-slate-200">
                          <td className="py-2.5 font-mono">{log.date}</td>
                          <td className="py-2.5">{log.issue}</td>
                          <td className="py-2.5 font-mono text-emerald-400">{formatPKR(log.cost)}</td>
                          <td className="py-2.5">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 text-[10px] font-bold">
                              {log.status}
                            </span>
                          </td>
                          <td className="py-2.5">
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({
                                ...prev,
                                maintenanceLogs: prev.maintenanceLogs.filter(l => l.id !== log.id)
                              }))}
                              className="text-rose-400 hover:text-rose-300"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SECTION 12: COMPLIANCE */}
            {activeSection === 12 && (
              <div className="space-y-4">
                <span className="text-xs font-bold text-emerald-500 font-mono uppercase">Regulatory Approvals & Taxes</span>
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-4 text-xs">
                  {formData.complianceItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center border-b border-slate-900 pb-2">
                      <span className="font-bold text-slate-200">{item.requirement}</span>
                      <span className="px-3 py-1 bg-emerald-950 text-emerald-400 font-bold rounded-lg text-[10px]">
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION 13: OCCUPANCY */}
            {activeSection === 13 && (
              <div className="space-y-4">
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                  <h4 className="text-sm font-extrabold text-white">Current Unit Allocation</h4>
                  <div className="flex justify-between text-xs border-b border-slate-900 pb-3">
                    <span className="text-slate-400">Unit Name</span>
                    <span className="font-mono text-white">{formData.unitNumber}</span>
                  </div>
                  <div className="flex justify-between text-xs border-b border-slate-900 pb-3">
                    <span className="text-slate-400">Current Assigned Tenant</span>
                    <span className="font-bold text-emerald-400">{formData.tenantName || "Vacant / Pending Allocation"}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Active Lease Status</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-950 text-blue-400 font-bold font-mono">
                      {formData.tenantName ? "ACTIVE" : "VACANT"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 14: MANAGER TASKS */}
            {activeSection === 14 && (
              <div className="space-y-4">
                <span className="text-xs font-bold text-emerald-500 font-mono uppercase">Property Launch To-Do List</span>
                <div className="space-y-3">
                  {formData.tasks.map((t) => (
                    <label key={t.id} className="flex items-center gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800/60 cursor-pointer hover:bg-slate-900/60 transition-colors text-xs">
                      <input
                        type="checkbox"
                        checked={t.completed}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          tasks: prev.tasks.map(item => item.id === t.id ? { ...item, completed: e.target.checked } : item)
                        }))}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className={t.completed ? "line-through text-slate-500" : "text-slate-200"}>
                        {t.text}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION 15: QUICK REFERENCE */}
            {activeSection === 15 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                  <h4 className="text-xs font-bold text-emerald-500 font-mono uppercase">National Emergency Channels</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between font-mono">
                      <span className="text-slate-400">Police Department Emergency</span>
                      <span className="font-bold text-white">15</span>
                    </div>
                    <div className="flex justify-between font-mono">
                      <span className="text-slate-400">Rescue Ambulance Service</span>
                      <span className="font-bold text-white">1122</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                  <h4 className="text-xs font-bold text-emerald-500 font-mono uppercase">Local DHA Support</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">National Hospital DHA Lahore</span>
                      <span className="font-mono font-bold text-white">042-111-171-171</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CONTROL NAVIGATION BAR */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-800/80 mt-8">
              <button
                type="button"
                onClick={handlePrev}
                disabled={activeSection === 1}
                className="px-5 py-2.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900 text-slate-300 font-bold text-xs disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Previous Step
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-5 py-2.5 text-slate-400 hover:text-slate-200 text-xs font-bold transition-all"
                >
                  Cancel & Exit
                </button>

                {activeSection < 15 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-emerald-600/10 transition-all"
                  >
                    Next Section
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-emerald-600/10 transition-all flex items-center gap-2"
                  >
                    <CheckCircle2 className="h-4.5 w-4.5" />
                    Register Property Asset
                  </button>
                )}
              </div>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
};
