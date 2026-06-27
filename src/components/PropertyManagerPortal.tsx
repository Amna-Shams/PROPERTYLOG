/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Building2, 
  Users, 
  FileText, 
  Wrench, 
  CreditCard, 
  Bell, 
  LogOut, 
  Plus, 
  Menu, 
  X, 
  TrendingUp, 
  DollarSign, 
  CheckCircle2, 
  HelpCircle,
  Home,
  User,
  MapPin,
  Calendar as CalendarIcon,
  Layers,
  ChevronRight,
  Sparkles,
  Inbox,
  FileSpreadsheet,
  FolderClosed,
  Search,
  Mail,
  Smartphone,
  CheckCircle,
  AlertTriangle,
  Upload,
  Send,
  Trash2,
  Lock,
  ArrowRight,
  RefreshCw,
  Clock,
  Briefcase,
  ShieldAlert,
  Edit,
  Sliders,
  Eye,
  FileCheck,
  ArrowLeft
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { formatPKR } from "../utils/currency";
import { decryptAES256 } from "../utils/crypto";
import { 
  UserRole, 
  PropertyType, 
  PropertyStatus, 
  UnitStatus, 
  LeaseStatus, 
  TicketPriority, 
  TicketStatus, 
  PaymentStatus,
  Property,
  Unit,
  Lease,
  MaintenanceTicket,
  RentPayment,
  Tenant
} from "../types";

interface PropertyManagerPortalProps {
  impersonatedByAdmin?: boolean;
}

