from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/api/queue", tags=["queue"])


@router.get("/{booking_id}", response_model=schemas.QueueEntryOut)
def get_queue_entry(booking_id: str, db: Session = Depends(get_db)):
    entry = db.query(models.QueueEntry).filter_by(booking_id=booking_id).first()
    if not entry:
        raise HTTPException(404, "No queue entry for this booking.")
    return entry
