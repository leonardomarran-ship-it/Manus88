from fastapi import APIRouter
from app.api.v1.endpoints import customers, products, machinery

api_router = APIRouter()

api_router.include_router(customers.router, prefix="/customers", tags=["customers"])
api_router.include_router(products.router, prefix="/products", tags=["products"])
api_router.include_router(machinery.router, prefix="/machinery", tags=["machinery"])