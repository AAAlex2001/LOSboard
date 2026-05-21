from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional


class CreateAccountRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    name: str = Field(min_length=1, max_length=100)

    @field_validator("email", mode="before")
    @classmethod
    def normalize_email(cls, v):
        return v.strip().lower() if isinstance(v, str) else v


class CreateAccountResponse(BaseModel):
    message: str
    email: EmailStr
    id: int


class UpdateAccountRequest(BaseModel):
    email: Optional[EmailStr] = None
    password: Optional[str] = Field(None, min_length=8, max_length=128)
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    phone_number: Optional[str] = Field(None, min_length=11, max_length=11)

    @field_validator("email", mode="before")
    @classmethod
    def normalize_email(cls, v):
        return v.strip().lower() if isinstance(v, str) else v


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class RefreshTokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class UpdateAccountResponse(BaseModel):
    message: str
    email: EmailStr
    phone_number: Optional[str] = None
    name: str
    id: int

class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)

    @field_validator("email", mode="before")
    @classmethod
    def normalize_email(cls, v):
        return v.strip().lower() if isinstance(v, str) else v

class LoginResponse(BaseModel):
    message: str
    email: EmailStr
    name: str
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    id: int


class MeResponse(BaseModel):
    id: int
    email: EmailStr
    name: str
    phone_number: Optional[str] = None
    avatar_url: Optional[str] = None


class UploadAvatarResponse(BaseModel):
    avatar_url: str
