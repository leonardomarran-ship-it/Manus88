from sqlalchemy import Column, String, Float, Integer, Date, Boolean, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from app.models.base import Base
import enum

# Enums
class MachineryType(str, enum.Enum):
    EXCAVADORA = "excavadora"
    CARGADOR = "cargador"
    BULLDOZER = "bulldozer"
    RETROEXCAVADORA = "retroexcavadora"
    GRUA = "grua"
    COMPACTADORA = "compactadora"
    MOTONIVELADORA = "motoniveladora"
    CAMION_VOLQUETE = "camion_volquete"
    PERFORADORA = "perforadora"
    OTRO = "otro"

class MachineryStatus(str, enum.Enum):
    OPERATIVO = "operativo"
    EN_MANTENIMIENTO = "en_mantenimiento"
    FUERA_DE_SERVICIO = "fuera_de_servicio"
    EN_REPARACION = "en_reparacion"

class Machinery(Base):
    __tablename__ = "machinery"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    code = Column(String, unique=True, nullable=False)
    brand = Column(String, nullable=True)
    model = Column(String, nullable=True)
    serial_number = Column(String, nullable=True)
    year = Column(Integer, nullable=True)
    machinery_type = Column(SQLEnum(MachineryType), nullable=False)
    status = Column(SQLEnum(MachineryStatus), default=MachineryStatus.OPERATIVO)
    current_location = Column(String, nullable=True)
    current_project = Column(String, nullable=True)
    horometer = Column(Float, default=0.0)
    odometer = Column(Float, default=0.0)
    operator_name = Column(String, nullable=True)
    operator_id = Column(String, nullable=True)
    next_maintenance_hours = Column(Float, nullable=True)
    maintenance_interval_hours = Column(Float, default=250.0)
    last_maintenance_date = Column(Date, nullable=True)
    acquisition_cost = Column(Float, default=0.0)
    hourly_rate = Column(Float, default=0.0)
    fuel_consumption_rate = Column(Float, default=0.0)
    capacity = Column(String, nullable=True)
    engine_power = Column(String, nullable=True)
    weight = Column(Float, nullable=True)
    plate_number = Column(String, nullable=True)
    is_available = Column(Boolean, default=True)
    is_active = Column(Boolean, default=True)
    tenant_id = Column(String, ForeignKey("tenants.id"), nullable=False)
    
    # Relación
    tenant = relationship("Tenant", back_populates="machinery")