from schemas.auth import RefreshTokenRequest, RefreshTokenResponse
from services.auth.jwt_service import JWTService


class RefreshTokenUseCase:
    def __init__(self):
        self.jwt_service = JWTService()

    async def refresh_token(
        self,
        request: RefreshTokenRequest,
    ) -> RefreshTokenResponse:
        payload = self.jwt_service.verify_refresh_token(request.refresh_token)

        access_token = self.jwt_service.create_access_token(
            payload.user_id, payload.email
        )
        new_refresh_token = self.jwt_service.create_refresh_token(
            payload.user_id, payload.email
        )

        return RefreshTokenResponse(
            access_token=access_token,
            refresh_token=new_refresh_token,
        )
