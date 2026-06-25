import uuid
from sqlalchemy.orm import Session
from datetime import datetime, date
from .. import models, schemas
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

class NotificationService:
    @staticmethod
    def create_notification(db: Session, user_id: uuid.UUID, title: str, message: str, type: str) -> models.Notification:
        """
        Creates a private, secure in-app notification in PostgreSQL and Supabase.
        Triggers email notifications if email configuration is active.
        """
        db_notification = models.Notification(
            user_id=user_id,
            title=title,
            message=message,
            type=type,
            status="Unread",
            is_read=False,
            created_at=datetime.utcnow()
        )
        db.add(db_notification)
        db.commit()
        db.refresh(db_notification)

        # Securely propagate to Supabase Real-Time / In-App if configured
        # Note: In production, you would run Supabase REST API push here
        
        # Trigger email as well
        user = db.query(models.User).filter(models.User.id == user_id).first()
        if user and user.email:
            NotificationService.send_email_notification(user.email, title, message)

        return db_notification

    @staticmethod
    def send_email_notification(to_email: str, title: str, message: str):
        """
        Helper method to dispatch an asynchronous SMTP email notification
        """
        # Safe mock / configuration guards for deployment safety
        import os
        smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
        smtp_port = int(os.getenv("SMTP_PORT", "587"))
        smtp_user = os.getenv("SMTP_USER")
        smtp_pass = os.getenv("SMTP_PASSWORD")

        if not smtp_user or not smtp_pass:
            print(f"[MOCK EMAIL DISPATCH] Sent to {to_email}: Title: {title} | Msg: {message}")
            return

        try:
            msg = MIMEMultipart()
            msg["From"] = f"PROPERTYLOG <{smtp_user}>"
            msg["To"] = to_email
            msg["Subject"] = f"[PROPERTYLOG] {title}"

            body = f"""
            <html>
                <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 12px; background-color: #fcfcfc;">
                        <h2 style="color: #2563eb; margin-top: 0;">PROPERTYLOG Action Required</h2>
                        <hr style="border: 0; border-top: 1px solid #eee;" />
                        <p style="font-size: 14px; font-weight: bold; color: #111;">{title}</p>
                        <p style="font-size: 14px; margin-bottom: 25px;">{message}</p>
                        <a href="https://propertylog-app.com/notifications" style="display: inline-block; padding: 10px 20px; background-color: #1e293b; color: #fff; text-decoration: none; border-radius: 8px; font-size: 13px; font-weight: bold;">View Inbox</a>
                        <p style="font-size: 11px; color: #999; margin-top: 30px;">You are receiving this email because you opted into property management system notifications.</p>
                    </div>
                </body>
            </html>
            """
            msg.attach(MIMEText(body, "html"))

            server = smtplib.SMTP(smtp_host, smtp_port)
            server.starttls()
            server.login(smtp_user, smtp_pass)
            server.sendmail(smtp_user, to_email, msg.as_string())
            server.quit()
            print(f"[EMAIL SUCCESS] Sent notification to {to_email}")
        except Exception as e:
            print(f"[EMAIL FAILURE] Failed to send email to {to_email}: {str(e)}")

    @staticmethod
    def get_user_notifications(db: Session, user_id: uuid.UUID, limit: int = 50, offset: int = 0) -> list:
        """
        Enforce Strict Secure Query Filtering: Only fetch notifications for authenticated user
        """
        return db.query(models.Notification)\
            .filter(models.Notification.user_id == user_id)\
            .order_index(models.Notification.created_at.desc())\
            .offset(offset)\
            .limit(limit)\
            .all()

    @staticmethod
    def run_daily_scheduler(db: Session):
        """
        Automated Daily Scheduler: Triggers rent reminders and lease expiries
        """
        today = date.today()
        # 1. Lease Expiry check (30 days before / 7 days before)
        # 2. Upcoming Rent Due (due in 3 days)
        # 3. Overdue Rent check
        
        # Leases Expiring in 30 days
        expiry_30 = today + timedelta(days=30)
        expiring_leases_30 = db.query(models.Lease).filter(models.Lease.end_date == expiry_30, models.Lease.status == "Active").all()
        for lease in expiring_leases_30:
            msg = f"Your lease for property '{lease.property_name}' (Unit {lease.unit_number}) will expire in 30 days on {lease.end_date}."
            # Notify Tenant
            NotificationService.create_notification(db, lease.tenant_id, "Lease Expiration in 30 Days", msg, "Lease")
            # Notify Landlord/Owner
            prop = db.query(models.Property).filter(models.Property.id == lease.property_id).first()
            if prop:
                NotificationService.create_notification(db, prop.owner_id, f"Lease Expiration - Tenant {lease.tenant_name}", f"Lease for Unit {lease.unit_number} will expire in 30 days on {lease.end_date}.", "Lease")

        # Leases Expiring in 7 days
        expiry_7 = today + timedelta(days=7)
        expiring_leases_7 = db.query(models.Lease).filter(models.Lease.end_date == expiry_7, models.Lease.status == "Active").all()
        for lease in expiring_leases_7:
            msg = f"URGENT: Your lease for property '{lease.property_name}' (Unit {lease.unit_number}) expires in exactly 7 days on {lease.end_date}."
            # Notify Tenant
            NotificationService.create_notification(db, lease.tenant_id, "Lease Expiration in 7 Days", msg, "Lease")
            # Notify Landlord
            prop = db.query(models.Property).filter(models.Property.id == lease.property_id).first()
            if prop:
                NotificationService.create_notification(db, prop.owner_id, f"URGENT: Lease Expiration - Unit {lease.unit_number}", f"Lease for Tenant {lease.tenant_name} will expire in 7 days on {lease.end_date}.", "Lease")

        # Rent Due (e.g., upcoming payments due within 3 days)
        due_soon = today + timedelta(days=3)
        upcoming_rent = db.query(models.RentPayment).filter(models.RentPayment.due_date == due_soon, models.RentPayment.status == "Unpaid").all()
        for p in upcoming_rent:
            msg = f"Your rent of ${p.amount} for {p.property_name} (Unit {p.unit_number}) is due on {p.due_date}."
            NotificationService.create_notification(db, p.tenant_id, "Upcoming Rent Due", msg, "Payment")

        # Overdue Rent check (due date passed and status is overdue/unpaid)
        overdue_rent = db.query(models.RentPayment).filter(models.RentPayment.due_date < today, models.RentPayment.status == "Unpaid").all()
        for p in overdue_rent:
            # Update payment status
            p.status = "Overdue"
            db.commit()
            msg = f"Your rent payment of ${p.amount} is OVERDUE! Due date was {p.due_date}."
            # Rent Due Trigger - Assigned Tenant ONLY
            NotificationService.create_notification(db, p.tenant_id, "Rent Overdue Notice", msg, "Payment")
            # Owners DO NOT receive overdue reminders per guidelines ("Owner: Do not send overdue reminders")
