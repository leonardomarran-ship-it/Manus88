from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.models.tenant import Tenant
from app.schemas.user import UserCreate
from app.core.security import get_password_hash, verify_password, create_access_token
import uuid

class AuthService:
    @staticmethod
    def create_user(db: Session, user_data: UserCreate) -> User:
        # Verificar si el email ya existe
        existing_user = db.query(User).filter(User.email == user_data.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El email ya está registrado"
            )
        
        # Si no se proporciona tenant_id, crear uno nuevo
        if not user_data.tenant_id:
            tenant = Tenant(
                id=f"tenant-{uuid.uuid4().hex[:8]}",
                name=f"Empresa de {user_data.full_name}",
                plan="free"
            )
            db.add(tenant)
            db.flush()
            tenant_id = tenant.id
        else:
            tenant = db.query(Tenant).filter(Tenant.id == user_data.tenant_id).first()
            if not tenant:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Tenant no encontrado"
                )
            tenant_id = user_data.tenant_id
        
        # Crear el usuario
        user = User(
            id=f"user-{uuid.uuid4().hex[:8]}",
            email=user_data.email,
            password_hash=get_password_hash(user_data.password),
            full_name=user_data.full_name,
            tenant_id=tenant_id,
            role="admin" if not user_data.tenant_id else "user"
        )
        
        db.add(user)
        db.commit()
        db.refresh(user)
        return user
    
    @staticmethod
    def authenticate_user(db: Session, email: str, password: str) -> User:
        user = db.query(User).filter(User.email == email).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email o contraseña incorrectos"
            )
        
        if not verify_password(password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email o contraseña incorrectos"
            )
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Usuario inactivo"
            )
        return user
    
    @staticmethod
    def generate_token(user: User) -> str:
        access_token = create_access_token(data={"sub": user.email})
        return access_token