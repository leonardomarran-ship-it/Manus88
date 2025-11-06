from sqlalchemy.orm import Session
from app.models.customer import Customer
from app.schemas.customer import CustomerCreate, CustomerUpdate
import uuid

def create_customer(db: Session, customer: CustomerCreate, tenant_id: str):
    db_customer = Customer(
        id=f"cust-{uuid.uuid4().hex[:8]}",
        tenant_id=tenant_id,  # Asignar tenant automáticamente
        **customer.model_dump()
    )
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    return db_customer

def get_customers(db: Session, tenant_id: str, skip: int = 0, limit: int = 100):
    return db.query(Customer).filter(
        Customer.tenant_id == tenant_id  # Filtrar por tenant
    ).offset(skip).limit(limit).all()

def get_customer(db: Session, customer_id: str, tenant_id: str):
    return db.query(Customer).filter(
        Customer.id == customer_id,
        Customer.tenant_id == tenant_id  # Verificar tenant
    ).first()

def update_customer(db: Session, customer_id: str, customer_update: CustomerUpdate, tenant_id: str):
    db_customer = get_customer(db, customer_id, tenant_id)
    if db_customer:
        update_data = customer_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_customer, key, value)
        db.commit()
        db.refresh(db_customer)
    return db_customer

def delete_customer(db: Session, customer_id: str, tenant_id: str):
    db_customer = get_customer(db, customer_id, tenant_id)
    if db_customer:
        db.delete(db_customer)
        db.commit()
        return True
    return False