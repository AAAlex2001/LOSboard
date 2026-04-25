from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class CreateAccountRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    name: str = Field(min_length=1, max_length=100)


class CreateAccountResponse(BaseModel):
    message: str
    email: EmailStr
    id: int


class UpdateAccountRequest(BaseModel):
    id: int
    email: Optional[EmailStr] = None
    password: Optional[str] = Field(None, min_length=8, max_length=128)
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    phone_number: Optional[str] = Field(None, min_length=11, max_length=11)

class UpdateAccountResponse(BaseModel):
    message: str
    email: EmailStr
    phone_number: Optional[str] = None
    name: str
    id: int

class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)

class LoginResponse(BaseModel):
    message: str
    email: EmailStr
    name: str
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    id: int   