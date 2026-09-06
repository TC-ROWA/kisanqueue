from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import require_role
from app import models

router = APIRouter(prefix="/api/notifications", tags=["notifications"])


@router.get("")
def list_notifications(user: models.User = Depends(require_role("farmer")), db: Session = Depends(get_db)):
    return (
        db.query(models.Notification)
        .filter_by(farmer_id=user.id)
        .order_by(models.Notification.created_at.desc())
        .all()
    )
