from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_current_user
from app import models, schemas

router = APIRouter(prefix="/api/complaints", tags=["complaints"])


@router.post("", response_model=schemas.ComplaintOut)
def submit_complaint(payload: schemas.ComplaintCreate, user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    complaint = models.Complaint(
        farmer_id=user.id, category=payload.category, subject=payload.subject,
        description=payload.description,
    )
    db.add(complaint)
    db.commit()
    db.refresh(complaint)
    return complaint
