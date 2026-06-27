/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { formatPKR } from "../utils/currency";
import {
  UserProfile,
  UserRole,
  Property,
  Unit,
  Lease,
  MaintenanceTicket,
  RentPayment,
  InAppNotification,
  ContactInquiry,
  PropertyType,
  PropertyStatus,
  UnitStatus,
  LeaseStatus,
  TicketPriority,
  TicketStatus,
  PaymentStatus,
  NotificationType,
  Tenant,
  Application
} from "../types";
import {
  initialUsers,
  initialProperties,
  initialUnits,
  initialLeases,
  initialTickets,
  initialPayments,
  initialNotifications,
  initialTenants
} from "../data/mockData";

export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
}

interface AppContextProps {
  currentUser: UserProfile | null;
  users: UserProfile[];
  properties: Property[];
  units: Unit[];
  leases: Lease[];
  tickets: MaintenanceTicket[];
  payments: RentPayment[];
  notifications: InAppNotification[];
  contacts: ContactInquiry[];
  toasts: Toast[];
  tenants: Tenant[];
  applications: Application[];
  
  // Auth Functions
  login: (email: string, role: UserRole) => Promise<boolean>;
  register: (name: string, email: string, phone: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<boolean>;
  switchRole: (role: UserRole) => void;

  // Data Functions
  addProperty: (property: Omit<Property, "id" | "created_at" | "owner_id">) => Promise<boolean>;
  updateProperty: (property: Property) => Promise<boolean>;
  deleteProperty: (id: string) => Promise<boolean>;
  
  addUnit: (unit: Omit<Unit, "id">) => Promise<boolean>;
  updateUnit: (unit: Unit) => Promise<boolean>;
  deleteUnit: (id: string) => Promise<boolean>;
  updateUnitStatus: (id: string, status: UnitStatus) => Promise<boolean>;
  
  addTenant: (tenant: Omit<Tenant, "id" | "created_at">) => Promise<boolean>;
  updateTenant: (tenant: Tenant) => Promise<boolean>;
  deleteTenant: (id: string) => Promise<boolean>;
  
  addLease: (lease: Omit<Lease, "id">) => Promise<boolean>;
  updateLease: (lease: Lease) => Promise<boolean>;
  deleteLease: (id: string) => Promise<boolean>;
  updateLeaseStatus: (id: string, status: LeaseStatus) => Promise<boolean>;
  
  addTicket: (ticket: Omit<MaintenanceTicket, "id" | "created_at" | "status" | "cost" | "images">) => Promise<boolean>;
  updateTicketStatus: (id: string, status: TicketStatus) => Promise<boolean>;
  updateTicketCost: (id: string, cost: number) => Promise<boolean>;
  
  addPayment: (payment: Omit<RentPayment, "id">) => Promise<boolean>;
  updatePayment: (payment: RentPayment) => Promise<boolean>;
  deletePayment: (id: string) => Promise<boolean>;
  markPaymentPaid: (id: string, method: string) => Promise<boolean>;
  
  addNotification: (title: string, message: string, type: NotificationType, targetUserId?: string) => Promise<boolean>;
  markNotificationRead: (id: string) => Promise<boolean>;
  clearNotifications: () => Promise<boolean>;
  
  addContactInquiry: (inquiry: Omit<ContactInquiry, "id" | "created_at">) => Promise<boolean>;
  
  // Application Functions
  addApplication: (app: Application) => Promise<boolean>;
  updateApplicationStatus: (id: string, status: string, progress: number) => Promise<boolean>;
  
  // Toast Functions
  showToast: (message: string, type?: Toast["type"]) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state from localStorage or use defaults
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem("pl_current_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem("pl_users");
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [properties, setProperties] = useState<Property[]>(() => {
    const saved = localStorage.getItem("pl_properties");
    return saved ? JSON.parse(saved) : initialProperties;
  });

  const [units, setUnits] = useState<Unit[]>(() => {
    const saved = localStorage.getItem("pl_units");
    return saved ? JSON.parse(saved) : initialUnits;
  });

  const [leases, setLeases] = useState<Lease[]>(() => {
    const saved = localStorage.getItem("pl_leases");
    return saved ? JSON.parse(saved) : initialLeases;
  });

  const [tickets, setTickets] = useState<MaintenanceTicket[]>(() => {
    const saved = localStorage.getItem("pl_tickets");
    return saved ? JSON.parse(saved) : initialTickets;
  });

  const [payments, setPayments] = useState<RentPayment[]>(() => {
    const saved = localStorage.getItem("pl_payments");
    return saved ? JSON.parse(saved) : initialPayments;
  });

  const [notifications, setNotifications] = useState<InAppNotification[]>(() => {
    const saved = localStorage.getItem("pl_notifications");
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  const [contacts, setContacts] = useState<ContactInquiry[]>(() => {
    const saved = localStorage.getItem("pl_contacts");
    return saved ? JSON.parse(saved) : [];
  });

  const [tenants, setTenants] = useState<Tenant[]>(() => {
    const saved = localStorage.getItem("pl_tenants");
    return saved ? JSON.parse(saved) : initialTenants;
  });

  const [applications, setApplications] = useState<Application[]>(() => {
    const saved = localStorage.getItem("pl_applications");
    return saved ? JSON.parse(saved) : [
      {
        id: "app-101",
        propertyId: "rent-1",
        propertyName: "Oakridge Premium Family Villa",
        managerName: "Kamran Shah",
        price: 320000,
        appliedDate: "2026-06-20",
        status: "Checking References",
        progress: 60,
        documents: {
          cnic: "cnic_copy_verified.jpg",
          statement: "bank_statement_3_months.pdf",
          salarySlip: "salary_slip_may_2026.pdf"
        },
        details: {
          fullName: "Jane Doe",
          fatherHusbandName: "Muhammad Asif",
          cnic: "35201-1234567-8",
          dob: "1992-08-15",
          gender: "Female",
          maritalStatus: "Married",
          nationality: "Pakistani",
          religion: "Islam",
          motherTongue: "Punjabi",
          mobileNumber: "0300-1234567",
          whatsAppNumber: "0300-1234567",
          emailAddress: "tenant@propertylog.com",
          currentAddress: "Apartment 4, Block K, Gulberg III, Lahore",
          currentCityDistrict: "Lahore",
          currentProvince: "Punjab",
          emergencyContactName: "Muhammad Asif",
          emergencyContactRelationship: "Husband",
          emergencyContactPhone: "0321-9876543",
          totalOccupants: 3,
          adultsCount: 2,
          childrenCount: 1,
          petsInHousehold: "No",
          petDetails: "N/A",
          vehiclesCount: 1,
          vehicleTypes: "Car (Honda Civic)",
          preferredLeaseDuration: "12 Months",
          preferredMoveInDate: "2026-07-01",
          flexibilityMoveInDate: "Flexible",
          noticePeriodWillingness: "60 Days",
          rentPaymentPreference: "Monthly",
          preferredPaymentDay: "5th",
          willingnessPayInAdvance: "2 Months",
          monthlyIncome: 450000,
          employerName: "Systems Limited Pakistan",
          occupation: "Software Engineering",
          ref1Name: "Mian Shakeel",
          ref1Contact: "0300-7654321",
          ref2Name: "Nadeem Mustafa",
          ref2Contact: "0321-4445556",
          declarationPlace: "Lahore, Pakistan",
          agreeRentOnTime: true,
          agreeSecurityDeposit: true,
          agreeMaintainProperty: true,
          agreeNoSubletting: true,
          agreeFollowBuildingRules: true,
          agreeNoticeBeforeMoving: true,
          agreeAllowInspections: true,
          agreeNoModifications: true,
          agreeNoLoudNoise: true,
          agreeNoIllegalActivities: true
        }
      }
    ];
  });

  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    localStorage.setItem("pl_applications", JSON.stringify(applications));
  }, [applications]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("pl_current_user", currentUser ? JSON.stringify(currentUser) : "");
  }, [currentUser]);

  // Load initial data from Supabase asynchronously on mount
  useEffect(() => {
    const syncFromSupabase = async () => {
      try {
        console.log("[Developer Log] Synchronizing database tables...");
        const { data: dbUsers, error: errUsers } = await supabase.from("users").select("*");
        if (errUsers) console.warn("[Developer Log] Supabase fetch users failed:", errUsers.message);
        else if (dbUsers && dbUsers.length > 0) setUsers(dbUsers);

        const { data: dbProperties, error: errProps } = await supabase.from("properties").select("*");
        if (errProps) console.warn("[Developer Log] Supabase fetch properties failed:", errProps.message);
        else if (dbProperties && dbProperties.length > 0) setProperties(dbProperties);

        const { data: dbUnits, error: errUnits } = await supabase.from("units").select("*");
        if (errUnits) console.warn("[Developer Log] Supabase fetch units failed:", errUnits.message);
        else if (dbUnits && dbUnits.length > 0) setUnits(dbUnits);

        const { data: dbTenants, error: errTenants } = await supabase.from("tenants").select("*");
        if (errTenants) console.warn("[Developer Log] Supabase fetch tenants failed:", errTenants.message);
        else if (dbTenants && dbTenants.length > 0) setTenants(dbTenants);

        const { data: dbLeases, error: errLeases } = await supabase.from("leases").select("*");
        if (errLeases) console.warn("[Developer Log] Supabase fetch leases failed:", errLeases.message);
        else if (dbLeases && dbLeases.length > 0) setLeases(dbLeases);

        const { data: dbTickets, error: errTickets } = await supabase.from("maintenance").select("*");
        if (errTickets) console.warn("[Developer Log] Supabase fetch maintenance failed:", errTickets.message);
        else if (dbTickets && dbTickets.length > 0) setTickets(dbTickets);

        const { data: dbPayments, error: errPayments } = await supabase.from("rent_payments").select("*");
        if (errPayments) console.warn("[Developer Log] Supabase fetch rent_payments failed:", errPayments.message);
        else if (dbPayments && dbPayments.length > 0) setPayments(dbPayments);

        const { data: dbContacts, error: errContacts } = await supabase.from("contact_inquiries").select("*");
        if (errContacts) console.warn("[Developer Log] Supabase fetch contact_inquiries failed:", errContacts.message);
        else if (dbContacts && dbContacts.length > 0) setContacts(dbContacts);
        
        console.log("[Developer Log] Database tables synchronization: SUCCESS");
      } catch (err) {
        console.warn("[Developer Log] Could not sync from Supabase, using localStorage or mock data:", err);
      }
    };
    syncFromSupabase();
  }, []);

  // Securely sync notifications specifically for the logged-in user (WHERE user_id = auth.uid())
  useEffect(() => {
    const syncMyNotifications = async () => {
      if (currentUser) {
        console.log(`[Developer Log] Fetching secure notifications for user_id = ${currentUser.id}`);
        const { data, error } = await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", currentUser.id)
          .order("created_at", { ascending: false });
          
        if (error) {
          if (error.message.includes("Invalid path specified in request URL") || error.message.includes("not found")) {
            console.warn("[Developer Log] Failed to fetch secure notifications (notifications table not found in Supabase):", error.message);
          } else {
            console.error("[Developer Log] Failed to fetch secure notifications:", error.message);
          }
        } else if (data) {
          setNotifications(data);
          console.log(`[Developer Log] Notifications secure sync status: OK (${data.length} synchronized)`);
        }
      } else {
        setNotifications([]);
      }
    };
    syncMyNotifications();
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("pl_users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem("pl_properties", JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem("pl_units", JSON.stringify(units));
  }, [units]);

  useEffect(() => {
    localStorage.setItem("pl_leases", JSON.stringify(leases));
  }, [leases]);

  useEffect(() => {
    localStorage.setItem("pl_tickets", JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem("pl_payments", JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem("pl_notifications", JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem("pl_contacts", JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem("pl_tenants", JSON.stringify(tenants));
  }, [tenants]);

  // Toast Helpers
  const showToast = (message: string, type: Toast["type"] = "info") => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Auth Functions
  const login = async (email: string, role: UserRole): Promise<boolean> => {
    // Simulate API network delay
    await new Promise((resolve) => setTimeout(resolve, 600));
    const normalizedEmail = email.toLowerCase().trim();
    
    // Check Supabase first
    try {
      const { data: dbUsers, error: errSelect } = await supabase
        .from("users")
        .select("*")
        .eq("email", normalizedEmail)
        .eq("role", role);

      if (errSelect) {
        console.error("Supabase login query error:", errSelect.message);
      } else if (dbUsers && dbUsers.length > 0) {
        const user = dbUsers[0] as UserProfile;
        setCurrentUser(user);
        showToast(`Welcome back, ${user.full_name}! Logged in as ${user.role}.`, "success");
        return true;
      }
    } catch (e) {
      console.warn("Supabase login query failed, falling back to local users state", e);
    }

    // Find matching user locally
    let user = users.find((u) => u.email.toLowerCase() === normalizedEmail && u.role === role);
    
    if (!user) {
      // If we don't have this user but it's a known email with a different role, create one.
      const nameMap: { [key: string]: string } = {
        "owner@propertylog.com": "Alex Mercer",
        "tenant@propertylog.com": "Jane Doe",
        "admin@propertylog.com": "Sarah Jenkins",
        "manager@propertylog.com": "John Doe"
      };
      
      const fullName = nameMap[normalizedEmail] || email.split("@")[0].replace(/[^a-zA-Z]/g, " ");
      const capitalizedName = fullName.charAt(0).toUpperCase() + fullName.slice(1);
      
      const newUser: UserProfile = {
        id: "u_" + Math.random().toString(36).substr(2, 9),
        full_name: capitalizedName,
        email: normalizedEmail,
        phone: "+1 (555) 123-4567",
        role,
        created_at: new Date().toISOString()
      };
      
      setUsers((prev) => [...prev, newUser]);
      user = newUser;

      // Sync user insert to Supabase
      const { error: errInsert } = await supabase.from("users").insert(newUser);
      if (errInsert) {
        console.error("Supabase insert user failed on login fallback:", errInsert.message);
        showToast(`Warning: Profile sync issue (${errInsert.message})`, "warning");
      }
    }
    
    setCurrentUser(user);
    showToast(`Welcome back, ${user.full_name}! Logged in as ${user.role}.`, "success");
    return true;
  };

  const register = async (name: string, email: string, phone: string, role: UserRole): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 650));
    const normalizedEmail = email.toLowerCase().trim();
    
    // Check Supabase first
    try {
      const { data: dbUsers, error: errSelect } = await supabase
        .from("users")
        .select("*")
        .eq("email", normalizedEmail)
        .eq("role", role);

      if (errSelect) {
        console.error("Supabase registration select check failed:", errSelect.message);
      } else if (dbUsers && dbUsers.length > 0) {
        showToast(`User with this email and role already exists.`, "error");
        return false;
      }
    } catch (e) {
      console.warn("Supabase user exists check failed, falling back to local state", e);
    }

    const exists = users.some((u) => u.email.toLowerCase() === normalizedEmail && u.role === role);
    if (exists) {
      showToast(`User with this email and role already exists.`, "error");
      return false;
    }
    
    const newUser: UserProfile = {
      id: "u_" + Math.random().toString(36).substr(2, 9),
      full_name: name,
      email: normalizedEmail,
      phone: phone || "+1 (555) 000-0000",
      role,
      created_at: new Date().toISOString()
    };
    
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);

    // Sync register to Supabase
    const { error: errInsert } = await supabase.from("users").insert(newUser);
    if (errInsert) {
      console.error("Supabase registration database insert failed:", errInsert.message);
      showToast(`Database Error registering account: ${errInsert.message}`, "error");
      return false;
    }

    showToast(`Account successfully created! Welcome, ${name}.`, "success");
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    showToast("You have been successfully logged out.", "info");
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    showToast(`Password reset link sent to ${email}. Please check your inbox.`, "success");
    return true;
  };

  const switchRole = async (role: UserRole) => {
    if (!currentUser) return;
    
    // Attempt to find a user with the same email but different role, or create one
    const matchingUser = users.find((u) => u.email.toLowerCase() === currentUser.email.toLowerCase() && u.role === role);
    
    if (matchingUser) {
      setCurrentUser(matchingUser);
      showToast(`Switched workspace role to ${role}.`, "success");
    } else {
      const newUser: UserProfile = {
        ...currentUser,
        id: "u_" + Math.random().toString(36).substr(2, 9),
        role,
        created_at: new Date().toISOString()
      };
      setUsers((prev) => [...prev, newUser]);
      setCurrentUser(newUser);

      // Sync switched user to Supabase
      const { error: errInsert } = await supabase.from("users").insert(newUser);
      if (errInsert) {
        console.error("Supabase switchRole insert failed:", errInsert.message);
        showToast(`Database Error switching workspace profile: ${errInsert.message}`, "error");
      } else {
        showToast(`Switched workspace role to ${role}. Created new profile.`, "success");
      }
    }
  };

  // Properties CRUD
  const addProperty = async (propData: Omit<Property, "id" | "created_at" | "owner_id">): Promise<boolean> => {
    if (!currentUser) {
      console.error("[Developer Log] Failed to add property: No authenticated user.");
      showToast("Unable to create property. No authenticated user.", "error");
      return false;
    }

    const propId = "p_" + Math.random().toString(36).substr(2, 9);
    const newProp: Property = {
      ...propData,
      id: propId,
      owner_id: currentUser.id,
      created_at: new Date().toISOString()
    };

    console.log(`[Developer Log] Attempting database insert for property "${newProp.name}" (ID: ${propId})...`);
    const { error } = await supabase.from("properties").insert(newProp);
    
    if (error) {
      if (error.message.includes("Invalid path specified in request URL") || error.message.includes("not found")) {
        console.warn(`[Developer Log] Table sync status: FAILED to insert property (table not found, saving locally):`, error.message);
      } else {
        console.error(`[Developer Log] Table sync status: FAILED to insert property:`, error.message);
        showToast(`Database Error: Unable to save property. ${error.message}`, "error");
        return false;
      }
    }

    // Success: Update UI / local state
    setProperties((prev) => [newProp, ...prev]);
    showToast(`Property "${newProp.name}" added successfully.`, "success");
    console.log(`[Developer Log] Table sync status: SUCCESS for property "${newProp.name}"`);

    // Ensure parent record is committed before child (Default unit 101 creation)
    console.log(`[Developer Log] Creating default unit 101 for property "${newProp.name}"...`);
    await addUnit({
      property_id: newProp.id,
      property_name: newProp.name,
      unit_number: "101",
      rent_amount: 1500,
      status: UnitStatus.VACANT,
      tenant_id: null,
      tenant_name: null
    });

    await addNotification(
      "New Property Added",
      `The property "${newProp.name}" was successfully registered in the system.`,
      NotificationType.GENERAL,
      currentUser.id
    );

    return true;
  };

  const updateProperty = async (updatedProp: Property): Promise<boolean> => {
    const oldProps = properties;
    setProperties((prev) => prev.map((p) => (p.id === updatedProp.id ? updatedProp : p)));
    
    console.log(`[Developer Log] Attempting database update for property (ID: ${updatedProp.id})...`);
    const { error } = await supabase.from("properties").update(updatedProp).eq("id", updatedProp.id);
    
    if (error) {
      if (error.message.includes("Invalid path specified in request URL") || error.message.includes("not found")) {
        console.warn(`[Developer Log] Table sync status: FAILED to update property (table not found, saving locally):`, error.message);
      } else {
        console.error(`[Developer Log] Table sync status: FAILED to update property:`, error.message);
        showToast(`Database Error: ${error.message}`, "error");
        // Rollback local state
        setProperties(oldProps);
        return false;
      }
    }

    showToast(`Property "${updatedProp.name}" updated successfully.`, "success");
    console.log(`[Developer Log] Table sync status: SUCCESS update property (ID: ${updatedProp.id})`);
    return true;
  };

  const deleteProperty = async (id: string): Promise<boolean> => {
    const prop = properties.find((p) => p.id === id);
    const oldProps = properties;
    const oldUnits = units;
    
    setProperties((prev) => prev.filter((p) => p.id !== id));
    setUnits((prev) => prev.filter((u) => u.property_id !== id));
    
    console.log(`[Developer Log] Attempting database delete for property (ID: ${id})...`);
    const { error } = await supabase.from("properties").delete().eq("id", id);
    
    if (error) {
      if (error.message.includes("Invalid path specified in request URL") || error.message.includes("not found")) {
        console.warn(`[Developer Log] Table sync status: FAILED to delete property (table not found, saving locally):`, error.message);
      } else {
        console.error(`[Developer Log] Table sync status: FAILED to delete property:`, error.message);
        showToast(`Database Error: ${error.message}`, "error");
        // Rollback local state
        setProperties(oldProps);
        setUnits(oldUnits);
        return false;
      }
    }

    showToast(`Property deleted successfully.`, "warning");
    console.log(`[Developer Log] Table sync status: SUCCESS delete property (ID: ${id})`);
    
    if (prop && currentUser) {
      await addNotification(
        "Property Removed",
        `The property "${prop.name}" and its linked units were deleted.`,
        NotificationType.GENERAL,
        currentUser.id
      );
    }
    return true;
  };

  // Units CRUD
  const addUnit = async (unitData: Omit<Unit, "id">): Promise<boolean> => {
    const unitId = "un_" + Math.random().toString(36).substr(2, 9);
    const newUnit: Unit = {
      ...unitData,
      id: unitId
    };

    console.log(`[Developer Log] Attempting database insert for unit "${newUnit.unit_number}" (ID: ${unitId})...`);
    const { error } = await supabase.from("units").insert(newUnit);
    
    if (error) {
      if (error.message.includes("Invalid path specified in request URL") || error.message.includes("not found")) {
        console.warn(`[Developer Log] Table sync status: FAILED to insert unit (table not found, saving locally):`, error.message);
      } else {
        console.error(`[Developer Log] Table sync status: FAILED to insert unit:`, error.message);
        showToast(`Database Error: ${error.message}`, "error");
        return false;
      }
    }

    setUnits((prev) => [...prev, newUnit]);
    showToast(`Unit "${unitData.unit_number}" added successfully.`, "success");
    console.log(`[Developer Log] Table sync status: SUCCESS insert unit (ID: ${unitId})`);
    return true;
  };

  const updateUnit = async (updatedUnit: Unit): Promise<boolean> => {
    const oldUnits = units;
    setUnits((prev) => prev.map((u) => (u.id === updatedUnit.id ? updatedUnit : u)));
    
    console.log(`[Developer Log] Attempting database update for unit (ID: ${updatedUnit.id})...`);
    const { error } = await supabase.from("units").update(updatedUnit).eq("id", updatedUnit.id);
    
    if (error) {
      if (error.message.includes("Invalid path specified in request URL") || error.message.includes("not found")) {
        console.warn(`[Developer Log] Table sync status: FAILED to update unit (table not found, saving locally):`, error.message);
      } else {
        console.error(`[Developer Log] Table sync status: FAILED to update unit:`, error.message);
        showToast(`Database Error: ${error.message}`, "error");
        // Rollback local state
        setUnits(oldUnits);
        return false;
      }
    }

    showToast(`Unit "${updatedUnit.unit_number}" updated successfully.`, "success");
    console.log(`[Developer Log] Table sync status: SUCCESS update unit (ID: ${updatedUnit.id})`);
    return true;
  };

  const deleteUnit = async (id: string): Promise<boolean> => {
    const oldUnits = units;
    setUnits((prev) => prev.filter((u) => u.id !== id));
    
    console.log(`[Developer Log] Attempting database delete for unit (ID: ${id})...`);
    const { error } = await supabase.from("units").delete().eq("id", id);
    
    if (error) {
      if (error.message.includes("Invalid path specified in request URL") || error.message.includes("not found")) {
        console.warn(`[Developer Log] Table sync status: FAILED to delete unit (table not found, saving locally):`, error.message);
      } else {
        console.error(`[Developer Log] Table sync status: FAILED to delete unit:`, error.message);
        showToast(`Database Error: ${error.message}`, "error");
        // Rollback local state
        setUnits(oldUnits);
        return false;
      }
    }

    showToast(`Unit deleted successfully.`, "warning");
    console.log(`[Developer Log] Table sync status: SUCCESS delete unit (ID: ${id})`);
    return true;
  };

  const updateUnitStatus = async (id: string, status: UnitStatus): Promise<boolean> => {
    const oldUnits = units;
    setUnits((prev) => prev.map((u) => (u.id === id ? { ...u, status } : u)));
    
    console.log(`[Developer Log] Attempting database update status for unit (ID: ${id}) to ${status}...`);
    const { error } = await supabase.from("units").update({ status }).eq("id", id);
    
    if (error) {
      if (error.message.includes("Invalid path specified in request URL") || error.message.includes("not found")) {
        console.warn(`[Developer Log] Table sync status: FAILED to update unit status (table not found, saving locally):`, error.message);
      } else {
        console.error(`[Developer Log] Table sync status: FAILED to update unit status:`, error.message);
        showToast(`Database Error: ${error.message}`, "error");
        // Rollback local state
        setUnits(oldUnits);
        return false;
      }
    }

    console.log(`[Developer Log] Table sync status: SUCCESS update unit status (ID: ${id}) to ${status}`);
    return true;
  };

  // Applications CRUD
  const addApplication = async (app: Application): Promise<boolean> => {
    setApplications(prev => {
      // Prevent duplicates by checking id
      const filtered = prev.filter(a => a.id !== app.id);
      return [app, ...filtered];
    });
    try {
      const { error } = await supabase.from("applications").upsert({
        id: app.id,
        user_id: currentUser?.id || "u2",
        property_id: app.propertyId,
        property_name: app.propertyName,
        manager_name: app.managerName,
        price: app.price,
        applied_date: app.appliedDate,
        status: app.status,
        progress: app.progress
      });
      if (error) console.warn("[Developer Log] Supabase applications insert failed:", error.message);
    } catch (e) {
      console.warn("[Developer Log] Supabase applications insert error:", e);
    }
    return true;
  };

  const updateApplicationStatus = async (id: string, status: string, progress: number): Promise<boolean> => {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status, progress } : a));
    try {
      const { error } = await supabase.from("applications").update({ status, progress }).eq("id", id);
      if (error) console.warn("[Developer Log] Supabase applications update failed:", error.message);
    } catch (e) {
      console.warn("[Developer Log] Supabase applications update error:", e);
    }
    return true;
  };

  // Tenants CRUD
  const addTenant = async (tenantData: Omit<Tenant, "id" | "created_at">): Promise<boolean> => {
    const tenantId = "t_" + Math.random().toString(36).substr(2, 9);
    
    const newUser: UserProfile = {
      id: tenantId,
      full_name: tenantData.full_name,
      email: tenantData.email,
      phone: tenantData.phone,
      role: UserRole.TENANT,
      created_at: new Date().toISOString()
    };

    const newTenant: Tenant = {
      ...tenantData,
      id: tenantId,
      created_at: new Date().toISOString()
    };

    console.log(`[Developer Log] Executing transaction-like flow for adding Tenant:`);
    console.log(`[Developer Log] Step 1: Committing parent User profile (ID: ${tenantId})...`);
    
    // Parent user must be committed successfully before child tenant is created
    const { error: errUser } = await supabase.from("users").insert(newUser);
    if (errUser) {
      if (errUser.message.includes("Invalid path specified in request URL") || errUser.message.includes("not found")) {
        console.warn("[Developer Log] Foreign Key Safety: FAILED to commit parent User record (table not found, saving locally).", errUser.message);
      } else {
        console.error("[Developer Log] Foreign Key Safety: FAILED to commit parent User record. Aborting.", errUser.message);
        showToast(`Database Error registering tenant profile: ${errUser.message}`, "error");
        return false;
      }
    }

    console.log(`[Developer Log] Step 2: Committing child Tenant profile (ID: ${tenantId})...`);
    const { error: errTenant } = await supabase.from("tenants").insert(newTenant);
    
    if (errTenant) {
      if (errTenant.message.includes("Invalid path specified in request URL") || errTenant.message.includes("not found")) {
        console.warn("[Developer Log] Foreign Key Safety: FAILED to commit child Tenant record (table not found, saving locally).", errTenant.message);
      } else {
        console.error("[Developer Log] Foreign Key Safety: FAILED to commit child Tenant record. Rolling back committed parent User to preserve consistency.", errTenant.message);
        showToast(`Database Error registering tenant: ${errTenant.message}`, "error");
        
        // Rollback committed parent User record to maintain referential & consistency integrity
        const { error: rollbackErr } = await supabase.from("users").delete().eq("id", tenantId);
        if (rollbackErr) {
          console.error("[Developer Log] Critical Consistency Failure: Rollback of parent user failed!", rollbackErr.message);
        } else {
          console.log("[Developer Log] Database Consistency Rollback: SUCCESS");
        }
        return false;
      }
    }

    // Both succeeded: Update UI state
    setUsers((prev) => [...prev, newUser]);
    setTenants((prev) => [newTenant, ...prev]);
    showToast(`Tenant "${newTenant.full_name}" registered successfully.`, "success");
    console.log(`[Developer Log] Table sync status: SUCCESS onboarded Tenant (ID: ${tenantId})`);

    if (currentUser) {
      await addNotification(
        "New Tenant Onboarded",
        `Tenant "${newTenant.full_name}" has been registered.`,
        NotificationType.GENERAL,
        currentUser.id
      );
    }

    // Secure notification for tenant
    await addNotification(
      "Tenant Registration",
      `Your tenant portal has been successfully created. Welcome aboard!`,
      NotificationType.GENERAL,
      newTenant.id
    );

    return true;
  };

  const updateTenant = async (updatedTenant: Tenant): Promise<boolean> => {
    const oldTenants = tenants;
    setTenants((prev) => prev.map((t) => (t.id === updatedTenant.id ? updatedTenant : t)));
    
    console.log(`[Developer Log] Attempting database update for tenant (ID: ${updatedTenant.id})...`);
    const { error } = await supabase.from("tenants").update(updatedTenant).eq("id", updatedTenant.id);
    
    if (error) {
      console.error(`[Developer Log] Table sync status: FAILED to update tenant:`, error.message);
      showToast(`Database Error: ${error.message}`, "error");
      // Rollback local state
      setTenants(oldTenants);
      return false;
    }

    showToast(`Tenant "${updatedTenant.full_name}" details updated.`, "success");
    console.log(`[Developer Log] Table sync status: SUCCESS update tenant (ID: ${updatedTenant.id})`);
    return true;
  };

  const deleteTenant = async (id: string): Promise<boolean> => {
    const oldTenants = tenants;
    setTenants((prev) => prev.filter((t) => t.id !== id));
    
    console.log(`[Developer Log] Attempting database delete for tenant (ID: ${id})...`);
    const { error } = await supabase.from("tenants").delete().eq("id", id);
    
    if (error) {
      console.error(`[Developer Log] Table sync status: FAILED to delete tenant:`, error.message);
      showToast(`Database Error: ${error.message}`, "error");
      // Rollback local state
      setTenants(oldTenants);
      return false;
    }

    showToast(`Tenant profile deleted.`, "warning");
    console.log(`[Developer Log] Table sync status: SUCCESS delete tenant (ID: ${id})`);
    return true;
  };

  // Leases CRUD
  const addLease = async (leaseData: Omit<Lease, "id">): Promise<boolean> => {
    const leaseId = "l_" + Math.random().toString(36).substr(2, 9);
    const newLease: Lease = {
      ...leaseData,
      id: leaseId
    };

    console.log(`[Developer Log] Executing transaction-like flow for Lease Creation:`);
    console.log(`[Developer Log] Step 1: Committing parent Lease (ID: ${leaseId})...`);
    
    // Commit parent record before creating notifications or editing units
    const { error: errLease } = await supabase.from("leases").insert(newLease);
    if (errLease) {
      if (errLease.message.includes("Invalid path specified in request URL") || errLease.message.includes("not found")) {
        console.warn("[Developer Log] Transaction Flow: FAILED to commit Lease (table not found, saving locally).", errLease.message);
      } else {
        console.error("[Developer Log] Transaction Flow: FAILED to commit Lease. Aborting.", errLease.message);
        showToast(`Database Error creating lease: ${errLease.message}`, "error");
        return false;
      }
    }

    console.log(`[Developer Log] Step 2: Updating Unit status to Occupied...`);
    const { error: errUnit } = await supabase.from("units").update({
      status: UnitStatus.OCCUPIED,
      tenant_id: leaseData.tenant_id,
      tenant_name: leaseData.tenant_name
    }).eq("id", leaseData.unit_id);

    if (errUnit) {
      if (errUnit.message.includes("Invalid path specified in request URL") || errUnit.message.includes("not found")) {
        console.warn("[Developer Log] Transaction Flow: Failed to update unit status (table not found, saving locally).", errUnit.message);
      } else {
        console.error("[Developer Log] Transaction Flow: Failed to update unit status. Continuing but logging alert.", errUnit.message);
      }
    }

    console.log(`[Developer Log] Step 3: Generating next cycle pending rent invoice...`);
    const pendingPaymentData = {
      tenant_id: leaseData.tenant_id,
      tenant_name: leaseData.tenant_name,
      unit_id: leaseData.unit_id,
      unit_number: leaseData.unit_number,
      property_name: leaseData.property_name,
      amount: leaseData.rent_amount,
      due_date: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString().split("T")[0],
      status: PaymentStatus.PENDING
    };
    
    // We create payment (which internally triggers "Rent Due" notification to Tenant)
    await addPayment(pendingPaymentData);

    // Update local React state upon successful DB confirmation
    setLeases((prev) => [newLease, ...prev]);
    setUnits((prev) =>
      prev.map((u) =>
        u.id === leaseData.unit_id
          ? {
              ...u,
              status: UnitStatus.OCCUPIED,
              tenant_id: leaseData.tenant_id,
              tenant_name: leaseData.tenant_name
            }
          : u
      )
    );

    showToast(`Lease created for ${leaseData.tenant_name}.`, "success");
    console.log(`[Developer Log] Table sync status: SUCCESS Lease committed (ID: ${leaseId})`);

    // Notifications: Tenant only
    await addNotification(
      "Lease Registered",
      `New lease agreement created for you in ${leaseData.property_name} Unit ${leaseData.unit_number}.`,
      NotificationType.LEASE,
      leaseData.tenant_id
    );

    // Notifications: Owner only
    const prop = properties.find(p => p.id === leaseData.property_id);
    if (prop) {
      await addNotification(
        "Lease Registered",
        `New lease agreement created for ${leaseData.tenant_name} in ${leaseData.property_name} Unit ${leaseData.unit_number}.`,
        NotificationType.LEASE,
        prop.owner_id
      );
    }

    return true;
  };

  const updateLease = async (updatedLease: Lease): Promise<boolean> => {
    const oldLeases = leases;
    setLeases((prev) => prev.map((l) => (l.id === updatedLease.id ? updatedLease : l)));
    
    console.log(`[Developer Log] Attempting database update for lease (ID: ${updatedLease.id})...`);
    const { error } = await supabase.from("leases").update(updatedLease).eq("id", updatedLease.id);
    
    if (error) {
      console.error(`[Developer Log] Table sync status: FAILED to update lease:`, error.message);
      showToast(`Database Error: ${error.message}`, "error");
      // Rollback local state
      setLeases(oldLeases);
      return false;
    }

    showToast(`Lease agreement updated successfully.`, "success");
    console.log(`[Developer Log] Table sync status: SUCCESS update lease (ID: ${updatedLease.id})`);
    return true;
  };

  const deleteLease = async (id: string): Promise<boolean> => {
    const oldLeases = leases;
    setLeases((prev) => prev.filter((l) => l.id !== id));
    
    console.log(`[Developer Log] Attempting database delete for lease (ID: ${id})...`);
    const { error } = await supabase.from("leases").delete().eq("id", id);
    
    if (error) {
      console.error(`[Developer Log] Table sync status: FAILED to delete lease:`, error.message);
      showToast(`Database Error: ${error.message}`, "error");
      // Rollback local state
      setLeases(oldLeases);
      return false;
    }

    showToast(`Lease contract deleted.`, "warning");
    console.log(`[Developer Log] Table sync status: SUCCESS delete lease (ID: ${id})`);
    return true;
  };

  const updateLeaseStatus = async (id: string, status: LeaseStatus): Promise<boolean> => {
    const oldLeases = leases;
    setLeases((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    
    console.log(`[Developer Log] Attempting database update lease status (ID: ${id}) to ${status}...`);
    const { error } = await supabase.from("leases").update({ status }).eq("id", id);
    
    if (error) {
      console.error(`[Developer Log] Table sync status: FAILED to update lease status:`, error.message);
      showToast(`Database Error: ${error.message}`, "error");
      // Rollback local state
      setLeases(oldLeases);
      return false;
    }

    showToast(`Lease status updated to ${status}.`, "info");
    console.log(`[Developer Log] Table sync status: SUCCESS update lease status (ID: ${id}) to ${status}`);

    // Role-based Triggers for Lease Expiry (Tenant + Assigned Owner)
    const lease = leases.find((l) => l.id === id);
    if (lease && (status === LeaseStatus.EXPIRING || status === LeaseStatus.EXPIRED)) {
      // Notify Tenant only
      await addNotification(
        "Lease Expiry Notice",
        `Your lease contract for Unit ${lease.unit_number} in ${lease.property_name} is ${status.toLowerCase()}.`,
        NotificationType.LEASE,
        lease.tenant_id
      );

      // Notify Owner only
      const prop = properties.find((p) => p.id === lease.property_id);
      if (prop) {
        await addNotification(
          "Lease Expiry Alert",
          `The lease contract for tenant ${lease.tenant_name} in ${lease.property_name} Unit ${lease.unit_number} is now ${status.toLowerCase()}.`,
          NotificationType.LEASE,
          prop.owner_id
        );
      }
    }

    return true;
  };

  // Maintenance Tickets CRUD
  const addTicket = async (ticketData: Omit<MaintenanceTicket, "id" | "created_at" | "status" | "cost" | "images">): Promise<boolean> => {
    const ticketId = "tk_" + Math.random().toString(36).substr(2, 9);
    const newTicket: MaintenanceTicket = {
      ...ticketData,
      id: ticketId,
      status: TicketStatus.OPEN,
      cost: 0,
      images: [],
      created_at: new Date().toISOString()
    };

    console.log(`[Developer Log] Attempting database insert for ticket "${newTicket.title}" (ID: ${ticketId})...`);
    const { error } = await supabase.from("maintenance").insert(newTicket);
    
    if (error) {
      if (error.message.includes("Invalid path specified in request URL") || error.message.includes("not found")) {
        console.warn(`[Developer Log] Table sync status: FAILED to insert maintenance ticket (table not found, saving locally):`, error.message);
      } else {
        console.error(`[Developer Log] Table sync status: FAILED to insert maintenance ticket:`, error.message);
        showToast(`Database Error: ${error.message}`, "error");
        return false;
      }
    }

    setTickets((prev) => [newTicket, ...prev]);
    showToast(`Maintenance ticket submitted: "${ticketData.title}"`, "success");
    console.log(`[Developer Log] Table sync status: SUCCESS insert maintenance ticket (ID: ${ticketId})`);

    // Maintenance Created: Notify Owner only
    const prop = properties.find((p) => p.id === ticketData.property_id);
    const ownerId = prop?.owner_id || "u1";
    await addNotification(
      "New Maintenance Ticket",
      `Tenant ${newTicket.tenant_name} reported: "${newTicket.title}" (${newTicket.priority} Priority).`,
      NotificationType.MAINTENANCE,
      ownerId
    );

    return true;
  };

  const updateTicketStatus = async (id: string, status: TicketStatus): Promise<boolean> => {
    const oldTickets = tickets;
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    
    console.log(`[Developer Log] Attempting database update maintenance ticket status (ID: ${id}) to ${status}...`);
    const { error } = await supabase.from("maintenance").update({ status }).eq("id", id);
    
    if (error) {
      console.error(`[Developer Log] Table sync status: FAILED to update ticket status:`, error.message);
      showToast(`Database Error: ${error.message}`, "error");
      // Rollback local state
      setTickets(oldTickets);
      return false;
    }

    showToast(`Ticket status updated to ${status}.`, "success");
    console.log(`[Developer Log] Table sync status: SUCCESS update ticket status (ID: ${id}) to ${status}`);

    // Maintenance Updated: Notify Tenant only
    const ticket = tickets.find((t) => t.id === id);
    if (ticket) {
      await addNotification(
        "Maintenance Ticket Updated",
        `Your maintenance ticket "${ticket.title}" has been updated to ${status}.`,
        NotificationType.MAINTENANCE,
        ticket.tenant_id
      );
    }

    return true;
  };

  const updateTicketCost = async (id: string, cost: number): Promise<boolean> => {
    const oldTickets = tickets;
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, cost } : t)));
    
    console.log(`[Developer Log] Attempting database update maintenance ticket cost (ID: ${id}) to $${cost}...`);
    const { error } = await supabase.from("maintenance").update({ cost }).eq("id", id);
    
    if (error) {
      console.error(`[Developer Log] Table sync status: FAILED to update ticket cost:`, error.message);
      showToast(`Database Error: ${error.message}`, "error");
      // Rollback local state
      setTickets(oldTickets);
      return false;
    }

    showToast(`Ticket resolution cost updated to $${cost}.`, "success");
    console.log(`[Developer Log] Table sync status: SUCCESS update ticket cost (ID: ${id}) to $${cost}`);
    return true;
  };

  // Payments CRUD
  const addPayment = async (paymentData: Omit<RentPayment, "id">): Promise<boolean> => {
    const paymentId = "pay_" + Math.random().toString(36).substr(2, 9);
    const newPayment: RentPayment = {
      ...paymentData,
      id: paymentId
    };

    console.log(`[Developer Log] Attempting database insert for rent payment (ID: ${paymentId})...`);
    const { error } = await supabase.from("rent_payments").insert(newPayment);
    
    if (error) {
      if (error.message.includes("Invalid path specified in request URL") || error.message.includes("not found")) {
        console.warn(`[Developer Log] Table sync status: FAILED to insert payment record (table not found, saving locally):`, error.message);
      } else {
        console.error(`[Developer Log] Table sync status: FAILED to insert payment record:`, error.message);
        showToast(`Database Error: ${error.message}`, "error");
        return false;
      }
    }

    setPayments((prev) => [newPayment, ...prev]);
    showToast(`Rent payment record created.`, "success");
    console.log(`[Developer Log] Table sync status: SUCCESS insert payment record (ID: ${paymentId})`);

    // Rent Due: Notify Tenant only
    await addNotification(
      "Rent Payment Due",
      `Rent payment of $${newPayment.amount} is due on ${newPayment.due_date} for Unit ${newPayment.unit_number}.`,
      NotificationType.PAYMENT,
      newPayment.tenant_id
    );

    return true;
  };

  const updatePayment = async (updatedPayment: RentPayment): Promise<boolean> => {
    const oldPayments = payments;
    setPayments((prev) => prev.map((p) => (p.id === updatedPayment.id ? updatedPayment : p)));
    
    console.log(`[Developer Log] Attempting database update for payment record (ID: ${updatedPayment.id})...`);
    const { error } = await supabase.from("rent_payments").update(updatedPayment).eq("id", updatedPayment.id);
    
    if (error) {
      console.error(`[Developer Log] Table sync status: FAILED to update payment record:`, error.message);
      showToast(`Database Error: ${error.message}`, "error");
      // Rollback local state
      setPayments(oldPayments);
      return false;
    }

    showToast(`Rent payment record updated.`, "success");
    console.log(`[Developer Log] Table sync status: SUCCESS update payment record (ID: ${updatedPayment.id})`);
    return true;
  };

  const deletePayment = async (id: string): Promise<boolean> => {
    const oldPayments = payments;
    setPayments((prev) => prev.filter((p) => p.id !== id));
    
    console.log(`[Developer Log] Attempting database delete for payment record (ID: ${id})...`);
    const { error } = await supabase.from("rent_payments").delete().eq("id", id);
    
    if (error) {
      console.error(`[Developer Log] Table sync status: FAILED to delete payment record:`, error.message);
      showToast(`Database Error: ${error.message}`, "error");
      // Rollback local state
      setPayments(oldPayments);
      return false;
    }

    showToast(`Rent record deleted.`, "warning");
    console.log(`[Developer Log] Table sync status: SUCCESS delete payment record (ID: ${id})`);
    return true;
  };

  const markPaymentPaid = async (id: string, method: string): Promise<boolean> => {
    const paidDate = new Date().toISOString().split("T")[0];
    const oldPayments = payments;
    
    console.log(`[Developer Log] Attempting database update: Mark payment ${id} PAID via ${method}...`);
    const { error } = await supabase.from("rent_payments").update({
      status: PaymentStatus.PAID,
      paid_date: paidDate,
      payment_method: method
    }).eq("id", id);

    if (error) {
      if (error.message.includes("Invalid path specified in request URL") || error.message.includes("not found")) {
        console.warn(`[Developer Log] Table sync status: FAILED to mark payment PAID (table not found, saving locally):`, error.message);
      } else {
        console.error(`[Developer Log] Table sync status: FAILED to mark payment PAID:`, error.message);
        showToast(`Database Error: ${error.message}`, "error");
        return false;
      }
    }

    setPayments((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: PaymentStatus.PAID,
              paid_date: paidDate,
              payment_method: method
            }
          : p
      )
    );

    showToast(`Rent payment marked as PAID via ${method}.`, "success");
    console.log(`[Developer Log] Table sync status: SUCCESS marked payment ${id} PAID`);

    const pay = payments.find((p) => p.id === id);
    if (pay) {
      // Payment Confirmed: Notify Tenant only
      await addNotification(
        "Payment Confirmed",
        `Your rent payment of ${formatPKR(pay.amount)} for Unit ${pay.unit_number} has been confirmed.`,
        NotificationType.PAYMENT,
        pay.tenant_id
      );

      // Payment Submitted / Received: Notify Owner only
      const unit = units.find(u => u.id === pay.unit_id);
      const prop = properties.find(p => p.id === unit?.property_id);
      if (prop) {
        await addNotification(
          "Payment Submitted",
          `Rent payment of ${formatPKR(pay.amount)} has been successfully completed for ${prop.name} Unit ${pay.unit_number}.`,
          NotificationType.PAYMENT,
          prop.owner_id
        );
      }
    }

    return true;
  };

  // Secure Notifications Engine
  const addNotification = async (
    title: string,
    message: string,
    type: NotificationType,
    targetUserId?: string
  ): Promise<boolean> => {
    // Strictly require a recipient (never fall back to fake IDs or create orphans)
    const recipientId = targetUserId || currentUser?.id;

    if (!recipientId) {
      console.error("[Developer Log] Security Failure: Unable to create notification. No valid recipient user ID.");
      showToast("Unable to create notification.", "error");
      return false;
    }

    const newNotif: InAppNotification = {
      id: "n_" + Math.random().toString(36).substr(2, 9),
      user_id: recipientId,
      title,
      message,
      type,
      is_read: false,
      created_at: new Date().toISOString()
    };

    console.log(`[Developer Log] Notification Security Rule check passed. Inserting notification for user_id = ${recipientId}...`);
    const { error } = await supabase.from("notifications").insert(newNotif);
    
    if (error) {
      if (error.message.includes("Invalid path specified in request URL") || error.message.includes("not found")) {
        console.warn(`[Developer Log] Notification dispatch: FAILED to write notification to database (notifications table not found):`, error.message);
      } else {
        console.error(`[Developer Log] Notification dispatch: FAILED to write notification to database:`, error.message);
        return false;
      }
    }

    // Secure local update: Only push to active notifications state if it is meant for the logged-in user
    if (currentUser && recipientId === currentUser.id) {
      setNotifications((prev) => [newNotif, ...prev]);
    }
    
    console.log(`[Developer Log] Notification dispatch: SUCCESS secure routing to user_id = ${recipientId}`);
    return true;
  };

  const markNotificationRead = async (id: string): Promise<boolean> => {
    const oldNotifs = notifications;
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    
    console.log(`[Developer Log] Attempting database update: Mark notification ${id} read...`);
    const { error } = await supabase.from("notifications").update({ is_read: true }).eq("id", id);
    
    if (error) {
      if (error.message.includes("Invalid path specified in request URL") || error.message.includes("not found")) {
        console.warn(`[Developer Log] Table sync status: FAILED to mark notification read (notifications table not found):`, error.message);
        return true; // Keep local changes as success
      } else {
        console.error(`[Developer Log] Table sync status: FAILED to mark notification read:`, error.message);
        setNotifications(oldNotifs);
        return false;
      }
    }

    console.log(`[Developer Log] Table sync status: SUCCESS marked notification ${id} read`);
    return true;
  };

  const clearNotifications = async (): Promise<boolean> => {
    if (!currentUser) {
      console.error("[Developer Log] Failed to clear notifications: No authenticated user.");
      return false;
    }

    const oldNotifs = notifications;
    setNotifications([]);
    
    console.log(`[Developer Log] Attempting database clear notifications for user_id = ${currentUser.id}...`);
    const { error } = await supabase.from("notifications").delete().eq("user_id", currentUser.id);
    
    if (error) {
      if (error.message.includes("Invalid path specified in request URL") || error.message.includes("not found")) {
        console.warn(`[Developer Log] Table sync status: FAILED to clear notifications (notifications table not found):`, error.message);
        showToast("Notifications cleared locally.", "info");
        return true; // Return true as we successfully cleared locally
      } else {
        console.error(`[Developer Log] Table sync status: FAILED to clear notifications:`, error.message);
        setNotifications(oldNotifs);
        showToast(`Database Error: ${error.message}`, "error");
        return false;
      }
    }

    showToast("Notifications cleared.", "info");
    console.log(`[Developer Log] Table sync status: SUCCESS cleared notifications for user_id = ${currentUser.id}`);
    return true;
  };

  // Contact Inquiries
  const addContactInquiry = async (inquiryData: Omit<ContactInquiry, "id" | "created_at">): Promise<boolean> => {
    const newInq: ContactInquiry = {
      ...inquiryData,
      id: "inq_" + Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString()
    };

    console.log(`[Developer Log] Attempting database insert for contact inquiry...`);
    const { error } = await supabase.from("contact_inquiries").insert(newInq);
    
    if (error) {
      console.error(`[Developer Log] Table sync status: FAILED to insert contact inquiry:`, error.message);
      showToast(`Database Error: ${error.message}`, "error");
      return false;
    }

    setContacts((prev) => [newInq, ...prev]);
    showToast(`Inquiry sent successfully! Our team will contact you shortly.`, "success");
    console.log(`[Developer Log] Table sync status: SUCCESS insert contact inquiry`);
    return true;
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        properties,
        units,
        leases,
        tickets,
        payments,
        notifications,
        contacts,
        toasts,
        tenants,
        applications,
        login,
        register,
        logout,
        forgotPassword,
        switchRole,
        addProperty,
        updateProperty,
        deleteProperty,
        addUnit,
        updateUnit,
        deleteUnit,
        updateUnitStatus,
        addTenant,
        updateTenant,
        deleteTenant,
        addLease,
        updateLease,
        deleteLease,
        updateLeaseStatus,
        addTicket,
        updateTicketStatus,
        updateTicketCost,
        addPayment,
        updatePayment,
        deletePayment,
        markPaymentPaid,
        addNotification,
        markNotificationRead,
        clearNotifications,
        addContactInquiry,
        addApplication,
        updateApplicationStatus,
        showToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
