from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from supabase import create_client

from app.database import get_db
from app.config import settings
from app import models, schemas

router = APIRouter(prefix="/api/auth", tags=["auth"])


def get_supabase():
    return create_client(settings.supabase_url, settings.supabase_service_role_key)


@router.post("/register", response_model=schemas.TokenResponse)
def register(payload: schemas.RegisterRequest, db: Session = Depends(get_db)):
    """
    Creates the Supabase Auth user (email+password, using mobile@kisanqueue as
    a synthetic email if the farmer didn't give a real one) and the matching
    `users` + `farmers` rows. Returns a session token so the frontend can log
    the farmer straight in after registering.
    """
    sb = get_supabase()
    email = payload.email or f"{payload.mobile}@kisanqueue.local"

    if db.query(models.User).filter_by(mobile=payload.mobile).first():
        raise HTTPException(409, "An account with this mobile number already exists")

    created = sb.auth.admin.create_user({
        "email": email,
        "password": payload.password,
        "email_confirm": True,
    })
    user_id = created.user.id

    user = models.User(id=user_id, role=models.UserRole.farmer, full_name=payload.full_name, mobile=payload.mobile, email=payload.email)
    farmer = models.Farmer(
        id=user_id, village=payload.village, district=payload.district, state=payload.state,
        farmer_id=payload.farmer_id, preferred_language=payload.preferred_language,
    )
    db.add(user)
    db.add(farmer)
    db.commit()

    session = sb.auth.sign_in_with_password({"email": email, "password": payload.password})
    return schemas.TokenResponse(access_token=session.session.access_token)


@router.post("/login", response_model=schemas.TokenResponse)
def login(payload: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter_by(mobile=payload.mobile).first()
    if not user:
        raise HTTPException(401, "Invalid mobile number or password")

    sb = get_supabase()
    email = user.email or f"{user.mobile}@kisanqueue.local"
    try:
        session = sb.auth.sign_in_with_password({"email": email, "password": payload.password})
    except Exception:
        raise HTTPException(401, "Invalid mobile number or password")

    return schemas.TokenResponse(access_token=session.session.access_token)
