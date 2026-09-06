from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.deps import require_role
from app import models, schemas

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.get("/dashboard")
def dashboard(user=Depends(require_role("admin")), db: Session = Depends(get_db)):
    return {
        "total_farmers": db.query(models.Farmer).count(),
        "active_centres": db.query(models.ProcurementCentre).filter_by(status=models.CentreStatus.OPEN).count(),
        "current_waiting": db.query(models.QueueEntry).filter_by(status=models.QueueStatus.WAITING).count(),
        "completed_procurements": db.query(models.Procurement).count(),
        "pending_payments": db.query(models.Payment).filter(models.Payment.status != "PAID").count(),
    }


@router.get("/farmers")
def list_farmers(user=Depends(require_role("admin")), db: Session = Depends(get_db)):
    return db.query(models.Farmer).all()


@router.get("/centres", response_model=list[schemas.CentreOut])
def list_centres(user=Depends(require_role("admin")), db: Session = Depends(get_db)):
    return db.query(models.ProcurementCentre).all()


@router.post("/centres", response_model=schemas.CentreOut)
def create_centre(payload: schemas.CentreOut, user=Depends(require_role("admin")), db: Session = Depends(get_db)):
    centre = models.ProcurementCentre(
        name=payload.name, village=payload.village, district=payload.district, state=payload.state,
        latitude=payload.latitude, longitude=payload.longitude, daily_capacity=payload.daily_capacity,
    )
    db.add(centre)
    db.commit()
    db.refresh(centre)
    return centre


@router.put("/centres/{centre_id}", response_model=schemas.CentreOut)
def update_centre(centre_id: str, payload: dict, user=Depends(require_role("admin")), db: Session = Depends(get_db)):
    centre = db.get(models.ProcurementCentre, centre_id)
    if not centre:
        raise HTTPException(404, "Centre not found")
    for key, value in payload.items():
        if hasattr(centre, key):
            setattr(centre, key, value)
    db.commit()
    db.refresh(centre)
    return centre


@router.get("/analytics")
def analytics(user=Depends(require_role("admin")), db: Session = Depends(get_db)):
    by_status = (
        db.query(models.QueueEntry.status, func.count(models.QueueEntry.id))
        .group_by(models.QueueEntry.status)
        .all()
    )
    return {"queue_by_status": {status.value: count for status, count in by_status}}


@router.get("/complaints", response_model=list[schemas.ComplaintOut])
def list_complaints(user=Depends(require_role("admin")), db: Session = Depends(get_db)):
    return db.query(models.Complaint).order_by(models.Complaint.created_at.desc()).all()
