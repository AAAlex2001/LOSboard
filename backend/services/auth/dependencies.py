from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from services.auth.jwt_service import JWTService, TokenPayloadDTO


bearer_scheme = HTTPBearer()
jwt_service = JWTService()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> TokenPayloadDTO:
    return jwt_service.verify_access_token(credentials.credentials)
