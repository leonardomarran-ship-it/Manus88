from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.schemas.machinery import (
    MachineryCreate, 
    MachineryUpdate, 
    MachineryResponse, 
    MachineryStats,
    MachineryAlert,
    HorometerUpdate
)
from app.services import machinery_service
from app.core.security import get_current_active_user
from app.models.user import User

router = APIRouter()

@router.post("/", response_model=MachineryResponse, status_code=201)
def create_machinery(
    machinery: MachineryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Crear nueva maquinaria (requiere autenticación)"""
    return machinery_service.create_machinery(db, machinery, current_user.tenant_id)

@router.get("/", response_model=List[MachineryResponse])
def get_machinery_list(
    skip: int = 0,
    limit: int = 100,
    machinery_type: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    needs_maintenance: Optional[bool] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Obtener lista de maquinaria del tenant (requiere autenticación)"""
    return machinery_service.get_machinery_list(
        db, 
        current_user.tenant_id,
        skip, 
        limit, 
        machinery_type, 
        status, 
        needs_maintenance
    )

@router.get("/stats", response_model=MachineryStats)
def get_machinery_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Obtener estadísticas de maquinaria del tenant (requiere autenticación)"""
    return machinery_service.get_machinery_stats(db, current_user.tenant_id)

@router.get("/alerts", response_model=List[MachineryAlert])
def get_maintenance_alerts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Obtener alertas de mantenimiento del tenant (requiere autenticación)"""
    return machinery_service.get_maintenance_alerts(db, current_user.tenant_id)

@router.get("/{machinery_id}", response_model=MachineryResponse)
def get_machinery(
    machinery_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Obtener una maquinaria específica (requiere autenticación)"""
    machinery = machinery_service.get_machinery(db, machinery_id, current_user.tenant_id)
    if not machinery:
        raise HTTPException(status_code=404, detail="Maquinaria no encontrada")
    return machinery

@router.put("/{machinery_id}", response_model=MachineryResponse)
def update_machinery(
    machinery_id: str,
    machinery_update: MachineryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Actualizar maquinaria (requiere autenticación)"""
    machinery = machinery_service.update_machinery(db, machinery_id, machinery_update, current_user.tenant_id)
    if not machinery:
        raise HTTPException(status_code=404, detail="Maquinaria no encontrada")
    return machinery

@router.patch("/{machinery_id}/horometer", response_model=MachineryResponse)
def update_horometer(
    machinery_id: str,
    horometer_update: HorometerUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Actualizar horómetro de maquinaria (requiere autenticación)"""
    machinery = machinery_service.update_horometer(db, machinery_id, horometer_update, current_user.tenant_id)
    if not machinery:
        raise HTTPException(status_code=404, detail="Maquinaria no encontrada")
    return machinery

@router.delete("/{machinery_id}")
def delete_machinery(
    machinery_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Eliminar maquinaria (soft delete) (requiere autenticación)"""
    success = machinery_service.delete_machinery(db, machinery_id, current_user.tenant_id)
    if not success:
        raise HTTPException(status_code=404, detail="Maquinaria no encontrada")
    return {"message": "Maquinaria eliminada exitosamente"}