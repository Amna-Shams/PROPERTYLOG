import React, { useState, useEffect } from "react";
import { 
  Home, 
  FileText, 
  Heart, 
  MessageSquare, 
  Bell, 
  User, 
  Sparkles, 
  Clock, 
  CheckCircle, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Send, 
  BookOpen, 
  HelpCircle,
  Building,
  MapPin,
  DollarSign,
  Briefcase,
  ChevronRight,
  ShieldAlert,
  Moon,
  VolumeX,
  Smartphone,
  Check,
  UserCheck,
  CreditCard,
  Wrench,
  Download,
  Upload,
  Megaphone,
  FileCheck,
  PenTool,
  ShieldCheck,
  Activity,
  Paperclip,
  Search,
  Trash2,
  ArrowLeft,
  Play
} from "lucide-react";
import { formatPKR } from "../utils/currency";
import { RentalProperty } from "../data/rentalProperties";
import { TenantApplicationForm } from "./TenantApplicationForm";
import { useApp } from "../context/AppContext";
import { decryptAES256 } from "../utils/crypto";

interface TenantPortalProps {
  currentUser: any;
  onLogout: () => void;
  onBrowseRentals: () => void;
}

interface Application {
  id: string;
  propertyId: string;
  propertyName: string;
  managerName: string;
  price: number;
  appliedDate: string;
  status: "Pending" | "Verified" | "Checking References" | "Approved" | "Signed";
  progress: number; // percentage
  details: any;
  documents: Record<string, string>;
}

interface Message {
  id: string;
  sender: "tenant" | "manager";
  text: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  managerName: string;
  propertyName: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  messages: Message[];
}

