from pydantic import BaseModel, EmailStr, Field, HttpUrl
from typing import List, Optional
from datetime import date, datetime
import uuid

# User Schemas
class UserBase(BaseModel):
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    role: str  # Admin, Owner, Tenant

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: uuid.UUID
    created_at: datetime

    class Config:
        from_attributes = True

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None
    user_id: Optional[str] = None

# Property Schemas
class PropertyBase(BaseModel):
    name: str
    address: str
    type: str
    units_count: int = 0
    status: str = "Active"
    image_url: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    description: Optional[str] = None

class PropertyCreate(PropertyBase):
    pass

class PropertyResponse(PropertyBase):
    id: uuid.UUID
    owner_id: uuid.UUID
    created_at: datetime

    class Config:
        from_attributes = True

# Unit Schemas
class UnitBase(BaseModel):
    property_id: uuid.UUID
    property_name: str
    unit_number: str
    rent_amount: float
    status: str = "Available"
    tenant_id: Optional[uuid.UUID] = None
    tenant_name: Optional[str] = None
    floor: Optional[str] = None

class UnitCreate(UnitBase):
    pass

class UnitResponse(UnitBase):
    id: uuid.UUID
    created_at: datetime

    class Config:
        from_attributes = True

# Tenant Profile Schemas
class TenantBase(BaseModel):
    full_name: str
    phone: str
    email: EmailStr
    cnic: str
    passport: Optional[str] = None
    emergency_contact: str
    cnic_doc_url: Optional[str] = None
    passport_doc_url: Optional[str] = None
    agreement_doc_url: Optional[str] = None

class TenantCreate(TenantBase):
    id: uuid.UUID  # links to user.id

class TenantResponse(TenantBase):
    created_at: datetime

    class Config:
        from_attributes = True

# Lease Schemas
class LeaseBase(BaseModel):
    property_id: uuid.UUID
    property_name: str
    unit_id: uuid.UUID
    unit_number: str
    tenant_id: uuid.UUID
    tenant_name: str
    start_date: date
    end_date: date
    rent_amount: float
    deposit_amount: float
    status: str = "Active"

class LeaseCreate(LeaseBase):
    pass

class LeaseResponse(LeaseBase):
    id: uuid.UUID
    created_at: datetime

    class Config:
        from_attributes = True

# Rent Payment Schemas
class RentPaymentBase(BaseModel):
    tenant_id: uuid.UUID
    tenant_name: str
    unit_id: uuid.UUID
    unit_number: str
    property_name: str
    amount: float
    due_date: date
    paid_date: Optional[date] = None
    status: str = "Unpaid"
    payment_method: Optional[str] = None

class RentPaymentCreate(RentPaymentBase):
    pass

class RentPaymentResponse(RentPaymentBase):
    id: uuid.UUID
    created_at: datetime

    class Config:
        from_attributes = True

# Maintenance Ticket Schemas
class MaintenanceTicketBase(BaseModel):
    property_id: uuid.UUID
    property_name: str
    unit_id: uuid.UUID
    unit_number: str
    tenant_id: uuid.UUID
    tenant_name: str
    title: str
    description: str
    priority: str  # Low, Medium, High, Urgent
    status: str = "Open"
    cost: Optional[float] = 0.0
    images: Optional[List[str]] = []

class MaintenanceTicketCreate(MaintenanceTicketBase):
    pass

class MaintenanceTicketResponse(MaintenanceTicketBase):
    id: uuid.UUID
    created_at: datetime

    class Config:
        from_attributes = True

# Document Schemas
class DocumentBase(BaseModel):
    lease_id: Optional[uuid.UUID] = None
    name: str
    file_url: str
    type: str

class DocumentCreate(DocumentBase):
    pass

class DocumentResponse(DocumentBase):
    id: uuid.UUID
    uploaded_by: uuid.UUID
    created_at: datetime

    class Config:
        from_attributes = True

# Notification Schemas (Role-Based Secure Notifications)
class NotificationBase(BaseModel):
    title: str
    message: str
    type: str  # Lease, Payment, Maintenance, General
    is_read: bool = False

class NotificationCreate(NotificationBase):
    user_id: uuid.UUID

class NotificationResponse(NotificationBase):
    id: uuid.UUID
    user_id: uuid.UUID
    created_at: datetime

    class Config:
        from_attributes = True
