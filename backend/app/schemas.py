from datetime import date, time, datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class RegisterRequest(BaseModel):
    full_name: str
    mobile: str
    email: Optional[str] = None
    village: str
    district: str
    state: str
    farmer_id: Optional[str] = None
    preferred_language: str = "en"
    password: str


class LoginRequest(BaseModel):
    mobile: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class FarmerOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    full_name: str
    mobile: str
    village: str
    district: str
    state: str
    farmer_id: Optional[str] = None
    preferred_language: str


class CentreOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    name: str
    village: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None
    latitude: float
    longitude: float
    daily_capacity: int
    status: str


class SlotOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    slot_date: date
    start_time: time
    end_time: time
    capacity: int
    booked_count: int


class BookingCreate(BaseModel):
    centre_id: str
    slot_id: str
    crop_id: str
    declared_quantity: float


class BookingOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    token_number: str
    status: str
    centre_id: str
    slot_id: str
    crop_id: str
    declared_quantity: float


class QueueEntryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    token_number: str
    queue_position: Optional[int] = None
    status: str
    estimated_wait_minutes: Optional[int] = None


class QualityCheckIn(BaseModel):
    moisture: float
    foreign_matter: float
    grade: str
    result: str
    remarks: Optional[str] = None


class WeighmentIn(BaseModel):
    actual_weight: float
    rate: float


class ComplaintCreate(BaseModel):
    category: str
    subject: str
    description: str


class ComplaintOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    category: str
    subject: str
    status: str
    created_at: datetime
