from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
import uuid
from datetime import date

from ..database import get_db
from .. import models, auth

router = APIRouter(prefix="/reports", tags=["reports"])

@router.get("/financials")
def get_financial_report(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_owner_user)
):
    """
    Generate real-time revenue collection and expense reports.
    """
    # Filter properties/payments by owner
    if current_user.role == "Admin":
        properties_q = db.query(models.Property).all()
        payments_q = db.query(models.RentPayment).all()
        maintenance_q = db.query(models.MaintenanceTicket).all()
    else:
        properties_q = db.query(models.Property).filter(models.Property.owner_id == current_user.id).all()
        owner_props_ids = [p.id for p in properties_q]
        
        owner_units_ids = [u.id for u in db.query(models.Unit).filter(models.Unit.property_id.in_(owner_props_ids)).all()]
        payments_q = db.query(models.RentPayment).filter(models.RentPayment.unit_id.in_(owner_units_ids)).all()
        maintenance_q = db.query(models.MaintenanceTicket).filter(models.MaintenanceTicket.property_id.in_(owner_props_ids)).all()

    # Calculate metrics
    total_expected = sum(p.amount for p in payments_q)
    total_received = sum(p.amount for p in payments_q if p.status == "Paid")
    total_unpaid = sum(p.amount for p in payments_q if p.status == "Unpaid" or p.status == "Overdue")
    total_expenses = sum(t.cost for t in maintenance_q if t.cost)

    net_income = total_received - total_expenses
    collection_rate = (total_received / total_expected * 100) if total_expected > 0 else 0.0

    return {
        "properties_count": len(properties_q),
        "total_expected_revenue": float(total_expected),
        "total_received_revenue": float(total_received),
        "total_unpaid_revenue": float(total_unpaid),
        "total_maintenance_expenses": float(total_expenses),
        "net_income": float(net_income),
        "collection_rate": float(collection_rate),
        "monthly_trends": [
            # Mocked data structure for visual charts representation
            {"month": "Jan", "revenue": float(total_received) * 0.8, "expenses": float(total_expenses) * 0.15},
            {"month": "Feb", "revenue": float(total_received) * 0.85, "expenses": float(total_expenses) * 0.2},
            {"month": "Mar", "revenue": float(total_received) * 0.9, "expenses": float(total_expenses) * 0.3},
            {"month": "Apr", "revenue": float(total_received) * 0.95, "expenses": float(total_expenses) * 0.25},
            {"month": "May", "revenue": float(total_received) * 1.0, "expenses": float(total_expenses) * 0.1},
        ]
    }
