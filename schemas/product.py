from pydantic import BaseModel
from typing import Optional

class ProductBase(BaseModel):
    name: str
    sku: str
    description: Optional[str] = None
    category: Optional[str] = None
    price: float = 0.0
    cost: float = 0.0
    stock_min: int = 0
    stock_max: int = 0
    stock_current: int = 0

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    sku: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = None
    cost: Optional[float] = None
    stock_min: Optional[int] = None
    stock_max: Optional[int] = None
    stock_current: Optional[int] = None

class ProductResponse(ProductBase):
    id: str
    tenant_id: str
    
    class Config:
        from_attributes = True