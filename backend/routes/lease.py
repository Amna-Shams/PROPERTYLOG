from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid

from ..database import get_db
from .. import models, schemas, auth
from ..services.notification_service import NotificationService

router = APIRouter(prefix="/leases", tags=["leases"])

@router.post("", response_model=schemas.LeaseResponse, status_code=status.HTTP_201_CREATED)
def create_lease(
    lease_in: schemas.LeaseCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_owner_user)
):
    # Verify owner owns the property
    prop = db.query(models.Property).filter(models.Property.id == lease_in.property_id).first()
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")
    if current_user.role != "Admin" and prop.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Unauthorized to lease units for this property")

    # Verify unit is available
    unit = db.query(models.Unit).filter(models.Unit.id == lease_in.unit_id).first()
    if not unit:
        raise HTTPException(status_code=404, detail="Unit not found")
    if unit.status == "Occupied":
        raise HTTPException(status_code=400, detail="Unit is already occupied")

    db_lease = models.Lease(
        property_id=lease_in.property_id,
        property_name=prop.name,
        unit_id=lease_in.unit_id,
        unit_number=unit.unit_number,
        tenant_id=lease_in.tenant_id,
        tenant_name=lease_in.tenant_name,
        start_date=lease_in.start_date,
        end_date=lease_in.end_date,
        rent_amount=lease_in.rent_amount,
        deposit_amount=lease_in.deposit_amount,
        status=lease_in.status
    )
    db.add(db_lease)

    # Update Unit's status and tenant assignments
    unit.status = "Occupied"
    unit.tenant_id = lease_in.tenant_id
    unit.tenant_name = lease_in.tenant_name
    
    db.commit()
    db.refresh(db_lease)

    # Send confirmation notifications
    # Notification for Tenant
    NotificationService.create_notification(
        db,
        lease_in.tenant_id,
        "Lease Agreement Registered",
        f"Your lease for Unit {unit.unit_number} in {prop.name} has been successfully registered. Rent is ${lease_in.rent_amount}/month.",
        "Lease"
    )
    
    # Notification for Owner
    NotificationService.create_notification(
        db,
        prop.owner_id,
        "New Lease Executed",
        f"Lease registered successfully for Unit {unit.unit_number} with Tenant {lease_in.tenant_name}.",
        "Lease"
    )

    return db_lease

@router.get("", response_model=List[schemas.LeaseResponse])
def get_leases(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    if current_user.role == "Admin":
        return db.query(models.Lease).all()
    elif current_user.role == "Owner":
        owner_properties = db.query(models.Property.id).filter(models.Property.owner_id == current_user.id).subquery()
        return db.query(models.Lease).filter(models.Lease.property_id.in_(owner_properties)).all()
    else:  # Tenant
        # Security Rule: Tenants ONLY see their own leases!
        return db.query(models.Lease).filter(models.Lease.tenant_id == current_user.id).all()
