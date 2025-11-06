from sqlalchemy import Column, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.models.base import Base

class Tenant(Base):
    __tablename__ = "tenants"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    domain = Column(String, unique=True, nullable=True)
    plan = Column(String, default="free")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relaciones
    users = relationship("User", back_populates="tenant")
    customers = relationship("Customer", back_populates="tenant")
    products = relationship("Product", back_populates="tenant")
    machinery = relationship("Machinery", back_populates="tenant")  # ← ESTA ERA LA LÍNEA MAL