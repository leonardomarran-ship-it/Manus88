from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class TenantBase(BaseModel):
    name: str
    domain: Optional[str] = None
    plan: str = "free"

class TenantCreate(TenantBase):
    pass

class TenantResponse(TenantBase):
    id: str
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True
        