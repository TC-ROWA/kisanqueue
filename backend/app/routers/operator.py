from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import require_role
from app import models, schemas

router = APIRouter(prefix="/api/operator", tags=["operator"])

NEXT_STAGE = {
    models.QueueStatus.WAITING: models.QueueStatus.CALLED,
    models.QueueStatus.CALLED: models.QueueStatus.QUALITY_CHECK,
    models.QueueStatus.QUALITY_CHECK: models.QueueStatus.WEIGHING,
    models.QueueStatus.WEIGHING: models.QueueStatus.PROCUREMENT,
    models.QueueStatus.PROCUREMENT: models.QueueStatus.COMPLETED,
}


def _operator_centre(user, db: Session) -> str:
    op = db.get(models.Operator, user.id)
    if not op:
        raise HTTPException(403, "This account is not linked to a procurement centre")
    return op.centre_id


@router.get("/dashboard")
def dashboard(user=Depends(require_role("operator")), db: Session = Depends(get_db)):
    centre_id = _operator_centre(user, db)
    waiting = db.query(models.QueueEntry).filter_by(centre_id=centre_id, status=models.QueueStatus.WAITING).count()
    completed = db.query(models.QueueEntry).filter_by(centre_id=centre_id, status=models.QueueStatus.COMPLETED).count()
    no_show = db.query(models.QueueEntry).filter_by(centre_id=centre_id, status=models.QueueStatus.NO_SHOW).count()
    return {"waiting": waiting, "completed": completed, "no_show": no_show}


@router.get("/queue", response_model=list[schemas.QueueEntryOut])
def operator_queue(user=Depends(require_role("operator")), db: Session = Depends(get_db)):
    centre_id = _operator_centre(user, db)
    return (
        db.query(models.QueueEntry)
        .filter(models.QueueEntry.centre_id == centre_id)
        .filter(models.QueueEntry.status.notin_(["COMPLETED", "CANCELLED", "NO_SHOW"]))
        .order_by(models.QueueEntry.queue_position)
        .all()
    )


def _advance(entry_id: str, db: Session, new_status: models.QueueStatus = None):
    entry = db.get(models.QueueEntry, entry_id)
    if not entry:
        raise HTTPException(404, "Queue entry not found")
    entry.status = new_status or NEXT_STAGE.get(entry.status, entry.status)
    if entry.status == models.QueueStatus.CALLED:
        entry.called_time = datetime.now(timezone.utc)
    if entry.status == models.QueueStatus.COMPLETED:
        entry.completed_time = datetime.now(timezone.utc)
    db.commit()
    return entry


@router.post("/queue/call-next")
def call_next(entry_id: str, db: Session = Depends(get_db), user=Depends(require_role("operator"))):
    return _advance(entry_id, db, models.QueueStatus.CALLED)


@router.post("/queue/hold")
def hold(entry_id: str, db: Session = Depends(get_db), user=Depends(require_role("operator"))):
    entry = db.get(models.QueueEntry, entry_id)
    if not entry:
        raise HTTPException(404, "Queue entry not found")
    entry.status = models.QueueStatus.WAITING
    db.commit()
    return entry


@router.post("/queue/skip")
def skip(entry_id: str, db: Session = Depends(get_db), user=Depends(require_role("operator"))):
    entry = db.get(models.QueueEntry, entry_id)
    if not entry:
        raise HTTPException(404, "Queue entry not found")
    entry.queue_position = (entry.queue_position or 0) + 5
    db.commit()
    return entry


@router.post("/queue/complete")
def complete(entry_id: str, db: Session = Depends(get_db), user=Depends(require_role("operator"))):
    return _advance(entry_id, db, models.QueueStatus.COMPLETED)


@router.post("/quality-check")
def quality_check(entry_id: str, payload: schemas.QualityCheckIn, db: Session = Depends(get_db), user=Depends(require_role("operator"))):
    entry = db.get(models.QueueEntry, entry_id)
    if not entry:
        raise HTTPException(404, "Queue entry not found")
    qc = models.QualityCheck(
        queue_entry_id=entry_id, moisture=payload.moisture, foreign_matter=payload.foreign_matter,
        grade=payload.grade, result=payload.result, remarks=payload.remarks, checked_by=user.id,
    )
    db.add(qc)
    if payload.result == "APPROVED":
        entry.status = models.QueueStatus.WEIGHING
    db.commit()
    return qc


@router.post("/weighment")
def weighment(entry_id: str, payload: schemas.WeighmentIn, db: Session = Depends(get_db), user=Depends(require_role("operator"))):
    entry = db.get(models.QueueEntry, entry_id)
    if not entry:
        raise HTTPException(404, "Queue entry not found")
    booking = db.get(models.Booking, entry.booking_id)
    gross = payload.actual_weight * payload.rate
    w = models.Weighment(
        queue_entry_id=entry_id, declared_quantity=booking.declared_quantity,
        actual_weight=payload.actual_weight, rate=payload.rate, gross_amount=gross, weighed_by=user.id,
    )
    db.add(w)
    entry.status = models.QueueStatus.PROCUREMENT
    db.commit()
    db.refresh(w)
    return w