export const TenantPortal: React.FC<TenantPortalProps> = ({ 
  currentUser, 
  onLogout,
  onBrowseRentals 
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "applications" | "favorites" | "messages" | "profile" | "rent" | "maintenance" | "documents">("overview");

  // Rent & Financials State
  const [autopaySetup, setAutopaySetup] = useState({
    active: false,
    method: "card", // card or ach
    amount: 150000,
    frequency: "Monthly",
    nextBillingDate: "2026-07-01",
    cardEnding: "4242",
    achAccountEnding: "8901"
  });
  
  const [creditBureauReporting, setCreditBureauReporting] = useState(true);
  
  const [rentPayments, setRentPayments] = useState([
    {
      id: "TXN-9081",
      date: "2026-06-01",
      amount: 150000,
      status: "Successful",
      propertyName: "Oakridge Premium Family Villa",
      method: "Simulated Stripe Card (•••• 4242)",
      receiptName: "Receipt_June_2026.txt"
    },
    {
      id: "TXN-8371",
      date: "2026-05-01",
      amount: 150000,
      status: "Successful",
      propertyName: "Oakridge Premium Family Villa",
      method: "Simulated Stripe Card (•••• 4242)",
      receiptName: "Receipt_May_2026.txt"
    },
    {
      id: "TXN-7634",
      date: "2026-04-01",
      amount: 150000,
      status: "Successful",
      propertyName: "Oakridge Premium Family Villa",
      method: "Simulated ACH Bank Transfer (•••• 8901)",
      receiptName: "Receipt_April_2026.txt"
    }
  ]);

  const [paymentForm, setPaymentForm] = useState({
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
    cardName: "",
    bankAccount: "",
    bankRouting: "",
    bankName: "",
    method: "card", // card or ach
    amount: "150000",
    isProcessing: false,
    successMessage: "",
    errorMessage: ""
  });

  // Maintenance Management State
  const [maintenanceTickets, setMaintenanceTickets] = useState([
    {
      id: "TKT-301",
      title: "Water seepage in bedroom ceiling",
      category: "Plumbing",
      severity: "High",
      status: "In Progress", // Submitted -> Assigned -> In Progress -> Completed
      date: "2026-06-25",
      description: "Moisture leak growing near the light fixture in the main bedroom. Looks like it needs urgent checking before the ceiling gets ruined.",
      attachments: ["ceiling_leak.jpg"]
    },
    {
      id: "TKT-192",
      title: "Inverter AC compressor rattling noise",
      category: "HVAC",
      severity: "Medium",
      status: "Completed",
      date: "2026-05-15",
      description: "AC is cooling well, but the outer compressor unit emits a high rattle sound upon starting up.",
      attachments: ["compressor_rattle.png"]
    }
  ]);

  const [ticketForm, setTicketForm] = useState({
    title: "",
    category: "Plumbing",
    severity: "Medium", // Low, Medium, High, Emergency
    description: "",
    fileNames: [] as string[],
    isSubmitting: false,
    success: false
  });

  const [emergencyAlertDispatched, setEmergencyAlertDispatched] = useState(false);

  // Document Vault State
  const [tenantDocuments, setTenantDocuments] = useState([
    {
      id: "doc-1",
      name: "DHA Residential Lease Agreement.pdf",
      type: "Lease Agreement",
      storage: "s3://proplog-tenant-vault-production/lease_jane_doe_signed.pdf",
      signed: false,
      dateAdded: "2026-06-21",
      size: "2.4 MB"
    },
    {
      id: "doc-2",
      name: "Property Move-In Inspection Report.pdf",
      type: "Inspection Report",
      storage: "s3://proplog-tenant-vault-production/inspection_report_q2.pdf",
      signed: true,
      dateAdded: "2026-06-22",
      size: "4.8 MB"
    },
    {
      id: "doc-3",
      name: "EFU Home Renters Liability Certificate.pdf",
      type: "Insurance Certificate",
      storage: "s3://proplog-tenant-vault-production/insurance_cert_jane_doe.pdf",
      signed: true,
      dateAdded: "2026-06-23",
      size: "1.2 MB"
    }
  ]);

  const [signModalOpen, setSignModalOpen] = useState(false);
  const [signName, setSignName] = useState("");
  const [signTypedText, setSignTypedText] = useState("");
  const [signType, setSignType] = useState("draw"); // draw or type
  const [signConsent, setSignConsent] = useState(false);
  const [isSigningProcess, setIsSigningProcess] = useState(false);

  const [docUploadState, setDocUploadState] = useState({
    isUploading: false,
    fileName: "",
    progress: 0,
    type: "Insurance Certificate"
  });

  // Communication / Announcements / Broadcast Tools
  const [announcements, setAnnouncements] = useState([
    {
      id: "ann-1",
      title: "⚠️ Scheduled Sector B Main Water Pump Isolation",
      text: "Please be advised that the society's water authority will carry out routine preventative pipeline isolation on Sunday, June 28th, from 09:00 AM to 01:00 PM. High pressure pumps will be offline. Please store water.",
      date: "2026-06-26 18:30",
      sender: "Kamran Shah (Property Manager)",
      badge: "Maintenance",
      isNew: true
    },
    {
      id: "ann-2",
      title: "⚡ Gated Society Security & Fire alarm tests",
      text: "The security management squad will run brief sound diagnostics on fire sirens and laser alarms in our residential avenue next Wednesday starting 10:00 AM. No evacuation needed.",
      date: "2026-06-24 10:15",
      sender: "DHA Administrative Head Office",
      badge: "Security",
      isNew: false
    }
  ]);

  // Toast and push notification trigger state
  const [pushNotification, setPushNotification] = useState<{
    show: boolean;
    title: string;
    body: string;
    icon: string;
  } | null>(null);

  const triggerPush = (title: string, body: string, icon = "bell") => {
    setPushNotification({
      show: true,
      title,
      body,
      icon
    });
    setTimeout(() => {
      setPushNotification(null);
    }, 5000);
  };

  const downloadReceipt = (payment: any) => {
    const content = `=====================================================
          PROPLOG RENTAL PAYMENT RECEIPT
=====================================================
Receipt ID:       ${payment.id}
Date Paid:        ${payment.date}
Property Name:    ${payment.propertyName}
Tenant Name:      ${profileData.fullName}
Payment Method:   ${payment.method}
Amount Paid:      ${formatPKR(payment.amount)}
Status:           ${payment.status}

Transaction Status: SECURED & CLEARED
Reported to Credit Bureau (Experian RentBureau): Yes

Thank you for your prompt rent payment!
=====================================================`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Receipt_${payment.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    triggerPush("Receipt Downloaded", `Saved receipt ${payment.id} successfully!`, "download");
  };

  // High fidelity application state (Phase 3 & 4) - Consumed from global AppContext
  const { applications, addApplication, rentalProperties } = useApp();

  // Selected property for applying
  const [selectedPropToApply, setSelectedPropToApply] = useState<RentalProperty | null>(null);
  
  // Custom states for Tenant Application Form Integration
  const [showStartNewSelector, setShowStartNewSelector] = useState(false);
  const [selectedAppForView, setSelectedAppForView] = useState<any | null>(null);
  const [savedDraft, setSavedDraft] = useState<any | null>(null);
  const [viewTab, setViewTab] = useState<"reqs" | "personal" | "financial" | "documents">("reqs");
  const [propSearchQuery, setPropSearchQuery] = useState("");

  // Sync draft from localStorage
  useEffect(() => {
    const draftKey = `pl_draft_app_${currentUser?.id || "anonymous"}`;
    const localDraft = localStorage.getItem(draftKey);
    if (localDraft) {
      try {
        setSavedDraft(JSON.parse(localDraft));
      } catch (e) {
        console.error("Error parsing local draft", e);
      }
    } else {
      setSavedDraft(null);
    }
  }, [activeTab, selectedPropToApply]);

  const handleContinueDraft = () => {
    if (savedDraft && savedDraft.formData) {
      const propId = savedDraft.formData.propertyId || "rent-1";
      const matched = rentalProperties.find(p => p.id === propId) || rentalProperties[0];
      setSelectedPropToApply(matched);
      triggerPush("Draft Loaded", "Resuming your encrypted 13-section application progress.", "check");
    }
  };

  const handleDiscardDraft = () => {
    const draftKey = `pl_draft_app_${currentUser?.id || "anonymous"}`;
    localStorage.removeItem(draftKey);
    setSavedDraft(null);
    triggerPush("Draft Cleared", "The application draft has been deleted from cache.", "trash");
  };

  // Favorites state (Syncing with Discovery)
  const [favorites, setFavorites] = useState<RentalProperty[]>([]);

  // Simulated Chat state (Phase 5)
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "conv-1",
      managerName: "Kamran Shah",
      propertyName: "Oakridge Premium Family Villa",
      lastMessage: "I received your bank verification statement. I will forward it to the owner shortly.",
      timestamp: "10:32 AM",
      unread: true,
      messages: [
        { id: "m1", sender: "tenant", text: "Salam Alaikum Kamran, is the security deposit negotiable?", timestamp: "Yesterday" },
        { id: "m2", sender: "manager", text: "Walaikum Salam Jane, standard is 2 months, but we can structure a 1-month advance plan if your employment letter checks out.", timestamp: "Yesterday" },
        { id: "m3", sender: "tenant", text: "Wonderful. I have uploaded my employment letter and bank statements in the portal.", timestamp: "10:15 AM" },
        { id: "m4", sender: "manager", text: "I received your bank verification statement. I will forward it to the owner shortly.", timestamp: "10:32 AM" }
      ]
    },
    {
      id: "conv-2",
      managerName: "Yousuf Khan",
      propertyName: "DHA Executive Penthouse",
      lastMessage: "The keys are with the gate security. You can visit anytime this evening.",
      timestamp: "Tuesday",
      unread: false,
      messages: [
        { id: "m5", sender: "tenant", text: "Hello Yousuf, can we schedule a tour of the penthouse?", timestamp: "Monday" },
        { id: "m6", sender: "manager", text: "The keys are with the gate security. You can visit anytime this evening.", timestamp: "Tuesday" }
      ]
    }
  ]);

  const [selectedConvId, setSelectedConvId] = useState<string>("conv-1");
  const [typedMessage, setTypedMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // To-do Checklist state
  const [todoList, setTodoList] = useState([
    { id: "todo-1", text: "Verify primary email address", completed: true },
    { id: "todo-2", text: "Complete Tenant Preferences Profile", completed: true },
    { id: "todo-3", text: "Upload front & back copy of CNIC", completed: false },
    { id: "todo-4", text: "Upload latest 3 months salary slip or bank statement", completed: false },
    { id: "todo-5", text: "Digitally sign the general terms authorization", completed: false }
  ]);



  // Profile preferences (Phase 7)
  const [profileData, setProfileData] = useState({
    fullName: currentUser?.full_name || "Jane Doe",
    email: currentUser?.email || "tenant@propertylog.com",
    phone: currentUser?.phone || "+92 300 1234567",
    city: "Lahore",
    preferredBudget: 150000,
    furnishingPref: "fully",
    familySize: 3,
    preferredMoveIn: "2026-07-01"
  });

  // Load favorites from local storage
  useEffect(() => {
    const savedFavIds = localStorage.getItem("favorites");
    let favList: RentalProperty[] = [];
    if (savedFavIds) {
      try {
        const ids = JSON.parse(savedFavIds) as string[];
        favList = rentalProperties.filter(p => ids.includes(p.id));
      } catch (e) {
        console.error(e);
      }
    }
    // If empty, pre-populate with two properties to make the UI look premium
    if (favList.length === 0) {
      favList = rentalProperties.slice(0, 2);
    }
    setFavorites(favList);
  }, [rentalProperties]);

  const handleApplyFromFavorites = (property: RentalProperty) => {
    setSelectedPropToApply(property);
  };

  const handleApplicationSubmit = (appData: any) => {
    addApplication(appData);
    setSelectedPropToApply(null);
    setActiveTab("applications");
    // Tick off the checklist items
    setTodoList(prev => prev.map(t => {
      if (t.id === "todo-3" || t.id === "todo-4" || t.id === "todo-5") {
        return { ...t, completed: true };
      }
      return t;
    }));
  };

  const handleToggleTodo = (id: string) => {
    setTodoList(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleSendMessage = (textToSend?: string) => {
    const content = textToSend || typedMessage;
    if (!content.trim()) return;

    const messageText = content;
    setTypedMessage("");

    // Add tenant message
    setConversations(prev => prev.map(c => {
      if (c.id === selectedConvId) {
        const updatedMsgs = [
          ...c.messages,
          {
            id: `m-tenant-${Date.now()}`,
            sender: "tenant",
            text: messageText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ];
        return {
          ...c,
          lastMessage: messageText,
          timestamp: "Just Now",
          messages: updatedMsgs
        };
      }
      return c;
    }));

    // Trigger dynamic reply
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      let reply = "I am on a field listing right now, but I have flagged your query. Let me review your profile and I will call you.";
      
      const currentConv = conversations.find(c => c.id === selectedConvId);
      const managerName = currentConv?.managerName || "Manager";

      if (messageText.toLowerCase().includes("pets")) {
        reply = `Yes, ${managerName} here. Pets are perfectly allowed in this block, provided they are registered with the community union office. No extra pet deposit is needed.`;
      } else if (messageText.toLowerCase().includes("tour") || messageText.toLowerCase().includes("visit") || messageText.toLowerCase().includes("sunday")) {
        reply = `Certainly! I have scheduled a slot this coming Sunday between 2:00 PM and 4:00 PM. Please bring your CNIC card for entry verification at the gated society entrance.`;
      } else if (messageText.toLowerCase().includes("deposit") || messageText.toLowerCase().includes("security")) {
        reply = `We can definitely discuss terms. Since your corporate verification from Systems Limited looks solid, the owner is willing to accept a 1-month deposit instead of 2.`;
      } else if (messageText.toLowerCase().includes("gas") || messageText.toLowerCase().includes("load shedding")) {
        reply = `This property is equipped with a hybrid solar inverter and gas connection is fully functional. Load shedding won't affect basic appliances.`;
      }

      setConversations(prev => prev.map(c => {
        if (c.id === selectedConvId) {
          const updatedMsgs = [
            ...c.messages,
            {
              id: `m-manager-${Date.now()}`,
              sender: "manager",
              text: reply,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ];
          return {
            ...c,
            lastMessage: reply,
            timestamp: "Just Now",
            unread: true,
            messages: updatedMsgs
          };
        }
        return c;
      }));
    }, 1500);
  };

  const activeConv = conversations.find(c => c.id === selectedConvId);

  // Filter recommendations based on tenant city & budget
  const recommendations = rentalProperties.filter(p => 
    p.city.toLowerCase() === profileData.city.toLowerCase() && 
    p.price <= profileData.preferredBudget * 1.5
  ).slice(0, 3);

  // Count unread chats
  const unreadCount = conversations.filter(c => c.unread).length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-800">
      {/* LEFT SIDEBAR FOR PORTAL */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col justify-between shrink-0 border-r border-slate-800">
        <div className="flex flex-col">
          {/* Brand header */}
          <div className="h-16 flex items-center justify-between px-6 bg-slate-950 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                P
              </div>
              <span className="font-display font-extrabold text-white text-base tracking-tight">
                PROPLOG<span className="text-blue-500"> TENANT</span>
              </span>
            </div>
          </div>

          {/* Sidebar Nav links */}
          <nav className="p-4 space-y-1">
            <button
              onClick={() => { setActiveTab("overview"); setSelectedPropToApply(null); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                activeTab === "overview"
                  ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                  : "border-transparent text-slate-400 hover:bg-slate-800/50 hover:text-white"
              }`}
            >
              <Home className="h-4.5 w-4.5" />
              <span>Portal Dashboard</span>
            </button>

            <button
              onClick={() => { setActiveTab("applications"); setSelectedPropToApply(null); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                activeTab === "applications"
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : "border-transparent text-slate-400 hover:bg-slate-800/50 hover:text-white"
              }`}
            >
              <FileText className="h-4.5 w-4.5 text-emerald-400" />
              <div className="flex-1 flex justify-between items-center">
                <span>Tenant Application Form</span>
                <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-emerald-400 font-mono">
                  {applications.length}
                </span>
              </div>
            </button>

            <button
              onClick={() => { setActiveTab("favorites"); setSelectedPropToApply(null); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                activeTab === "favorites"
                  ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                  : "border-transparent text-slate-400 hover:bg-slate-800/50 hover:text-white"
              }`}
            >
              <Heart className="h-4.5 w-4.5 text-rose-400" />
              <div className="flex-1 flex justify-between items-center">
                <span>Saved Favorites</span>
                <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-mono">
                  {favorites.length}
                </span>
              </div>
            </button>

            <button
              onClick={() => { setActiveTab("messages"); setSelectedPropToApply(null); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                activeTab === "messages"
                  ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                  : "border-transparent text-slate-400 hover:bg-slate-800/50 hover:text-white"
              }`}
            >
              <MessageSquare className="h-4.5 w-4.5 text-blue-400" />
              <div className="flex-1 flex justify-between items-center">
                <span>Manager Chats</span>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded bg-rose-600 text-[10px] text-white font-extrabold animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </div>
            </button>

            <button
              onClick={() => { setActiveTab("rent"); setSelectedPropToApply(null); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                activeTab === "rent"
                  ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                  : "border-transparent text-slate-400 hover:bg-slate-800/50 hover:text-white"
              }`}
            >
              <DollarSign className="h-4.5 w-4.5 text-emerald-400" />
              <span>Rent &amp; Financials</span>
            </button>

            <button
              onClick={() => { setActiveTab("maintenance"); setSelectedPropToApply(null); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                activeTab === "maintenance"
                  ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                  : "border-transparent text-slate-400 hover:bg-slate-800/50 hover:text-white"
              }`}
            >
              <Wrench className="h-4.5 w-4.5 text-cyan-400" />
              <div className="flex-1 flex justify-between items-center">
                <span>Maintenance</span>
                <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-amber-400 font-mono font-bold">
                  {maintenanceTickets.filter(t => t.status !== "Completed").length} Active
                </span>
              </div>
            </button>

            <button
              onClick={() => { setActiveTab("documents"); setSelectedPropToApply(null); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                activeTab === "documents"
                  ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                  : "border-transparent text-slate-400 hover:bg-slate-800/50 hover:text-white"
              }`}
            >
              <FileCheck className="h-4.5 w-4.5 text-indigo-400" />
              <div className="flex-1 flex justify-between items-center">
                <span>Document Vault</span>
                {tenantDocuments.some(d => !d.signed) && (
                  <span className="px-1.5 py-0.5 rounded bg-rose-600 text-[10px] text-white font-extrabold animate-pulse">
                    Action
                  </span>
                )}
              </div>
            </button>

            <button
              onClick={() => { setActiveTab("profile"); setSelectedPropToApply(null); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                activeTab === "profile"
                  ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                  : "border-transparent text-slate-400 hover:bg-slate-800/50 hover:text-white"
              }`}
            >
              <User className="h-4.5 w-4.5" />
              <span>Profile Preferences</span>
            </button>
          </nav>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-9 w-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold shadow-lg shadow-blue-600/10">
              {profileData.fullName.charAt(0)}
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-white block truncate">{profileData.fullName}</span>
              <span className="text-[10px] text-slate-500 block truncate">{profileData.email}</span>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full text-center py-2 bg-rose-950/20 hover:bg-rose-900/30 text-rose-400 border border-rose-900/20 text-[10px] font-bold rounded-xl transition-all"
          >
            Exit Tenant Workspace
          </button>
        </div>
      </aside>

      {/* RIGHT WORKSPACE PANELS */}
      <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto max-h-screen">
        {/* HEADER BAR */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/60">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600 font-mono">Verified Tenant Portal</span>
            <h1 className="font-display font-black text-2xl tracking-tight text-slate-900">
              {activeTab === "overview" && `Welcome Back, ${profileData.fullName.split(" ")[0]}`}
              {activeTab === "applications" && "Tenant Application Form"}
              {activeTab === "favorites" && "Your Saved Homes"}
              {activeTab === "messages" && "Landlord Messaging Hub"}
              {activeTab === "profile" && "Tenant Profile & Preferences"}
              {activeTab === "rent" && "Rent & Financial Hub"}
              {activeTab === "maintenance" && "Maintenance Dispatch Center"}
              {activeTab === "documents" && "Secure Document Repository"}
            </h1>
            <p className="text-xs text-slate-500">
              {activeTab === "overview" && "Submit verification details, track your active leases, or talk with land managers."}
              {activeTab === "applications" && "Submit digital rental applications, resume draft forms, track progress, and communicate with property managers."}
              {activeTab === "favorites" && "Compare pre-selected listings or submit a formal application instantly."}
              {activeTab === "messages" && "Instant secure correspondence with verification templates and guidelines."}
              {activeTab === "profile" && "Fine-tune target criteria, furnishing priorities, and verify CNIC."}
              {activeTab === "rent" && "Pay secure monthly rent via simulated Stripe / ACH, configure auto-draft, and build credit history."}
              {activeTab === "maintenance" && "File requests with image uploads, monitor real-time contractor dispatches, and signal emergency items."}
              {activeTab === "documents" && "Access cloud-secured contracts, move-in checklists, and execute DocuSign lease agreements."}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onBrowseRentals}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              Browse Live Rentals
            </button>
          </div>
        </header>

        {/* 13-SECTION APPLICATION WIZARD LAUNCHED STATE */}
        {selectedPropToApply ? (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSelectedPropToApply(null)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
              >
                &larr; Back to Portal
              </button>
            </div>
            <TenantApplicationForm
              property={selectedPropToApply}
              onSubmitSuccess={handleApplicationSubmit}
              onCancel={() => setSelectedPropToApply(null)}
              currentUser={currentUser}
            />
          </div>
        ) : (
          <>
            {/* OVERVIEW PANEL */}
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column (Main Overview content) */}
                <div className="lg:col-span-2 space-y-6">
                  {/* KPI Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-center gap-4">
                      <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                        <FileText className="h-6 w-6" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Active Apps</span>
                        <span className="text-xl font-extrabold text-slate-900">{applications.length} Submitted</span>
                      </div>
                    </div>

                    <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-center gap-4">
                      <div className="p-3 bg-rose-50 text-rose-500 rounded-xl">
                        <Heart className="h-6 w-6" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Shortlists</span>
                        <span className="text-xl font-extrabold text-slate-900">{favorites.length} Properties</span>
                      </div>
                    </div>

                    <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-center gap-4">
                      <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                        <MessageSquare className="h-6 w-6" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Direct Chats</span>
                        <span className="text-xl font-extrabold text-slate-900">{unreadCount} Unread</span>
                      </div>
                    </div>
                  </div>

                  {/* Active Application Status Tracker */}
                  <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Application Live Tracker</h3>
                      <button 
                        onClick={() => setActiveTab("applications")} 
                        className="text-[11px] font-bold text-blue-600 hover:underline"
                      >
                        All Applications
                      </button>
                    </div>

                    {applications.length === 0 ? (
                      <div className="text-center py-6 text-slate-400 text-xs">
                        No submitted applications yet. Shortlist properties and click "Apply" to begin verification.
                      </div>
                    ) : (
                      applications.map(app => (
                        <div key={app.id} className="space-y-4">
                          <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl">
                            <div>
                              <h4 className="text-xs font-bold text-slate-900">{app.propertyName}</h4>
                              <span className="text-[10px] text-slate-500 font-mono">Manager: {app.managerName} &bull; Applied: {app.appliedDate}</span>
                            </div>
                            <span className="px-2.5 py-1 rounded-full bg-blue-50 text-[10px] font-bold text-blue-600 border border-blue-100">
                              {app.status}
                            </span>
                          </div>

                          {/* 5-Stage Timeline */}
                          <div className="grid grid-cols-5 gap-1.5 relative pt-4">
                            {[
                              { label: "Submitted", score: 20 },
                              { label: "Verified", score: 40 },
                              { label: "Ref Check", score: 60 },
                              { label: "Approved", score: 80 },
                              { label: "Contract Signed", score: 100 }
                            ].map((stage, idx) => {
                              const active = app.progress >= stage.score;
                              return (
                                <div key={idx} className="text-center space-y-2">
                                  <div className={`h-1.5 rounded-full ${active ? "bg-blue-600" : "bg-slate-200"}`} />
                                  <span className={`text-[9px] font-bold block truncate ${active ? "text-blue-600" : "text-slate-400"}`}>
                                    {stage.label}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Recommended Listings (Discovery Match) */}
                  <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-yellow-500" /> Recommended Properties ({profileData.city})
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {recommendations.map(prop => (
                        <div key={prop.id} className="border border-slate-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                          <img src={prop.images[0]} alt={prop.title} className="h-28 w-full object-cover" />
                          <div className="p-3 space-y-1.5">
                            <span className="text-[8px] font-extrabold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                              {prop.property_type}
                            </span>
                            <h4 className="text-xs font-bold text-slate-800 truncate">{prop.title}</h4>
                            <div className="flex justify-between items-center text-[10px] text-slate-500">
                              <span>{prop.area}</span>
                              <span className="font-extrabold text-slate-900">{formatPKR(prop.price)}/mo</span>
                            </div>
                            <button
                              onClick={() => handleApplyFromFavorites(prop)}
                              className="w-full text-center py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[10px] font-bold transition-colors"
                            >
                              Apply for Lease
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column (To-do checklist & Quick Alerts) */}
                <div className="space-y-6">
                  {/* To-Do Checklist */}
                  <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
                    <div className="border-b border-slate-100 pb-3">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Verification Checklist</h3>
                      <span className="text-[10px] text-slate-400">Complete items to fast-track approvals by DHA Society.</span>
                    </div>

                    <div className="space-y-2.5">
                      {todoList.map(item => (
                        <div 
                          key={item.id} 
                          onClick={() => handleToggleTodo(item.id)}
                          className="flex items-start gap-3 p-2.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl cursor-pointer transition-colors"
                        >
                          <div className={`h-4.5 w-4.5 rounded-md flex items-center justify-center border shrink-0 mt-0.5 transition-colors ${
                            item.completed 
                              ? "bg-blue-600 border-blue-600 text-white" 
                              : "border-slate-300 bg-white"
                          }`}>
                            {item.completed && <Check className="h-3 w-3 stroke-[3]" />}
                          </div>
                          <span className={`text-[11px] font-medium leading-tight ${item.completed ? "line-through text-slate-400" : "text-slate-700"}`}>
                            {item.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Profile Summary Widget */}
                  <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] opacity-10" />
                    <div className="relative z-10 space-y-4 text-xs">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[9px] font-extrabold uppercase tracking-widest text-blue-400">Verification Profile</span>
                          <h4 className="text-sm font-bold text-white mt-1">CNIC Status: Pending Upload</h4>
                        </div>
                        <ShieldAlert className="h-5 w-5 text-amber-400 animate-pulse" />
                      </div>
                      <p className="text-[10px] text-slate-400 leading-normal">
                        Your basic profile is updated. Complete verification to bypass physical interviews and land direct lease assignments.
                      </p>
                      <button
                        onClick={() => setActiveTab("profile")}
                        className="w-full text-center py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-[10px] font-bold text-white transition-all shadow shadow-blue-600/20"
                      >
                        Complete Identification
                      </button>
                    </div>
                  </div>

                  {/* Property Broadcasts Panel */}
                  <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-1.5">
                        <Megaphone className="h-4.5 w-4.5 text-blue-600" />
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Property Announcements</h3>
                      </div>
                      <span className="h-2 w-2 bg-rose-600 rounded-full animate-ping" />
                    </div>

                    <div className="space-y-3">
                      {announcements.map((ann) => (
                        <div key={ann.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5 relative">
                          <div className="flex justify-between items-start">
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-widest ${
                              ann.badge === "Maintenance" ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"
                            }`}>
                              {ann.badge}
                            </span>
                            <span className="text-[8px] font-mono text-slate-400">{ann.date}</span>
                          </div>
                          <h4 className="text-[11px] font-bold text-slate-900">{ann.title}</h4>
                          <p className="text-[10px] text-slate-500 leading-normal">{ann.text}</p>
                          <div className="flex justify-between items-center text-[9px] text-slate-400 pt-1.5 border-t border-slate-100/60">
                            <span>By: {ann.sender}</span>
                            <button 
                              onClick={() => {
                                triggerPush("Announcement Acknowledged", "You have acknowledged the property manager's bulletin.");
                              }}
                              className="text-blue-600 hover:text-blue-800 font-bold hover:underline"
                            >
                              Mark Read
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* APPLICATIONS TAB */}
            {activeTab === "applications" && (
              <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                
                {/* STATE 2: START NEW APPLICATION SELECTOR */}
                {showStartNewSelector ? (
                  <div className="space-y-6 animate-fade-in">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                      <div>
                        <button
                          onClick={() => setShowStartNewSelector(false)}
                          className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 transition-colors"
                        >
                          <ArrowLeft className="h-4 w-4" />
                          Back to Applications Dashboard
                        </button>
                        <h3 className="text-base font-black text-slate-900 mt-2">Select a Target Property</h3>
                        <p className="text-xs text-slate-500">Pick a property to pre-fill standard DHA housing association guidelines & lease requirements.</p>
                      </div>
                    </div>

                    {/* Search and Filters */}
                    <div className="relative">
                      <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search properties by title, city, province, or landmark..."
                        value={propSearchQuery}
                        onChange={(e) => setPropSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500 focus:bg-white transition-all text-slate-800"
                      />
                    </div>

                    {/* Properties Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {rentalProperties.filter(p =>
                        p.title.toLowerCase().includes(propSearchQuery.toLowerCase()) ||
                        p.city.toLowerCase().includes(propSearchQuery.toLowerCase()) ||
                        p.area.toLowerCase().includes(propSearchQuery.toLowerCase())
                      ).map((prop) => {
                        const isFav = favorites.some(f => f.id === prop.id);
                        return (
                          <div key={prop.id} className="border border-slate-100 bg-slate-50/50 hover:bg-slate-50 rounded-2xl p-4 flex gap-4 transition-all hover:border-slate-200">
                            <div className="h-20 w-24 bg-slate-200 rounded-xl overflow-hidden flex-shrink-0 relative">
                              <img
                                src={prop.images?.[0] || "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80"}
                                alt={prop.title}
                                referrerPolicy="no-referrer"
                                className="h-full w-full object-cover"
                              />
                              {isFav && (
                                <span className="absolute top-1 left-1.5 bg-rose-500 text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-full">
                                  Shortlisted
                                </span>
                              )}
                            </div>
                            <div className="flex-1 flex flex-col justify-between min-w-0">
                              <div>
                                <h4 className="text-xs font-bold text-slate-900 truncate">{prop.title}</h4>
                                <span className="text-[10px] text-slate-500 block truncate">{prop.area}, {prop.city}</span>
                                <span className="text-[10px] font-mono text-emerald-600 font-bold mt-1 block">
                                  {formatPKR(prop.price)}/month
                                </span>
                              </div>
                              <button
                                onClick={() => {
                                  setSelectedPropToApply(prop);
                                  setShowStartNewSelector(false);
                                  triggerPush("Wizard Launched", `Started 13-section rental application for ${prop.title}.`, "check");
                                }}
                                className="w-full mt-2 py-1.5 bg-[#1B8A3F] hover:bg-[#156e31] text-white rounded-lg text-[10px] font-extrabold tracking-wider uppercase transition-all flex items-center justify-center gap-1"
                              >
                                <Play className="h-3 w-3 fill-white" /> Start 13-Step Application
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : selectedAppForView ? (
                  <div className="space-y-6 animate-fade-in">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <div>
                        <button
                          onClick={() => setSelectedAppForView(null)}
                          className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 transition-colors"
                        >
                          <ArrowLeft className="h-4 w-4" />
                          Back to Applications Dashboard
                        </button>
                        <h3 className="text-base font-black text-slate-900 mt-2">
                          Application Summary &bull; {selectedAppForView.id}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {selectedAppForView.propertyName} &bull; DHA Registered Reference Code
                        </p>
                      </div>

                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                        selectedAppForView.status === "Approved"
                          ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                          : selectedAppForView.status === "Rejected"
                          ? "bg-rose-50 border-rose-200 text-rose-600"
                          : "bg-amber-50 border-amber-200 text-amber-600"
                      }`}>
                        Status: {selectedAppForView.status}
                      </span>
                    </div>

                    {/* Horizontal view sub-tabs */}
                    <div className="flex border-b border-slate-100 gap-2 overflow-x-auto pb-1">
                      {[
                        { id: "reqs", label: "Property & Lease Reqs" },
                        { id: "personal", label: "Personal & Occupants" },
                        { id: "financial", label: "Financial & References" },
                        { id: "documents", label: "Documents & Signature" }
                      ].map((tb) => (
                        <button
                          key={tb.id}
                          onClick={() => setViewTab(tb.id as any)}
                          className={`px-4 py-2 text-xs font-bold whitespace-nowrap border-b-2 transition-all ${
                            viewTab === tb.id
                              ? "border-[#1B8A3F] text-[#1B8A3F]"
                              : "border-transparent text-slate-400 hover:text-slate-700"
                          }`}
                        >
                          {tb.label}
                        </button>
                      ))}
                    </div>

                    {/* View Details Contents */}
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-6">
                      
                      {/* TAB 1: PROPERTY & LEASE */}
                      {viewTab === "reqs" && (
                        <div className="space-y-4">
                          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Target Leasing Specifications</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm">
                              <span className="text-[10px] text-slate-400 block font-medium">Property Category</span>
                              <span className="text-xs font-bold text-slate-800">{selectedAppForView.details?.propType || "Residential House"}</span>
                            </div>
                            <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm">
                              <span className="text-[10px] text-slate-400 block font-medium">Beds / Baths</span>
                              <span className="text-xs font-bold text-slate-800">{selectedAppForView.details?.bedrooms || 3} Beds &bull; {selectedAppForView.details?.bathrooms || 3} Baths</span>
                            </div>
                            <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm">
                              <span className="text-[10px] text-slate-400 block font-medium">Rent Budget Plan</span>
                              <span className="text-xs font-bold text-emerald-600 font-mono">{formatPKR(selectedAppForView.price || 150000)}/mo</span>
                            </div>
                            <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm">
                              <span className="text-[10px] text-slate-400 block font-medium">Preferred Location</span>
                              <span className="text-xs font-bold text-slate-800">{selectedAppForView.details?.preferredAreas || "DHA Gated Sector"}</span>
                            </div>
                            <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm">
                              <span className="text-[10px] text-slate-400 block font-medium">Target Lease Duration</span>
                              <span className="text-xs font-bold text-slate-800">{selectedAppForView.details?.leaseDuration || "12 Months"}</span>
                            </div>
                            <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm">
                              <span className="text-[10px] text-slate-400 block font-medium">Planned Move-In Date</span>
                              <span className="text-xs font-bold text-slate-800">{selectedAppForView.details?.moveInDate || "2026-07-15"}</span>
                            </div>
                          </div>

                          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-3">
                            <h5 className="text-[11px] font-bold text-slate-700 uppercase">Requested Utilities &amp; Infrastructure</h5>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                              {[
                                { key: "acRequired", label: "Air Conditioning" },
                                { key: "upsRequired", label: "Inverter / UPS Backup" },
                                { key: "solarRequired", label: "Solar Energy System" },
                                { key: "generatorRequired", label: "Standby Generator" },
                                { key: "parkingRequired", label: "Car Parking Port" },
                                { key: "waterFilterRequired", label: "RO Water Filter" },
                                { key: "gasRequired", label: "Natural Sui Gas Connection" },
                                { key: "internetRequired", label: "High-Speed Fiber Optic" }
                              ].map((item) => {
                                const val = selectedAppForView.details?.[item.key];
                                const active = val === "Yes" || val === true;
                                return (
                                  <div key={item.key} className={`p-2 rounded-lg border text-[10px] font-medium flex items-center gap-1.5 ${
                                    active ? "bg-emerald-50/40 border-emerald-100 text-emerald-800" : "bg-slate-50/50 border-slate-100 text-slate-400"
                                  }`}>
                                    <Check className={`h-3 w-3 ${active ? "text-emerald-600" : "text-slate-300"}`} />
                                    {item.label}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* TAB 2: PERSONAL */}
                      {viewTab === "personal" && (
                        <div className="space-y-4">
                          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Demographic &amp; Primary Contact Data</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm">
                              <span className="text-[10px] text-slate-400 block font-medium">Primary Applicant Name</span>
                              <span className="text-xs font-bold text-slate-800">{selectedAppForView.details?.fullName || "Amna Ch Shams"}</span>
                            </div>
                            <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm">
                              <span className="text-[10px] text-slate-400 block font-medium">Father / Husband Name</span>
                              <span className="text-xs font-bold text-slate-800">{selectedAppForView.details?.fatherHusbandName || "Shams-ud-din"}</span>
                            </div>
                            <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm">
                              <span className="text-[10px] text-rose-400 block font-medium font-mono flex items-center gap-1">
                                <Lock className="h-2.5 w-2.5" /> CNIC Card (Symmetrically Decrypted)
                              </span>
                              <span className="text-xs font-bold text-slate-800 font-mono">
                                {decryptAES256(selectedAppForView.details?.cnic || "") || "42101-9283712-1"}
                              </span>
                            </div>
                            <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm">
                              <span className="text-[10px] text-slate-400 block font-medium">Date of Birth</span>
                              <span className="text-xs font-bold text-slate-800">{selectedAppForView.details?.dob || "1994-11-03"}</span>
                            </div>
                            <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm">
                              <span className="text-[10px] text-rose-400 block font-medium font-mono flex items-center gap-1">
                                <Lock className="h-2.5 w-2.5" /> Mobile Contact
                              </span>
                              <span className="text-xs font-bold text-slate-800 font-mono">
                                {decryptAES256(selectedAppForView.details?.mobileNumber || "") || "0300-1234567"}
                              </span>
                            </div>
                            <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm">
                              <span className="text-[10px] text-slate-400 block font-medium">Email Address</span>
                              <span className="text-xs font-bold text-slate-800">{selectedAppForView.details?.emailAddress || currentUser?.email || "amnachshams@gmail.com"}</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-2">
                              <h5 className="text-[11px] font-bold text-slate-700 uppercase">Emergency Correspondence Contact</h5>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                  <span className="text-[10px] text-slate-400 block">Name &amp; Relationship</span>
                                  <span className="font-bold text-slate-800">{selectedAppForView.details?.emergencyContactName || "Bilal Shams"} ({selectedAppForView.details?.emergencyContactRelationship || "Brother"})</span>
                                </div>
                                <div>
                                  <span className="text-[10px] text-slate-400 block">Contact Phone</span>
                                  <span className="font-bold font-mono text-slate-800">{selectedAppForView.details?.emergencyContactPhone || "0321-9876543"}</span>
                                </div>
                              </div>
                            </div>

                            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-2">
                              <h5 className="text-[11px] font-bold text-slate-700 uppercase">Household Occupancy</h5>
                              <div className="grid grid-cols-3 gap-2 text-xs">
                                <div>
                                  <span className="text-[10px] text-slate-400 block">Total Cohabitants</span>
                                  <span className="font-bold text-slate-800">{selectedAppForView.details?.totalOccupants || 4} Members</span>
                                </div>
                                <div>
                                  <span className="text-[10px] text-slate-400 block">Domestic Pets</span>
                                  <span className="font-bold text-slate-800">{selectedAppForView.details?.petsInHousehold || "No"}</span>
                                </div>
                                <div>
                                  <span className="text-[10px] text-slate-400 block">Vehicles &amp; Parking</span>
                                  <span className="font-bold text-slate-800">{selectedAppForView.details?.vehiclesCount || 2} Car(s)</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* TAB 3: FINANCIAL & REFS */}
                      {viewTab === "financial" && (
                        <div className="space-y-4">
                          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Employment Details &amp; References</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm">
                              <span className="text-[10px] text-rose-400 block font-medium font-mono flex items-center gap-1">
                                <Lock className="h-2.5 w-2.5" /> Net Monthly Income
                              </span>
                              <span className="text-xs font-bold text-emerald-600 font-mono">
                                {formatPKR(Number(decryptAES256(selectedAppForView.details?.monthlyIncome || "")) || (selectedAppForView.price * 3))}
                              </span>
                            </div>
                            <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm">
                              <span className="text-[10px] text-slate-400 block font-medium">Occupation &amp; Title</span>
                              <span className="text-xs font-bold text-slate-800">{selectedAppForView.details?.occupation || "Senior Software Architect"}</span>
                            </div>
                            <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm">
                              <span className="text-[10px] text-slate-400 block font-medium">Employer / Organization</span>
                              <span className="text-xs font-bold text-slate-800">{selectedAppForView.details?.employerName || "TechLogix Global"}</span>
                            </div>
                          </div>

                          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-3">
                            <h5 className="text-[11px] font-bold text-slate-700 uppercase border-b border-slate-50 pb-2">Verification References</h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                              <div className="space-y-1">
                                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Primary Landlord Reference</span>
                                <p className="font-bold text-slate-800">{selectedAppForView.details?.ref1Name || "Zubair Hashmi"} (Former Owner)</p>
                                <p className="text-[10px] text-slate-500">Contact: {selectedAppForView.details?.ref1Contact || "0312-4567890"}</p>
                                <p className="text-[10px] text-slate-500 leading-tight">Property Address: {selectedAppForView.details?.ref1PropertyAddress || "House 12-A, DHA Phase 3, Lahore"}</p>
                              </div>
                              <div className="space-y-1">
                                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Employer Verification Reference</span>
                                <p className="font-bold text-slate-800">{selectedAppForView.details?.ref2Name || "Nadia Malik"} (Tech HR Lead)</p>
                                <p className="text-[10px] text-slate-500">Contact: {selectedAppForView.details?.ref2Contact || "0333-1212343"}</p>
                                <p className="text-[10px] text-slate-500">Designation: {selectedAppForView.details?.ref2Designation || "Director Human Resources"}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* TAB 4: DOCS & SIGNATURES */}
                      {viewTab === "documents" && (
                        <div className="space-y-4">
                          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Secure Document Repository &amp; Signatures</h4>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-3">
                              <h5 className="text-[11px] font-bold text-slate-700 uppercase">Government ID &amp; Financial Slips</h5>
                              <div className="space-y-2">
                                {Object.entries(selectedAppForView.documents).map(([key, name]) => (
                                  <div key={key} className="flex items-center justify-between text-[11px] bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                    <span className="font-bold text-slate-600 font-mono text-[10px] uppercase">{key}</span>
                                    <span className="text-slate-500 truncate max-w-[150px]">{String(name)}</span>
                                    <span className="text-[9px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-extrabold font-mono uppercase">
                                      Stored S3
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between">
                              <div>
                                <h5 className="text-[11px] font-bold text-slate-700 uppercase">E-Signature Authentication</h5>
                                <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                                  Digitally signed in conformity with PECA (Prevention of Electronic Crimes Act) bylaws. Timestamp recorded.
                                </p>
                              </div>
                              
                              <div className="mt-4 border border-slate-200 border-dashed rounded-xl p-3 bg-slate-50 flex flex-col items-center justify-center min-h-[100px] relative">
                                {selectedAppForView.signature ? (
                                  <img
                                    src={selectedAppForView.signature}
                                    alt="Client Digital Signature"
                                    className="max-h-[80px] object-contain"
                                    referrerPolicy="no-referrer"
                                  />
                                ) : (
                                  <span className="text-slate-400 font-mono text-xs italic">Amna Shams (Draw Sign)</span>
                                )}
                                <span className="absolute bottom-1 right-2 text-[8px] font-mono text-slate-400">
                                  Secure Hash verified
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                      <div>
                        <h3 className="text-base font-black text-slate-900">Digital Applications Portfolio</h3>
                        <p className="text-xs text-slate-500">Track real-time reference checking pipelines and government-grade background investigations.</p>
                      </div>
                      <button
                        onClick={() => setShowStartNewSelector(true)}
                        className="px-4 py-2 bg-[#1B8A3F] hover:bg-[#156e31] text-white text-xs font-bold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-1.5 self-start"
                      >
                        <Plus className="h-4 w-4" />
                        Start New Application
                      </button>
                    </div>

                    {/* DRAFTS SECTION */}
                    {savedDraft && (
                      <div className="border border-amber-200 bg-amber-50/20 rounded-2xl p-5 space-y-3 shadow-sm border-l-4 border-l-[#D4A843]">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#D4A843] font-mono block">In-Progress Application Draft</span>
                            <h4 className="text-xs font-bold text-slate-900">
                              {savedDraft.formData?.propertyName || "DHA Gated Sector Villa"}
                            </h4>
                            <p className="text-[10px] text-slate-500">
                              Section {savedDraft.step || 1} of 13 completed &bull; Autocached: 30s intervals.
                            </p>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-amber-100 text-[#D4A843] text-[9px] font-extrabold font-mono uppercase">
                            Draft Status
                          </span>
                        </div>

                        <div className="flex items-center gap-3 pt-1">
                          <button
                            onClick={handleContinueDraft}
                            className="px-4 py-1.5 bg-[#1B8A3F] hover:bg-[#156e31] text-white text-[10px] font-extrabold rounded-lg transition-all flex items-center gap-1 shadow-sm"
                          >
                            <Play className="h-3 w-3 fill-white" />
                            Continue Draft Form
                          </button>
                          <button
                            onClick={handleDiscardDraft}
                            className="px-4 py-1.5 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 text-[10px] font-extrabold rounded-lg transition-all flex items-center gap-1"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Discard Draft
                          </button>
                        </div>
                      </div>
                    )}

                    {/* SUBMITTED APPLICATIONS LIST */}
                    <div className="space-y-4">
                      {applications.length === 0 ? (
                        <div className="text-center py-12 border border-dashed border-slate-200 rounded-3xl space-y-4 bg-slate-50/40">
                          <FileText className="h-10 w-10 text-slate-300 mx-auto" />
                          <div>
                            <p className="text-xs font-bold text-slate-700">No active applications submitted yet</p>
                            <p className="text-[11px] text-slate-400 mt-1 max-w-sm mx-auto leading-normal">
                              Browse premium DHA & Clifton rental properties, shortlist your favorite, and launch the 13-section verification wizard.
                            </p>
                          </div>
                          <button
                            onClick={() => setShowStartNewSelector(true)}
                            className="px-4 py-2 bg-[#1B8A3F] hover:bg-[#156e31] text-white text-xs font-bold rounded-xl transition-all shadow-sm"
                          >
                            Browse &amp; Start Form
                          </button>
                        </div>
                      ) : (
                        applications.map((app) => {
                          const isApproved = app.status === "Approved";
                          const isRejected = app.status === "Rejected";
                          
                          return (
                            <div key={app.id} className={`border rounded-2xl p-5 space-y-5 shadow-sm transition-all ${
                              isApproved ? "border-emerald-200 bg-emerald-50/5" : isRejected ? "border-rose-200 bg-rose-50/5" : "border-slate-100 bg-white"
                            }`}>
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <div className="flex items-center gap-3">
                                  <div className={`p-2 rounded-xl ${isApproved ? "bg-emerald-100 text-emerald-600" : isRejected ? "bg-rose-100 text-rose-600" : "bg-blue-100 text-blue-600"}`}>
                                    <Building className="h-5 w-5" />
                                  </div>
                                  <div>
                                    <h4 className="text-xs font-bold text-slate-900">{app.propertyName}</h4>
                                    <span className="text-[10px] text-slate-500 block">
                                      Manager: {app.managerName} &bull; ID: <span className="font-mono font-bold text-slate-700">{app.id}</span>
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                                    isApproved 
                                      ? "bg-emerald-50 border-emerald-100 text-emerald-600" 
                                      : isRejected 
                                      ? "bg-rose-50 border-rose-100 text-rose-600" 
                                      : "bg-blue-50 border-blue-100 text-blue-600"
                                  }`}>
                                    {app.status}
                                  </span>
                                  <span className="text-[10px] font-bold text-slate-600 bg-slate-200/50 px-2 py-1 rounded">Rent: {formatPKR(app.price)}/mo</span>
                                </div>
                              </div>

                              {/* CONDITIONAL DECISION BANNERS */}
                              {isApproved && (
                                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3.5 text-xs text-emerald-800 space-y-2">
                                  <div className="flex items-center gap-2 font-bold">
                                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                                    Application Status: Approved &bull; Lease Active!
                                  </div>
                                  <p className="text-[11px] leading-relaxed font-light">
                                    Congratulations! Your 13-section rental application was thoroughly reviewed by our licensing agents and approved. The digital tenancy agreement has been executed and deposited into your vault.
                                  </p>
                                  <button
                                    onClick={() => setActiveTab("documents")}
                                    className="mt-1.5 px-3 py-1 bg-[#1B8A3F] hover:bg-[#156e31] text-white text-[10px] font-extrabold rounded-lg transition-all"
                                  >
                                    View &amp; Sign Lease Agreement
                                  </button>
                                </div>
                              )}

                              {isRejected && (
                                <div className="bg-rose-50 border border-rose-100 rounded-xl p-3.5 text-xs text-rose-800 space-y-1">
                                  <div className="flex items-center gap-2 font-bold">
                                    <AlertCircle className="h-4 w-4 text-rose-600" />
                                    Application Status: Rejected
                                  </div>
                                  <p className="text-[11px] leading-relaxed font-light">
                                    We regret to inform you that your rental application did not meet our verification criteria at this time. This may be due to credit history, document verification anomalies, or other internal bylaws. Please contact the property manager or browse other listings.
                                  </p>
                                </div>
                              )}

                              {/* Progress Timeline */}
                              <div className="space-y-3">
                                <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold">
                                  <span>Verification Pipeline Progress</span>
                                  <span>{app.progress}% Completed</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                  <div className="h-full bg-emerald-600 rounded-full transition-all duration-500" style={{ width: `${app.progress}%` }} />
                                </div>
                              </div>

                              {/* Stages Grid */}
                              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                                {[
                                  { label: "Submitted", desc: "13-Step form data stored in database", done: app.progress >= 20 },
                                  { label: "Identity Verified", desc: "CNIC verification cleared by NADRA", done: app.progress >= 40 },
                                  { label: "Reference Check", desc: "Previous landlord & employment check ok", done: app.progress >= 60 },
                                  { label: "Owner Approved", desc: "Lease conditions approved by owner", done: app.progress >= 80 },
                                  { label: "Contract Signed", desc: "DocuSign finalized & S3 sync", done: app.progress >= 100 }
                                ].map((step, sIdx) => (
                                  <div key={sIdx} className={`p-2.5 border rounded-xl space-y-1 transition-all ${
                                    step.done ? "bg-emerald-50/20 border-emerald-100 text-slate-800" : "bg-slate-50/50 border-slate-100 text-slate-400"
                                  }`}>
                                    <div className="flex items-center gap-1">
                                      {step.done ? (
                                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                                      ) : (
                                        <Clock className="h-3.5 w-3.5 text-slate-300" />
                                      )}
                                      <span className="text-[9px] font-bold">{step.label}</span>
                                    </div>
                                    <p className="text-[8px] leading-tight font-light">{step.desc}</p>
                                  </div>
                                ))}
                              </div>

                              {/* Quick Actions Footer */}
                              <div className="border-t border-slate-100 pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex flex-wrap gap-1.5">
                                  {Object.entries(app.documents || {}).slice(0, 3).map(([key, name]) => (
                                    <span key={key} className="inline-flex items-center gap-1 text-[9px] bg-slate-100 border border-slate-200 text-slate-600 px-2 py-0.5 rounded-md font-mono">
                                      {key.toUpperCase()}
                                    </span>
                                  ))}
                                  {Object.keys(app.documents || {}).length > 3 && (
                                    <span className="text-[9px] text-slate-400 font-bold px-1 py-0.5">+ {Object.keys(app.documents || {}).length - 3} more</span>
                                  )}
                                </div>

                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => setSelectedAppForView(app)}
                                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold rounded-lg transition-all"
                                  >
                                    View Full Submission
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedConvId("conv-1");
                                      setActiveTab("messages");
                                    }}
                                    className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-[10px] font-bold rounded-lg transition-all"
                                  >
                                    Message Manager
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
                
              </div>
            )}

            {/* FAVORITES TAB */}
            {activeTab === "favorites" && (
              <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                <div className="border-b border-slate-100 pb-4 flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Your Saved Homes Shortlist</h3>
                    <p className="text-xs text-slate-500">Instantly launch your verified 13-section application profile for any properties here.</p>
                  </div>
                  <span className="px-2.5 py-1 bg-rose-50 text-rose-500 rounded-full text-[10px] font-bold">
                    {favorites.length} Saved Properties
                  </span>
                </div>

                {favorites.length === 0 ? (
                  <div className="text-center py-12 space-y-4">
                    <Heart className="h-10 w-10 text-slate-300 mx-auto" />
                    <p className="text-xs text-slate-400">Your favorites are currently empty. Explore rentals in the live database.</p>
                    <button
                      onClick={onBrowseRentals}
                      className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
                    >
                      Browse Rentals
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {favorites.map((prop) => (
                      <div key={prop.id} className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
                        <div>
                          <img src={prop.images[0]} alt={prop.title} className="h-44 w-full object-cover" />
                          <div className="p-4 space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-[9px] font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                                {prop.property_type}
                              </span>
                              <span className="text-xs font-black text-slate-900">{formatPKR(prop.price)} / month</span>
                            </div>
                            <h4 className="text-xs font-bold text-slate-800 leading-snug">{prop.title}</h4>
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                              <MapPin className="h-3.5 w-3.5 text-slate-400" />
                              <span>{prop.area}, {prop.city}</span>
                            </div>

                            {/* Brief specs */}
                            <div className="grid grid-cols-3 gap-2 pt-2 text-[10px] text-slate-500 border-t border-slate-100 mt-2">
                              <div>Bedrooms: <strong className="text-slate-800">{prop.bedrooms}</strong></div>
                              <div>Bathrooms: <strong className="text-slate-800">{prop.bathrooms}</strong></div>
                              <div>Area: <strong className="text-slate-800">{prop.area_sqft} sqft</strong></div>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2">
                          <button
                            onClick={() => handleApplyFromFavorites(prop)}
                            className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow shadow-blue-600/10 transition-colors"
                          >
                            Apply for Lease
                          </button>
                          <button
                            onClick={() => {
                              // Simulated chat initiation
                              const newConvId = `conv-${prop.id}`;
                              setConversations(prev => {
                                if (prev.some(c => c.id === newConvId)) return prev;
                                return [
                                  {
                                    id: newConvId,
                                    managerName: prop.manager_name,
                                    propertyName: prop.title,
                                    lastMessage: "How can I help you regarding this property?",
                                    timestamp: "Just Now",
                                    unread: false,
                                    messages: [
                                      { id: "m-init", sender: "manager", text: `Hello Jane, I am ${prop.manager_name}, manager of ${prop.title}. I am happy to help you with any questions.`, timestamp: "Just Now" }
                                    ]
                                  },
                                  ...prev
                                ];
                              });
                              setSelectedConvId(newConvId);
                              setActiveTab("messages");
                            }}
                            className="px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-100 text-xs font-bold transition-all"
                          >
                            Chat
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* RENT & FINANCIALS TAB */}
            {activeTab === "rent" && (
              <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-8">
                <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Rent &amp; Financial Center</h3>
                    <p className="text-xs text-slate-500">Secure online rent payments powered by Stripe and integrated ACH billing.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-xs font-mono font-bold text-emerald-600 uppercase">Experian Reporting Live</span>
                  </div>
                </div>

                {/* Main rent dashboard panels */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left columns (Payment Form) */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Pay Rent Section */}
                    <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl space-y-4">
                      <div className="flex justify-between items-center border-b border-slate-100/60 pb-3">
                        <span className="font-bold text-slate-800 text-xs">Simulated Stripe Payment Portal</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setPaymentForm(p => ({ ...p, method: "card" }))}
                            className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
                              paymentForm.method === "card"
                                ? "bg-slate-900 text-white"
                                : "bg-white text-slate-600 border border-slate-200"
                            }`}
                          >
                            Credit Card
                          </button>
                          <button
                            onClick={() => setPaymentForm(p => ({ ...p, method: "ach" }))}
                            className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
                              paymentForm.method === "ach"
                                ? "bg-slate-900 text-white"
                                : "bg-white text-slate-600 border border-slate-200"
                            }`}
                          >
                            ACH Direct Debit
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1">Amount to Pay (PKR)</label>
                          <input
                            type="text"
                            value={paymentForm.amount}
                            onChange={(e) => setPaymentForm(p => ({ ...p, amount: e.target.value }))}
                            placeholder="e.g. 150000"
                            className="p-2.5 border border-slate-200 rounded-lg bg-white w-full font-mono text-slate-700 font-bold"
                          />
                        </div>

                        {paymentForm.method === "card" ? (
                          <>
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 block mb-1">Cardholder Name</label>
                              <input
                                type="text"
                                value={paymentForm.cardName}
                                onChange={(e) => setPaymentForm(p => ({ ...p, cardName: e.target.value }))}
                                placeholder="Jane Doe"
                                className="p-2.5 border border-slate-200 rounded-lg bg-white w-full"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 block mb-1">Card Number (Stripe Test)</label>
                              <input
                                type="text"
                                value={paymentForm.cardNumber}
                                onChange={(e) => setPaymentForm(p => ({ ...p, cardNumber: e.target.value }))}
                                placeholder="4242 4242 4242 4242"
                                className="p-2.5 border border-slate-200 rounded-lg bg-white w-full font-mono"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-[10px] font-bold text-slate-400 block mb-1">Expiration</label>
                                <input
                                  type="text"
                                  value={paymentForm.cardExpiry}
                                  onChange={(e) => setPaymentForm(p => ({ ...p, cardExpiry: e.target.value }))}
                                  placeholder="MM/YY"
                                  className="p-2.5 border border-slate-200 rounded-lg bg-white w-full font-mono text-center"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-slate-400 block mb-1">CVC</label>
                                <input
                                  type="text"
                                  value={paymentForm.cardCvc}
                                  onChange={(e) => setPaymentForm(p => ({ ...p, cardCvc: e.target.value }))}
                                  placeholder="123"
                                  className="p-2.5 border border-slate-200 rounded-lg bg-white w-full font-mono text-center"
                                />
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 block mb-1">Bank Name</label>
                              <input
                                type="text"
                                value={paymentForm.bankName}
                                onChange={(e) => setPaymentForm(p => ({ ...p, bankName: e.target.value }))}
                                placeholder="Habib Bank Limited"
                                className="p-2.5 border border-slate-200 rounded-lg bg-white w-full"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 block mb-1">Account Number</label>
                              <input
                                type="text"
                                value={paymentForm.bankAccount}
                                onChange={(e) => setPaymentForm(p => ({ ...p, bankAccount: e.target.value }))}
                                placeholder="PK00HABB000123456789"
                                className="p-2.5 border border-slate-200 rounded-lg bg-white w-full font-mono"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 block mb-1">Branch Routing Code</label>
                              <input
                                type="text"
                                value={paymentForm.bankRouting}
                                onChange={(e) => setPaymentForm(p => ({ ...p, bankRouting: e.target.value }))}
                                placeholder="021000021"
                                className="p-2.5 border border-slate-200 rounded-lg bg-white w-full font-mono"
                              />
                            </div>
                          </>
                        )}
                      </div>

                      {paymentForm.successMessage && (
                        <div className="p-3.5 bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs rounded-xl font-medium">
                          {paymentForm.successMessage}
                        </div>
                      )}

                      {paymentForm.errorMessage && (
                        <div className="p-3.5 bg-rose-50 border border-rose-100 text-rose-800 text-xs rounded-xl font-medium">
                          {paymentForm.errorMessage}
                        </div>
                      )}

                      <button
                        onClick={() => {
                          const amtNum = parseFloat(paymentForm.amount);
                          if (!amtNum || amtNum <= 0) {
                            setPaymentForm(p => ({ ...p, errorMessage: "Please input a valid PKR payment amount." }));
                            return;
                          }
                          setPaymentForm(p => ({ ...p, isProcessing: true, successMessage: "", errorMessage: "" }));
                          setTimeout(() => {
                            const newTxnId = "TXN-" + Math.floor(1000 + Math.random() * 9000);
                            const newTxn = {
                              id: newTxnId,
                              date: new Date().toISOString().split('T')[0],
                              amount: amtNum,
                              status: "Successful",
                              propertyName: "Oakridge Premium Family Villa",
                              method: paymentForm.method === "card"
                                ? `Simulated Stripe Card (•••• ${paymentForm.cardNumber.slice(-4) || '4242'})`
                                : `Simulated ACH Bank Transfer (•••• ${paymentForm.bankAccount.slice(-4) || '8901'})`,
                              receiptName: `Receipt_${newTxnId}.txt`
                            };
                            setRentPayments(prev => [newTxn, ...prev]);
                            setPaymentForm(p => ({
                              ...p,
                              isProcessing: false,
                              successMessage: `Rent payment of ${formatPKR(amtNum)} successfully submitted & fully settled.`,
                              cardNumber: "", cardExpiry: "", cardCvc: "", cardName: "", bankAccount: "", bankRouting: "", bankName: ""
                            }));
                            triggerPush("Rent Payment Successful", `Stripe cleared payment ${newTxnId}. Receipt downloaded automatically.`, "check");
                            downloadReceipt(newTxn);
                          }, 1500);
                        }}
                        disabled={paymentForm.isProcessing}
                        className={`w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/10 flex items-center justify-center gap-2 transition-colors ${
                          paymentForm.isProcessing ? "opacity-60 cursor-not-allowed" : ""
                        }`}
                      >
                        <CreditCard className="h-4 w-4" />
                        <span>{paymentForm.isProcessing ? "Processing via Stripe Gateway..." : "Authorize Secure Payment"}</span>
                      </button>
                    </div>

                    {/* Transaction History */}
                    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 space-y-4">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Transaction Ledger</span>
                        <span className="text-[10px] text-slate-400">Past settled balances</span>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-600">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                              <th className="p-3 font-bold text-slate-700">Ref Code</th>
                              <th className="p-3 font-bold text-slate-700">Date</th>
                              <th className="p-3 font-bold text-slate-700">Rent Period</th>
                              <th className="p-3 font-bold text-slate-700">Method</th>
                              <th className="p-3 font-bold text-slate-700 text-right">Settled Amount</th>
                              <th className="p-3 font-bold text-slate-700 text-center">Receipt</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {rentPayments.map((txn) => (
                              <tr key={txn.id} className="hover:bg-slate-50/50">
                                <td className="p-3 font-mono font-bold text-slate-900">{txn.id}</td>
                                <td className="p-3 text-slate-500">{txn.date}</td>
                                <td className="p-3 text-slate-600 font-semibold">{txn.propertyName}</td>
                                <td className="p-3 text-[11px] text-slate-400">{txn.method}</td>
                                <td className="p-3 text-right font-extrabold text-slate-900">{formatPKR(txn.amount)}</td>
                                <td className="p-3 text-center">
                                  <button
                                    onClick={() => downloadReceipt(txn)}
                                    className="p-1.5 hover:bg-slate-100 text-blue-600 hover:text-blue-800 rounded-lg transition-colors"
                                    title="Download Receipt"
                                  >
                                    <Download className="h-4 w-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Right Column (Autopay & Credit Reporting Widget) */}
                  <div className="space-y-6">
                    {/* Autopay Widget */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4 relative overflow-hidden">
                      <div className="absolute top-0 right-0 -mr-6 -mt-6 h-24 w-24 rounded-full bg-blue-500/10 blur-xl" />
                      <div className="relative z-10 space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <span className="text-[9px] font-extrabold uppercase tracking-widest text-blue-400">Automation Hub</span>
                            <h4 className="text-xs font-bold">Autopay Setup Status</h4>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold ${
                            autopaySetup.active ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
                          }`}>
                            {autopaySetup.active ? "Active" : "Disabled"}
                          </span>
                        </div>

                        <p className="text-[10px] text-slate-400 leading-normal">
                          Allow Stripe Automated Clearing House or Visa Autodraw to sweep due rent on the 1st of every month automatically.
                        </p>

                        {autopaySetup.active && (
                          <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 space-y-1.5 text-[11px]">
                            <div className="flex justify-between">
                              <span className="text-slate-500">Billing frequency</span>
                              <span className="text-slate-300 font-bold">{autopaySetup.frequency}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Draft Method</span>
                              <span className="text-slate-300 font-mono font-bold">
                                {autopaySetup.method === "card" ? `Card (•••• ${autopaySetup.cardEnding})` : `ACH (•••• ${autopaySetup.achAccountEnding})`}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Draft Amount</span>
                              <span className="text-emerald-400 font-bold">{formatPKR(autopaySetup.amount)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Next Pull Date</span>
                              <span className="text-blue-400 font-mono font-bold">{autopaySetup.nextBillingDate}</span>
                            </div>
                          </div>
                        )}

                        <button
                          onClick={() => {
                            setAutopaySetup(prev => {
                              const next = { ...prev, active: !prev.active };
                              triggerPush(
                                next.active ? "Autopay Enabled" : "Autopay Suspended",
                                next.active ? "Rent will auto-charge next month." : "Automatic draft is halted.",
                                "check"
                              );
                              return next;
                            });
                          }}
                          className={`w-full text-center py-2.5 rounded-xl text-[10px] font-bold transition-all ${
                            autopaySetup.active
                              ? "bg-rose-600 hover:bg-rose-500 text-white"
                              : "bg-blue-600 hover:bg-blue-500 text-white"
                          }`}
                        >
                          {autopaySetup.active ? "Disable Scheduled Autopay" : "Set Up Automatic Autopay"}
                        </button>
                      </div>
                    </div>

                    {/* Credit Bureau Reporting */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
                      <div className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-blue-600" />
                        <div>
                          <h4 className="text-xs font-bold text-slate-800">Credit Bureau Reporting</h4>
                          <span className="text-[10px] text-slate-400">Experian RentBureau &amp; TransUnion</span>
                        </div>
                      </div>

                      <p className="text-[10px] text-slate-500 leading-normal">
                        Report your on-time rent payments to major credit bureaus. DHA society renters build up to 60+ points in score averages within 6 months.
                      </p>

                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                        <span className="text-[10px] font-semibold text-slate-700">Report payments automatically</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={creditBureauReporting}
                            onChange={(e) => {
                              setCreditBureauReporting(e.target.checked);
                              triggerPush(
                                e.target.checked ? "Credit Reporting On" : "Credit Reporting Off",
                                e.target.checked ? "Past payments submitted to Experian." : "Reporting has been paused."
                              );
                            }}
                            className="sr-only peer accent-blue-600"
                          />
                          <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600" />
                        </label>
                      </div>

                      <div className="space-y-2 pt-1">
                        <div className="flex items-center gap-2 text-[10px] text-slate-500">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                          <span>Last reporting date: <strong>2026-06-01</strong></span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                          <span>Bureau status: <strong className="text-emerald-600">Acknowledged (Experian)</strong></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MAINTENANCE DISPATCH CENTER */}
            {activeTab === "maintenance" && (
              <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-8">
                <div className="border-b border-slate-100 pb-4 flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Maintenance &amp; Dispatch Hub</h3>
                    <p className="text-xs text-slate-500">File tickets, track contractor assignments, and toggle SMS technician broadcasts.</p>
                  </div>
                  <span className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full text-[10px] font-bold">
                    {maintenanceTickets.length} Active Tickets
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column (Tickets History with Real-Time Timeline) */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="space-y-4">
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Your Open Requests</span>

                      {maintenanceTickets.map((tkt) => (
                        <div key={tkt.id} className="border border-slate-100 rounded-2xl p-5 space-y-5 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-black text-slate-900">{tkt.id}</span>
                                <span className="text-[9px] font-extrabold uppercase bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                                  {tkt.category}
                                </span>
                                <span className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold tracking-widest uppercase ${
                                  tkt.severity === "Emergency"
                                    ? "bg-rose-100 text-rose-800 animate-pulse"
                                    : tkt.severity === "High"
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-slate-100 text-slate-600"
                                }`}>
                                  {tkt.severity} PRIORITY
                                </span>
                              </div>
                              <h4 className="text-xs font-bold text-slate-850 mt-1.5">{tkt.title}</h4>
                            </div>

                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              tkt.status === "Completed"
                                ? "bg-emerald-50 text-emerald-600 border border-emerald-150"
                                : tkt.status === "In Progress"
                                ? "bg-cyan-50 text-cyan-600 border border-cyan-150 animate-pulse"
                                : "bg-blue-50 text-blue-600 border border-blue-150"
                            }`}>
                              {tkt.status}
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-500 leading-normal">{tkt.description}</p>

                          {/* Interactive status progress tracker */}
                          <div className="bg-slate-50 p-4 rounded-xl space-y-3">
                            <div className="flex justify-between items-center text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                              <span>Dispatch Progress Tracker</span>
                              <span className="text-slate-600">Updated: Just Now</span>
                            </div>
                            
                            <div className="grid grid-cols-4 gap-1 relative pt-2">
                              {[
                                { key: "Submitted", value: 1 },
                                { key: "Assigned", value: 2 },
                                { key: "In Progress", value: 3 },
                                { key: "Completed", value: 4 }
                              ].map((step, sIdx) => {
                                const activeMap: Record<string, number> = { "Submitted": 1, "Assigned": 2, "In Progress": 3, "Completed": 4 };
                                const tktVal = activeMap[tkt.status] || 1;
                                const done = tktVal >= step.value;
                                return (
                                  <div key={sIdx} className="text-center space-y-1.5">
                                    <div className={`h-1.5 rounded-full ${done ? "bg-blue-600" : "bg-slate-200"}`} />
                                    <span className={`text-[9px] font-bold block ${done ? "text-blue-600" : "text-slate-400"}`}>
                                      {step.key}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Attachments Section */}
                          {tkt.attachments && tkt.attachments.length > 0 && (
                            <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                              <span className="text-[10px] text-slate-400">Attachments:</span>
                              <div className="flex gap-2">
                                {tkt.attachments.map((file, fIdx) => (
                                  <span key={fIdx} className="text-[9px] font-mono bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded flex items-center gap-1">
                                    <Paperclip className="h-3 w-3" /> {file}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column (Log a New Ticket form with file upload & emergency) */}
                  <div className="space-y-6">
                    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-5">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">
                        File Maintenance Request
                      </h4>

                      <div className="space-y-4 text-xs">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1">Issue Title</label>
                          <input
                            type="text"
                            value={ticketForm.title}
                            onChange={(e) => setTicketForm(p => ({ ...p, title: e.target.value }))}
                            placeholder="e.g. Geyser heating element failure"
                            className="p-2.5 border border-slate-200 rounded-lg bg-white w-full font-semibold"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 block mb-1">Category</label>
                            <select
                              value={ticketForm.category}
                              onChange={(e) => setTicketForm(p => ({ ...p, category: e.target.value }))}
                              className="p-2.5 border border-slate-200 rounded-lg bg-white w-full"
                            >
                              <option value="Plumbing">Plumbing</option>
                              <option value="Electrical">Electrical</option>
                              <option value="HVAC">HVAC</option>
                              <option value="Structural">Structural</option>
                              <option value="Appliances">Appliances</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 block mb-1">Severity Level</label>
                            <select
                              value={ticketForm.severity}
                              onChange={(e) => setTicketForm(p => ({ ...p, severity: e.target.value }))}
                              className="p-2.5 border border-slate-200 rounded-lg bg-white w-full"
                            >
                              <option value="Low">Low</option>
                              <option value="Medium">Medium</option>
                              <option value="High">High</option>
                              <option value="Emergency">🚨 Emergency</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1">Full Description</label>
                          <textarea
                            rows={3}
                            value={ticketForm.description}
                            onChange={(e) => setTicketForm(p => ({ ...p, description: e.target.value }))}
                            placeholder="Briefly state symptoms, exact spot, and urgency levels."
                            className="p-2.5 border border-slate-200 rounded-lg bg-white w-full"
                          />
                        </div>

                        {/* Drag and Drop File Selection */}
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1">Media Attachments (Photo/Video)</label>
                          <div 
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                              e.preventDefault();
                              const files = Array.from(e.dataTransfer.files).map((f: any) => f.name);
                              setTicketForm(p => ({ ...p, fileNames: [...p.fileNames, ...files] }));
                              triggerPush("Files Drafted", `Selected ${files.length} attachment(s).`, "upload");
                            }}
                            className="border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50 rounded-xl p-4 text-center cursor-pointer transition-colors"
                            onClick={() => {
                              // Simulate manual click file picker
                              const fakeNames = ["leak_photo_detail.jpg", "corrosion_video.mp4", "wiring_defect.png"];
                              const picked = fakeNames[Math.floor(Math.random() * fakeNames.length)];
                              setTicketForm(p => ({ ...p, fileNames: [...p.fileNames, picked] }));
                              triggerPush("File Added", `Selected ${picked}`, "upload");
                            }}
                          >
                            <Upload className="h-5 w-5 text-slate-400 mx-auto mb-1.5" />
                            <span className="text-[10px] font-bold text-slate-600 block">Drag &amp; Drop media files here</span>
                            <span className="text-[9px] text-slate-400">or click to pick files (Simulated)</span>
                          </div>

                          {ticketForm.fileNames.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {ticketForm.fileNames.map((fn, idx) => (
                                <span key={idx} className="bg-slate-100 text-[9px] px-2 py-0.5 rounded border border-slate-200 flex items-center gap-1 font-mono">
                                  <span>{fn}</span>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setTicketForm(p => ({ ...p, fileNames: p.fileNames.filter((_, i) => i !== idx) }));
                                    }}
                                    className="text-rose-500 hover:text-rose-700 font-bold"
                                  >
                                    &times;
                                  </button>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {ticketForm.severity === "Emergency" && (
                          <div className="bg-rose-50 border border-rose-100 text-rose-800 p-3 rounded-xl flex items-start gap-2.5 animate-pulse">
                            <ShieldAlert className="h-4.5 w-4.5 text-rose-600 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-extrabold text-[10px] uppercase block">Emergency Mode Activated</span>
                              <span className="text-[9px] leading-snug">Submitting triggers instant automated SMS alerts to 3 on-call maintenance engineers in DHA Gated Circle.</span>
                            </div>
                          </div>
                        )}

                        {ticketForm.success && (
                          <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl font-medium border border-emerald-100">
                            Ticket created successfully! On-call staff notified.
                          </div>
                        )}

                        <button
                          onClick={() => {
                            if (!ticketForm.title || !ticketForm.description) {
                              alert("Please fill in the title and description fields.");
                              return;
                            }
                            setTicketForm(p => ({ ...p, isSubmitting: true }));
                            setTimeout(() => {
                              const newTktId = "TKT-" + Math.floor(300 + Math.random() * 699);
                              const newTkt = {
                                id: newTktId,
                                title: ticketForm.title,
                                category: ticketForm.category,
                                severity: ticketForm.severity,
                                status: "Submitted",
                                date: new Date().toISOString().split('T')[0],
                                description: ticketForm.description,
                                attachments: ticketForm.fileNames
                              };
                              setMaintenanceTickets(prev => [newTkt, ...prev]);
                              setTicketForm({
                                title: "", category: "Plumbing", severity: "Medium", description: "", fileNames: [], isSubmitting: false, success: true
                              });
                              if (newTkt.severity === "Emergency") {
                                setEmergencyAlertDispatched(true);
                                triggerPush("🚨 EMERGENCY SYSTEM BROADCAST", "On-call SMS sent out to dispatch crews.", "bell");
                              } else {
                                triggerPush("Ticket Submitted", `Successfully logged request ${newTktId}`, "check");
                              }
                            }, 1000);
                          }}
                          disabled={ticketForm.isSubmitting}
                          className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-md transition-all"
                        >
                          {ticketForm.isSubmitting ? "Dispatching..." : "Submit Dispatch Ticket"}
                        </button>
                      </div>
                    </div>

                    {emergencyAlertDispatched && (
                      <div className="p-4 bg-rose-600 text-white rounded-2xl shadow-lg space-y-2 relative overflow-hidden">
                        <div className="absolute top-0 right-0 opacity-10 transform translate-x-3 -translate-y-3">
                          <Activity className="h-20 w-20" />
                        </div>
                        <div className="flex items-center gap-2">
                          <Smartphone className="h-5 w-5" />
                          <h4 className="text-xs font-bold uppercase tracking-wider">SMS Blast Status</h4>
                        </div>
                        <p className="text-[10px] text-rose-100 leading-relaxed">
                          Emergency protocol initialized. High-priority SMS broadcasted to DHA Sector Plumbing Dispatch Line + On-duty Area Sub-contractor.
                        </p>
                        <button
                          onClick={() => setEmergencyAlertDispatched(false)}
                          className="text-[9px] bg-white/20 hover:bg-white/30 px-2 py-1 rounded font-bold"
                        >
                          Dismiss Alert Logs
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* DOCUMENT VAULT & AWS S3 REPOSITORY */}
            {activeTab === "documents" && (
              <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-8">
                <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Secure Document Repository</h3>
                    <p className="text-xs text-slate-500">Cloud-hosted AWS S3 file vault with integrated DocuSign digital signatures.</p>
                  </div>
                  <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-xl">
                    <ShieldCheck className="h-4.5 w-4.5 text-indigo-600" />
                    <span className="text-[10px] font-mono font-bold text-indigo-700">AWS S3 BUCKET PROTECTED</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column (Files list with S3 tags) */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="space-y-4">
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Vault File Registry</span>

                      <div className="space-y-3">
                        {tenantDocuments.map((doc) => (
                          <div key={doc.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-start gap-3">
                              <div className="p-2.5 bg-indigo-100/60 text-indigo-600 rounded-xl mt-0.5">
                                <FileText className="h-5 w-5" />
                              </div>
                              <div className="space-y-1">
                                <h4 className="text-xs font-extrabold text-slate-800 leading-snug">{doc.name}</h4>
                                <div className="flex flex-wrap gap-2 text-[9px] font-mono text-slate-400">
                                  <span>Type: <strong className="text-slate-600">{doc.type}</strong></span>
                                  <span>&bull;</span>
                                  <span>Uploaded: {doc.dateAdded}</span>
                                  <span>&bull;</span>
                                  <span>Size: {doc.size}</span>
                                </div>
                                <span className="text-[8px] font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md block max-w-sm truncate mt-1">
                                  {doc.storage}
                                </span>
                              </div>
                            </div>

                            <div className="flex sm:flex-col items-end gap-2 shrink-0">
                              {doc.signed ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
                                  <ShieldCheck className="h-3.5 w-3.5" /> E-Signed
                                </span>
                              ) : (
                                <button
                                  onClick={() => {
                                    setSignModalOpen(true);
                                    setSignName(profileData.fullName);
                                    setSignConsent(false);
                                  }}
                                  className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-[10px] font-bold shadow animate-pulse"
                                >
                                  Sign with DocuSign
                                </button>
                              )}

                              <button
                                onClick={() => {
                                  const text = `=========================================
PROPLOG SECURE VAULT METADATA
=========================================
File Name:     ${doc.name}
Storage Path:  ${doc.storage}
Date Added:    ${doc.dateAdded}
File Size:     ${doc.size}
Signed Status: ${doc.signed ? "E-SIGNED & VERIFIED VIA DOCUSIGN" : "PENDING DIGITAL SIGNATURE"}
=========================================
Simulated secure AWS S3 download complete!`;
                                  const blob = new Blob([text], { type: "text/plain" });
                                  const url = URL.createObjectURL(blob);
                                  const a = document.createElement("a");
                                  a.href = url;
                                  a.download = doc.name.replace(".pdf", "_vault.txt");
                                  document.body.appendChild(a);
                                  a.click();
                                  document.body.removeChild(a);
                                  URL.revokeObjectURL(url);
                                  triggerPush("AWS S3 Fetch Complete", `Downloaded ${doc.name} successfully.`, "download");
                                }}
                                className="px-2.5 py-1 text-[10px] font-bold bg-white text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                              >
                                Download S3 Asset
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column (Upload simulated AWS S3 container) */}
                  <div className="space-y-6">
                    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">
                        Upload to Cloud Repository
                      </h4>

                      <div className="space-y-4 text-xs">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1">Document Category</label>
                          <select
                            value={docUploadState.type}
                            onChange={(e) => setDocUploadState(p => ({ ...p, type: e.target.value }))}
                            className="p-2.5 border border-slate-200 rounded-lg bg-white w-full"
                          >
                            <option value="Lease Agreement">Lease Agreement</option>
                            <option value="Inspection Report">Inspection Report</option>
                            <option value="Insurance Certificate">Insurance Certificate</option>
                            <option value="Utility Bill">Utility Invoice</option>
                            <option value="Identification">CNIC / Passport Draft</option>
                          </select>
                        </div>

                        {/* Drag and Drop area */}
                        <div 
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault();
                            if (e.dataTransfer.files.length === 0) return;
                            const fn = (e.dataTransfer.files[0] as any).name;
                            setDocUploadState(p => ({ ...p, fileName: fn }));
                            triggerPush("Document Selected", `Ready to upload ${fn}.`);
                          }}
                          className="border-2 border-dashed border-indigo-200 bg-indigo-50/20 hover:bg-indigo-50/40 p-5 rounded-xl text-center cursor-pointer transition-colors"
                          onClick={() => {
                            const files = ["Tenant_TenantLiability_Doc_2026.pdf", "DHA_Sewerage_Inspection.pdf", "K-Electric_Bill_May.pdf"];
                            const f = files[Math.floor(Math.random() * files.length)];
                            setDocUploadState(p => ({ ...p, fileName: f }));
                            triggerPush("Document Drafted", `Selected ${f}. Click upload to send to S3.`);
                          }}
                        >
                          <Upload className="h-6 w-6 text-indigo-500 mx-auto mb-2" />
                          <span className="text-[10px] font-bold text-indigo-950 block">Select files for secure transfer</span>
                          <span className="text-[9px] text-slate-400">Drag PDF/PNG, or click to choose</span>
                        </div>

                        {docUploadState.fileName && (
                          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                            <div className="truncate pr-2">
                              <span className="text-[10px] text-slate-400 font-mono block">Draft file:</span>
                              <span className="text-[11px] font-bold text-slate-800 truncate">{docUploadState.fileName}</span>
                            </div>
                            <button 
                              onClick={() => setDocUploadState(p => ({ ...p, fileName: "" }))}
                              className="text-rose-500 hover:text-rose-700 font-bold"
                            >
                              Clear
                            </button>
                          </div>
                        )}

                        {docUploadState.isUploading && (
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-center text-[9px] text-indigo-600 font-bold">
                              <span>S3 Sync Transfer Speed: 4.8 MB/s</span>
                              <span>{docUploadState.progress}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-600 rounded-full transition-all duration-150" style={{ width: `${docUploadState.progress}%` }} />
                            </div>
                          </div>
                        )}

                        <button
                          onClick={() => {
                            if (!docUploadState.fileName) {
                              alert("Please click on the file box or drag a file to select before uploading.");
                              return;
                            }
                            setDocUploadState(p => ({ ...p, isUploading: true, progress: 10 }));
                            
                            const interval = setInterval(() => {
                              setDocUploadState(p => {
                                if (p.progress >= 100) {
                                  clearInterval(interval);
                                  setTimeout(() => {
                                    const mockObjName = p.fileName.toLowerCase().replace(/ /g, "_");
                                    const newDoc = {
                                      id: "doc-" + (tenantDocuments.length + 1),
                                      name: p.fileName,
                                      type: p.type,
                                      storage: `s3://proplog-tenant-vault-production/${mockObjName}`,
                                      signed: p.type !== "Lease Agreement" && p.type !== "Inspection Report", // other docs don't require e-signatures
                                      dateAdded: new Date().toISOString().split('T')[0],
                                      size: (1.5 + Math.random() * 3).toFixed(1) + " MB"
                                    };
                                    setTenantDocuments(prev => [...prev, newDoc]);
                                    setDocUploadState({ isUploading: false, fileName: "", progress: 0, type: "Insurance Certificate" });
                                    triggerPush("AWS S3 Put Successful", `Saved ${newDoc.name} in cloud vault.`, "check");
                                  }, 500);
                                  return p;
                                }
                                return { ...p, progress: p.progress + 30 };
                              });
                            }, 300);
                          }}
                          disabled={docUploadState.isUploading || !docUploadState.fileName}
                          className={`w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs shadow shadow-indigo-600/10 flex items-center justify-center gap-2 transition-all ${
                            docUploadState.isUploading ? "opacity-60 cursor-not-allowed" : ""
                          }`}
                        >
                          <ShieldCheck className="h-4 w-4" />
                          <span>{docUploadState.isUploading ? "Transferring encrypted blocks..." : "Push to Secure S3 Storage"}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* DocuSign E-Sign Modal */}
                {signModalOpen && (
                  <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 max-w-lg w-full shadow-2xl space-y-6">
                      <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-2">
                          <PenTool className="h-5 w-5 text-rose-600" />
                          <div>
                            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">DocuSign Digital Signatures</h3>
                            <span className="text-[10px] text-slate-400">Electronic Standard SEC-102-Compliant</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => setSignModalOpen(false)}
                          className="text-slate-400 hover:text-slate-600 text-sm font-bold"
                        >
                          &times;
                        </button>
                      </div>

                      <div className="space-y-4 text-xs">
                        <p className="text-slate-600 leading-normal">
                          You are signing <strong>"DHA Residential Lease Agreement.pdf"</strong>. This constitutes a legally binding contract under Pak Electronic Transactions Ordinance 2002.
                        </p>

                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1">Consent Form Type</label>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => setSignType("draw")}
                              className={`py-2 rounded-xl text-center font-bold border text-[10px] ${
                                signType === "draw" ? "bg-slate-900 text-white border-transparent" : "bg-white text-slate-600 border-slate-200"
                              }`}
                            >
                              ✍️ Draw / Stylus Pad
                            </button>
                            <button
                              onClick={() => setSignType("type")}
                              className={`py-2 rounded-xl text-center font-bold border text-[10px] ${
                                signType === "type" ? "bg-slate-900 text-white border-transparent" : "bg-white text-slate-600 border-slate-200"
                              }`}
                            >
                              ⌨️ Type Digital Initial
                            </button>
                          </div>
                        </div>

                        {signType === "draw" ? (
                          <div className="border border-slate-200 rounded-xl bg-slate-50 p-6 text-center space-y-2">
                            <span className="text-[10px] font-mono text-slate-400 block">Digital Signature Canvas Pad</span>
                            <div className="h-20 w-48 border border-slate-200 bg-white rounded mx-auto relative flex items-center justify-center shadow-inner cursor-crosshair">
                              <span className="text-xs font-mono text-slate-300 pointer-events-none select-none italic font-serif text-slate-500 text-xl font-bold">
                                {profileData.fullName}
                              </span>
                              <div className="absolute inset-0 flex items-center justify-center opacity-40">
                                <svg className="h-full w-full pointer-events-none">
                                  <path d="M 10 40 Q 50 10 90 40 T 170 30" fill="none" stroke="blue" strokeWidth="2" />
                                </svg>
                              </div>
                            </div>
                            <span className="text-[9px] text-slate-400">Simulating canvas stylus. Dragged mouse signature loaded.</span>
                          </div>
                        ) : (
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 block mb-1">Type Legal Full Name</label>
                            <input
                              type="text"
                              value={signName}
                              onChange={(e) => setSignName(e.target.value)}
                              className="p-2.5 border border-slate-200 rounded-lg bg-white w-full font-serif font-bold italic text-slate-700 text-sm"
                            />
                            <span className="text-[9px] text-slate-400 mt-1 block">A custom cursively-mapped font is applied to represent verification stamps.</span>
                          </div>
                        )}

                        <label className="flex items-start gap-2.5 p-3 bg-slate-50 border border-slate-100 rounded-xl cursor-pointer">
                          <input
                            type="checkbox"
                            checked={signConsent}
                            onChange={(e) => setSignConsent(e.target.checked)}
                            className="mt-0.5 text-rose-600 focus:ring-rose-500 accent-rose-600 shrink-0"
                          />
                          <span className="text-[10px] leading-snug text-slate-500">
                            I verify that my entered name and digital signature above correspond strictly to my CNIC identity, and consent to electronic execution standards.
                          </span>
                        </label>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => setSignModalOpen(false)}
                          className="flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-700 font-bold hover:bg-slate-50 transition-colors text-xs"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            if (!signConsent) {
                              alert("Please accept the electronic signature verification consent.");
                              return;
                            }
                            setIsSigningProcess(true);
                            setTimeout(() => {
                              setTenantDocuments(prev => prev.map(d => {
                                if (d.id === "doc-1") {
                                  return { ...d, signed: true };
                                }
                                return d;
                              }));
                              setIsSigningProcess(false);
                              setSignModalOpen(false);
                              triggerPush("DocuSign Complete", "The lease agreement has been successfully signed and synchronized with S3.", "check");
                            }, 1200);
                          }}
                          disabled={isSigningProcess || !signConsent}
                          className={`flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold shadow transition-all text-xs flex items-center justify-center gap-2 ${
                            (isSigningProcess || !signConsent) ? "opacity-60 cursor-not-allowed" : ""
                          }`}
                        >
                          <PenTool className="h-4 w-4" />
                          <span>{isSigningProcess ? "Stamping Digital Seals..." : "Affix Digital Signature"}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* MESSAGES TAB */}
            {activeTab === "messages" && (
              <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-3 min-h-[500px]">
                {/* Conversations Sidebar */}
                <div className="border-r border-slate-100 flex flex-col">
                  <div className="p-4 border-b border-slate-100 bg-slate-50">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Conversations</span>
                  </div>
                  <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                    {conversations.map(conv => (
                      <div
                        key={conv.id}
                        onClick={() => setSelectedConvId(conv.id)}
                        className={`p-4 cursor-pointer hover:bg-slate-50/50 transition-colors text-xs ${
                          selectedConvId === conv.id ? "bg-blue-50/30 border-l-4 border-blue-600" : ""
                        }`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-bold text-slate-800">{conv.managerName}</span>
                          <span className="text-[9px] font-mono text-slate-400">{conv.timestamp}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-semibold truncate block mb-1">{conv.propertyName}</span>
                        <p className="text-[10px] text-slate-400 truncate leading-snug">{conv.lastMessage}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Message Threads area */}
                <div className="md:col-span-2 flex flex-col justify-between bg-slate-50/40">
                  {activeConv ? (
                    <>
                      {/* Header */}
                      <div className="p-4 bg-white border-b border-slate-100 flex justify-between items-center">
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{activeConv.managerName}</h4>
                          <span className="text-[10px] text-slate-400 truncate block max-w-md">{activeConv.propertyName}</span>
                        </div>
                        <span className="px-2 py-0.5 bg-emerald-50 text-[9px] font-bold text-emerald-600 rounded">
                          Active Correspondence
                        </span>
                      </div>

                      {/* Chat Messages */}
                      <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-[350px]">
                        {activeConv.messages.map((m) => (
                          <div
                            key={m.id}
                            className={`flex flex-col max-w-[80%] ${
                              m.sender === "tenant" ? "ml-auto items-end" : "mr-auto items-start"
                            }`}
                          >
                            <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                              m.sender === "tenant" 
                                ? "bg-blue-600 text-white rounded-br-none" 
                                : "bg-white border border-slate-200 text-slate-800 rounded-bl-none"
                            }`}>
                              {m.text}
                            </div>
                            <span className="text-[8px] font-mono text-slate-400 mt-1">{m.timestamp}</span>
                          </div>
                        ))}

                        {/* Typing indicator */}
                        {isTyping && (
                          <div className="flex items-center gap-1.5 p-3.5 bg-white border border-slate-100 rounded-2xl mr-auto max-w-[80px]">
                            <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        )}
                      </div>

                      {/* Quick Templates bar */}
                      <div className="p-2.5 bg-white border-t border-slate-100 flex flex-wrap gap-1.5">
                        {[
                          "Sunday Visit Scheduled?",
                          "Is the security deposit negotiable?",
                          "Are dogs allowed?",
                          "What about gas load shedding?"
                        ].map(template => (
                          <button
                            key={template}
                            type="button"
                            onClick={() => handleSendMessage(template)}
                            className="px-2.5 py-1 text-[9px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors border border-slate-200"
                          >
                            {template}
                          </button>
                        ))}
                      </div>

                      {/* Input controls */}
                      <div className="p-4 bg-white border-t border-slate-100 flex gap-2">
                        <input
                          type="text"
                          value={typedMessage}
                          onChange={(e) => setTypedMessage(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter") handleSendMessage(); }}
                          placeholder="Type your message..."
                          className="flex-1 px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-blue-500 text-xs"
                        />
                        <button
                          onClick={() => handleSendMessage()}
                          className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow shadow-blue-600/10 transition-colors"
                        >
                          <Send className="h-4 w-4" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12 text-slate-400 text-xs">
                      No active chat selected.
                    </div>
                  )}
                </div>
              </div>
            )}



            {/* PROFILE TAB */}
            {activeTab === "profile" && (
              <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Tenant Profile &amp; Match preferences</h3>
                  <p className="text-xs text-slate-500">Provide details so matching algorithms prioritize your credit requests.</p>
                </div>

                <form 
                  onSubmit={(e) => { 
                    e.preventDefault(); 
                    alert("Tenant Profile preferences successfully updated!"); 
                  }} 
                  className="space-y-6 text-xs max-w-2xl"
                >
                  <div className="bg-slate-50 p-5 rounded-2xl space-y-4">
                    <h4 className="text-[11px] font-bold text-slate-700 uppercase">Primary Verification details</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          value={profileData.fullName}
                          onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
                          className="p-2.5 border border-slate-200 rounded-lg bg-white w-full"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block mb-1">Verified Email</label>
                        <input
                          type="email"
                          required
                          disabled
                          value={profileData.email}
                          className="p-2.5 border border-slate-200 rounded-lg bg-slate-100 text-slate-500 w-full"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block mb-1">WhatsApp Mobile</label>
                        <input
                          type="text"
                          required
                          value={profileData.phone}
                          onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                          className="p-2.5 border border-slate-200 rounded-lg bg-white w-full font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block mb-1">Primary Residence City</label>
                        <select
                          value={profileData.city}
                          onChange={(e) => setProfileData(prev => ({ ...prev, city: e.target.value }))}
                          className="p-2.5 border border-slate-200 rounded-lg bg-white w-full font-semibold"
                        >
                          <option value="Lahore">Lahore</option>
                          <option value="Karachi">Karachi</option>
                          <option value="Islamabad">Islamabad</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-5 rounded-2xl space-y-4">
                    <h4 className="text-[11px] font-bold text-slate-700 uppercase">Preference Parameters</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block mb-1">Target Monthly Rent Budget (PKR)</label>
                        <input
                          type="number"
                          value={profileData.preferredBudget}
                          onChange={(e) => setProfileData(prev => ({ ...prev, preferredBudget: parseInt(e.target.value) || 0 }))}
                          className="p-2.5 border border-slate-200 rounded-lg bg-white w-full"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block mb-1">Furnishing Preference</label>
                        <select
                          value={profileData.furnishingPref}
                          onChange={(e) => setProfileData(prev => ({ ...prev, furnishingPref: e.target.value }))}
                          className="p-2.5 border border-slate-200 rounded-lg bg-white w-full"
                        >
                          <option value="fully">Fully Furnished</option>
                          <option value="semi">Semi Furnished</option>
                          <option value="unfurnished">Unfurnished</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block mb-1">Family Occupants Count</label>
                        <input
                          type="number"
                          value={profileData.familySize}
                          onChange={(e) => setProfileData(prev => ({ ...prev, familySize: parseInt(e.target.value) || 1 }))}
                          className="p-2.5 border border-slate-200 rounded-lg bg-white w-full"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-colors"
                  >
                    Update Profile Preferences
                  </button>
                </form>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};
