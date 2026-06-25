from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid

from ..database import get_db
from .. import models, schemas, auth
from ..services.notification_service import NotificationService

router = APIRouter(prefix="/notifications", tags=["notifications"])

@router.get("", response_model=List[schemas.NotificationResponse])
def get_my_notifications(
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """
    Secure Query Filtering: Fetch notifications for authenticated user ONLY.
    WHERE user_id = authenticated_user
    """
    # Force query filter: user_id == current_user.id
    notifications = db.query(models.Notification)\
        .filter(models.Notification.user_id == current_user.id)\
        .order_by(models.Notification.created_at.desc())\
        .offset(offset)\
        .limit(limit)\
        .all()
        
    return notifications

@router.patch("/{notification_id}/read", response_model=schemas.NotificationResponse)
def mark_as_read(
    notification_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """
    Mark a notification as read, enforcing user ownership.
    """
    notification = db.query(models.Notification).filter(models.Notification.id == notification_id).first()
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
        
    # Security check: Ensure notification belongs to current user
    if notification.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Unauthorized to access other user's notifications"
        )
        
    notification.is_read = True
    notification.status = "Read"
    db.commit()
    db.refresh(notification)
    return notification

@router.delete("/clear-all")
def clear_all_my_notifications(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """
    Securely delete or mark all current user notifications as read.
    """
    db.query(models.Notification).filter(models.Notification.user_id == current_user.id).update(
        {models.Notification.is_read: True, models.Notification.status: "Read"},
        synchronize_session=False
    )
    db.commit()
    return {"message": "All notifications marked as read successfully"}

@router.post("/trigger-scheduler")
def trigger_daily_scheduler(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_admin_user)
):
    """
    Admin-only endpoint to manually trigger the daily notifications scheduler.
    """
    NotificationService.run_daily_scheduler(db)
    return {"message": "Automated notification scheduler execution completed successfully"}
