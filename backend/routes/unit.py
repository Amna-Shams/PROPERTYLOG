from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid

from ..database import get_db
from .. import models, schemas, auth

router = APIRouter(prefix="/units", tags=["units"])

@router.post("", response_model=schemas.UnitResponse, status_code=status.HTTP_201_CREATED)
def create_unit(
    unit_in: schemas.UnitCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_owner_user)
):
    # Verify owner owns the property
    prop = db.query(models.Property).filter(models.Property.id == unit_in.property_id).first()
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")
    if current_user.role != "Admin" and prop.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Unauthorized to add units to this property")

    db_unit = models.Unit(
        property_id=unit_in.property_id,
        property_name=prop.name,
        unit_number=unit_in.unit_number,
        rent_amount=unit_in.rent_amount,
        status=unit_in.status,
        tenant_id=unit_in.tenant_id,
        tenant_name=unit_in.tenant_name,
        floor=unit_in.floor
    )
    db.add(db_unit)
    
    # Increment property units count
    prop.units_count += 1
    db.commit()
    db.refresh(db_unit)
    return db_unit

@router.get("", response_model=List[schemas.UnitResponse])
def get_units(
    property_id: Optional[uuid.UUID] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    query = db.query(models.Unit)
    
    # If property filter is specified, check access to that property first
    if property_id:
        prop = db.query(models.Property).filter(models.Property.id == property_id).first()
        if not prop:
            raise HTTPException(status_code=404, detail="Property not found")
        if current_user.role == "Owner" and prop.owner_id != current_user.id:
            raise HTTPException(status_code=403, detail="Unauthorized for this property")
        query = query.filter(models.Unit.property_id == property_id)
    else:
        # If no property filter, return units the user has access to
        if current_user.role == "Owner":
            owner_properties = db.query(models.Property.id).filter(models.Property.owner_id == current_user.id).subquery()
            query = query.filter(models.Unit.property_id.in_(owner_properties))
        elif current_user.role == "Tenant":
            query = query.filter(models.Unit.tenant_id == current_user.id)
            
    return query.all()
