from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import uuid

from ..database import get_db
from .. import models, schemas, auth

router = APIRouter(prefix="/properties", tags=["properties"])

@router.post("", response_model=schemas.PropertyResponse, status_code=status.HTTP_201_CREATED)
def create_property(
    prop_in: schemas.PropertyCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_owner_user)
):
    db_property = models.Property(
        name=prop_in.name,
        address=prop_in.address,
        type=prop_in.type,
        units_count=prop_in.units_count,
        status=prop_in.status,
        image_url=prop_in.image_url,
        latitude=prop_in.latitude,
        longitude=prop_in.longitude,
        description=prop_in.description,
        owner_id=current_user.id
    )
    db.add(db_property)
    db.commit()
    db.refresh(db_property)
    return db_property

@router.get("", response_model=List[schemas.PropertyResponse])
def get_properties(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    # Security Rule: Tenants only see properties they reside in, Owners see their own properties, Admins see all
    if current_user.role == "Admin":
        return db.query(models.Property).all()
    elif current_user.role == "Owner":
        return db.query(models.Property).filter(models.Property.owner_id == current_user.id).all()
    else:  # Tenant
        # Query property related to tenant's lease
        active_leases = db.query(models.Lease).filter(models.Lease.tenant_id == current_user.id, models.Lease.status == "Active").all()
        prop_ids = [lease.property_id for lease in active_leases]
        return db.query(models.Property).filter(models.Property.id.in_(prop_ids)).all()

@router.get("/{property_id}", response_model=schemas.PropertyResponse)
def get_property_by_id(
    property_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    prop = db.query(models.Property).filter(models.Property.id == property_id).first()
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")
    
    # Check permissions
    if current_user.role == "Owner" and prop.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this property")
    elif current_user.role == "Tenant":
        has_lease = db.query(models.Lease).filter(models.Lease.tenant_id == current_user.id, models.Lease.property_id == property_id).first()
        if not has_lease:
            raise HTTPException(status_code=403, detail="No active lease for this property")
            
    return prop
