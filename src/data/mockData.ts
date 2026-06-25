/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Property,
  PropertyType,
  PropertyStatus,
  Unit,
  UnitStatus,
  UserProfile,
  UserRole,
  Lease,
  LeaseStatus,
  MaintenanceTicket,
  TicketPriority,
  TicketStatus,
  RentPayment,
  PaymentStatus,
  InAppNotification,
  NotificationType,
  Testimonial,
  FAQItem,
  Tenant
} from "../types";

export const initialTestimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Sarah Jenkins",
    role: "Property Owner (45 Units)",
    company: "Apex Realty Group",
    content: "PROPERTYLOG completely transformed how we manage our portfolio. We reduced manual rent follow-ups by 80% and resolved maintenance issues twice as fast. A game changer for small and medium owners.",
    avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "t2",
    name: "Marcus Vance",
    role: "Senior Portfolio Manager",
    company: "Vance Holdings",
    content: "The automated lease tracking and seamless tenant onboarding saved us hundreds of administrative hours. The elegant design is a joy to work with, both for my team and our tenants.",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "t3",
    name: "Elena Rostova",
    role: "Residential Landlord",
    company: "Individual Owner",
    content: "I manage 8 residential properties on my own. Before PROPERTYLOG, I was constantly buried in sticky notes and Excel sheets. Now everything is beautifully automated. Highly recommended!",
    avatar_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
  }
];

export const initialFAQs: FAQItem[] = [
  {
    question: "What is PROPERTYLOG?",
    answer: "PROPERTYLOG is an all-in-one modern Property Management SaaS designed to help property owners, real estate managers, and landlords streamline rent tracking, lease contracts, tenant communications, and maintenance ticket handling."
  },
  {
    question: "How does the rent collection tracking work?",
    answer: "Our dashboard monitors monthly lease agreements, automatically marks rent invoices as Pending, and tracks when they are paid or Overdue. It offers real-time analytics on your rent collection rate and financial performance."
  },
  {
    question: "Can tenants submit maintenance requests?",
    answer: "Yes! Tenants have dedicated dashboards where they can submit maintenance requests with description, photos, and priority levels. Landlords and owners can view, update progress, and assign contractors to these tickets."
  },
  {
    question: "Is there local or cloud persistence?",
    answer: "Absolutely! The system utilizes resilient localStorage combined with full-stack Node API simulation. Any properties, tenants, leases, or maintenance tickets you create are instantly saved and persist across page refreshes."
  },
  {
    question: "Does it support multiple user roles?",
    answer: "Yes, PROPERTYLOG supports Admin, Owner, and Tenant roles. The application completely customizes the dashboard interface based on the active logged-in user's role."
  }
];

export const initialUsers: UserProfile[] = [
  {
    id: "u1",
    full_name: "Alex Mercer",
    email: "owner@propertylog.com",
    phone: "+1 (555) 019-2834",
    role: UserRole.OWNER,
    created_at: "2026-01-10T12:00:00Z"
  },
  {
    id: "u2",
    full_name: "Jane Doe",
    email: "tenant@propertylog.com",
    phone: "+1 (555) 023-4567",
    role: UserRole.TENANT,
    created_at: "2026-02-15T09:30:00Z"
  },
  {
    id: "u3",
    full_name: "Sarah Jenkins",
    email: "admin@propertylog.com",
    phone: "+1 (555) 012-3456",
    role: UserRole.ADMIN,
    created_at: "2026-01-01T08:00:00Z"
  }
];

