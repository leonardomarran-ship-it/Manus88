from pydantic import BaseModel
from typing import Optional
from datetime import date

class MachineryBase(BaseModel):
    name: str
    code: str
    brand: Optional[str] = None
    model: Optional[str] = None
    serial_number: Optional[str] = None
    year: Optional[int] = None
    machinery_type: str
    status: str = "operativo"
    current_location: Optional[str] = None
    current_project: Optional[str] = None
    horometer: float = 0.0
    odometer: float = 0.0
    operator_name: Optional[str] = None
    operator_id: Optional[str] = None
    next_maintenance_hours: Optional[float] = None
    maintenance_interval_hours: float = 250.0
    last_maintenance_date: Optional[date] = None
    acquisition_cost: float = 0.0
    hourly_rate: float = 0.0
    fuel_consumption_rate: float = 0.0
    capacity: Optional[str] = None
    engine_power: Optional[str] = None
    weight: Optional[float] = None
    plate_number: Optional[str] = None
    is_available: bool = True

class MachineryCreate(MachineryBase):
    pass

class MachineryUpdate(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
    brand: Optional[str] = None
    model: Optional[str] = None
    serial_number: Optional[str] = None
    year: Optional[int] = None
    machinery_type: Optional[str] = None
    status: Optional[str] = None
    current_location: Optional[str] = None
    current_project: Optional[str] = None
    horometer: Optional[float] = None
    odometer: Optional[float] = None
    operator_name: Optional[str] = None
    operator_id: Optional[str] = None
    next_maintenance_hours: Optional[float] = None
    maintenance_interval_hours: Optional[float] = None
    last_maintenance_date: Optional[date] = None
    acquisition_cost: Optional[float] = None
    hourly_rate: Optional[float] = None
    fuel_consumption_rate: Optional[float] = None
    capacity: Optional[str] = None
    engine_power: Optional[str] = None
    weight: Optional[float] = None
    plate_number: Optional[str] = None
    is_available: Optional[bool] = None

class MachineryResponse(MachineryBase):
    id: str
    tenant_id: str
    is_active: bool
    
    class Config:
        from_attributes = True

class HorometerUpdate(BaseModel):
    horometer: float
    operator_name: Optional[str] = None

class MachineryStats(BaseModel):
    total: int
    operational: int
    in_maintenance: int
    needs_maintenance: int
    total_hours: float

class MachineryAlert(BaseModel):
    machinery_id: str
    machinery_name: str
    machinery_code: str
    current_hours: float
    next_maintenance_hours: float
    hours_until_maintenance: float
    alert_level: str