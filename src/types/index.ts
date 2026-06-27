/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum UserRole {
  ADMIN = "Admin",
  OWNER = "Owner",
  TENANT = "Tenant",
  PROPERTY_MANAGER = "Property Manager"
}

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: UserRole;
  created_at: string;
}

export enum PropertyType {
  HOUSE = "House",
  APARTMENT = "Apartment",
  PLAZA = "Plaza",
  SHOP = "Shop",
  HOSTEL = "Hostel",
  COMMERCIAL = "Commercial",
  CONDO = "Condo"
}

export enum PropertyStatus {
  ACTIVE = "Active",
  MAINTENANCE = "Maintenance",
  INACTIVE = "Inactive"
}

export interface Property {
  id: string;
  name: string;
  address: string;
  type: PropertyType;
  units_count: number;
  status: PropertyStatus;
  image_url: string;
  owner_id: string;
  created_at: string;
  latitude?: number;
  longitude?: number;
  description?: string;
}

export enum UnitStatus {
  AVAILABLE = "Available",
  OCCUPIED = "Occupied",
  MAINTENANCE = "Maintenance",
  VACANT = "Available"
}

export interface Unit {
  id: string;
  property_id: string;
  property_name: string;
  unit_number: string;
  rent_amount: number; // monthly rent
  status: UnitStatus;
  tenant_id: string | null;
  tenant_name: string | null;
  floor?: number | string;
  created_at?: string;
}

export enum LeaseStatus {
  ACTIVE = "Active",
  EXPIRING = "Expiring",
  TERMINATED = "Terminated",
  EXPIRED = "Expired",
  PENDING = "Pending"
}

export interface Lease {
  id: string;
  property_id: string;
  property_name: string;
  unit_id: string;
  unit_number: string;
  tenant_id: string;
  tenant_name: string;
  start_date: string;
  end_date: string;
  rent_amount: number;
  deposit_amount: number;
  status: LeaseStatus;
}

export enum TicketPriority {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High",
  URGENT = "Urgent"
}

export enum TicketStatus {
  OPEN = "Open",
  IN_PROGRESS = "In Progress",
  RESOLVED = "Resolved",
  CLOSED = "Closed"
}

export interface MaintenanceTicket {
  id: string;
  property_id: string;
  property_name: string;
  unit_id: string;
  unit_number: string;
  tenant_id: string;
  tenant_name: string;
  title: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  created_at: string;
  cost?: number;
  images?: string[]; // array of base64 or mockup urls
}

export enum PaymentStatus {
  PAID = "Paid",
  PARTIAL = "Partial",
  UNPAID = "Unpaid",
  PENDING = "Pending", // for backwards compatibility
  OVERDUE = "Overdue"  // for backwards compatibility
}

export interface Tenant {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  cnic: string;
  passport?: string;
  emergency_contact: string;
  cnic_doc_url?: string;
  passport_doc_url?: string;
  agreement_doc_url?: string;
  created_at: string;
}

export interface RentPayment {
  id: string;
  tenant_id: string;
  tenant_name: string;
  unit_id: string;
  unit_number: string;
  property_name: string;
  amount: number;
  due_date: string;
  paid_date?: string;
  status: PaymentStatus;
  payment_method?: string;
}

export enum NotificationType {
  LEASE = "Lease",
  PAYMENT = "Payment",
  MAINTENANCE = "Maintenance",
  GENERAL = "General"
}

export interface InAppNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  created_at: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar_url: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
}

export interface Application {
  id: string;
  propertyId: string;
  propertyName: string;
  managerName: string;
  price: number;
  appliedDate: string;
  status: string; // 'Pending' | 'Approved' | 'Rejected' | 'Draft' | 'Checking References' | 'Identity Verified' | 'Owner Approved' | 'Contract Signed'
  progress: number;
  documents: Record<string, string>; // base64 or file name references
  details: Record<string, any>; // multi-section form data
}
