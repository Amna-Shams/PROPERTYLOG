import uuid
from sqlalchemy import Column, String, Integer, Numeric, Boolean, Date, DateTime, ForeignKey, Text, Table
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

# Many-to-many or associate tables if any. We can use relationships directly.

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    full_name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False, index=True)
    phone = Column(String(30))
    role = Column(String(20), nullable=False, index=True)  # Admin, Owner, Tenant
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Relationships
    properties = relationship("Property", back_populates="owner", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    tenant_profile = relationship("Tenant", back_populates="user", uselist=False, cascade="all, delete-orphan")


class Property(Base):
    __tablename__ = "properties"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    address = Column(Text, nullable=False)
    type = Column(String(35), nullable=False)  # House, Apartment, Plaza, etc.
    units_count = Column(Integer, default=0, nullable=False)
    status = Column(String(20), default="Active", nullable=False)  # Active, Maintenance, Inactive
    image_url = Column(Text)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    latitude = Column(Numeric(10, 8))
    longitude = Column(Numeric(11, 8))
    description = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Relationships
    owner = relationship("User", back_populates="properties")
    units = relationship("Unit", back_populates="property", cascade="all, delete-orphan")
    leases = relationship("Lease", back_populates="property", cascade="all, delete-orphan")


class Unit(Base):
    __tablename__ = "units"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    property_id = Column(UUID(as_uuid=True), ForeignKey("properties.id", ondelete="CASCADE"), nullable=False, index=True)
    property_name = Column(String(100), nullable=False)
    unit_number = Column(String(20), nullable=False)
    rent_amount = Column(Numeric(12, 2), nullable=False)
    status = Column(String(20), default="Available", nullable=False)  # Available, Occupied, Maintenance
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), index=True)
    tenant_name = Column(String(100))
    floor = Column(String(20))
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Relationships
    property = relationship("Property", back_populates="units")
    leases = relationship("Lease", back_populates="unit", cascade="all, delete-orphan")


class Tenant(Base):
    __tablename__ = "tenants"

    id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    full_name = Column(String(100), nullable=False)
    phone = Column(String(30), nullable=False)
    email = Column(String(150), nullable=False)
    cnic = Column(String(30), nullable=False)
    passport = Column(String(50))
    emergency_contact = Column(String(100), nullable=False)
    cnic_doc_url = Column(Text)
    passport_doc_url = Column(Text)
    agreement_doc_url = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Relationships
    user = relationship("User", back_populates="tenant_profile")


class Lease(Base):
    __tablename__ = "leases"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    property_id = Column(UUID(as_uuid=True), ForeignKey("properties.id", ondelete="CASCADE"), nullable=False, index=True)
    property_name = Column(String(100), nullable=False)
    unit_id = Column(UUID(as_uuid=True), ForeignKey("units.id", ondelete="CASCADE"), nullable=False, index=True)
    unit_number = Column(String(20), nullable=False)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    tenant_name = Column(String(100), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    rent_amount = Column(Numeric(12, 2), nullable=False)
    deposit_amount = Column(Numeric(12, 2), nullable=False)
    status = Column(String(20), default="Active", nullable=False)  # Active, Expiring, Terminated, Expired, Pending
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Relationships
    property = relationship("Property", back_populates="leases")
    unit = relationship("Unit", back_populates="leases")


class RentPayment(Base):
    __tablename__ = "rent_payments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    tenant_name = Column(String(100), nullable=False)
    unit_id = Column(UUID(as_uuid=True), ForeignKey("units.id", ondelete="CASCADE"), nullable=False, index=True)
    unit_number = Column(String(20), nullable=False)
    property_name = Column(String(100), nullable=False)
    amount = Column(Numeric(12, 2), nullable=False)
    due_date = Column(Date, nullable=False)
    paid_date = Column(Date)
    status = Column(String(20), default="Unpaid", nullable=False, index=True)  # Paid, Partial, Unpaid, Pending, Overdue
    payment_method = Column(String(50))
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class MaintenanceTicket(Base):
    __tablename__ = "maintenance"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    property_id = Column(UUID(as_uuid=True), ForeignKey("properties.id", ondelete="CASCADE"), nullable=False, index=True)
    property_name = Column(String(100), nullable=False)
    unit_id = Column(UUID(as_uuid=True), ForeignKey("units.id", ondelete="CASCADE"), nullable=False, index=True)
    unit_number = Column(String(20), nullable=False)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    tenant_name = Column(String(100), nullable=False)
    title = Column(String(150), nullable=False)
    description = Column(Text, nullable=False)
    priority = Column(String(20), nullable=False)  # Low, Medium, High, Urgent
    status = Column(String(20), default="Open", nullable=False, index=True)  # Open, In Progress, Resolved, Closed
    cost = Column(Numeric(12, 2), default=0.00)
    images = Column(ARRAY(Text))  # Array of strings for base64 or URL
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class Document(Base):
    __tablename__ = "documents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    lease_id = Column(UUID(as_uuid=True), ForeignKey("leases.id", ondelete="SET NULL"), nullable=True)
    name = Column(String(150), nullable=False)
    file_url = Column(Text, nullable=False)
    type = Column(String(50), nullable=False)
    uploaded_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(150), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(30), nullable=False)  # Lease, Payment, Maintenance, General
    status = Column(String(20), default="Unread", nullable=False)  # Unread, Read
    is_read = Column(Boolean, default=False, nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Relationships
    user = relationship("User", back_populates="notifications")
