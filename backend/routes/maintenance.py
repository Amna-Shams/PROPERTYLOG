from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid

from ..database import get_db
from .. import models, schemas, auth
from ..services.notification_service import NotificationService

router = APIRouter(prefix="/maintenance", tags=["maintenance"])

@router.post("", response_model=schemas.MaintenanceTicketResponse, status_code=status.HTTP_201_CREATED)
def create_ticket(
    ticket_in: schemas.MaintenanceTicketCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_tenant_user)
):
    """
    Tenant files a repair ticket.
    """
    # Enforce strict user filtering: Tenant must only submit for their own unit
    unit = db.query(models.Unit).filter(models.Unit.id == ticket_in.unit_id).first()
    if not unit:
        raise HTTPException(status_code=404, detail="Unit not found")
        
    if unit.tenant_id != current_user.id:
        raise HTTPException(status_code=403, detail="Unauthorized to submit maintenance for this unit")

    prop = db.query(models.Property).filter(models.Property.id == ticket_in.property_id).first()
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")

    db_ticket = models.MaintenanceTicket(
        property_id=ticket_in.property_id,
        property_name=prop.name,
        unit_id=ticket_in.unit_id,
        unit_number=unit.unit_number,
        tenant_id=current_user.id,
        tenant_name=current_user.full_name,
        title=ticket_in.title,
        description=ticket_in.description,
        priority=ticket_in.priority,
        status="Open",
        cost=ticket_in.cost,
        images=ticket_in.images
    )
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)

    # Trigger: MAINTENANCE CREATED
    # Recipient: Tenant
    NotificationService.create_notification(
        db,
        current_user.id,
        "Request Submitted",
        f"Your maintenance request for '{ticket_in.title}' has been submitted successfully.",
        "Maintenance"
    )

    # Recipient: Assigned Owner
    NotificationService.create_notification(
        db,
        prop.owner_id,
        "New Maintenance Request",
        f"Tenant {current_user.full_name} submitted a maintenance ticket for Unit {unit.unit_number}: '{ticket_in.title}' (Priority: {ticket_in.priority}).",
        "Maintenance"
    )

    return db_ticket

@router.patch("/{ticket_id}/status", response_model=schemas.MaintenanceTicketResponse)
def update_ticket_status(
    ticket_id: uuid.UUID,
    status: str,  # Open, In Progress, Resolved, Closed
    cost: Optional[float] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_owner_user)
):
    """
    Owner updates maintenance status.
    """
    ticket = db.query(models.MaintenanceTicket).filter(models.MaintenanceTicket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    # Secure verification: Ensure landlord owns the property
    prop = db.query(models.Property).filter(models.Property.id == ticket.property_id).first()
    if not prop:
        raise HTTPException(status_code=404, detail="Associated property not found")
        
    if current_user.role != "Admin" and prop.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Unauthorized to update maintenance tickets for this property")

    if status not in ["Open", "In Progress", "Resolved", "Closed"]:
        raise HTTPException(status_code=400, detail="Invalid status value")

    ticket.status = status
    if cost is not None:
        ticket.cost = cost
        
    db.commit()
    db.refresh(ticket)

    # Trigger: MAINTENANCE STATUS UPDATE
    # Recipient: Tenant ONLY
    NotificationService.create_notification(
        db,
        ticket.tenant_id,
        f"Maintenance Status Updated: {status}",
        f"The status of your maintenance request '{ticket.title}' has been updated to '{status}'.",
        "Maintenance"
    )

    return ticket

@router.get("", response_model=List[schemas.MaintenanceTicketResponse])
def get_tickets(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    # Enforce secure role-based query filtering
    if current_user.role == "Admin":
        return db.query(models.MaintenanceTicket).all()
    elif current_user.role == "Owner":
        owner_properties = db.query(models.Property.id).filter(models.Property.owner_id == current_user.id).subquery()
        return db.query(models.MaintenanceTicket).filter(models.MaintenanceTicket.property_id.in_(owner_properties)).all()
    else:  # Tenant
        # Strict user-level access filtering: WHERE user_id = authenticated_user
        return db.query(models.MaintenanceTicket).filter(models.MaintenanceTicket.tenant_id == current_user.id).all()
