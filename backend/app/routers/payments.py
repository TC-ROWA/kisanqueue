from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/api", tags=["payments"])


@router.get("/payments/{payment_id}")
def get_payment(payment_id: str, db: Session = Depends(get_db)):
    payment = db.get(models.Payment, payment_id)
    if not payment:
        raise HTTPException(404, "Payment not found")
    return {
        "id": payment.id,
        "amount": float(payment.amount),
        "status": payment.status,
        "method": payment.method,
        "reference": payment.reference,
        "paid_at": payment.paid_at,
    }