export const initialProperties: Property[] = [
  {
    id: "p1",
    name: "Oakridge Heights",
    address: "742 Evergreen Terrace, Springfield",
    type: PropertyType.APARTMENT,
    units_count: 12,
    status: PropertyStatus.ACTIVE,
    image_url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80",
    owner_id: "u1",
    created_at: "2026-01-15T10:00:00Z"
  },
  {
    id: "p2",
    name: "Sunset Ridge Villa",
    address: "890 Ocean Drive, Miami Beach",
    type: PropertyType.HOUSE,
    units_count: 1,
    status: PropertyStatus.ACTIVE,
    image_url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80",
    owner_id: "u1",
    created_at: "2026-02-01T11:30:00Z"
  },
  {
    id: "p3",
    name: "Metro Plaza Commercial",
    address: "101 Broadway, New York City",
    type: PropertyType.COMMERCIAL,
    units_count: 4,
    status: PropertyStatus.ACTIVE,
    image_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80",
    owner_id: "u1",
    created_at: "2026-01-20T14:15:00Z"
  },
  {
    id: "p4",
    name: "Pineview Luxury Condos",
    address: "55 Pine Needle Way, Aspen",
    type: PropertyType.CONDO,
    units_count: 8,
    status: PropertyStatus.MAINTENANCE,
    image_url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80",
    owner_id: "u1",
    created_at: "2026-03-05T16:45:00Z"
  }
];

export const initialUnits: Unit[] = [
  // Oakridge Heights units
  { id: "un1", property_id: "p1", property_name: "Oakridge Heights", unit_number: "101", rent_amount: 1450, status: UnitStatus.OCCUPIED, tenant_id: "t1", tenant_name: "Jane Doe" },
  { id: "un2", property_id: "p1", property_name: "Oakridge Heights", unit_number: "102", rent_amount: 1450, status: UnitStatus.OCCUPIED, tenant_id: "t2", tenant_name: "John Smith" },
  { id: "un3", property_id: "p1", property_name: "Oakridge Heights", unit_number: "201", rent_amount: 1500, status: UnitStatus.VACANT, tenant_id: null, tenant_name: null },
  { id: "un4", property_id: "p1", property_name: "Oakridge Heights", unit_number: "202", rent_amount: 1500, status: UnitStatus.MAINTENANCE, tenant_id: null, tenant_name: null },
  
  // Sunset Villa
  { id: "un5", property_id: "p2", property_name: "Sunset Ridge Villa", unit_number: "A", rent_amount: 3200, status: UnitStatus.OCCUPIED, tenant_id: "t3", tenant_name: "Michael Chang" },
  
  // Metro Plaza
  { id: "un6", property_id: "p3", property_name: "Metro Plaza Commercial", unit_number: "Suite 100", rent_amount: 5500, status: UnitStatus.OCCUPIED, tenant_id: "t4", tenant_name: "Innovate Tech LLC" },
  { id: "un7", property_id: "p3", property_name: "Metro Plaza Commercial", unit_number: "Suite 200", rent_amount: 4800, status: UnitStatus.VACANT, tenant_id: null, tenant_name: null }
];

export const initialLeases: Lease[] = [
  {
    id: "l1",
    property_id: "p1",
    property_name: "Oakridge Heights",
    unit_id: "un1",
    unit_number: "101",
    tenant_id: "t1",
    tenant_name: "Jane Doe",
    start_date: "2026-01-01",
    end_date: "2026-12-31",
    rent_amount: 1450,
    deposit_amount: 1450,
    status: LeaseStatus.ACTIVE
  },
  {
    id: "l2",
    property_id: "p1",
    property_name: "Oakridge Heights",
    unit_id: "un2",
    unit_number: "102",
    tenant_id: "t2",
    tenant_name: "John Smith",
    start_date: "2025-07-15",
    end_date: "2026-07-14",
    rent_amount: 1450,
    deposit_amount: 1000,
    status: LeaseStatus.EXPIRING
  },
  {
    id: "l3",
    property_id: "p2",
    property_name: "Sunset Ridge Villa",
    unit_id: "un5",
    unit_number: "A",
    tenant_id: "t3",
    tenant_name: "Michael Chang",
    start_date: "2026-02-01",
    end_date: "2027-01-31",
    rent_amount: 3200,
    deposit_amount: 3200,
    status: LeaseStatus.ACTIVE
  }
];

