from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid

from ..database import get_db
from .. import models, schemas, auth

router = APIRouter(prefix="/tenants", tags=["tenants"])

@router.post("", response_model=schemas.TenantResponse, status_code=status.HTTP_201_CREATED)
def create_tenant_profile(
    tenant_in: schemas.TenantCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_owner_user)
):
    # Verify the user exists and has tenant role
    target_user = db.query(models.User).filter(models.User.id == tenant_in.id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")
    if target_user.role != "Tenant":
        raise HTTPException(status_code=400, detail="Target user does not have 'Tenant' role")
    
    # Check if profile already exists
    existing = db.query(models.Tenant).filter(models.Tenant.id == tenant_in.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Tenant profile already exists for this user")

    db_tenant = models.Tenant(
        id=tenant_in.id,
        full_name=tenant_in.full_name,
        phone=tenant_in.phone,
        email=tenant_in.email,
        cnic=tenant_in.cnic,
        passport=tenant_in.passport,
        emergency_contact=tenant_in.emergency_contact,
        cnic_doc_url=tenant_in.cnic_doc_url,
        passport_doc_url=tenant_in.passport_doc_url,
        agreement_doc_url=tenant_in.agreement_doc_url
    )
    db.add(db_tenant)
    db.commit()
    db.refresh(db_tenant)
    return db_tenant

@router.get("", response_model=List[schemas.TenantResponse])
def get_tenants(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_owner_user)
):
    # Owners and admins can view all tenants
    # (In a hyper-secure setup, landlords only see tenants leased to their properties. We can do that by joining through leases)
    if current_user.role == "Admin":
        return db.query(models.Tenant).all()
    else:
        # Get properties owned by landlord
        owner_props = db.query(models.Property.id).filter(models.Property.owner_id == current_user.id).subquery()
        # Find leases on those properties
        tenant_ids = db.query(models.Lease.tenant_id).filter(models.Lease.property_id.in_(owner_props)).subquery()
        # Return profiles
        return db.query(models.Tenant).filter(models.Tenant.id.in_(tenant_ids)).all()

@router.get("/{tenant_id}", response_model=schemas.TenantResponse)
def get_tenant_by_id(
    tenant_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    # Access Rule: tenant can see their own profile, owner can see if they are their tenant, admin can see all
    if current_user.role == "Tenant" and current_user.id != tenant_id:
        raise HTTPException(status_code=403, detail="Not authorized to view other tenant profiles")
        
    tenant = db.query(models.Tenant).filter(models.Tenant.id == tenant_id).first()
    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant profile not found")
        
    if current_user.role == "Owner":
        # Check if they have leased to this tenant
        owner_props = db.query(models.Property.id).filter(models.Property.owner_id == current_user.id).subquery()
        lease_exists = db.query(models.Lease).filter(models.Lease.property_id.in_(owner_props), models.Lease.tenant_id == tenant_id).first()
        if not lease_exists:
            raise HTTPException(status_code=403, detail="Unauthorized: Tenant is not linked to any of your properties")
            
    return tenant
