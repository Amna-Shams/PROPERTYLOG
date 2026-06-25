-- SQL Setup for PROPERTYLOG Supabase Integration
-- Execute this entire script in your Supabase SQL Editor (https://supabase.com -> Project -> SQL Editor)

-- 1. CLEANUP (Optional: Uncomment to reset tables)
-- DROP TABLE IF EXISTS contact_inquiries CASCADE;
-- DROP TABLE IF EXISTS notifications CASCADE;
-- DROP TABLE IF EXISTS maintenance CASCADE;
-- DROP TABLE IF EXISTS rent_payments CASCADE;
-- DROP TABLE IF EXISTS leases CASCADE;
-- DROP TABLE IF EXISTS tenants CASCADE;
-- DROP TABLE IF EXISTS units CASCADE;
-- DROP TABLE IF EXISTS properties CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;

-- 2. CREATE TABLES (Optimized for flexible VARCHAR keys)

-- Table: users
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(100) PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(30),
    role VARCHAR(20) NOT NULL CHECK (role IN ('Admin', 'Owner', 'Tenant')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Table: properties
CREATE TABLE IF NOT EXISTS properties (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    type VARCHAR(35) NOT NULL,
    units_count INTEGER DEFAULT 0 NOT NULL,
    status VARCHAR(20) DEFAULT 'Active' NOT NULL CHECK (status IN ('Active', 'Maintenance', 'Inactive')),
    image_url TEXT,
    owner_id VARCHAR(100) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    latitude NUMERIC(10, 8),
    longitude NUMERIC(11, 8),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Table: units
CREATE TABLE IF NOT EXISTS units (
    id VARCHAR(100) PRIMARY KEY,
    property_id VARCHAR(100) NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    property_name VARCHAR(100) NOT NULL,
    unit_number VARCHAR(20) NOT NULL,
    rent_amount NUMERIC(12, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'Available' NOT NULL CHECK (status IN ('Available', 'Occupied', 'Maintenance')),
    tenant_id VARCHAR(100) REFERENCES users(id) ON DELETE SET NULL,
    tenant_name VARCHAR(100),
    floor VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT unique_property_unit UNIQUE(property_id, unit_number)
);

-- Table: tenants
CREATE TABLE IF NOT EXISTS tenants (
    id VARCHAR(100) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
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
CREATE TABLE IF NOT EXISTS leases (
    id VARCHAR(100) PRIMARY KEY,
    property_id VARCHAR(100) NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    property_name VARCHAR(100) NOT NULL,
    unit_id VARCHAR(100) NOT NULL REFERENCES units(id) ON DELETE CASCADE,
    unit_number VARCHAR(20) NOT NULL,
    tenant_id VARCHAR(100) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tenant_name VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    rent_amount NUMERIC(12, 2) NOT NULL,
    deposit_amount NUMERIC(12, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'Active' NOT NULL CHECK (status IN ('Active', 'Expiring', 'Terminated', 'Expired', 'Pending')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Table: rent_payments
CREATE TABLE IF NOT EXISTS rent_payments (
    id VARCHAR(100) PRIMARY KEY,
    tenant_id VARCHAR(100) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tenant_name VARCHAR(100) NOT NULL,
    unit_id VARCHAR(100) NOT NULL REFERENCES units(id) ON DELETE CASCADE,
    unit_number VARCHAR(20) NOT NULL,
    property_name VARCHAR(100) NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    due_date DATE NOT NULL,
    paid_date DATE,
    status VARCHAR(20) DEFAULT 'Unpaid' NOT NULL CHECK (status IN ('Paid', 'Partial', 'Unpaid', 'Pending', 'Overdue')),
    payment_method VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Table: maintenance (tickets)
CREATE TABLE IF NOT EXISTS maintenance (
    id VARCHAR(100) PRIMARY KEY,
    property_id VARCHAR(100) NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    property_name VARCHAR(100) NOT NULL,
    unit_id VARCHAR(100) NOT NULL REFERENCES units(id) ON DELETE CASCADE,
    unit_number VARCHAR(20) NOT NULL,
    tenant_id VARCHAR(100) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tenant_name VARCHAR(100) NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('Low', 'Medium', 'High', 'Urgent')),
    status VARCHAR(20) DEFAULT 'Open' NOT NULL CHECK (status IN ('Open', 'In Progress', 'Resolved', 'Closed')),
    cost NUMERIC(12, 2) DEFAULT 0.00,
    images TEXT[], -- array of image URLs
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Table: notifications
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(100) PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(30) NOT NULL CHECK (type IN ('Lease', 'Payment', 'Maintenance', 'General')),
    is_read BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Table: contact_inquiries
CREATE TABLE IF NOT EXISTS contact_inquiries (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);


-- 3. DISABLE RLS (Highly recommended for direct anon/public access during testing)
-- Run these commands to make sure the API can fetch/write records without auth header errors
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE properties DISABLE ROW LEVEL SECURITY;
ALTER TABLE units DISABLE ROW LEVEL SECURITY;
ALTER TABLE tenants DISABLE ROW LEVEL SECURITY;
ALTER TABLE leases DISABLE ROW LEVEL SECURITY;
ALTER TABLE rent_payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE contact_inquiries DISABLE ROW LEVEL SECURITY;


-- 4. SEED RECORDS (Pre-populate with initial application demo datasets)

-- Seeds: users
INSERT INTO users (id, full_name, email, phone, role, created_at)
VALUES 
('u1', 'Alex Mercer', 'owner@propertylog.com', '+1 (555) 019-2834', 'Owner', '2026-01-10 12:00:00+00'),
('u2', 'Jane Doe', 'tenant@propertylog.com', '+1 (555) 023-4567', 'Tenant', '2026-02-15 09:30:00+00'),
('u3', 'Sarah Jenkins', 'admin@propertylog.com', '+1 (555) 012-3456', 'Admin', '2026-01-01 08:00:00+00'),
('t2', 'John Smith', 'john.smith@gmail.com', '+1 (555) 345-6789', 'Tenant', '2025-07-15 12:00:00+00'),
('t3', 'Michael Chang', 'michael.c@yahoo.com', '+1 (555) 456-7890', 'Tenant', '2026-02-01 12:00:00+00')
ON CONFLICT (id) DO NOTHING;

-- Seeds: properties
INSERT INTO properties (id, name, address, type, units_count, status, image_url, owner_id, latitude, longitude, description, created_at)
VALUES 
('p1', 'Oakridge Heights', '742 Evergreen Terrace, Springfield', 'Apartment', 12, 'Active', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80', 'u1', 40.7128, -74.0060, 'Premium residential apartment complex', '2026-01-15 10:00:00+00'),
('p2', 'Sunset Ridge Villa', '890 Ocean Drive, Miami Beach', 'House', 1, 'Active', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80', 'u1', 25.7617, -80.1918, 'Beautiful beachfront villa', '2026-02-01 11:30:00+00'),
('p3', 'Metro Plaza Commercial', '101 Broadway, New York City', 'Commercial', 4, 'Active', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80', 'u1', 40.7580, -73.9855, 'Premium commercial high-rise plaza', '2026-01-20 14:15:00+00'),
('p4', 'Pineview Luxury Condos', '55 Pine Needle Way, Aspen', 'Condo', 8, 'Maintenance', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80', 'u1', 39.1911, -106.8175, 'Mountain-view ski resort condos', '2026-03-05 16:45:00+00')
ON CONFLICT (id) DO NOTHING;

-- Seeds: units
INSERT INTO units (id, property_id, property_name, unit_number, rent_amount, status, tenant_id, tenant_name, floor, created_at)
VALUES 
('un1', 'p1', 'Oakridge Heights', '101', 1450.00, 'Occupied', 'u2', 'Jane Doe', '1', '2026-01-15 10:00:00+00'),
('un2', 'p1', 'Oakridge Heights', '102', 1450.00, 'Occupied', 't2', 'John Smith', '1', '2026-01-15 10:00:00+00'),
('un3', 'p1', 'Oakridge Heights', '201', 1500.00, 'Available', NULL, NULL, '2', '2026-01-15 10:00:00+00'),
('un4', 'p1', 'Oakridge Heights', '202', 1500.00, 'Maintenance', NULL, NULL, '2', '2026-01-15 10:00:00+00'),
('un5', 'p2', 'Sunset Ridge Villa', 'A', 3200.00, 'Occupied', 't3', 'Michael Chang', '1', '2026-02-01 11:30:00+00'),
('un6', 'p3', 'Metro Plaza Commercial', 'Suite 100', 5500.00, 'Occupied', NULL, 'Innovate Tech LLC', '1', '2026-01-20 14:15:00+00'),
('un7', 'p3', 'Metro Plaza Commercial', 'Suite 200', 4800.00, 'Available', NULL, NULL, '2', '2026-01-20 14:15:00+00')
ON CONFLICT (id) DO NOTHING;

-- Seeds: tenants
INSERT INTO tenants (id, full_name, phone, email, cnic, passport, emergency_contact, cnic_doc_url, passport_doc_url, agreement_doc_url, created_at)
VALUES 
('u2', 'Jane Doe', '+1 (555) 023-4567', 'tenant@propertylog.com', '37405-1234567-8', 'AB1234567', 'Richard Doe (+1 (555) 098-7654)', 'cnic_mock_url.jpg', 'passport_mock_url.jpg', 'agreement_mock_url.pdf', '2026-01-01 12:00:00+00'),
('t2', 'John Smith', '+1 (555) 345-6789', 'john.smith@gmail.com', '35201-9876543-1', '', 'Mary Smith (+1 (555) 333-4444)', 'cnic_john.jpg', '', 'lease_john.pdf', '2025-07-15 12:00:00+00'),
('t3', 'Michael Chang', '+1 (555) 456-7890', 'michael.c@yahoo.com', '42301-4455667-3', 'PP9876543', 'Sophea Chang (+1 (555) 888-9999)', '', '', '', '2026-02-01 12:00:00+00')
ON CONFLICT (id) DO NOTHING;

-- Seeds: leases
INSERT INTO leases (id, property_id, property_name, unit_id, unit_number, tenant_id, tenant_name, start_date, end_date, rent_amount, deposit_amount, status, created_at)
VALUES 
('l1', 'p1', 'Oakridge Heights', 'un1', '101', 'u2', 'Jane Doe', '2026-01-01', '2026-12-31', 1450.00, 1450.00, 'Active', '2026-01-01 12:00:00+00'),
('l2', 'p1', 'Oakridge Heights', 'un2', '102', 't2', 'John Smith', '2025-07-15', '2026-07-14', 1450.00, 1000.00, 'Expiring', '2025-07-15 12:00:00+00'),
('l3', 'p2', 'Sunset Ridge Villa', 'un5', 'A', 't3', 'Michael Chang', '2026-02-01', '2027-01-31', 3200.00, 3200.00, 'Active', '2026-02-01 12:00:00+00')
ON CONFLICT (id) DO NOTHING;

-- Seeds: rent_payments
INSERT INTO rent_payments (id, tenant_id, tenant_name, unit_id, unit_number, property_name, amount, due_date, paid_date, status, payment_method, created_at)
VALUES 
('pay1', 'u2', 'Jane Doe', 'un1', '101', 'Oakridge Heights', 1450.00, '2026-06-01', '2026-06-01', 'Paid', 'Direct Deposit', '2026-06-01 12:00:00+00'),
('pay2', 't2', 'John Smith', 'un2', '102', 'Oakridge Heights', 1450.00, '2026-06-01', '2026-06-03', 'Paid', 'Credit Card', '2026-06-01 12:00:00+00'),
('pay3', 't3', 'Michael Chang', 'un5', 'A', 'Sunset Ridge Villa', 3200.00, '2026-06-01', NULL, 'Overdue', NULL, '2026-06-01 12:00:00+00'),
('pay5', 'u2', 'Jane Doe', 'un1', '101', 'Oakridge Heights', 1450.00, '2026-07-01', NULL, 'Pending', NULL, '2026-06-25 12:00:00+00'),
('pay6', 't2', 'John Smith', 'un2', '102', 'Oakridge Heights', 1450.00, '2026-07-01', NULL, 'Pending', NULL, '2026-06-25 12:00:00+00'),
('pay7', 't3', 'Michael Chang', 'un5', 'A', 'Sunset Ridge Villa', 3200.00, '2026-07-01', NULL, 'Pending', NULL, '2026-06-25 12:00:00+00')
ON CONFLICT (id) DO NOTHING;

-- Seeds: maintenance
INSERT INTO maintenance (id, property_id, property_name, unit_id, unit_number, tenant_id, tenant_name, title, description, priority, status, cost, images, created_at)
VALUES 
('tk1', 'p1', 'Oakridge Heights', 'un1', '101', 'u2', 'Jane Doe', 'Leaking kitchen sink pipe', 'The hot water supply line under the kitchen sink is slowly dripping, creating a pool inside the cupboard. Requires a plumber to replace the gasket or pipe.', 'High', 'In Progress', 0.00, ARRAY[]::TEXT[], '2026-06-22 08:30:00+00'),
('tk2', 'p1', 'Oakridge Heights', 'un2', '102', 't2', 'John Smith', 'Squeaky HVAC fan motor', 'When the air conditioning runs, there is a very high pitched squeak coming from the bedroom vent. Might need fan lubrication or belt replacement.', 'Medium', 'Open', 0.00, ARRAY[]::TEXT[], '2026-06-24 14:15:00+00'),
('tk3', 'p2', 'Sunset Ridge Villa', 'un5', 'A', 't3', 'Michael Chang', 'Driveway gate sensor broken', 'The automatic gate does not slide open when pressing the clicker or when positioned near the driveway loop. Currently locked open for safety.', 'Urgent', 'Open', 0.00, ARRAY[]::TEXT[], '2026-06-24 18:00:00+00'),
('tk4', 'p1', 'Oakridge Heights', 'un1', '101', 'u2', 'Jane Doe', 'Loose front entry doorknob', 'The outer handle screws have come loose and the whole mechanism wiggles. Can lock, but feels insecure.', 'Low', 'Resolved', 85.00, ARRAY[]::TEXT[], '2026-06-10 11:00:00+00')
ON CONFLICT (id) DO NOTHING;

-- Seeds: notifications
INSERT INTO notifications (id, user_id, title, message, type, is_read, created_at)
VALUES 
('n1', 'u1', 'New Maintenance Ticket', 'Michael Chang filed an Urgent maintenance ticket: ''Driveway gate sensor broken'' for Sunset Ridge Villa.', 'Maintenance', FALSE, '2026-06-24 18:02:00+00'),
('n2', 'u1', 'Rent Overdue Notification', 'Rent payment of $3,200 for Sunset Ridge Villa (Michael Chang) is now overdue since June 1st.', 'Payment', FALSE, '2026-06-10 09:00:00+00'),
('n3', 'u1', 'Lease Expiring Soon', 'John Smith''s lease for Oakridge Heights Unit 102 will expire on 2026-07-14 (less than 30 days remaining).', 'Lease', TRUE, '2026-06-15 08:00:00+00'),
('n4', 'u2', 'Maintenance Ticket Updated', 'Your ticket ''Leaking kitchen sink pipe'' has been updated to In Progress. A plumber is scheduled for tomorrow morning.', 'Maintenance', FALSE, '2026-06-23 10:00:00+00')
ON CONFLICT (id) DO NOTHING;
