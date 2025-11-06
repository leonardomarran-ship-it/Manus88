from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.machinery import Machinery, MachineryStatus, MachineryType
from app.schemas.machinery import (
    MachineryCreate, 
    MachineryUpdate, 
    MachineryStats,
    MachineryAlert,
    HorometerUpdate
)
import uuid
from typing import Optional, List
from datetime import datetime

def create_machinery(db: Session, machinery: MachineryCreate, tenant_id: str):
    db_machinery = Machinery(
        id=f"mach-{uuid.uuid4().hex[:8]}",
        tenant_id=tenant_id,  # Asignar tenant automáticamente
        **machinery.model_dump()
    )
    db.add(db_machinery)
    db.commit()
    db.refresh(db_machinery)
    return db_machinery

def get_machinery_list(
    db: Session, 
    tenant_id: str,
    skip: int = 0, 
    limit: int = 100,
    machinery_type: Optional[str] = None,
    status: Optional[str] = None,
    needs_maintenance: Optional[bool] = None
):
    query = db.query(Machinery).filter(
        Machinery.tenant_id == tenant_id,
        Machinery.is_active == True
    )
    
    if machinery_type:
        query = query.filter(Machinery.machinery_type == machinery_type)
    if status:
        query = query.filter(Machinery.status == status)
    if needs_maintenance is not None:
        if needs_maintenance:
            query = query.filter(
                Machinery.next_maintenance_hours != None,
                Machinery.horometer >= Machinery.next_maintenance_hours
            )
        else:
            query = query.filter(
                (Machinery.next_maintenance_hours == None) |
                (Machinery.horometer < Machinery.next_maintenance_hours)
            )
    
    return query.offset(skip).limit(limit).all()

def get_machinery_stats(db: Session, tenant_id: str) -> MachineryStats:
    total = db.query(Machinery).filter(
        Machinery.tenant_id == tenant_id,
        Machinery.is_active == True
    ).count()
    
    operational = db.query(Machinery).filter(
        Machinery.tenant_id == tenant_id,
        Machinery.is_active == True,
        Machinery.status == MachineryStatus.OPERATIVO
    ).count()
    
    in_maintenance = db.query(Machinery).filter(
        Machinery.tenant_id == tenant_id,
        Machinery.is_active == True,
        Machinery.status == MachineryStatus.EN_MANTENIMIENTO
    ).count()
    
    needs_maintenance = db.query(Machinery).filter(
        Machinery.tenant_id == tenant_id,
        Machinery.is_active == True,
        Machinery.next_maintenance_hours != None,
        Machinery.horometer >= Machinery.next_maintenance_hours
    ).count()
    
    total_hours = db.query(func.sum(Machinery.horometer)).filter(
        Machinery.tenant_id == tenant_id,
        Machinery.is_active == True
    ).scalar() or 0.0
    
    return MachineryStats(
        total=total,
        operational=operational,
        in_maintenance=in_maintenance,
        needs_maintenance=needs_maintenance,
        total_hours=total_hours
    )

def get_maintenance_alerts(db: Session, tenant_id: str) -> List[MachineryAlert]:
    machinery_list = db.query(Machinery).filter(
        Machinery.tenant_id == tenant_id,
        Machinery.is_active == True,
        Machinery.next_maintenance_hours != None,
        Machinery.horometer >= Machinery.next_maintenance_hours
    ).all()
    
    alerts = []
    for machinery in machinery_list:
        hours_overdue = machinery.horometer - machinery.next_maintenance_hours
        alerts.append(MachineryAlert(
            machinery_id=machinery.id,
            machinery_name=machinery.name,
            machinery_code=machinery.code,
            current_hours=machinery.horometer,
            next_maintenance_hours=machinery.next_maintenance_hours,
            hours_until_maintenance=-hours_overdue,
            alert_level="critical" if hours_overdue > 50 else "warning"
        ))
    
    return alerts

def get_machinery(db: Session, machinery_id: str, tenant_id: str):
    return db.query(Machinery).filter(
        Machinery.id == machinery_id,
        Machinery.tenant_id == tenant_id,
        Machinery.is_active == True
    ).first()

def update_machinery(db: Session, machinery_id: str, machinery_update: MachineryUpdate, tenant_id: str):
    db_machinery = get_machinery(db, machinery_id, tenant_id)
    if db_machinery:
        update_data = machinery_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_machinery, key, value)
        db.commit()
        db.refresh(db_machinery)
    return db_machinery

def update_horometer(db: Session, machinery_id: str, horometer_update: HorometerUpdate, tenant_id: str):
    db_machinery = get_machinery(db, machinery_id, tenant_id)
    if db_machinery:
        db_machinery.horometer = horometer_update.horometer
        if horometer_update.operator_name:
            db_machinery.operator_name = horometer_update.operator_name
        db.commit()
        db.refresh(db_machinery)
    return db_machinery

def delete_machinery(db: Session, machinery_id: str, tenant_id: str):
    db_machinery = get_machinery(db, machinery_id, tenant_id)
    if db_machinery:
        db_machinery.is_active = False
        db.commit()
        return True
    return False