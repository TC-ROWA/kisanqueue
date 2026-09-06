from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_current_user
from app import models, schemas

router = APIRouter(prefix="/api/farmers", tags=["farmers"])


@router.get("/me", response_model=schemas.FarmerOut)
def get_my_profile(user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    farmer = db.get(models.Farmer, user.id)
    return schemas.FarmerOut(
        id=user.id, full_name=user.full_name, mobile=user.mobile,
        village=farmer.village, district=farmer.district, state=farmer.state,
        farmer_id=farmer.farmer_id, preferred_language=farmer.preferred_language,
    )
