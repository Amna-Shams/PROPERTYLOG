-- PostgreSQL database schema for PROPERTYLOG
-- Includes tables for: users, properties, units, tenants, leases, rent_payments, maintenance, documents, notifications

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(30),
    role VARCHAR(20) NOT NULL CHECK (role IN ('Admin', 'Owner', 'Tenant')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Index for user email lookup
CREATE INDEX idx_users_email ON users(email);
-- Index for user role
CREATE INDEX idx_users_role ON users(role);

-- Table: properties
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    type VARCHAR(35) NOT NULL CHECK (type IN ('House', 'Apartment', 'Plaza', 'Shop', 'Hostel', 'Commercial', 'Condo')),
    units_count INTEGER DEFAULT 0 NOT NULL,
    status VARCHAR(20) DEFAULT 'Active' NOT NULL CHECK (status IN ('Active', 'Maintenance', 'Inactive')),
    image_url TEXT,
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    latitude NUMERIC(10, 8),
    longitude NUMERIC(11, 8),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Index for property owner
CREATE INDEX idx_properties_owner_id ON properties(owner_id);

-- Table: units
CREATE TABLE units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    property_name VARCHAR(100) NOT NULL,
    unit_number VARCHAR(20) NOT NULL,
    rent_amount NUMERIC(12, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'Available' NOT NULL CHECK (status IN ('Available', 'Occupied', 'Maintenance')),
    tenant_id UUID REFERENCES users(id) ON DELETE SET NULL,
    tenant_name VARCHAR(100),
    floor VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT unique_property_unit UNIQUE(property_id, unit_number)
);

-- Indexes for units
CREATE INDEX idx_units_property_id ON units(property_id);
CREATE INDEX idx_units_tenant_id ON units(tenant_id);

-- Table: tenants
CREATE TABLE tenants (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    email VARCHAR(150) NOT NULL,
    cnic VARCHAR(30) NOT NULL,
    passport VARCHAR(50),
    emergency_contact VARCHAR(100) NOT NULL,
    cnic_doc_url TEXT,
    passport_doc_url TEXT,
    agreement_doc_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Table: leases
CREATE TABLE leases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    property_name VARCHAR(100) NOT NULL,
    unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
    unit_number VARCHAR(20) NOT NULL,
    tenant_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tenant_name VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    rent_amount NUMERIC(12, 2) NOT NULL,
    deposit_amount NUMERIC(12, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'Active' NOT NULL CHECK (status IN ('Active', 'Expiring', 'Terminated', 'Expired', 'Pending')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Indexes for leases
CREATE INDEX idx_leases_property_id ON leases(property_id);
CREATE INDEX idx_leases_unit_id ON leases(unit_id);
CREATE INDEX idx_leases_tenant_id ON leases(tenant_id);

-- Table: rent_payments
CREATE TABLE rent_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tenant_name VARCHAR(100) NOT NULL,
    unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
    unit_number VARCHAR(20) NOT NULL,
    property_name VARCHAR(100) NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    due_date DATE NOT NULL,
    paid_date DATE,
    status VARCHAR(20) DEFAULT 'Unpaid' NOT NULL CHECK (status IN ('Paid', 'Partial', 'Unpaid', 'Pending', 'Overdue')),
    payment_method VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Indexes for rent payments
CREATE INDEX idx_rent_payments_tenant_id ON rent_payments(tenant_id);
CREATE INDEX idx_rent_payments_unit_id ON rent_payments(unit_id);
CREATE INDEX idx_rent_payments_status ON rent_payments(status);

-- Table: maintenance (tickets)
CREATE TABLE maintenance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    property_name VARCHAR(100) NOT NULL,
    unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
    unit_number VARCHAR(20) NOT NULL,
    tenant_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tenant_name VARCHAR(100) NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('Low', 'Medium', 'High', 'Urgent')),
    status VARCHAR(20) DEFAULT 'Open' NOT NULL CHECK (status IN ('Open', 'In Progress', 'Resolved', 'Closed')),
    cost NUMERIC(12, 2) DEFAULT 0.00,
    images TEXT[], -- Array of image URLs/S3 links
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Indexes for maintenance
CREATE INDEX idx_maintenance_property_id ON maintenance(property_id);
CREATE INDEX idx_maintenance_tenant_id ON maintenance(tenant_id);
CREATE INDEX idx_maintenance_status ON maintenance(status);

-- Table: documents
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lease_id UUID REFERENCES leases(id) ON DELETE SET NULL,
    name VARCHAR(150) NOT NULL,
    file_url TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    uploaded_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Table: notifications (Role-Based Secure Notifications)
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(30) NOT NULL CHECK (type IN ('Lease', 'Payment', 'Maintenance', 'General')),
    status VARCHAR(20) DEFAULT 'Unread' NOT NULL CHECK (status IN ('Unread', 'Read')),
    is_read BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Index for fast user-specific lookup of unread notifications
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_user_created ON notifications(user_id, created_at DESC);
