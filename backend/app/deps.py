from fastapi import Depends, HTTPException, Header, status
from jose import jwt, JWTError
from sqlalchemy.orm import Session

from app.database import get_db
from app.config import settings
from app import models


def get_current_user(
    authorization: str = Header(default=None),
    db: Session = Depends(get_db),
) -> models.User:
    """
    Verifies the Supabase Auth JWT sent as `Authorization: Bearer <token>`
    by the frontend (the Supabase JS client attaches this automatically).
    Supabase signs tokens with the project's JWT secret — for local
    development you can find it under Project Settings -> API -> JWT Secret.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Missing bearer token")
    token = authorization.removeprefix("Bearer ").strip()
    try:
        payload = jwt.decode(
            token,
            settings.supabase_service_role_key,
            algorithms=["HS256"],
            options={"verify_aud": False},
        )
    except JWTError:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid or expired token")

    user_id = payload.get("sub")
    user = db.get(models.User, user_id)
    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User profile not found")
    return user


def require_role(*roles: str):
    def _check(user: models.User = Depends(get_current_user)) -> models.User:
        if user.role.value not in roles:
            raise HTTPException(status.HTTP_403_FORBIDDEN, "Not permitted for this role")
        return user
    return _check
