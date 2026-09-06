from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/api/centres", tags=["centres"])


@router.get("", response_model=list[schemas.CentreOut])
def list_centres(db: Session = Depends(get_db)):
    return db.query(models.ProcurementCentre).all()


@router.get("/{centre_id}", response_model=schemas.CentreOut)
def get_centre(centre_id: str, db: Session = Depends(get_db)):
    centre = db.get(models.ProcurementCentre, centre_id)
    if not centre:
        raise HTTPException(404, "Procurement centre not found")
    return centre


@router.get("/{centre_id}/queue", response_model=list[schemas.QueueEntryOut])
def get_centre_queue(centre_id: str, db: Session = Depends(get_db)):
    return (
        db.query(models.QueueEntry)
        .filter(models.QueueEntry.centre_id == centre_id)
        .filter(models.QueueEntry.status.notin_(["COMPLETED", "CANCELLED", "NO_SHOW"]))
        .order_by(models.QueueEntry.queue_position)
        .all()
    )
