from typing import List, Callable
from fastapi import Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.database.models import Profile
from app.core.security import decode_access_token
from app.core.exceptions import UnauthenticatedException, UnauthorizedException

security_scheme = HTTPBearer(auto_error=False)

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
    db: Session = Depends(get_db)
) -> Profile:
    if not credentials or not credentials.credentials:
        raise UnauthenticatedException(message="Missing authentication token")
    
    payload = decode_access_token(credentials.credentials)
    if not payload:
        raise UnauthenticatedException(message="Invalid or expired token")
    
    user_id = payload.get("sub")
    if not user_id:
        raise UnauthenticatedException(message="Token payload invalid")
    
    user = db.query(Profile).filter(Profile.id == user_id, Profile.is_active == True).first()
    if not user:
        raise UnauthenticatedException(message="User profile not found or inactive")
    
    return user

def require_role(allowed_roles: List[str]) -> Callable:
    def role_checker(current_user: Profile = Depends(get_current_user)) -> Profile:
        if current_user.role not in allowed_roles:
            raise UnauthorizedException(
                message=f"Role '{current_user.role}' is not authorized to access this resource. Allowed roles: {', '.join(allowed_roles)}"
            )
        return current_user
    return role_checker