export const PropertyManagerPortal: React.FC<PropertyManagerPortalProps> = ({ impersonatedByAdmin = false }) => {
  const {
    currentUser,
    properties,
    units,
    leases,
    tickets,
    payments,
    notifications,
    tenants,
    logout,
    addProperty,
    updateProperty,
    deleteProperty,
    addUnit,
    updateUnit,
    deleteUnit,
    addTenant,
    updateTenant,
    deleteTenant,
    addLease,
    updateLease,
    deleteLease,
    addTicket,
    updateTicketStatus,
    updateTicketCost,
    addPayment,
    markPaymentPaid,
    applications,
    updateApplicationStatus,
    showToast
  } = useApp();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "properties" | "units" | "tenants" | "owners" | "leases" | "rent" | "maintenance" | "reports" | "documents" | "communications" | "settings" | "applications"
  >("dashboard");

  // State variables for Tenant Verification Board
  const [globalApps, setGlobalApps] = useState<any[]>(() => {
    const saved = localStorage.getItem("propertylog_applications_global");
    if (saved) return JSON.parse(saved);
    
    // Initial high-fidelity mock applications for Pakistani context
    return [
      {
        id: "app-201",
        propertyId: "rent-1",
        propertyName: "Oakridge Premium Family Villa",
        managerName: "Kamran Shah",
        price: 180000,
        appliedDate: "2026-06-25",
        status: "Pending",
        progress: 40,
        details: {
          fullName: "Amna Shams",
          fatherHusbandName: "Muhammad Shams-ud-Din",
          cnic: "35201-9876543-2",
          dob: "1994-11-12",
          gender: "Female",
          maritalStatus: "Married",
          nationality: "Pakistani",
          religion: "Islam",
          motherTongue: "Urdu",
          mobileNumber: "0300-1234567",
          whatsAppNumber: "0300-1234567",
          emailAddress: "amna.shams@gmail.com",
          currentAddress: "House 45-B, Phase 5, DHA Lahore",
          currentCityDistrict: "Lahore",
          currentProvince: "Punjab",
          emergencyContactName: "Muhammad Shams-ud-Din",
          emergencyContactRelationship: "Father",
          emergencyContactPhone: "0321-7654321",
          propType: "House",
          bedrooms: 3,
          bathrooms: 3,
          minArea: 1800,
          parkingRequired: "Yes",
          parkingCount: 1,
          maxMonthlyRent: 180000,
          monthlyIncome: 380000,
          sourceOfIncome: "Employment",
          occupation: "Principal Project Manager",
          employerName: "Systems Limited Pakistan",
          employerContact: "0345-9876543",
          yearsInCurrentJob: 5,
          totalOccupants: 3,
          adultsCount: 2,
          childrenCount: 1,
          petsInHousehold: "No",
          vehiclesCount: 1,
          vehicleTypes: "Toyota Yaris (ABC-123)",
          preferredLeaseDuration: "12 Months",
          preferredMoveInDate: "2026-07-15",
          ref1Name: "Mian Shakeel (Previous Landlord)",
          ref1Contact: "0300-7654321",
          ref1Duration: "2022 to 2026",
          ref2Name: "Nadeem Mustafa",
          ref2Contact: "0321-4445556",
          ref2Designation: "Engineering Director",
          ref3Name: "Tariq Mahmood",
          ref3Relationship: "Family Friend",
          ref3Contact: "0333-5556667",
          declarationPlace: "Lahore"
        },
        documents: {
          cnic: "cnic_verification_scanned.png",
          photo: "passport_photo_amna.jpg",
          statement: "hbl_bank_statement_3m.pdf",
          salarySlip: "salary_slip_may_2026.pdf"
        },
        signature: "Amna Shams",
        agreed: true
      },
      {
        id: "app-202",
        propertyId: "rent-2",
        propertyName: "DHA Phase 6 Executive Penthouse",
        managerName: "Kamran Shah",
        price: 250000,
        appliedDate: "2026-06-24",
        status: "Under Review",
        progress: 75,
        details: {
          fullName: "Zubair Ahmed Khan",
          fatherHusbandName: "Kamal Ahmed Khan",
          cnic: "42201-4433221-5",
          dob: "1988-04-20",
          gender: "Male",
          maritalStatus: "Married",
          nationality: "Pakistani",
          religion: "Islam",
          motherTongue: "Urdu",
          mobileNumber: "0321-8889900",
          whatsAppNumber: "0321-8889900",
          emailAddress: "zubair.khan@merck-corp.com",
          currentAddress: "Apartment C-12, Creek Vista, Phase 8, DHA Karachi",
          currentCityDistrict: "Karachi",
          currentProvince: "Sindh",
          emergencyContactName: "Ayla Zubair Khan",
          emergencyContactRelationship: "Wife",
          emergencyContactPhone: "0333-1112223",
          propType: "Penthouse",
          bedrooms: 4,
          bathrooms: 4,
          minArea: 3200,
          parkingRequired: "Yes",
          parkingCount: 2,
          maxMonthlyRent: 250000,
          monthlyIncome: 650000,
          sourceOfIncome: "Business",
          occupation: "Director Marketing",
          employerName: "Merck Pharmaceuticals PK",
          employerContact: "021-35851122",
          yearsInCurrentJob: 8,
          totalOccupants: 4,
          adultsCount: 2,
          childrenCount: 2,
          petsInHousehold: "Yes",
          petDetails: "Persian Cat, White, 1",
          vehiclesCount: 2,
          vehicleTypes: "Honda Civic (KAE-9821), Suzuki Cultus (BD-339)",
          preferredLeaseDuration: "24 Months",
          preferredMoveInDate: "2026-08-01",
          ref1Name: "Brig. (R) Tasneem-ul-Haq",
          ref1Contact: "0300-8887766",
          ref1Duration: "2020 to 2026",
          ref2Name: "Dr. Shahzad Saleem",
          ref2Contact: "0322-9993344",
          ref2Designation: "Regional CEO",
          ref3Name: "Farhan Naqvi",
          ref3Relationship: "Business Associate",
          ref3Contact: "0331-5552233",
          declarationPlace: "Karachi"
        },
        documents: {
          cnic: "cnic_zubair_identity.png",
          photo: "passport_photo_zubair.jpg",
          statement: "mcb_bank_statement_3m.pdf",
          salarySlip: "tax_return_ntn_2025.pdf"
        },
        signature: "Zubair Ahmed Khan",
        agreed: true
      }
    ];
  });

  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [appFilter, setAppFilter] = useState<string>("All");
  const [reviewTab, setReviewTab] = useState<"requirements" | "personal" | "financial" | "documents">("requirements");

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("propertylog_applications_global", JSON.stringify(globalApps));
  }, [globalApps]);

  // Synchronize globalApps with shared context applications
  useEffect(() => {
    if (applications && applications.length > 0) {
      setGlobalApps(applications);
    }
  }, [applications]);

  // Local storage lists or state for vendors, owners, documents, and messages
  const [vendors, setVendors] = useState<{ id: string; name: string; service: string; phone: string; rating: number }[]>(() => {
    const saved = localStorage.getItem("pl_pm_vendors");
    return saved ? JSON.parse(saved) : [
      { id: "v1", name: "QuickFix Electrical", service: "Electrician", phone: "+1 (555) 309-1234", rating: 4.8 },
      { id: "v2", name: "Apex Plumbing", service: "Plumber", phone: "+1 (555) 782-9901", rating: 4.9 },
      { id: "v3", name: "EcoClean Janitorial", service: "Cleaner", phone: "+1 (555) 881-2234", rating: 4.5 },
      { id: "v4", name: "Titan HVAC Services", service: "HVAC Specialist", phone: "+1 (555) 662-7700", rating: 4.7 }
    ];
  });

  const [localOwners, setLocalOwners] = useState<{ id: string; name: string; email: string; phone: string; company: string; active: boolean; payoutHistory: { date: string; amount: number; invoice: string }[] }[]>(() => {
    const saved = localStorage.getItem("pl_pm_owners");
    return saved ? JSON.parse(saved) : [
      { id: "o1", name: "Alex Mercer", email: "owner@propertylog.com", phone: "+1 (555) 123-4567", company: "Mercer Holdings LLC", active: true, payoutHistory: [{ date: "2026-06-01", amount: 12500, invoice: "PO-9910" }] },
      { id: "o2", name: "Sophia Reynolds", email: "sophia@reynoldsprop.com", phone: "+1 (555) 987-6543", company: "Reynolds Real Estate", active: true, payoutHistory: [{ date: "2026-06-01", amount: 8900, invoice: "PO-9911" }] },
      { id: "o3", name: "Marcus Stone", email: "marcus@stonegroup.com", phone: "+1 (555) 555-0199", company: "Stone Capital", active: false, payoutHistory: [] }
    ];
  });

  const [docs, setDocs] = useState<{ id: string; name: string; folder: "Owner" | "Tenant" | "Property" | "Lease"; size: string; date: string; fileType: string; linkedEntity: string }[]>(() => {
    const saved = localStorage.getItem("pl_pm_docs");
    return saved ? JSON.parse(saved) : [
      { id: "d1", name: "Management_Agreement_Mercer.pdf", folder: "Owner", size: "2.4 MB", date: "2026-01-10", fileType: "PDF", linkedEntity: "Alex Mercer" },
      { id: "d2", name: "Tenant_Lease_Agreement_Jane_Doe.pdf", folder: "Lease", size: "1.8 MB", date: "2026-02-15", fileType: "PDF", linkedEntity: "Jane Doe" },
      { id: "d3", name: "Property_Deed_Oakridge.pdf", folder: "Property", size: "4.1 MB", date: "2025-11-20", fileType: "PDF", linkedEntity: "Oakridge Heights" },
      { id: "d4", name: "MoveIn_Checklist_Jane.png", folder: "Tenant", size: "850 KB", date: "2026-02-18", fileType: "PNG", linkedEntity: "Jane Doe" }
    ];
  });

  const [commLogs, setCommLogs] = useState<{ id: string; type: "Email" | "SMS"; recipient: string; subject: string; message: string; date: string; status: "Sent" | "Failed" }[]>(() => {
    const saved = localStorage.getItem("pl_pm_comms");
    return saved ? JSON.parse(saved) : [
      { id: "c1", type: "Email", recipient: "All Tenants", subject: "Routine HVAC Inspection Next Tuesday", message: "Dear Tenants, Please be advised that HVAC technicians will visit all units next Tuesday morning.", date: "2026-06-25 09:12", status: "Sent" },
      { id: "c2", type: "SMS", recipient: "+1 (555) 123-4567 (Jane Doe)", subject: "Rent Reminder", message: "Reminder: Rent payment of $1,500 is due on the 1st of July. Thank you.", date: "2026-06-26 14:02", status: "Sent" }
    ];
  });

  useEffect(() => {
    localStorage.setItem("pl_pm_vendors", JSON.stringify(vendors));
  }, [vendors]);

  useEffect(() => {
    localStorage.setItem("pl_pm_owners", JSON.stringify(localOwners));
  }, [localOwners]);

  useEffect(() => {
    localStorage.setItem("pl_pm_docs", JSON.stringify(docs));
  }, [docs]);

  useEffect(() => {
    localStorage.setItem("pl_pm_comms", JSON.stringify(commLogs));
  }, [commLogs]);

  // Modals and form states
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [showTenantModal, setShowTenantModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showMassEmailModal, setShowMassEmailModal] = useState(false);

  // Form payload structures
  const [propForm, setPropForm] = useState({ name: "", address: "", type: PropertyType.APARTMENT, units_count: 5, year_built: "2021", status: PropertyStatus.ACTIVE, image_url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600" });
  const [tenantForm, setTenantForm] = useState({ full_name: "", email: "", phone: "", cnic: "", emergency_contact: "", vehicle_plate: "", pet_info: "", co_signer: "" });
  const [paymentForm, setPaymentForm] = useState({ tenant_id: "", amount: 1200, due_date: "", unit_id: "" });
  const [ticketForm, setTicketForm] = useState({ property_id: "", unit_id: "", title: "", description: "", priority: TicketPriority.MEDIUM, vendor_id: "" });
  const [massEmailForm, setMassEmailForm] = useState({ type: "Email" as "Email" | "SMS", recipientGroup: "all", subject: "", message: "", template: "default" });
  
  // Searching & Filtering
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Dynamic values calculation
  const totalProperties = properties.length;
  const totalUnits = units.length;
  const occupiedUnits = units.filter(u => u.status === UnitStatus.OCCUPIED).length;
  const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;
  
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const monthlyRentCollected = payments
    .filter(p => p.status === PaymentStatus.PAID)
    .reduce((sum, p) => sum + p.amount, 0);

  const outstandingBalances = payments
    .filter(p => p.status === PaymentStatus.UNPAID || p.status === PaymentStatus.PENDING)
    .reduce((sum, p) => sum + p.amount, 0);

  const activeTicketsCount = tickets.filter(t => t.status !== TicketStatus.RESOLVED && t.status !== TicketStatus.CLOSED).length;
  const leasesExpiringSoon = leases.filter(l => l.status === LeaseStatus.EXPIRING).length;

  // Handler submissions
  const handleCreateProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!propForm.name || !propForm.address) {
      showToast("Property name and address are required.", "error");
      return;
    }
    const success = await addProperty({
      name: propForm.name,
      address: propForm.address,
      type: propForm.type,
      units_count: propForm.units_count,
      status: propForm.status,
      image_url: propForm.image_url
    });
    if (success) {
      setShowPropertyModal(false);
      setPropForm({ name: "", address: "", type: PropertyType.APARTMENT, units_count: 5, year_built: "2021", status: PropertyStatus.ACTIVE, image_url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600" });
    }
  };

  const handleCreateTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantForm.full_name || !tenantForm.email) {
      showToast("Tenant name and email are required.", "error");
      return;
    }
    const success = await addTenant({
      full_name: tenantForm.full_name,
      email: tenantForm.email,
      phone: tenantForm.phone || "+1 (555) 991-0022",
      cnic: tenantForm.cnic || "35201-1234567-9",
      emergency_contact: tenantForm.emergency_contact || "Sibling: +1 (555) 991-9922",
    });
    if (success) {
      setShowTenantModal(false);
      setTenantForm({ full_name: "", email: "", phone: "", cnic: "", emergency_contact: "", vehicle_plate: "", pet_info: "", co_signer: "" });
    }
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentForm.tenant_id || !paymentForm.unit_id) {
      showToast("Please choose tenant and unit.", "error");
      return;
    }
    const tenantObj = tenants.find(t => t.id === paymentForm.tenant_id);
    const unitObj = units.find(u => u.id === paymentForm.unit_id);
    if (!tenantObj || !unitObj) return;

    const success = await addPayment({
      tenant_id: tenantObj.id,
      tenant_name: tenantObj.full_name,
      unit_id: unitObj.id,
      unit_number: unitObj.unit_number,
      property_name: unitObj.property_name,
      amount: paymentForm.amount,
      due_date: paymentForm.due_date || new Date().toISOString().split("T")[0],
      status: PaymentStatus.PENDING
    });
    if (success) {
      setShowPaymentModal(false);
    }
  };

  const handleApproveApplication = async (app: any) => {
    // 1. Onboard the Tenant with DHA-compliant security details
    const tenantData = {
      full_name: app.details.fullName,
      email: app.details.emailAddress,
      phone: app.details.mobileNumber,
      cnic: app.details.cnic,
      emergency_contact: `${app.details.emergencyContactName} (${app.details.emergencyContactRelationship}) - ${app.details.emergencyContactPhone}`,
      cnic_doc_url: app.documents?.cnic || ""
    };

    const tenantResult = await addTenant(tenantData);
    if (!tenantResult) {
      showToast("Failed to onboard Tenant profile to government registry.", "error");
      return;
    }

    // Try to find the newly registered tenant by email
    const matchedTenant = tenants.find(t => t.email.toLowerCase() === app.details.emailAddress.toLowerCase()) || { id: "t_" + Math.random().toString(36).substr(2, 9) };
    const tenantId = matchedTenant.id;

    // 2. Identify and assign an available unit matching requirements
    const unitForProperty = units.find(u => u.property_id === app.propertyId && u.status === UnitStatus.AVAILABLE) || units[0];

    const leaseData = {
      property_id: app.propertyId || "rent-1",
      property_name: app.propertyName || "Oakridge Premium Family Villa",
      unit_id: unitForProperty?.id || "un_mock_id",
      unit_number: unitForProperty?.unit_number || "PH-3",
      tenant_id: tenantId,
      tenant_name: app.details.fullName,
      start_date: app.details.preferredMoveInDate || new Date().toISOString().split("T")[0],
      end_date: new Date(new Date(app.details.preferredMoveInDate || new Date()).setFullYear(new Date(app.details.preferredMoveInDate || new Date()).getFullYear() + 1)).toISOString().split("T")[0],
      rent_amount: app.details.maxMonthlyRent || 150000,
      deposit_amount: app.details.securityDepositBudget || (app.details.maxMonthlyRent * 2),
      status: LeaseStatus.ACTIVE
    };

    const leaseResult = await addLease(leaseData);
    if (!leaseResult) {
      showToast("Failed to register and sign the digital lease contract.", "error");
      return;
    }

    // 3. Mark the application status to Approved (100% progress completed)
    const updatedApps = globalApps.map(a => {
      if (a.id === app.id) {
        return { ...a, status: "Approved", progress: 100 };
      }
      return a;
    });

    setGlobalApps(updatedApps);
    updateApplicationStatus(app.id, "Approved", 100);
    setSelectedApp(null);
    showToast(`Verification success! Tenant ${app.details.fullName} approved and lease generated successfully under standard DHA bylaws.`, "success");
  };

  const handleReviewApplication = (app: any) => {
    const updated = globalApps.map(a => a.id === app.id ? { ...a, status: "Under Review", progress: 75 } : a);
    setGlobalApps(updated);
    updateApplicationStatus(app.id, "Under Review", 75);
    setSelectedApp(prev => prev ? { ...prev, status: "Under Review", progress: 75 } : null);
    showToast(`Application for ${app.details.fullName} is now under active review.`, "info");
  };

  const handleRejectApplication = (app: any) => {
    const updated = globalApps.map(a => a.id === app.id ? { ...a, status: "Rejected", progress: 100 } : a);
    setGlobalApps(updated);
    updateApplicationStatus(app.id, "Rejected", 100);
    setSelectedApp(null);
    showToast(`Application for ${app.details.fullName} has been rejected.`, "error");
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketForm.property_id || !ticketForm.unit_id || !ticketForm.title) {
      showToast("Please complete ticket details.", "error");
      return;
    }
    const propObj = properties.find(p => p.id === ticketForm.property_id);
    const unitObj = units.find(u => u.id === ticketForm.unit_id);
    if (!propObj || !unitObj) return;

    const success = await addTicket({
      property_id: propObj.id,
      property_name: propObj.name,
      unit_id: unitObj.id,
      unit_number: unitObj.unit_number,
      tenant_id: unitObj.tenant_id || "unassigned",
      tenant_name: unitObj.tenant_name || "Unoccupied",
      title: ticketForm.title,
      description: ticketForm.description,
      priority: ticketForm.priority
    });
    if (success) {
      setShowTicketModal(false);
      setTicketForm({ property_id: "", unit_id: "", title: "", description: "", priority: TicketPriority.MEDIUM, vendor_id: "" });
    }
  };

  const handleSendMassEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!massEmailForm.message) {
      showToast("Message content cannot be empty.", "error");
      return;
    }
    const newComm = {
      id: "c_" + Math.random().toString(36).substr(2, 9),
      type: massEmailForm.type,
      recipient: massEmailForm.recipientGroup === "all" ? "All Tenants" : "All Property Owners",
      subject: massEmailForm.subject || "System Notification",
      message: massEmailForm.message,
      date: new Date().toLocaleString(),
      status: "Sent" as const
    };
    setCommLogs(prev => [newComm, ...prev]);
    showToast(`Mass ${massEmailForm.type} broadcast dispatched successfully!`, "success");
    setShowMassEmailModal(false);
    setMassEmailForm({ type: "Email", recipientGroup: "all", subject: "", message: "", template: "default" });
  };

  // Deactivate owner (manager constraint: only deactivate owners, not delete)
  const handleToggleOwnerActive = (id: string) => {
    setLocalOwners(prev => prev.map(o => o.id === id ? { ...o, active: !o.active } : o));
    const owner = localOwners.find(o => o.id === id);
    if (owner) {
      showToast(`Owner "${owner.name}" status updated to ${!owner.active ? "Active" : "Inactive"}.`, "warning");
    }
  };

  return (
    <div id="property-manager-portal" className="min-h-screen bg-slate-100 flex text-slate-800 font-sans">
      
      {/* 1. COLLAPSIBLE SIDEBAR */}
      <aside
        id="pm-sidebar"
        className={`${sidebarOpen ? "w-64" : "w-20"} bg-slate-900 text-slate-300 transition-all duration-300 flex flex-col justify-between shrink-0 border-r border-slate-800 md:flex`}
      >
        <div className="flex flex-col">
          {/* Header */}
          <div className="h-16 flex items-center justify-between px-4 bg-slate-950 border-b border-slate-800">
            <div className="flex items-center gap-2 overflow-hidden">
              <button onClick={() => window.history.back()} className="p-1 hover:bg-slate-800 rounded text-slate-400">
                <ArrowLeft className="h-4 w-4" />
              </button>
              <div className="h-9 w-9 rounded-xl bg-slate-800 text-blue-400 flex items-center justify-center shrink-0 shadow-md">
                <Briefcase className="h-5 w-5" />
              </div>
              {sidebarOpen && (
                <span className="font-extrabold text-white text-sm tracking-wider uppercase font-mono">
                  PM_WORK<span className="text-blue-400">SPACE</span>
                </span>
              )}
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>

          {/* Sidebar Menu Modules */}
          <nav className="p-3 space-y-1 pt-6 overflow-y-auto max-h-[calc(100vh-12rem)]">
            {[
              { id: "dashboard", label: "Dashboard", icon: Home },
              { id: "properties", label: "Properties", icon: Building2 },
              { id: "units", label: "Units Inventory", icon: Layers },
              { id: "tenants", label: "Tenants Directory", icon: Users },
              { id: "applications", label: "Applications Board", icon: FileCheck },
              { id: "owners", label: "Owners Ledger", icon: User },
              { id: "leases", label: "Leases Contracts", icon: FileText },
              { id: "rent", label: "Rent & Invoices", icon: CreditCard },
              { id: "maintenance", label: "Maintenance Desk", icon: Wrench },
              { id: "reports", label: "Financial Reports", icon: FileSpreadsheet },
              { id: "documents", label: "Central Documents", icon: FolderClosed },
              { id: "communications", label: "Communications", icon: Mail },
              { id: "settings", label: "Gateway Settings", icon: Sliders }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                    activeTab === item.id
                      ? "bg-slate-800 text-blue-400 border-slate-700/60 shadow-inner"
                      : "border-transparent text-slate-400 hover:bg-slate-800/40 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {sidebarOpen && <span>{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer info block */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-800/20 border border-slate-800/50">
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-xs uppercase font-mono">
              PM
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-100 truncate">John Doe</div>
                <div className="text-[10px] text-slate-400 font-mono truncate">Property Manager</div>
              </div>
            )}
          </div>
          {impersonatedByAdmin && sidebarOpen && (
            <div className="mt-2.5 p-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-center text-[9px] font-mono text-amber-400 uppercase tracking-widest font-extrabold animate-pulse">
              ADMIN IMPERSONATING
            </div>
          )}
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE CONTAINER */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top bar with quick actions */}
        <header className="h-16 shrink-0 bg-white border-b border-slate-200/60 px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm shadow-slate-200/10">
          <div className="flex items-center gap-3">
            <h1 className="font-extrabold text-slate-900 text-lg md:text-xl uppercase tracking-tight font-mono">
              {activeTab === "dashboard" && "Dashboard Cockpit"}
              {activeTab === "properties" && "Manage Property Assets"}
              {activeTab === "units" && "Units Inventory Module"}
              {activeTab === "tenants" && "Tenants Portfolio Directory"}
              {activeTab === "applications" && "Tenant Verification Board"}
              {activeTab === "owners" && "Owners Ledger Portal"}
              {activeTab === "leases" && "Leases Contracts Board"}
              {activeTab === "rent" && "Rent Invoices & Payments"}
              {activeTab === "maintenance" && "Maintenance Dispatch Board"}
              {activeTab === "reports" && "Financial Reports & Exports"}
              {activeTab === "documents" && "Central Documents Folder"}
              {activeTab === "communications" && "Broadcasts & Logs"}
              {activeTab === "settings" && "Workspace Configuration"}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick action buttons row */}
            <div className="hidden lg:flex items-center gap-1.5">
              <button
                onClick={() => { setShowPropertyModal(true); setPropForm(prev => ({ ...prev })); }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] px-2.5 py-1.5 rounded-lg flex items-center gap-1 uppercase tracking-wider transition-colors"
              >
                <Plus className="h-3 w-3" /> Property
              </button>
              <button
                onClick={() => setShowTenantModal(true)}
                className="bg-slate-700 hover:bg-slate-800 text-white font-bold text-[10px] px-2.5 py-1.5 rounded-lg flex items-center gap-1 uppercase tracking-wider transition-colors"
              >
                <Plus className="h-3 w-3" /> Tenant
              </button>
              <button
                onClick={() => setShowPaymentModal(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] px-2.5 py-1.5 rounded-lg flex items-center gap-1 uppercase tracking-wider transition-colors"
              >
                <DollarSign className="h-3 w-3" /> Record Rent
              </button>
              <button
                onClick={() => setShowTicketModal(true)}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10px] px-2.5 py-1.5 rounded-lg flex items-center gap-1 uppercase tracking-wider transition-colors"
              >
                <Wrench className="h-3 w-3" /> Log Ticket
              </button>
              <button
                onClick={() => setShowMassEmailModal(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-[10px] px-2.5 py-1.5 rounded-lg flex items-center gap-1 uppercase tracking-wider transition-colors"
              >
                <Send className="h-3 w-3" /> Email broadcast
              </button>
            </div>
            
            {/* Log out option if not impersonated */}
            {!impersonatedByAdmin && (
              <button
                onClick={logout}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-500 bg-slate-50 border border-slate-200"
              >
                <LogOut className="h-4.5 w-4.5" />
              </button>
            )}
          </div>
        </header>

        <div className="p-6 space-y-6">
          
          {/* A. STATIC KPI METRIC CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {[
              { label: "Properties", val: totalProperties, color: "text-blue-600", bg: "bg-blue-50" },
              { label: "Total Units", val: totalUnits, color: "text-slate-700", bg: "bg-slate-50" },
              { label: "Occupancy Rate", val: `${occupancyRate}%`, color: "text-indigo-600", bg: "bg-indigo-50", progress: occupancyRate },
              { label: "Rent Collected", val: `$${monthlyRentCollected}`, color: "text-emerald-600", bg: "bg-emerald-50" },
              { label: "Outstanding", val: `$${outstandingBalances}`, color: "text-rose-600", bg: "bg-rose-50" },
              { label: "Active Tickets", val: activeTicketsCount, color: "text-amber-600", bg: "bg-amber-50" },
              { label: "Leases Expiring", val: leasesExpiringSoon, color: "text-purple-600", bg: "bg-purple-50" }
            ].map((kpi, idx) => (
              <div key={idx} className="bg-white border border-slate-200/70 p-4 rounded-2xl flex flex-col justify-between shadow-sm">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">{kpi.label}</span>
                  <span className={`text-xl font-extrabold font-mono ${kpi.color} block mt-1`}>{kpi.val}</span>
                </div>
                {kpi.progress !== undefined && (
                  <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3">
                    <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${kpi.progress}%` }}></div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* QUICK FLOATING MOBILE / GENERAL SHORT ACTIONS */}
          <div className="lg:hidden bg-white p-3 border border-slate-200/80 rounded-2xl flex items-center justify-around">
            <button onClick={() => setShowPropertyModal(true)} className="p-2 flex flex-col items-center text-blue-600 font-bold text-[10px]"><Plus className="h-4 w-4" /> Property</button>
            <button onClick={() => setShowTenantModal(true)} className="p-2 flex flex-col items-center text-slate-700 font-bold text-[10px]"><Users className="h-4 w-4" /> Tenant</button>
            <button onClick={() => setShowPaymentModal(true)} className="p-2 flex flex-col items-center text-emerald-600 font-bold text-[10px]"><DollarSign className="h-4 w-4" /> Rent</button>
            <button onClick={() => setShowTicketModal(true)} className="p-2 flex flex-col items-center text-amber-600 font-bold text-[10px]"><Wrench className="h-4 w-4" /> Ticket</button>
          </div>

          {/* B. DETAILED MODULE TABS SWITCHER */}

          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === "dashboard" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Financial chart placeholder & active alerts */}
              <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-900 text-sm uppercase font-mono tracking-tight">System Revenue Trend</h3>
                  <span className="text-xs text-slate-500 flex items-center gap-1 font-semibold"><Clock className="h-3.5 w-3.5" /> 2026 Live Roll</span>
                </div>
                {/* Visual Chart Grid Simulation */}
                <div className="h-64 bg-slate-50 rounded-2xl border border-slate-100/80 flex flex-col justify-end p-4 relative overflow-hidden">
                  <div className="absolute top-4 left-4 text-xs font-semibold text-slate-400">Monthly collected rents: (USD $)</div>
                  <div className="flex items-end justify-between h-40 gap-2 font-mono text-[9px]">
                    {[
                      { month: "Jan", val: 8400, fill: "h-2/5 bg-slate-400" },
                      { month: "Feb", val: 9900, fill: "h-3/5 bg-slate-500" },
                      { month: "Mar", val: 12500, fill: "h-4/5 bg-blue-500" },
                      { month: "Apr", val: 14000, fill: "h-5/6 bg-blue-600" },
                      { month: "May", val: 15200, fill: "h-11/12 bg-indigo-500" },
                      { month: "Jun", val: monthlyRentCollected, fill: "h-full bg-emerald-500" }
                    ].map((bar, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2">
                        <div className={`w-full rounded-md shadow-sm ${bar.fill}`}></div>
                        <span className="text-slate-500 uppercase font-extrabold">{bar.month}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
                  <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-2xl">
                    <div className="font-extrabold text-indigo-900">Portfolio Performance</div>
                    <p className="text-slate-600 mt-1">Rent collection is up 12% compared to Q1 2026. Delinquency rate is minimal.</p>
                  </div>
                  <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-2xl">
                    <div className="font-extrabold text-amber-900">Maintenance Backlog</div>
                    <p className="text-slate-600 mt-1">{activeTicketsCount} open maintenance tickets require immediate attention.</p>
                  </div>
                </div>
              </div>

              {/* Calendar & Next Events Widgets */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-900 text-sm uppercase font-mono tracking-tight">Calendar Highlights</h3>
                  <button onClick={() => setActiveTab("communications")} className="text-[10px] font-bold text-blue-600 hover:underline">Full Log</button>
                </div>

                {/* Simulated Google Calendar widget */}
                <div className="space-y-3.5">
                  {[
                    { title: "Jane Lease Expiry", type: "Renewal", date: "June 30", hour: "All Day", color: "bg-amber-100 text-amber-800 border-amber-200" },
                    { title: "HVAC Inspection", type: "Maintenance", date: "July 02", hour: "10:00 AM", color: "bg-blue-100 text-blue-800 border-blue-200" },
                    { title: "Owner Statement Review", type: "Meeting", date: "July 05", hour: "03:00 PM", color: "bg-purple-100 text-purple-800 border-purple-200" },
                    { title: "Unit 102 Viewings", type: "Viewing", date: "July 07", hour: "01:30 PM", color: "bg-emerald-100 text-emerald-800 border-emerald-200" }
                  ].map((evt, idx) => (
                    <div key={idx} className={`p-3 rounded-2xl border text-xs flex justify-between items-center ${evt.color}`}>
                      <div>
                        <div className="font-extrabold">{evt.title}</div>
                        <div className="text-[10px] opacity-80 mt-0.5">{evt.type} • {evt.hour}</div>
                      </div>
                      <span className="font-mono font-bold text-[10px]">{evt.date}</span>
                    </div>
                  ))}
                </div>
                
                {/* Quick calendar mock grid */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3">
                  <div className="text-[10px] font-extrabold text-slate-400 uppercase text-center mb-2">June / July 2026</div>
                  <div className="grid grid-cols-7 gap-1 text-center font-mono text-[9px] text-slate-500 font-extrabold">
                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => <span key={d}>{d}</span>)}
                    {Array.from({ length: 14 }).map((_, i) => {
                      const day = 23 + i;
                      const isToday = day === 26;
                      const hasEvent = [26, 30, 2, 5, 7].includes(day % 31);
                      return (
                        <span key={i} className={`py-1 rounded-lg ${isToday ? "bg-blue-600 text-white font-extrabold" : ""} ${hasEvent ? "underline decoration-rose-500 decoration-2 font-bold" : ""}`}>
                          {day > 30 ? day - 30 : day}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROPERTIES */}
          {activeTab === "properties" && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="relative max-w-sm w-full">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search properties by name or address..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600"
                  />
                </div>
                <button
                  onClick={() => setShowPropertyModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors self-start"
                >
                  <Plus className="h-4 w-4" /> Add Property Asset
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties
                  .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.address.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((p) => {
                    const linkedUnits = units.filter(u => u.property_id === p.id);
                    const vacantCount = linkedUnits.filter(u => u.status === UnitStatus.VACANT || u.status === UnitStatus.AVAILABLE).length;
                    return (
                      <div key={p.id} className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 flex flex-col justify-between">
                        <img src={p.image_url} alt={p.name} className="h-40 w-full object-cover" />
                        <div className="p-4 space-y-3 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">{p.type}</span>
                            <span className="text-[10px] font-semibold text-slate-400">Built: 2021</span>
                          </div>
                          <h4 className="font-bold text-slate-900 text-base">{p.name}</h4>
                          <p className="text-xs text-slate-500 flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {p.address}</p>
                          <div className="grid grid-cols-2 gap-2 text-[11px] bg-white p-3 rounded-xl border border-slate-100 font-semibold text-slate-600">
                            <div>Units: <span className="text-slate-900 font-extrabold">{p.units_count}</span></div>
                            <div>Vacant: <span className="text-emerald-600 font-extrabold">{vacantCount}</span></div>
                          </div>
                        </div>
                        <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              showToast("Editing Property configuration...", "info");
                            }}
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-lg border border-slate-200"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              deleteProperty(p.id);
                            }}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg border border-rose-200"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* TAB 3: UNITS */}
          {activeTab === "units" && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
                <div className="flex flex-wrap items-center gap-2">
                  {["all", "Occupied", "Available", "Maintenance"].map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        statusFilter === st
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
                <div className="relative max-w-xs w-full">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by unit number..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600 border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-200">
                      <th className="py-3 px-4">Property</th>
                      <th className="py-3 px-4">Unit #</th>
                      <th className="py-3 px-4">Rent Price</th>
                      <th className="py-3 px-4">Tenant</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {units
                      .filter(u => statusFilter === "all" || u.status === statusFilter)
                      .filter(u => u.unit_number.includes(searchQuery))
                      .map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50/50">
                          <td className="py-3.5 px-4 font-bold text-slate-950">{u.property_name}</td>
                          <td className="py-3.5 px-4 font-mono font-extrabold">Unit {u.unit_number}</td>
                          <td className="py-3.5 px-4 font-mono font-extrabold text-slate-900">${u.rent_amount}</td>
                          <td className="py-3.5 px-4">{u.tenant_name || <span className="text-slate-400 font-semibold italic">Vacant</span>}</td>
                          <td className="py-3.5 px-4">
                            <select
                              value={u.status}
                              onChange={(e) => {
                                updateUnit({ ...u, status: e.target.value as any });
                                showToast(`Unit ${u.unit_number} status updated to ${e.target.value}.`, "success");
                              }}
                              className={`px-2 py-1 rounded-lg text-[10px] font-bold border ${
                                u.status === UnitStatus.OCCUPIED ? "bg-indigo-50 text-indigo-700 border-indigo-200" :
                                u.status === UnitStatus.MAINTENANCE ? "bg-amber-50 text-amber-700 border-amber-200" :
                                "bg-emerald-50 text-emerald-700 border-emerald-200"
                              }`}
                            >
                              <option value={UnitStatus.OCCUPIED}>Occupied</option>
                              <option value={UnitStatus.VACANT}>Available</option>
                              <option value={UnitStatus.MAINTENANCE}>Maintenance</option>
                            </select>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => {
                                deleteUnit(u.id);
                              }}
                              className="text-rose-500 hover:text-rose-700 font-bold ml-3"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: TENANTS */}
          {activeTab === "tenants" && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
                <div className="relative max-w-sm w-full">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search tenants by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => setShowTenantModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1 transition-colors"
                >
                  <Plus className="h-4 w-4" /> Add Tenant
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tenants
                  .filter(t => t.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || t.email.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((t) => (
                    <div key={t.id} className="border border-slate-200 rounded-2xl p-5 bg-slate-50 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="h-11 w-11 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-sm uppercase">
                          {t.full_name.charAt(0)}
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">ID: {t.id}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-base">{t.full_name}</h4>
                        <p className="text-xs text-slate-500">{t.email}</p>
                        <p className="text-xs text-slate-500 mt-1">Phone: {t.phone}</p>
                      </div>
                      <div className="border-t border-slate-200/60 pt-3 text-[11px] space-y-1.5 text-slate-600 font-medium">
                        <div>CNIC / ID: <span className="text-slate-900 font-mono font-bold">{t.cnic}</span></div>
                        <div>Emergency: <span className="text-slate-900 font-bold">{t.emergency_contact}</span></div>
                        <div>Vehicle: <span className="text-slate-900 font-mono">ABC-991 (Simulated)</span></div>
                      </div>
                      <div className="flex justify-end gap-2 pt-2 border-t border-slate-200/60">
                        <button
                          onClick={() => {
                            showToast("Digital checklist and sign tool coming soon", "info");
                          }}
                          className="px-2.5 py-1 bg-white text-slate-700 hover:bg-slate-100 font-bold text-[10px] rounded-lg border border-slate-200 transition-colors"
                        >
                          Checklist
                        </button>
                        <button
                          onClick={() => {
                            deleteTenant(t.id);
                          }}
                          className="px-2.5 py-1 bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold text-[10px] rounded-lg border border-rose-200 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 5: OWNERS */}
          {activeTab === "owners" && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="font-bold text-slate-900 text-sm uppercase font-mono tracking-wider">Property Owners Directory</h3>
                <button
                  onClick={() => {
                    const newOwnerName = prompt("Enter Owner Name:");
                    if (!newOwnerName) return;
                    const newOwnerEmail = prompt("Enter Owner Email:");
                    setLocalOwners(prev => [...prev, {
                      id: "o_" + Math.random().toString(36).substr(2, 9),
                      name: newOwnerName,
                      email: newOwnerEmail || "owner@domain.com",
                      phone: "+1 (555) 000-0000",
                      company: "New Ventures LLC",
                      active: true,
                      payoutHistory: []
                    }]);
                    showToast(`Owner "${newOwnerName}" added to system.`, "success");
                  }}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3 py-2 rounded-xl"
                >
                  + Register Owner
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {localOwners.map((owner) => (
                  <div key={owner.id} className="border border-slate-200 rounded-2xl p-5 bg-slate-50 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-base">{owner.name}</h4>
                        <span className="text-[10px] font-mono text-slate-400 font-bold block mt-0.5">{owner.company}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold font-mono uppercase border ${
                        owner.active ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-rose-50 text-rose-500 border-rose-200"
                      }`}>
                        {owner.active ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <div className="text-xs space-y-1 text-slate-600">
                      <div>Email: <span className="font-bold text-slate-900">{owner.email}</span></div>
                      <div>Phone: <span className="font-bold text-slate-900">{owner.phone}</span></div>
                    </div>

                    <div className="border-t border-slate-200/60 pt-3">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Payout History</div>
                      {owner.payoutHistory.length === 0 ? (
                        <span className="text-slate-400 italic text-[11px]">No payouts recorded.</span>
                      ) : (
                        owner.payoutHistory.map((po, idx) => (
                          <div key={idx} className="flex justify-between items-center text-[11px] font-mono bg-white p-2 border border-slate-100 rounded-xl">
                            <span className="font-bold text-slate-800">{po.date}</span>
                            <span className="font-bold text-emerald-600">${po.amount}</span>
                            <span className="text-slate-400">{po.invoice}</span>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-slate-200/60">
                      <button
                        onClick={() => {
                          const amount = parseFloat(prompt("Enter payout amount ($):") || "0");
                          if (amount <= 0) return;
                          setLocalOwners(prev => prev.map(o => o.id === owner.id ? {
                            ...o,
                            payoutHistory: [...o.payoutHistory, {
                              date: new Date().toISOString().split("T")[0],
                              amount,
                              invoice: `PO-${Math.floor(Math.random() * 9000) + 1000}`
                            }]
                          } : o));
                          showToast("Payout disbursed and logged.", "success");
                        }}
                        className="text-[10px] font-bold text-blue-600 hover:underline"
                      >
                        + Disburse Payout
                      </button>
                      <button
                        onClick={() => handleToggleOwnerActive(owner.id)}
                        className={`text-[10px] font-bold ${owner.active ? "text-amber-600" : "text-emerald-600"} hover:underline`}
                      >
                        {owner.active ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: LEASES */}
          {activeTab === "leases" && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <h3 className="font-bold text-slate-900 text-sm uppercase font-mono tracking-wider">Lease Agreements Portfolio</h3>
                <button
                  onClick={() => {
                    const tName = prompt("Tenant Name:");
                    if (!tName) return;
                    const pName = prompt("Property Name:");
                    const uNum = prompt("Unit Number:");
                    const rentVal = parseFloat(prompt("Monthly Rent ($):") || "1200");
                    addLease({
                      property_id: "p1",
                      property_name: pName || "Main Plaza",
                      unit_id: "u1",
                      unit_number: uNum || "101",
                      tenant_id: "t_new",
                      tenant_name: tName,
                      start_date: "2026-07-01",
                      end_date: "2027-06-30",
                      rent_amount: rentVal,
                      deposit_amount: rentVal,
                      status: LeaseStatus.ACTIVE
                    });
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5"
                >
                  <Plus className="h-4 w-4" /> Create New Lease
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600 border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-200">
                      <th className="py-3 px-4">Tenant</th>
                      <th className="py-3 px-4">Property / Unit</th>
                      <th className="py-3 px-4">Dates</th>
                      <th className="py-3 px-4">Rent / Deposit</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {leases.map((l) => (
                      <tr key={l.id} className="hover:bg-slate-50/50">
                        <td className="py-3.5 px-4 font-bold text-slate-900">{l.tenant_name}</td>
                        <td className="py-3.5 px-4 font-semibold text-slate-600">
                          {l.property_name} • <span className="font-mono">Unit {l.unit_number}</span>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-medium text-slate-500">
                          {l.start_date} to {l.end_date}
                        </td>
                        <td className="py-3.5 px-4 font-mono">
                          Rent: <span className="font-bold text-slate-900">${l.rent_amount}</span> / Dep: <span className="font-bold text-slate-500">${l.deposit_amount}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold border ${
                            l.status === LeaseStatus.ACTIVE ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                            l.status === LeaseStatus.EXPIRING ? "bg-amber-50 text-amber-600 border-amber-200" :
                            "bg-rose-50 text-rose-500 border-rose-200"
                          }`}>
                            {l.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-2">
                          <button
                            onClick={() => {
                              showToast(`Reminders sent automatically to ${l.tenant_name}!`, "success");
                            }}
                            className="text-[10px] font-bold text-blue-600 hover:underline"
                          >
                            Remind
                          </button>
                          <button
                            onClick={() => {
                              updateLease({ ...l, status: LeaseStatus.ACTIVE });
                              showToast(`Lease renewed successfully!`, "success");
                            }}
                            className="text-[10px] font-bold text-indigo-600 hover:underline"
                          >
                            Renew
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 7: RENT COLLECTION */}
          {activeTab === "rent" && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 text-sm uppercase font-mono tracking-tight">Recurring Invoices &amp; Gateway Payments</h3>
                  <p className="text-[11px] text-slate-400">Manage Stripe invoices and auto grace periods.</p>
                </div>
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1"
                >
                  <DollarSign className="h-4 w-4" /> Log Tenant Payment
                </button>
              </div>

              {/* Invoicing info banners */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-3">
                  <CheckCircle className="h-8 w-8 text-emerald-500" />
                  <div>
                    <div className="font-extrabold text-slate-900">1st of Month Cycle</div>
                    <div className="text-slate-500">Auto-billing active on Stripe.</div>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-3">
                  <Clock className="h-8 w-8 text-amber-500 animate-spin" style={{ animationDuration: "12s" }} />
                  <div>
                    <div className="font-extrabold text-slate-900">5-Day Grace Period</div>
                    <div className="text-slate-500">Late fees trigger on 6th of month.</div>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-3">
                  <ShieldAlert className="h-8 w-8 text-indigo-500" />
                  <div>
                    <div className="font-extrabold text-slate-900">Eviction Protections</div>
                    <div className="text-slate-500">Eviction filings require admin lock.</div>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600 border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-200">
                      <th className="py-3 px-4">Tenant</th>
                      <th className="py-3 px-4">Property &amp; Unit</th>
                      <th className="py-3 px-4">Amount Due</th>
                      <th className="py-3 px-4">Due Date</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Gateway Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {payments.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/50">
                        <td className="py-3.5 px-4 font-bold text-slate-900">{p.tenant_name}</td>
                        <td className="py-3.5 px-4">{p.property_name} Unit {p.unit_number}</td>
                        <td className="py-3.5 px-4 font-mono font-bold">${p.amount}</td>
                        <td className="py-3.5 px-4 font-mono">{p.due_date}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold border uppercase ${
                            p.status === PaymentStatus.PAID ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                            p.status === PaymentStatus.OVERDUE ? "bg-rose-50 text-rose-500 border-rose-200 animate-pulse" :
                            "bg-amber-50 text-amber-500 border-amber-200"
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {p.status !== PaymentStatus.PAID ? (
                            <button
                              onClick={() => {
                                markPaymentPaid(p.id, "Stripe Gateway");
                              }}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] px-2.5 py-1 rounded-lg uppercase tracking-wider transition-all"
                            >
                              Stripe Pay
                            </button>
                          ) : (
                            <span className="text-[10px] font-mono text-slate-400 font-bold">Paid via {p.payment_method || "Stripe"}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 8: MAINTENANCE */}
          {activeTab === "maintenance" && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 text-sm uppercase font-mono tracking-tight">Active Maintenance &amp; Vendors</h3>
                  <p className="text-[11px] text-slate-400">Dispatch tickets, assign plumbers/electricians, and review cost estimates.</p>
                </div>
                <button
                  onClick={() => setShowTicketModal(true)}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5"
                >
                  <Plus className="h-4 w-4" /> Log Issue Ticket
                </button>
              </div>

              {/* Maintenance Tickets list */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Tickets list */}
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-800 text-xs uppercase font-mono border-b border-slate-100 pb-2">Active Tickets</h4>
                  {tickets.map((t) => (
                    <div key={t.id} className="border border-slate-200/80 p-4 rounded-2xl bg-slate-50/50 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-extrabold text-slate-900 text-sm">{t.title}</div>
                          <div className="text-[10px] font-mono text-slate-400 font-bold mt-0.5">{t.property_name} Unit {t.unit_number}</div>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase border ${
                          t.priority === TicketPriority.URGENT || t.priority === TicketPriority.HIGH ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-blue-50 text-blue-600 border-blue-100"
                        }`}>
                          {t.priority}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{t.description}</p>
                      <div className="flex justify-between items-center text-[11px] font-semibold text-slate-500 pt-1">
                        <div>Cost Estimate: <span className="font-bold font-mono text-slate-900">${t.cost || 0}</span></div>
                        <div className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                          <span>Status: {t.status}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-1.5 pt-2.5 border-t border-slate-200/50">
                        <button
                          onClick={() => {
                            const costStr = prompt("Enter resolve cost ($):", "250");
                            if (costStr) {
                              updateTicketCost(t.id, parseFloat(costStr));
                            }
                          }}
                          className="px-2.5 py-1 bg-white text-slate-700 hover:bg-slate-100 text-[10px] font-extrabold rounded-lg border border-slate-200 transition-colors"
                        >
                          Cost Set
                        </button>
                        <button
                          onClick={() => {
                            updateTicketStatus(t.id, TicketStatus.RESOLVED);
                            showToast("Ticket resolved. Tenant notified.", "success");
                          }}
                          className="px-2.5 py-1 bg-emerald-600 text-white hover:bg-emerald-700 text-[10px] font-extrabold rounded-lg transition-colors"
                        >
                          Resolve &amp; Bill
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Vendors database */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h4 className="font-bold text-slate-800 text-xs uppercase font-mono">Assigned Vendor Pool</h4>
                    <button
                      onClick={() => {
                        const name = prompt("Vendor Name:");
                        const service = prompt("Service category (Plumber/HVAC etc):");
                        const phone = prompt("Phone number:");
                        if (name && service) {
                          setVendors(prev => [...prev, { id: "v_" + Math.random().toString(36).substr(2, 9), name, service, phone: phone || "+1 (555) 000-0000", rating: 4.8 }]);
                        }
                      }}
                      className="text-[10px] font-bold text-blue-600 hover:underline"
                    >
                      + Add Vendor
                    </button>
                  </div>
                  <div className="space-y-3">
                    {vendors.map((v) => (
                      <div key={v.id} className="bg-slate-50 p-3 rounded-2xl border border-slate-200/60 flex justify-between items-center text-xs">
                        <div>
                          <div className="font-extrabold text-slate-900">{v.name}</div>
                          <div className="text-[10px] text-slate-400 font-bold mt-0.5">{v.service} • {v.phone}</div>
                        </div>
                        <span className="font-mono font-bold bg-white text-blue-600 border border-slate-100 rounded-lg px-2 py-1 text-[10px]">
                          ⭐ {v.rating}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: FINANCIALS & REPORTS */}
          {activeTab === "reports" && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-sm uppercase font-mono tracking-tight">Financial Reports Center</h3>
                <p className="text-[11px] text-slate-400">Generate PDF statements, rent rolls, and delinquency analyses instantly.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: "Owner Statement", desc: "Income & expenses split per property owner", type: "PDF" },
                  { title: "Rent Roll Portfolio", desc: "List of all units, tenant rents, and leases", type: "CSV" },
                  { title: "Delinquency Report", desc: "Identifies tenants with outstanding balances", type: "PDF" },
                  { title: "Maintenance Cost Roll", desc: "Total spent on property repair bills", type: "CSV" }
                ].map((rep, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-300 transition-colors">
                    <div className="space-y-2">
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 border border-blue-100 text-[9px] font-extrabold font-mono uppercase">{rep.type}</span>
                      <h4 className="font-bold text-slate-900 text-sm mt-1">{rep.title}</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{rep.desc}</p>
                    </div>
                    <button
                      onClick={() => {
                        showToast(`Generating and exporting ${rep.title}...`, "success");
                      }}
                      className="mt-4 w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] rounded-xl flex items-center justify-center gap-1.5 uppercase tracking-wider transition-colors"
                    >
                      <FileSpreadsheet className="h-3.5 w-3.5" /> Export Report
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 10: DOCUMENTS */}
          {activeTab === "documents" && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 text-sm uppercase font-mono tracking-tight">Central Files &amp; Storage</h3>
                  <p className="text-[11px] text-slate-400">Secure directory with automated folders for Owner, Tenant, Property, and Lease agreements.</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative max-w-xs w-full">
                    <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search files by name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 pr-4 py-1.5 border border-slate-200 rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={() => {
                      const name = prompt("Enter file name (e.g. Agreement_Unit103.pdf):");
                      const folderStr = prompt("Enter folder (Owner, Tenant, Property, Lease):") || "Property";
                      if (name) {
                        setDocs(prev => [{
                          id: "d_" + Math.random().toString(36).substr(2, 9),
                          name,
                          folder: folderStr as any,
                          size: "1.2 MB",
                          date: new Date().toISOString().split("T")[0],
                          fileType: "PDF",
                          linkedEntity: "Unit 103"
                        }, ...prev]);
                        showToast("Document uploaded and indexed successfully.", "success");
                      }
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1.5"
                  >
                    <Upload className="h-3.5 w-3.5" /> Upload File
                  </button>
                </div>
              </div>

              {/* Folder Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-bold text-slate-800">
                {["Owner Documents", "Tenant Documents", "Property Documents", "Lease Agreements"].map((f, idx) => {
                  const shortName = f.split(" ")[0];
                  const count = docs.filter(d => d.folder === shortName || (shortName === "Lease" && d.folder === "Lease")).length;
                  return (
                    <div key={idx} className="bg-slate-50 border border-slate-200/60 p-4 rounded-2xl flex items-center gap-3 shadow-inner">
                      <FolderClosed className="h-8 w-8 text-blue-500" />
                      <div>
                        <div>{f}</div>
                        <span className="text-[10px] text-slate-400 font-bold">{count} indexed files</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Documents table list */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600 border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-200">
                      <th className="py-2.5 px-4">Filename</th>
                      <th className="py-2.5 px-4">Folder</th>
                      <th className="py-2.5 px-4">Linked Entity</th>
                      <th className="py-2.5 px-4">Size</th>
                      <th className="py-2.5 px-4">Date</th>
                      <th className="py-2.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                    {docs
                      .filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((d) => (
                        <tr key={d.id} className="hover:bg-slate-50/50">
                          <td className="py-2 px-4 font-sans font-semibold text-slate-800 flex items-center gap-1.5">
                            <FileText className="h-4 w-4 text-slate-400 shrink-0" /> {d.name}
                          </td>
                          <td className="py-2 px-4">{d.folder} Folder</td>
                          <td className="py-2 px-4 font-sans text-slate-600">{d.linkedEntity}</td>
                          <td className="py-2 px-4">{d.size}</td>
                          <td className="py-2 px-4">{d.date}</td>
                          <td className="py-2 px-4 text-right">
                            <button
                              onClick={() => {
                                setDocs(prev => prev.filter(item => item.id !== d.id));
                                showToast("Document unlinked and removed.", "warning");
                              }}
                              className="text-rose-500 hover:text-rose-700 font-bold"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 11: COMMUNICATIONS */}
          {activeTab === "communications" && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 text-sm uppercase font-mono tracking-tight">Mass Broadcasts &amp; Direct Logs</h3>
                  <p className="text-[11px] text-slate-400">Send building-wide notifications and template-based reminders.</p>
                </div>
                <button
                  onClick={() => setShowMassEmailModal(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5"
                >
                  <Send className="h-4 w-4" /> Send Mass Email/SMS
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <h4 className="font-bold text-slate-800 text-xs uppercase font-mono border-b border-slate-100 pb-2">Communication History Log</h4>
                  <div className="space-y-3.5">
                    {commLogs.map((log) => (
                      <div key={log.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-2.5">
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-1.5 text-slate-800 font-bold">
                            {log.type === "Email" ? <Mail className="h-4 w-4 text-blue-500" /> : <Smartphone className="h-4 w-4 text-emerald-500" />}
                            <span>To: {log.recipient}</span>
                          </span>
                          <span className="font-mono text-[10px] text-slate-400">{log.date}</span>
                        </div>
                        <div>
                          <div className="font-extrabold text-slate-950 mb-0.5">{log.subject}</div>
                          <p className="text-slate-600 leading-relaxed font-sans">{log.message}</p>
                        </div>
                        <span className="text-[9px] font-mono bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md border border-emerald-100 font-extrabold uppercase">
                          {log.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Templates Pool */}
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-800 text-xs uppercase font-mono border-b border-slate-100 pb-2">Predefined Templates</h4>
                  <div className="space-y-3">
                    {[
                      { title: "Rent Overdue Notification", summary: "Notify delinquent tenants regarding late fee policies and grace periods." },
                      { title: "Lease Renewals Invite", summary: "Simulate a bulk renewal invite proposal to expiring contracts." },
                      { title: "HVAC Inspection Scheduled", summary: "Routine notification advising inspection on upcoming weekdays." }
                    ].map((t, idx) => (
                      <div key={idx} className="bg-slate-50 p-3 rounded-2xl border border-slate-200/60 text-xs space-y-1">
                        <div className="font-extrabold text-slate-900">{t.title}</div>
                        <p className="text-slate-500 leading-relaxed">{t.summary}</p>
                        <button
                          onClick={() => {
                            setMassEmailForm({
                              type: "Email",
                              recipientGroup: "all",
                              subject: t.title,
                              message: `Dear Residents, Please be advised regarding: ${t.title}. Thank you, Workspace Management.`,
                              template: "custom"
                            });
                            setShowMassEmailModal(true);
                          }}
                          className="text-[10px] font-bold text-blue-600 hover:underline block pt-1"
                        >
                          Use Template
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 12: SETTINGS */}
          {activeTab === "settings" && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-sm uppercase font-mono tracking-tight">Workspace &amp; Gateway Settings</h3>
                <p className="text-[11px] text-slate-400">Configure Stripe checkout integration, push notifications, and profile credentials.</p>
              </div>

              <div className="max-w-xl space-y-6 text-xs text-slate-600 font-medium">
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/60 space-y-4">
                  <h4 className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    <CreditCard className="h-4.5 w-4.5 text-blue-600" /> Payment Gateway (Stripe)
                  </h4>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Stripe Public API Key</label>
                      <input
                        type="text"
                        defaultValue="pk_test_51O9P08L88Q"
                        disabled
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl font-mono text-slate-500 text-[11px]"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="font-extrabold text-emerald-600 uppercase font-mono text-[10px]">Connected &amp; Active</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/60 space-y-4">
                  <h4 className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    <Sliders className="h-4.5 w-4.5 text-indigo-600" /> Notifications &amp; Reminders
                  </h4>
                  <div className="space-y-3">
                    {[
                      { label: "SMS Expiry Reminders", val: "Automatically triggers 30 days prior to end_date." },
                      { label: "Late Fees Accumulation", val: "Applies 5% penalty dynamically after 5th of each cycle." },
                      { label: "Owner Net Transfers", val: "Runs automated bank drafts on 10th of every cycle." }
                    ].map((s, idx) => (
                      <div key={idx} className="flex items-start gap-2 justify-between">
                        <div>
                          <div className="font-bold text-slate-900">{s.label}</div>
                          <p className="text-[10px] text-slate-400">{s.val}</p>
                        </div>
                        <input type="checkbox" defaultChecked className="h-4 w-4 rounded text-blue-600 border-slate-300" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 13: TENANT APPLICATIONS BOARD */}
          {activeTab === "applications" && (
            <div className="space-y-6">
              {/* Stats Overview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Total Received", val: globalApps.length, color: "text-blue-600", bg: "bg-blue-50" },
                  { label: "Pending Check", val: globalApps.filter(a => a.status === "Pending").length, color: "text-amber-600", bg: "bg-amber-50" },
                  { label: "Under Review", val: globalApps.filter(a => a.status === "Under Review").length, color: "text-indigo-600", bg: "bg-indigo-50" },
                  { label: "Approved (Active)", val: globalApps.filter(a => a.status === "Approved").length, color: "text-emerald-600", bg: "bg-emerald-50" }
                ].map((stat, idx) => (
                  <div key={idx} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
                    <div className={`text-2xl font-black font-mono mt-2 ${stat.color}`}>{stat.val}</div>
                  </div>
                ))}
              </div>

              {/* Filtering bar */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-center">
                  {["All", "Pending", "Under Review", "Approved", "Rejected"].map(filter => (
                    <button
                      key={filter}
                      onClick={() => setAppFilter(filter)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        appFilter === filter 
                          ? "bg-slate-900 text-white shadow-sm" 
                          : "text-slate-500 hover:bg-slate-100"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
                <div className="text-[11px] text-slate-400 font-semibold font-mono">
                  Showing {globalApps.filter(a => appFilter === "All" || a.status === appFilter).length} applications
                </div>
              </div>

              {/* Applications List Table */}
              <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200/60 uppercase text-[10px] font-bold text-slate-400 tracking-wider">
                      <tr>
                        <th className="py-3.5 px-6">Applicant &amp; CNIC</th>
                        <th className="py-3.5 px-4">Property Category</th>
                        <th className="py-3.5 px-4">Desired Rent &amp; Income</th>
                        <th className="py-3.5 px-4">Applied Date</th>
                        <th className="py-3.5 px-4">Status Progress</th>
                        <th className="py-3.5 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {globalApps
                        .filter(a => appFilter === "All" || a.status === appFilter)
                        .map(app => {
                          const cnicDecrypted = decryptAES256(app.details.cnic);
                          const mobileDecrypted = decryptAES256(app.details.mobileNumber) || app.details.mobileNumber;
                          const rentDecrypted = app.details.maxMonthlyRent && String(app.details.maxMonthlyRent).startsWith("ENC::") ? Number(decryptAES256(app.details.maxMonthlyRent)) : Number(app.details.maxMonthlyRent);
                          const incomeDecrypted = app.details.monthlyIncome && String(app.details.monthlyIncome).startsWith("ENC::") ? Number(decryptAES256(app.details.monthlyIncome)) : Number(app.details.monthlyIncome);

                          return (
                            <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                              <td className="py-4 px-6">
                                <div className="font-extrabold text-slate-950 text-sm">{app.details.fullName}</div>
                                <div className="text-[10px] text-slate-400 font-mono mt-0.5">{cnicDecrypted} &bull; {mobileDecrypted}</div>
                              </td>
                              <td className="py-4 px-4">
                                <div className="font-bold text-slate-900">{app.propertyName}</div>
                                <div className="text-[10px] text-slate-400 mt-0.5">{app.details.propType} ({app.details.bedrooms} Bed &bull; {app.details.bathrooms} Bath)</div>
                              </td>
                              <td className="py-4 px-4 font-mono">
                                <div className="text-blue-600 font-extrabold">{formatPKR(rentDecrypted)}</div>
                                <div className="text-[10px] text-emerald-600 font-bold mt-0.5">Income: {formatPKR(incomeDecrypted)}</div>
                              </td>
                              <td className="py-4 px-4 font-mono text-slate-400">{app.appliedDate}</td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                                  app.status === "Approved" ? "bg-emerald-50 text-emerald-600" :
                                  app.status === "Pending" ? "bg-amber-50 text-amber-600" :
                                  app.status === "Under Review" ? "bg-indigo-50 text-indigo-600" :
                                  "bg-rose-50 text-rose-600"
                                }`}>
                                  {app.status}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">({app.progress}%)</span>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-right">
                              <button
                                onClick={() => { setSelectedApp(app); setReviewTab("requirements"); }}
                                className="px-3.5 py-1.5 text-[11px] font-bold text-blue-600 border border-blue-200 rounded-xl hover:bg-blue-50/50 transition-colors"
                              >
                                Verify Details
                              </button>
                            </td>
                          </tr>
                          );
                        })}
                      {globalApps.filter(a => appFilter === "All" || a.status === appFilter).length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-slate-400">
                            <FileCheck className="h-10 w-10 mx-auto text-slate-300 mb-2" />
                            <p className="font-bold text-sm">No applications matching current status filter.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ==================== FORM MODALS ==================== */}

      {/* Modal 1: Add Property */}
      {showPropertyModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl relative space-y-4">
            <button onClick={() => setShowPropertyModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
            <h3 className="font-extrabold text-slate-900 text-base uppercase font-mono">Create Property Asset</h3>
            <form onSubmit={handleCreateProperty} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Name</label>
                <input type="text" required placeholder="Oakridge Towers" value={propForm.name} onChange={e => setPropForm({ ...propForm, name: e.target.value })} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Address</label>
                <input type="text" required placeholder="742 Evergreen Terr" value={propForm.address} onChange={e => setPropForm({ ...propForm, address: e.target.value })} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type</label>
                  <select value={propForm.type} onChange={e => setPropForm({ ...propForm, type: e.target.value as any })} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-white">
                    <option value={PropertyType.APARTMENT}>Apartment</option>
                    <option value={PropertyType.HOUSE}>House</option>
                    <option value={PropertyType.COMMERCIAL}>Commercial</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Units</label>
                  <input type="number" value={propForm.units_count} onChange={e => setPropForm({ ...propForm, units_count: parseInt(e.target.value) || 1 })} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl" />
                </div>
              </div>
              <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl uppercase tracking-wider shadow-md">Add Property</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Add Tenant */}
      {showTenantModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl relative space-y-4">
            <button onClick={() => setShowTenantModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
            <h3 className="font-extrabold text-slate-900 text-base uppercase font-mono">Add Tenant Portfolio</h3>
            <form onSubmit={handleCreateTenant} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
                  <input type="text" required placeholder="Sarah Jenkins" value={tenantForm.full_name} onChange={e => setTenantForm({ ...tenantForm, full_name: e.target.value })} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
                  <input type="email" required placeholder="sarah@domain.com" value={tenantForm.email} onChange={e => setTenantForm({ ...tenantForm, email: e.target.value })} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phone</label>
                  <input type="text" placeholder="+1 (555) 000-1122" value={tenantForm.phone} onChange={e => setTenantForm({ ...tenantForm, phone: e.target.value })} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">CNIC / ID</label>
                  <input type="text" placeholder="35201-1234567-9" value={tenantForm.cnic} onChange={e => setTenantForm({ ...tenantForm, cnic: e.target.value })} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl font-mono" />
                </div>
              </div>
              <button type="submit" className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl uppercase tracking-wider">Save Tenant</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Record Payment */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl relative space-y-4">
            <button onClick={() => setShowPaymentModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
            <h3 className="font-extrabold text-slate-900 text-base uppercase font-mono">Record Rent Invoice</h3>
            <form onSubmit={handleRecordPayment} className="space-y-4 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select Tenant</label>
                <select value={paymentForm.tenant_id} onChange={e => setPaymentForm({ ...paymentForm, tenant_id: e.target.value })} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-white">
                  <option value="">-- Choose Tenant --</option>
                  {tenants.map(t => <option key={t.id} value={t.id}>{t.full_name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select Unit</label>
                <select value={paymentForm.unit_id} onChange={e => setPaymentForm({ ...paymentForm, unit_id: e.target.value })} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-white">
                  <option value="">-- Choose Unit --</option>
                  {units.map(u => <option key={u.id} value={u.id}>{u.property_name} - Unit {u.unit_number}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amount ($)</label>
                  <input type="number" value={paymentForm.amount} onChange={e => setPaymentForm({ ...paymentForm, amount: parseFloat(e.target.value) || 0 })} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Due Date</label>
                  <input type="date" value={paymentForm.due_date} onChange={e => setPaymentForm({ ...paymentForm, due_date: e.target.value })} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl" />
                </div>
              </div>
              <button type="submit" className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl uppercase tracking-wider">Log Payment</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal 4: Log Ticket */}
      {showTicketModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl relative space-y-4">
            <button onClick={() => setShowTicketModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
            <h3 className="font-extrabold text-slate-900 text-base uppercase font-mono">Create Maintenance Ticket</h3>
            <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select Property</label>
                  <select value={ticketForm.property_id} onChange={e => setTicketForm({ ...ticketForm, property_id: e.target.value })} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-white">
                    <option value="">-- Choose --</option>
                    {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select Unit</label>
                  <select value={ticketForm.unit_id} onChange={e => setTicketForm({ ...ticketForm, unit_id: e.target.value })} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-white">
                    <option value="">-- Choose --</option>
                    {units.filter(u => u.property_id === ticketForm.property_id).map(u => <option key={u.id} value={u.id}>Unit {u.unit_number}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ticket Title</label>
                <input type="text" required placeholder="Burst kitchen pipe" value={ticketForm.title} onChange={e => setTicketForm({ ...ticketForm, title: e.target.value })} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Description</label>
                <textarea rows={3} placeholder="Plumbing leak causing minor ceiling stain..." value={ticketForm.description} onChange={e => setTicketForm({ ...ticketForm, description: e.target.value })} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl" />
              </div>
              <button type="submit" className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl uppercase tracking-wider">Log Ticket</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal 5: Mass Email / SMS */}
      {showMassEmailModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl relative space-y-4">
            <button onClick={() => setShowMassEmailModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
            <h3 className="font-extrabold text-slate-900 text-base uppercase font-mono">Send Broadcast</h3>
            <form onSubmit={handleSendMassEmail} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type</label>
                  <select value={massEmailForm.type} onChange={e => setMassEmailForm({ ...massEmailForm, type: e.target.value as any })} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-white">
                    <option value="Email">Email</option>
                    <option value="SMS">SMS / Text</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recipient Group</label>
                  <select value={massEmailForm.recipientGroup} onChange={e => setMassEmailForm({ ...massEmailForm, recipientGroup: e.target.value })} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-white">
                    <option value="all">All Tenants</option>
                    <option value="owners">All Property Owners</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Subject Line (Emails Only)</label>
                <input type="text" placeholder="Building Wide Alert" value={massEmailForm.subject} onChange={e => setMassEmailForm({ ...massEmailForm, subject: e.target.value })} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Broadcast Message Content</label>
                <textarea rows={4} required placeholder="Dear Residents..." value={massEmailForm.message} onChange={e => setMassEmailForm({ ...massEmailForm, message: e.target.value })} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl font-sans" />
              </div>
              <button type="submit" className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl uppercase tracking-wider">Broadcast Send</button>
            </form>
          </div>
        </div>
      )}

      {/* Verification Dialog: Tenant Verification Review Panel */}
      {selectedApp && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col relative animate-scale-up">
            
            {/* Modal Header */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
              <div>
                <span className="inline-flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-widest bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2.5 py-1 rounded-full">
                  Applicant ID: {selectedApp.id}
                </span>
                <h3 className="font-extrabold text-lg mt-1 tracking-tight leading-tight">Tenant Verification: {selectedApp.details.fullName}</h3>
                <p className="text-[10px] text-slate-400 leading-normal font-medium font-mono">{selectedApp.propertyName} &bull; Desired Move-in: {selectedApp.details.preferredMoveInDate}</p>
              </div>
              <button 
                onClick={() => setSelectedApp(null)} 
                className="p-1.5 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors"
              >
                <X className="h-5.5 w-5.5" />
              </button>
            </div>

            {/* Selection Review Tabs */}
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-2.5 shrink-0 flex items-center gap-1.5 overflow-x-auto">
              {[
                { id: "requirements", label: "1. Core & Property Needs" },
                { id: "personal", label: "2. Personal & Occupants" },
                { id: "financial", label: "3. Income & References" },
                { id: "documents", label: "4. Documents & Digital Signs" }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setReviewTab(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-xl text-[11px] font-extrabold transition-all shrink-0 ${
                    reviewTab === tab.id
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-600 font-medium">
              
              {/* TAB 1: REQUIREMENTS */}
              {reviewTab === "requirements" && (
                <div className="space-y-4">
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Property Specifications Applied</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <span className="text-slate-400 font-medium block">Category:</span>
                        <span className="font-bold text-slate-900 text-sm capitalize">{selectedApp.details.propType}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium block">Covered Area:</span>
                        <span className="font-bold text-slate-900 text-sm font-mono">{selectedApp.details.minArea} Sq Ft</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium block">Bedrooms:</span>
                        <span className="font-bold text-slate-900 text-sm font-mono">{selectedApp.details.bedrooms} Beds</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium block">Bathrooms:</span>
                        <span className="font-bold text-slate-900 text-sm font-mono">{selectedApp.details.bathrooms} Baths</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t border-slate-200/60">
                      <div>
                        <span className="text-slate-400 font-medium block">Furnishing:</span>
                        <span className="font-bold text-slate-900 text-sm capitalize">{selectedApp.details.furnishedStatus || "Fully"}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium block">Floor Level:</span>
                        <span className="font-bold text-slate-900 text-sm">{selectedApp.details.preferredFloor}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium block">Parking Slot:</span>
                        <span className="font-bold text-slate-900 text-sm">{selectedApp.details.parkingRequired} ({selectedApp.details.parkingCount} cars)</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium block">Store Room:</span>
                        <span className="font-bold text-slate-900 text-sm">{selectedApp.details.storeRoomRequired}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-3">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Smart Indoor Amenities (Tenant Wants)</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { label: "AC", val: selectedApp.details.acRequired },
                        { label: "UPS / Inverter", val: selectedApp.details.upsRequired },
                        { label: "Solar Net", val: selectedApp.details.solarRequired },
                        { label: "Sui Gas", val: selectedApp.details.gasRequired },
                        { label: "Boring Water", val: selectedApp.details.waterRequired },
                        { label: "Generator", val: selectedApp.details.generatorRequired },
                        { label: "Fiber Net", val: selectedApp.details.internetRequired },
                        { label: "RO Filter", val: selectedApp.details.waterFilterRequired }
                      ].map((item, idx) => (
                        <div key={idx} className="bg-white p-2.5 rounded-xl border border-slate-100 flex items-center justify-between">
                          <span className="font-bold text-slate-700">{item.label}</span>
                          <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold ${
                            item.val === "Must Have" ? "bg-rose-50 text-rose-600" : "bg-blue-50 text-blue-600"
                          }`}>{item.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-3">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Neighborhood Landmarks Preference</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <span className="text-slate-400 font-medium block">Preferred Sector:</span>
                        <span className="font-bold text-slate-800">{selectedApp.details.preferredAreas}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium block">Nearest Commercial Landmark:</span>
                        <span className="font-bold text-slate-800">{selectedApp.details.nearestLandmark}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium block">Province / City:</span>
                        <span className="font-bold text-slate-800">{selectedApp.details.currentProvince || "Punjab"} / {selectedApp.details.currentCityDistrict || "Lahore"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PERSONAL & OCCUPANTS */}
              {reviewTab === "personal" && (
                <div className="space-y-4">
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Government ID Verification</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <span className="text-slate-400 font-medium block">Full Name (CNIC matching):</span>
                        <span className="font-bold text-slate-900 text-sm">{selectedApp.details.fullName}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium block">Father / Husband Name:</span>
                        <span className="font-bold text-slate-900 text-sm">{decryptAES256(selectedApp.details.fatherHusbandName) || selectedApp.details.fatherHusbandName}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium block">CNIC Identity:</span>
                        <span className="font-bold text-blue-600 font-mono text-sm flex items-center gap-1">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" /> {decryptAES256(selectedApp.details.cnic)}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium block">Date of Birth:</span>
                        <span className="font-bold text-slate-800 font-mono text-sm">{decryptAES256(selectedApp.details.dob) || selectedApp.details.dob}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium block">Gender / Marital Status:</span>
                        <span className="font-bold text-slate-800">{selectedApp.details.gender} &bull; {selectedApp.details.maritalStatus}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium block">Mother Tongue / Religion:</span>
                        <span className="font-bold text-slate-800">{selectedApp.details.motherTongue} &bull; {selectedApp.details.religion}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Contact Channels</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <span className="text-slate-400 font-medium block">Mobile Phone:</span>
                        <span className="font-bold text-slate-900 font-mono">{decryptAES256(selectedApp.details.mobileNumber) || selectedApp.details.mobileNumber}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium block">WhatsApp:</span>
                        <span className="font-bold text-slate-900 font-mono">{decryptAES256(selectedApp.details.whatsAppNumber) || selectedApp.details.whatsAppNumber}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium block">Verified Email:</span>
                        <span className="font-bold text-slate-900 font-mono text-blue-600">{decryptAES256(selectedApp.details.emailAddress) || selectedApp.details.emailAddress}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-400 font-medium block">Current Address:</span>
                        <span className="font-bold text-slate-800">{selectedApp.details.currentAddress}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium block">Kin Emergency Contact:</span>
                        <span className="font-bold text-slate-800">{selectedApp.details.emergencyContactName} ({selectedApp.details.emergencyContactRelationship}) - {selectedApp.details.emergencyContactPhone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Household Profile &amp; Assets</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <span className="text-slate-400 font-medium block">Total Occupants:</span>
                        <span className="font-bold text-slate-900 text-sm font-mono">{selectedApp.details.totalOccupants} Persons</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium block">Adults / Children:</span>
                        <span className="font-bold text-slate-800 font-mono">{selectedApp.details.adultsCount} Adults / {selectedApp.details.childrenCount} Kids</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium block">Any Domestic Pets?</span>
                        <span className="font-bold text-slate-800">{selectedApp.details.petsInHousehold} {selectedApp.details.petsInHousehold === "Yes" && `(${selectedApp.details.petDetails})`}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium block">Logistical Vehicles:</span>
                        <span className="font-bold text-slate-800">{selectedApp.details.vehiclesCount} ({selectedApp.details.vehicleTypes})</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: FINANCIALS & REFERENCES */}
              {reviewTab === "financial" && (
                <div className="space-y-4">
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Financial Affordability Ratios</h4>
                    {(() => {
                      const rentDecrypted = selectedApp.details.maxMonthlyRent && String(selectedApp.details.maxMonthlyRent).startsWith("ENC::") ? Number(decryptAES256(selectedApp.details.maxMonthlyRent)) : Number(selectedApp.details.maxMonthlyRent);
                      const depositDecrypted = selectedApp.details.securityDepositBudget && String(selectedApp.details.securityDepositBudget).startsWith("ENC::") ? Number(decryptAES256(selectedApp.details.securityDepositBudget)) : Number(selectedApp.details.securityDepositBudget);
                      const incomeDecrypted = selectedApp.details.monthlyIncome && String(selectedApp.details.monthlyIncome).startsWith("ENC::") ? Number(decryptAES256(selectedApp.details.monthlyIncome)) : Number(selectedApp.details.monthlyIncome);
                      const ratio = incomeDecrypted > 0 ? ((rentDecrypted / incomeDecrypted) * 100).toFixed(0) : "0";

                      return (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <span className="text-slate-400 font-medium block">Rent Budget Limit:</span>
                            <span className="font-bold text-blue-600 text-sm font-mono">{formatPKR(rentDecrypted)}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-medium block">Security Deposit Budget:</span>
                            <span className="font-bold text-slate-800 text-sm font-mono">{formatPKR(depositDecrypted)}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-medium block">Net Monthly Income:</span>
                            <span className="font-bold text-emerald-600 text-sm font-mono">{formatPKR(incomeDecrypted)}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-medium block">Affordability Score:</span>
                            <span className="font-extrabold text-indigo-600 text-sm font-mono">
                              {ratio}% Rent-to-Income
                            </span>
                          </div>
                        </div>
                      );
                    })()}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t border-slate-200/60">
                      <div>
                        <span className="text-slate-400 font-medium block">Source of Income:</span>
                        <span className="font-bold text-slate-800">{selectedApp.details.sourceOfIncome}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium block">Occupation / Employer:</span>
                        <span className="font-bold text-slate-800">{selectedApp.details.occupation} &bull; {selectedApp.details.employerName}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium block">Employer Contact (HR):</span>
                        <span className="font-bold text-slate-800 font-mono">{selectedApp.details.employerContact}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium block">Years in Current Org:</span>
                        <span className="font-bold text-slate-800 font-mono">{selectedApp.details.yearsInCurrentJob || 4} Years</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tenancy &amp; Corporate References</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white p-4 rounded-xl border border-slate-150 space-y-2">
                        <span className="text-[10px] font-bold text-blue-600 block uppercase">1. Former Landlord Check</span>
                        <div>
                          <span className="text-slate-400 font-medium block">Landlord Name:</span>
                          <span className="font-bold text-slate-800">{selectedApp.details.ref1Name}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-medium block">Contact Mobile:</span>
                          <span className="font-bold text-slate-800 font-mono">{selectedApp.details.ref1Contact}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-medium block">Stayed Duration:</span>
                          <span className="font-bold text-slate-800 font-mono">{selectedApp.details.ref1Duration}</span>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-xl border border-slate-150 space-y-2">
                        <span className="text-[10px] font-bold text-indigo-600 block uppercase">2. Professional Reference</span>
                        <div>
                          <span className="text-slate-400 font-medium block">Supervisor Name:</span>
                          <span className="font-bold text-slate-800">{selectedApp.details.ref2Name}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-medium block">Contact Mobile:</span>
                          <span className="font-bold text-slate-800 font-mono">{selectedApp.details.ref2Contact}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-medium block">Supervisor Designation:</span>
                          <span className="font-bold text-slate-800">{selectedApp.details.ref2Designation}</span>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-xl border border-slate-150 space-y-2">
                        <span className="text-[10px] font-bold text-slate-600 block uppercase">3. Personal Reference</span>
                        <div>
                          <span className="text-slate-400 font-medium block">Guarantor Name:</span>
                          <span className="font-bold text-slate-800">{selectedApp.details.ref3Name}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-medium block">Contact Mobile:</span>
                          <span className="font-bold text-slate-800 font-mono">{selectedApp.details.ref3Contact}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-medium block">Relationship:</span>
                          <span className="font-bold text-slate-800">{selectedApp.details.ref3Relationship}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: DOCUMENTS */}
              {reviewTab === "documents" && (
                <div className="space-y-4">
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Secure Documents Repository</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { label: "CNIC Copy (Front & Back Scanned)", file: selectedApp.documents?.cnic || "cnic_doc_verified.png", size: "1.4 MB" },
                        { label: "Passport Sized Photograph", file: selectedApp.documents?.photo || "photo_verification.jpg", size: "820 KB" },
                        { label: "Last 3 Months Bank Statement", file: selectedApp.documents?.statement || "bank_statement_3m.pdf", size: "4.2 MB" },
                        { label: "Salary Slip / Business NTN Certificate", file: selectedApp.documents?.salarySlip || "salary_slip_verified.pdf", size: "2.1 MB" }
                      ].map((doc, idx) => (
                        <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200/60 flex items-center justify-between shadow-xs">
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
                              <FileCheck className="h-5 w-5" />
                            </div>
                            <div>
                              <span className="font-bold text-slate-800 block">{doc.label}</span>
                              <span className="text-[10px] text-slate-400 font-mono block mt-0.5">{doc.file} &bull; {doc.size}</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => alert(`Reviewing encrypted copy: ${doc.file}. Secured with Government RSA keys.`)}
                            className="text-[10px] font-bold text-blue-600 hover:underline px-3 py-1.5 hover:bg-blue-50/50 rounded-lg transition-colors border border-blue-100 shrink-0"
                          >
                            View Document
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-3">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sworn Declaration Signing</h4>
                    <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
                      <p className="font-bold text-slate-900 uppercase tracking-wider text-[10px] flex items-center gap-1.5"><ShieldAlert className="h-4 w-4 text-emerald-600" /> Digital Sign-off Confirmed</p>
                      <p className="font-light leading-relaxed text-[11px] text-slate-500">The applicant checked the compliance terms declaring that all listings, references, and income figures are authentic, acknowledging that contract revocation may occur under Punjab tenancy statutes if falsified.</p>
                      
                      <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100 font-mono text-[11px]">
                        <div>
                          <span className="text-slate-400 block font-medium">Signing Location:</span>
                          <span className="font-bold text-slate-800">{selectedApp.details.declarationPlace || "Lahore"}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-medium">Digital Signature:</span>
                          <span className="font-serif italic font-black text-slate-950 text-sm uppercase">{selectedApp.signature}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Actions */}
            <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={() => handleRejectApplication(selectedApp)}
                className="px-5 py-2.5 border border-rose-200 hover:bg-rose-50 text-rose-600 font-bold text-xs rounded-xl transition-all"
              >
                Reject Application
              </button>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => handleReviewApplication(selectedApp)}
                  className="px-5 py-2.5 border border-slate-200 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-100 transition-all"
                >
                  Mark Under Review
                </button>
                <button
                  type="button"
                  onClick={() => handleApproveApplication(selectedApp)}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/10 transition-all"
                >
                  Approve &amp; Generate Lease
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
