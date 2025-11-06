from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.api.v1.endpoints import customers, products, machinery, auth

# Crear tablas
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="MANUS88 API",
    description="ERP especializado en construcción y minería con IA",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Autenticación"])
app.include_router(customers.router, prefix="/api/v1/customers", tags=["Clientes"])
app.include_router(products.router, prefix="/api/v1/products", tags=["Productos"])
app.include_router(machinery.router, prefix="/api/v1/machinery", tags=["Maquinaria"])

@app.get("/")
def root():
    return {
        "message": "MANUS88 API - Sistema ERP para Construcción y Minería",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}