export const initialTickets: MaintenanceTicket[] = [
  {
    id: "tk1",
    property_id: "p1",
    property_name: "Oakridge Heights",
    unit_id: "un1",
    unit_number: "101",
    tenant_id: "t1",
    tenant_name: "Jane Doe",
    title: "Leaking kitchen sink pipe",
    description: "The hot water supply line under the kitchen sink is slowly dripping, creating a pool inside the cupboard. Requires a plumber to replace the gasket or pipe.",
    priority: TicketPriority.HIGH,
    status: TicketStatus.IN_PROGRESS,
    created_at: "2026-06-22T08:30:00Z"
  },
  {
    id: "tk2",
    property_id: "p1",
    property_name: "Oakridge Heights",
    unit_id: "un2",
    unit_number: "102",
    tenant_id: "t2",
    tenant_name: "John Smith",
    title: "Squeaky HVAC fan motor",
    description: "When the air conditioning runs, there is a very high pitched squeak coming from the bedroom vent. Might need fan lubrication or belt replacement.",
    priority: TicketPriority.MEDIUM,
    status: TicketStatus.OPEN,
    created_at: "2026-06-24T14:15:00Z"
  },
  {
    id: "tk3",
    property_id: "p2",
    property_name: "Sunset Ridge Villa",
    unit_id: "un5",
    unit_number: "A",
    tenant_id: "t3",
    tenant_name: "Michael Chang",
    title: "Driveway gate sensor broken",
    description: "The automatic gate does not slide open when pressing the clicker or when positioned near the driveway loop. Currently locked open for safety.",
    priority: TicketPriority.URGENT,
    status: TicketStatus.OPEN,
    created_at: "2026-06-24T18:00:00Z"
  },
  {
    id: "tk4",
    property_id: "p1",
    property_name: "Oakridge Heights",
    unit_id: "un1",
    unit_number: "101",
    tenant_id: "t1",
    tenant_name: "Jane Doe",
    title: "Loose front entry doorknob",
    description: "The outer handle screws have come loose and the whole mechanism wiggles. Can lock, but feels insecure.",
    priority: TicketPriority.LOW,
    status: TicketStatus.RESOLVED,
    created_at: "2026-06-10T11:00:00Z"
  }
];

export const initialPayments: RentPayment[] = [
  // Current month (June 2026)
  {
    id: "pay1",
    tenant_id: "t1",
    tenant_name: "Jane Doe",
    unit_id: "un1",
    unit_number: "101",
    property_name: "Oakridge Heights",
    amount: 1450,
    due_date: "2026-06-01",
    paid_date: "2026-06-01",
    status: PaymentStatus.PAID,
    payment_method: "Direct Deposit"
  },
  {
    id: "pay2",
    tenant_id: "t2",
    tenant_name: "John Smith",
    unit_id: "un2",
    unit_number: "102",
    property_name: "Oakridge Heights",
    amount: 1450,
    due_date: "2026-06-01",
    paid_date: "2026-06-03",
    status: PaymentStatus.PAID,
    payment_method: "Credit Card"
  },
  {
    id: "pay3",
    tenant_id: "t3",
    tenant_name: "Michael Chang",
    unit_id: "un5",
    unit_number: "A",
    property_name: "Sunset Ridge Villa",
    amount: 3200,
    due_date: "2026-06-01",
    status: PaymentStatus.OVERDUE
  },
  {
    id: "pay4",
    tenant_id: "t4",
    tenant_name: "Innovate Tech LLC",
    unit_id: "un6",
    unit_number: "Suite 100",
    property_name: "Metro Plaza Commercial",
    amount: 5500,
    due_date: "2026-06-15",
    paid_date: "2026-06-14",
    status: PaymentStatus.PAID,
    payment_method: "Bank Transfer"
  },
  
  // Upcoming month (July 2026) - pending
  {
    id: "pay5",
    tenant_id: "t1",
    tenant_name: "Jane Doe",
    unit_id: "un1",
    unit_number: "101",
    property_name: "Oakridge Heights",
    amount: 1450,
    due_date: "2026-07-01",
    status: PaymentStatus.PENDING
  },
  {
    id: "pay6",
    tenant_id: "t2",
    tenant_name: "John Smith",
    unit_id: "un2",
    unit_number: "102",
    property_name: "Oakridge Heights",
    amount: 1450,
    due_date: "2026-07-01",
    status: PaymentStatus.PENDING
  },
  {
    id: "pay7",
    tenant_id: "t3",
    tenant_name: "Michael Chang",
    unit_id: "un5",
    unit_number: "A",
    property_name: "Sunset Ridge Villa",
    amount: 3200,
    due_date: "2026-07-01",
    status: PaymentStatus.PENDING
  }
];

