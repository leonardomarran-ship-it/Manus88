from sqlalchemy import Column, String, Float, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.models.base import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    sku = Column(String, unique=True, nullable=False)
    description = Column(String, nullable=True)
    category = Column(String, nullable=True)
    price = Column(Float, default=0.0)
    cost = Column(Float, default=0.0)
    stock_min = Column(Integer, default=0)
    stock_max = Column(Integer, default=0)
    stock_current = Column(Integer, default=0)
    tenant_id = Column(String, ForeignKey("tenants.id"), nullable=False)
    
    # Relación
    tenant = relationship("Tenant", back_populates="products")