from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app import models

router = APIRouter(prefix="/api/procurement", tags=["procurement"])


@router.get("/{queue_entry_id}")
def get_procurement_status(queue_entry_id: str, db: Session = Depends(get_db)):
    entry = db.get(models.QueueEntry, queue_entry_id)
    if not entry:
        raise HTTPException(404, "Queue entry not found.")
    quality = db.query(models.QualityCheck).filter_by(queue_entry_id=queue_entry_id).first()
    weighment = db.query(models.Weighment).filter_by(queue_entry_id=queue_entry_id).first()
    return {
        "status": entry.status.value,
        "quality_check": quality,
        "weighment": weighment,
    }
