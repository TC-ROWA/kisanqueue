import uuid
import enum
from sqlalchemy import (
    Column, String, Text, Integer, Numeric, Boolean, ForeignKey, DateTime,
    Date, Time, Enum, JSON, func
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


def uid():
    return str(uuid.uuid4())


class UserRole(str, enum.Enum):
    farmer = "farmer"
    operator = "operator"
    admin = "admin"


class CentreStatus(str, enum.Enum):
    OPEN = "OPEN"
    HIGH_RUSH = "HIGH_RUSH"
    LIMITED_CAPACITY = "LIMITED_CAPACITY"
    PAUSED = "PAUSED"
    CLOSED = "CLOSED"


class QueueStatus(str, enum.Enum):
    BOOKED = "BOOKED"
    ARRIVED = "ARRIVED"
    WAITING = "WAITING"
    CALLED = "CALLED"
    QUALITY_CHECK = "QUALITY_CHECK"
    WEIGHING = "WEIGHING"
    PROCUREMENT = "PROCUREMENT"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"
    NO_SHOW = "NO_SHOW"


class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=False), primary_key=True)
    role = Column(Enum(UserRole, name="user_role"), nullable=False, default=UserRole.farmer)
    full_name = Column(Text, nullable=False)
    mobile = Column(Text, nullable=False, unique=True)
    email = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Farmer(Base):
    __tablename__ = "farmers"
    id = Column(UUID(as_uuid=False), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    village = Column(Text, nullable=False)
    district = Column(Text, nullable=False)
    state = Column(Text, nullable=False)
    farmer_id = Column(Text)
    preferred_language = Column(Text, default="en")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    bookings = relationship("Booking", back_populates="farmer")


class ProcurementCentre(Base):
    __tablename__ = "procurement_centres"
    id = Column(UUID(as_uuid=False), primary_key=True, default=uid)
    name = Column(Text, nullable=False)
    address = Column(Text)
    village = Column(Text)
    district = Column(Text)
    state = Column(Text)
    latitude = Column(Numeric)
    longitude = Column(Numeric)
    daily_capacity = Column(Integer, default=100)
    opening_time = Column(Time)
    closing_time = Column(Time)
    status = Column(Enum(CentreStatus, name="centre_status"), default=CentreStatus.OPEN)
    paused_reason = Column(Text)
    reopen_estimate = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    slots = relationship("Slot", back_populates="centre")


class Operator(Base):
    __tablename__ = "operators"
    id = Column(UUID(as_uuid=False), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    centre_id = Column(UUID(as_uuid=False), ForeignKey("procurement_centres.id", ondelete="CASCADE"), nullable=False)


class Admin(Base):
    __tablename__ = "admins"
    id = Column(UUID(as_uuid=False), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)


class Crop(Base):
    __tablename__ = "crops"
    id = Column(UUID(as_uuid=False), primary_key=True, default=uid)
    name = Column(Text, nullable=False, unique=True)
    msp_rate = Column(Numeric(10, 2))


class Slot(Base):
    __tablename__ = "slots"
    id = Column(UUID(as_uuid=False), primary_key=True, default=uid)
    centre_id = Column(UUID(as_uuid=False), ForeignKey("procurement_centres.id", ondelete="CASCADE"), nullable=False)
    slot_date = Column(Date, nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    capacity = Column(Integer, default=20)
    booked_count = Column(Integer, default=0)

    centre = relationship("ProcurementCentre", back_populates="slots")


class Booking(Base):
    __tablename__ = "bookings"
    id = Column(UUID(as_uuid=False), primary_key=True, default=uid)
    farmer_id = Column(UUID(as_uuid=False), ForeignKey("farmers.id", ondelete="CASCADE"), nullable=False)
    centre_id = Column(UUID(as_uuid=False), ForeignKey("procurement_centres.id"), nullable=False)
    slot_id = Column(UUID(as_uuid=False), ForeignKey("slots.id"), nullable=False)
    crop_id = Column(UUID(as_uuid=False), ForeignKey("crops.id"), nullable=False)
    declared_quantity = Column(Numeric(10, 2), nullable=False)
    token_number = Column(Text, nullable=False, unique=True)
    status = Column(Text, default="CONFIRMED")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    farmer = relationship("Farmer", back_populates="bookings")


class QueueEntry(Base):
    __tablename__ = "queue_entries"
    id = Column(UUID(as_uuid=False), primary_key=True, default=uid)
    booking_id = Column(UUID(as_uuid=False), ForeignKey("bookings.id", ondelete="CASCADE"), nullable=False)
    farmer_id = Column(UUID(as_uuid=False), ForeignKey("farmers.id"), nullable=False)
    centre_id = Column(UUID(as_uuid=False), ForeignKey("procurement_centres.id"), nullable=False)
    token_number = Column(Text, nullable=False)
    queue_position = Column(Integer)
    status = Column(Enum(QueueStatus, name="queue_status"), default=QueueStatus.BOOKED)
    arrival_time = Column(DateTime(timezone=True))
    called_time = Column(DateTime(timezone=True))
    completed_time = Column(DateTime(timezone=True))
    estimated_wait_minutes = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class QualityCheck(Base):
    __tablename__ = "quality_checks"
    id = Column(UUID(as_uuid=False), primary_key=True, default=uid)
    queue_entry_id = Column(UUID(as_uuid=False), ForeignKey("queue_entries.id", ondelete="CASCADE"), nullable=False)
    moisture = Column(Numeric(5, 2))
    foreign_matter = Column(Numeric(5, 2))
    grade = Column(Text)
    result = Column(Enum("APPROVED", "REJECTED", name="quality_result"), nullable=False)
    remarks = Column(Text)
    checked_by = Column(UUID(as_uuid=False), ForeignKey("operators.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Weighment(Base):
    __tablename__ = "weighments"
    id = Column(UUID(as_uuid=False), primary_key=True, default=uid)
    queue_entry_id = Column(UUID(as_uuid=False), ForeignKey("queue_entries.id", ondelete="CASCADE"), nullable=False)
    declared_quantity = Column(Numeric(10, 2), nullable=False)
    actual_weight = Column(Numeric(10, 2), nullable=False)
    rate = Column(Numeric(10, 2), nullable=False)
    gross_amount = Column(Numeric(12, 2), nullable=False)
    weighed_by = Column(UUID(as_uuid=False), ForeignKey("operators.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Procurement(Base):
    __tablename__ = "procurements"
    id = Column(UUID(as_uuid=False), primary_key=True, default=uid)
    queue_entry_id = Column(UUID(as_uuid=False), ForeignKey("queue_entries.id", ondelete="CASCADE"), nullable=False)
    weighment_id = Column(UUID(as_uuid=False), ForeignKey("weighments.id"))
    deductions = Column(Numeric(12, 2), default=0)
    net_amount = Column(Numeric(12, 2), nullable=False)
    completed_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Payment(Base):
    __tablename__ = "payments"
    id = Column(UUID(as_uuid=False), primary_key=True, default=uid)
    procurement_id = Column(UUID(as_uuid=False), ForeignKey("procurements.id", ondelete="CASCADE"), nullable=False)
    farmer_id = Column(UUID(as_uuid=False), ForeignKey("farmers.id"), nullable=False)
    amount = Column(Numeric(12, 2), nullable=False)
    status = Column(Enum("PENDING", "INITIATED", "PROCESSING", "PAID", "FAILED", name="payment_status"), default="PENDING")
    method = Column(Text, default="Direct Bank Transfer")
    reference = Column(Text, unique=True)
    paid_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Notification(Base):
    __tablename__ = "notifications"
    id = Column(UUID(as_uuid=False), primary_key=True, default=uid)
    farmer_id = Column(UUID(as_uuid=False), ForeignKey("farmers.id", ondelete="CASCADE"), nullable=False)
    category = Column(Text, nullable=False)
    message = Column(Text, nullable=False)
    read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Complaint(Base):
    __tablename__ = "complaints"
    id = Column(UUID(as_uuid=False), primary_key=True, default=uid)
    farmer_id = Column(UUID(as_uuid=False), ForeignKey("farmers.id", ondelete="CASCADE"), nullable=False)
    category = Column(Enum("PAYMENT", "QUALITY", "WEIGHT", "TOKEN", "CENTRE", "OTHER", name="complaint_category"), nullable=False)
    subject = Column(Text, nullable=False)
    description = Column(Text, nullable=False)
    status = Column(Enum("OPEN", "IN_REVIEW", "RESOLVED", "REJECTED", name="complaint_status"), default="OPEN")
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(UUID(as_uuid=False), primary_key=True, default=uid)
    actor_id = Column(UUID(as_uuid=False), ForeignKey("users.id"))
    action = Column(Text, nullable=False)
    entity = Column(Text, nullable=False)
    entity_id = Column(UUID(as_uuid=False))
    metadata_json = Column("metadata", JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
