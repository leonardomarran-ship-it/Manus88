from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.user import UserCreate, UserLogin, UserResponse, Token
from app.services.auth_service import AuthService
from app.core.security import get_current_active_user
from app.models.user import User

router = APIRouter()

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Registrar un nuevo usuario y crear su tenant si no existe
    """
    try:
        # Crear usuario
        user = AuthService.create_user(db, user_data)
        
        # Generar token
        access_token = AuthService.generate_token(user)
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": user
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al registrar usuario: {str(e)}"
        )

@router.post("/login", response_model=Token)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """
    Iniciar sesión y obtener token de acceso
    """
    try:
        # Autenticar usuario
        user = AuthService.authenticate_user(db, credentials.email, credentials.password)
        
        # Generar token
        access_token = AuthService.generate_token(user)
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": user
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al iniciar sesión: {str(e)}"
        )

@router.get("/me", response_model=UserResponse)
def get_current_user_info(current_user: User = Depends(get_current_active_user)):
    """
    Obtener información del usuario actual
    """
    return current_user

@router.post("/logout")
def logout():
    """
    Cerrar sesión (el token se elimina en el frontend)
    """
    return {"message": "Sesión cerrada exitosamente"}