export const initialNotifications: InAppNotification[] = [
  {
    id: "n1",
    user_id: "u1",
    title: "New Maintenance Ticket",
    message: "Michael Chang filed an Urgent maintenance ticket: 'Driveway gate sensor broken' for Sunset Ridge Villa.",
    type: NotificationType.MAINTENANCE,
    is_read: false,
    created_at: "2026-06-24T18:02:00Z"
  },
  {
    id: "n2",
    user_id: "u1",
    title: "Rent Overdue Notification",
    message: "Rent payment of $3,200 for Sunset Ridge Villa (Michael Chang) is now overdue since June 1st.",
    type: NotificationType.PAYMENT,
    is_read: false,
    created_at: "2026-06-10T09:00:00Z"
  },
  {
    id: "n3",
    user_id: "u1",
    title: "Lease Expiring Soon",
    message: "John Smith's lease for Oakridge Heights Unit 102 will expire on 2026-07-14 (less than 30 days remaining).",
    type: NotificationType.LEASE,
    is_read: true,
    created_at: "2026-06-15T08:00:00Z"
  },
  {
    id: "n4",
    user_id: "u2", // Tenant
    title: "Maintenance Ticket Updated",
    message: "Your ticket 'Leaking kitchen sink pipe' has been updated to In Progress. A plumber is scheduled for tomorrow morning.",
    type: NotificationType.MAINTENANCE,
    is_read: false,
    created_at: "2026-06-23T10:00:00Z"
  }
];

export const initialTenants: Tenant[] = [
  {
    id: "t1",
    full_name: "Jane Doe",
    phone: "+1 (555) 023-4567",
    email: "tenant@propertylog.com",
    cnic: "37405-1234567-8",
    passport: "AB1234567",
    emergency_contact: "Richard Doe (+1 (555) 098-7654)",
    cnic_doc_url: "cnic_mock_url.jpg",
    passport_doc_url: "passport_mock_url.jpg",
    agreement_doc_url: "agreement_mock_url.pdf",
    created_at: "2026-01-01T12:00:00Z"
  },
  {
    id: "t2",
    full_name: "John Smith",
    phone: "+1 (555) 345-6789",
    email: "john.smith@gmail.com",
    cnic: "35201-9876543-1",
    passport: "",
    emergency_contact: "Mary Smith (+1 (555) 333-4444)",
    cnic_doc_url: "cnic_john.jpg",
    agreement_doc_url: "lease_john.pdf",
    created_at: "2025-07-15T12:00:00Z"
  },
  {
    id: "t3",
    full_name: "Michael Chang",
    phone: "+1 (555) 456-7890",
    email: "michael.c@yahoo.com",
    cnic: "42301-4455667-3",
    passport: "PP9876543",
    emergency_contact: "Sophea Chang (+1 (555) 888-9999)",
    cnic_doc_url: "",
    created_at: "2026-02-01T12:00:00Z"
  }
];

