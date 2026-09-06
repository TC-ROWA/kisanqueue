import random
import string
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_current_user
from app import models, schemas

router = APIRouter(prefix="/api", tags=["bookings"])


def generate_token() -> str:
    return "KQ-" + "".join(random.choices(string.digits, k=3))


@router.post("/bookings", response_model=schemas.BookingOut)
def create_booking(payload: schemas.BookingCreate, user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    slot = db.get(models.Slot, payload.slot_id)
    if not slot:
        raise HTTPException(404, "Slot not found")
    if slot.booked_count >= slot.capacity:
        raise HTTPException(409, "Slot is no longer available. Please select another slot.")

    booking = models.Booking(
        farmer_id=user.id, centre_id=payload.centre_id, slot_id=payload.slot_id,
        crop_id=payload.crop_id, declared_quantity=payload.declared_quantity,
        token_number=generate_token(),
    )
    db.add(booking)
    slot.booked_count += 1

    queue_entry = models.QueueEntry(
        booking_id=booking.id, farmer_id=user.id, centre_id=payload.centre_id,
        token_number=booking.token_number, status=models.QueueStatus.BOOKED,
    )
    db.add(queue_entry)
    db.commit()
    db.refresh(booking)
    return booking


@router.get("/bookings/{booking_id}", response_model=schemas.BookingOut)
def get_booking(booking_id: str, db: Session = Depends(get_db)):
    booking = db.get(models.Booking, booking_id)
    if not booking:
        raise HTTPException(404, "Booking not found")
    return booking


@router.post("/bookings/{booking_id}/cancel")
def cancel_booking(booking_id: str, db: Session = Depends(get_db)):
    booking = db.get(models.Booking, booking_id)
    if not booking:
        raise HTTPException(404, "Booking not found")
    booking.status = "CANCELLED"
    db.commit()
    return {"id": booking_id, "status": "CANCELLED"}

