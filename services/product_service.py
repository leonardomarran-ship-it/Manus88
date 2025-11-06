from sqlalchemy.orm import Session
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate
import uuid
from typing import Optional

def create_product(db: Session, product: ProductCreate, tenant_id: str):
    db_product = Product(
        id=f"prod-{uuid.uuid4().hex[:8]}",
        tenant_id=tenant_id,  # Asignar tenant automáticamente
        **product.model_dump()
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def get_products(db: Session, tenant_id: str, skip: int = 0, limit: int = 100, category: Optional[str] = None):
    query = db.query(Product).filter(Product.tenant_id == tenant_id)
    if category:
        query = query.filter(Product.category == category)
    return query.offset(skip).limit(limit).all()

def get_low_stock_products(db: Session, tenant_id: str):
    return db.query(Product).filter(
        Product.tenant_id == tenant_id,
        Product.stock_current <= Product.stock_min
    ).all()

def get_product(db: Session, product_id: str, tenant_id: str):
    return db.query(Product).filter(
        Product.id == product_id,
        Product.tenant_id == tenant_id
    ).first()

def update_product(db: Session, product_id: str, product_update: ProductUpdate, tenant_id: str):
    db_product = get_product(db, product_id, tenant_id)
    if db_product:
        update_data = product_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_product, key, value)
        db.commit()
        db.refresh(db_product)
    return db_product

def delete_product(db: Session, product_id: str, tenant_id: str):
    db_product = get_product(db, product_id, tenant_id)
    if db_product:
        db.delete(db_product)
        db.commit()
        return True
    return False