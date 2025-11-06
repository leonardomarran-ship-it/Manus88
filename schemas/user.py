from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr
    full_name: str

class UserCreate(BaseModel):
    model_config = {"json_schema_extra": {
        "examples": [{
            "email": "marco@manus88.com",
            "full_name": "Marco CEO",
            "password": "manus88",
            "tenant_id": None
        }]
    }}
    
    email: EmailStr
    full_name: str
    password: str
    tenant_id: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: str
    role: str
    is_active: bool
    tenant_id: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class TokenData(BaseModel):
    email: Optional[str] = None