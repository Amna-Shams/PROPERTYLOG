from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid
from datetime import date

from ..database import get_db
from .. import models, schemas, auth
from ..services.notification_service import NotificationService

router = APIRouter(prefix="/rent", tags=["rent"])

@router.post("", response_model=schemas.RentPaymentResponse, status_code=status.HTTP_201_CREATED)
def create_rent_invoice(
    payment_in: schemas.RentPaymentCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_owner_user)
):
    """
    Manually generate a rent payment invoice. Usually triggered by Owner or scheduler.
    """
    db_payment = models.RentPayment(
        tenant_id=payment_in.tenant_id,
        tenant_name=payment_in.tenant_name,
        unit_id=payment_in.unit_id,
        unit_number=payment_in.unit_number,
        property_name=payment_in.property_name,
        amount=payment_in.amount,
        due_date=payment_in.due_date,
        status="Unpaid"
    )
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)

    # RENT DUE Trigger: Notify tenant ONLY
    NotificationService.create_notification(
        db,
        payment_in.tenant_id,
        "New Rent Invoice Generated",
        f"Your monthly rent payment of ${payment_in.amount} for Unit {payment_in.unit_number} is due on {payment_in.due_date}.",
        "Payment"
    )

    return db_payment

@router.post("/{payment_id}/submit-payment", response_model=schemas.RentPaymentResponse)
def submit_payment(
    payment_id: uuid.UUID,
    payment_method: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_tenant_user)
):
    """
    Tenant submits payment.
    """
    payment = db.query(models.RentPayment).filter(models.RentPayment.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment record not found")
        
    # Secure validation: Check if payment belongs to authenticated tenant
    if payment.tenant_id != current_user.id:
        raise HTTPException(status_code=403, detail="Unauthorized to submit payment for this record")
        
    if payment.status == "Paid":
        raise HTTPException(status_code=400, detail="Rent payment is already fully paid")

    payment.status = "Pending"
    payment.payment_method = payment_method
    db.commit()
    db.refresh(payment)

    # Find the owner of the property
    unit = db.query(models.Unit).filter(models.Unit.id == payment.unit_id).first()
    owner_id = None
    if unit:
        prop = db.query(models.Property).filter(models.Property.id == unit.property_id).first()
        if prop:
            owner_id = prop.owner_id

    # Trigger: PAYMENT SUBMITTED
    # Recipient: Owner
    if owner_id:
        NotificationService.create_notification(
            db,
            owner_id,
            "Rent Payment Submitted",
            f"Tenant {payment.tenant_name} has submitted a payment of ${payment.amount} for Unit {payment.unit_number} via {payment_method}.",
            "Payment"
        )
        
    # Tenant gets a success notification:
    NotificationService.create_notification(
        db,
        payment.tenant_id,
        "Payment Submitted Successfully",
        f"Your rent payment of ${payment.amount} was submitted successfully using {payment_method} and is awaiting owner approval.",
        "Payment"
    )

    return payment

@router.post("/{payment_id}/approve-payment", response_model=schemas.RentPaymentResponse)
def approve_payment(
    payment_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_owner_user)
):
    """
    Owner approves payment submission.
    """
    payment = db.query(models.RentPayment).filter(models.RentPayment.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment record not found")

    # Secure verification: Ensure landlord owns the property this unit belongs to
    unit = db.query(models.Unit).filter(models.Unit.id == payment.unit_id).first()
    if not unit:
        raise HTTPException(status_code=404, detail="Associated unit not found")
    prop = db.query(models.Property).filter(models.Property.id == unit.property_id).first()
    if not prop:
        raise HTTPException(status_code=404, detail="Associated property not found")
        
    if current_user.role != "Admin" and prop.owner_id != current_user.id:
         raise HTTPException(status_code=403, detail="Unauthorized to approve payments for this property")

    payment.status = "Paid"
    payment.paid_date = date.today()
    db.commit()
    db.refresh(payment)

    # Trigger: PAYMENT CONFIRMED
    # Recipient: Tenant ONLY
    NotificationService.create_notification(
        db,
        payment.tenant_id,
        "Payment Confirmed",
        f"Your rent payment of ${payment.amount} for Unit {payment.unit_number} has been confirmed. Thank you!",
        "Payment"
    )

    # Owner gets NO notification per specifications ("Owner: Store confirmation in payment history only")
    # Confirmed in database history.

    return payment

@router.get("", response_model=List[schemas.RentPaymentResponse])
def get_payments(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    # Enforce strict query filtering based on roles
    if current_user.role == "Admin":
        return db.query(models.RentPayment).all()
    elif current_user.role == "Owner":
        owner_properties = db.query(models.Property.id).filter(models.Property.owner_id == current_user.id).subquery()
        owner_units = db.query(models.Unit.id).filter(models.Unit.property_id.in_(owner_properties)).subquery()
        return db.query(models.RentPayment).filter(models.RentPayment.unit_id.in_(owner_units)).all()
    else:  # Tenant
        # Strict user-level access filtering: WHERE user_id = authenticated_user
        return db.query(models.RentPayment).filter(models.RentPayment.tenant_id == current_user.id).all()
