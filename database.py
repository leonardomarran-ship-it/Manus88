import os
from pathlib import Path
from urllib.parse import quote_plus
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Buscar el .env en la carpeta backend (dos niveles arriba de este archivo)
env_path = Path(__file__).parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

# Leemos la URL del .env
raw_url = os.getenv("DATABASE_URL")

if not raw_url:
    raise ValueError("DATABASE_URL no está configurada en el archivo .env")

# Separamos partes para codificar la contraseña
head, tail      = raw_url.rsplit("@", 1)
proto_user_pass = head.split("://")[1]
user, password  = proto_user_pass.split(":", 1)
password_coded  = quote_plus(password)

# Re-armamos la URL segura
DATABASE_URL = f"postgresql+psycopg2://{user}:{password_coded}@{tail}"

engine       = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base         = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()