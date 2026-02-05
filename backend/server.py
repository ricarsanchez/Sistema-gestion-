from fastapi import FastAPI, APIRouter, HTTPException, status, Depends, Header
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from pathlib import Path
import os
import logging
from typing import Optional, List
from datetime import datetime

# Import local modules
from models import (
    User, UserCreate, UserUpdate, UserResponse, UserInDB, UserRole,
    LoginRequest, TokenResponse
)
from auth import hash_password, verify_password, create_access_token, decode_access_token
from permissions import Permission, get_permissions_list, require_permission
from middleware import get_current_user_from_token, get_token_from_header
from database import (
    db, users_collection, serialize_doc, serialize_docs,
    create_indexes, log_audit
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create the main app
app = FastAPI(title="Sistema Gestión Ferretería")

# Create API router with /api prefix
api_router = APIRouter(prefix="/api")

# Security
security = HTTPBearer()

# Dependency to get current user from token
async def get_current_user(authorization: Optional[str] = Header(None)) -> dict:
    """Get current authenticated user from token"""
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No se proporcionó token de autenticación"
        )
    
    token = get_token_from_header(authorization)
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido"
        )
    
    user_data = await get_current_user_from_token(token)
    
    # Get full user from database
    user = await users_collection.find_one({"id": user_data["sub"]}, {"_id": 0})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario no encontrado"
        )
    
    if not user.get("estado", False):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario inactivo"
        )
    
    return user

# ===== AUTH ROUTES =====

@api_router.post("/auth/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(user_data: UserCreate):
    """Register a new user"""
    # Check if email already exists
    existing_user = await users_collection.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El email ya está registrado"
        )
    
    # Create new user
    password_hash = hash_password(user_data.password)
    
    user = UserInDB(
        **user_data.model_dump(exclude={"password"}),
        password_hash=password_hash
    )
    
    # Convert to dict and serialize datetime
    user_dict = user.model_dump()
    user_dict['created_at'] = user_dict['created_at'].isoformat()
    user_dict['updated_at'] = user_dict['updated_at'].isoformat()
    if user_dict.get('last_login'):
        user_dict['last_login'] = user_dict['last_login'].isoformat()
    
    # Insert into database
    await users_collection.insert_one(user_dict)
    
    # Return user without password
    return UserResponse(**user.model_dump(exclude={"password_hash"}))

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(credentials: LoginRequest):
    """Login user and return JWT token"""
    # Find user by email
    user = await users_collection.find_one({"email": credentials.email}, {"_id": 0})
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos"
        )
    
    # Verify password
    if not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos"
        )
    
    # Check if user is active
    if not user.get("estado", False):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario inactivo"
        )
    
    # Update last login
    await users_collection.update_one(
        {"id": user["id"]},
        {"$set": {"last_login": datetime.utcnow().isoformat()}}
    )
    
    # Create access token
    access_token = create_access_token(data={
        "sub": user["id"],
        "email": user["email"],
        "rol": user["rol"]
    })
    
    # Log audit
    await log_audit(
        usuario_id=user["id"],
        usuario_nombre=user["nombre"],
        accion="login",
        modulo="auth",
        detalles=f"Login exitoso desde {credentials.email}"
    )
    
    # Return token and user data
    user_response = UserResponse(**{k: v for k, v in user.items() if k != "password_hash"})
    
    return TokenResponse(
        access_token=access_token,
        user=user_response
    )

@api_router.get("/auth/me", response_model=UserResponse)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """Get current user information"""
    return UserResponse(**{k: v for k, v in current_user.items() if k != "password_hash"})

@api_router.get("/auth/permissions")
async def get_user_permissions(current_user: dict = Depends(get_current_user)):
    """Get current user permissions"""
    user_role = UserRole(current_user["rol"])
    permissions = get_permissions_list(user_role)
    
    return {
        "rol": current_user["rol"],
        "permissions": permissions
    }

# ===== USER ROUTES =====

@api_router.get("/users", response_model=List[UserResponse])
async def list_users(current_user: dict = Depends(get_current_user)):
    """List all users (Admin only)"""
    require_permission(UserRole(current_user["rol"]), Permission.USUARIOS_VER)
    
    users = await users_collection.find({}, {"_id": 0, "password_hash": 0}).to_list(1000)
    return users

@api_router.get("/users/{user_id}", response_model=UserResponse)
async def get_user(user_id: str, current_user: dict = Depends(get_current_user)):
    """Get user by ID"""
    require_permission(UserRole(current_user["rol"]), Permission.USUARIOS_VER)
    
    user = await users_collection.find_one({"id": user_id}, {"_id": 0, "password_hash": 0})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    
    return UserResponse(**user)

@api_router.put("/users/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: str,
    user_update: UserUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update user"""
    require_permission(UserRole(current_user["rol"]), Permission.USUARIOS_EDITAR)
    
    # Check if user exists
    existing_user = await users_collection.find_one({"id": user_id})
    if not existing_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    
    # Prepare update data
    update_data = user_update.model_dump(exclude_unset=True)
    
    # Hash password if provided
    if "password" in update_data and update_data["password"]:
        update_data["password_hash"] = hash_password(update_data.pop("password"))
    
    update_data["updated_at"] = datetime.utcnow().isoformat()
    
    # Update user
    await users_collection.update_one(
        {"id": user_id},
        {"$set": update_data}
    )
    
    # Log audit
    await log_audit(
        usuario_id=current_user["id"],
        usuario_nombre=current_user["nombre"],
        accion="actualizar",
        modulo="usuarios",
        detalles=f"Usuario actualizado: {user_id}"
    )
    
    # Get updated user
    updated_user = await users_collection.find_one({"id": user_id}, {"_id": 0, "password_hash": 0})
    return UserResponse(**updated_user)

@api_router.delete("/users/{user_id}")
async def delete_user(user_id: str, current_user: dict = Depends(get_current_user)):
    """Delete (deactivate) user"""
    require_permission(UserRole(current_user["rol"]), Permission.USUARIOS_ELIMINAR)
    
    # Cannot delete yourself
    if user_id == current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No puedes eliminar tu propio usuario"
        )
    
    # Check if user exists
    user = await users_collection.find_one({"id": user_id})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    
    # Deactivate user instead of deleting
    await users_collection.update_one(
        {"id": user_id},
        {"$set": {"estado": False, "updated_at": datetime.utcnow().isoformat()}}
    )
    
    # Log audit
    await log_audit(
        usuario_id=current_user["id"],
        usuario_nombre=current_user["nombre"],
        accion="eliminar",
        modulo="usuarios",
        detalles=f"Usuario desactivado: {user_id}"
    )
    
    return {"message": "Usuario desactivado exitosamente"}

# ===== HEALTH CHECK =====

@api_router.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "API Sistema Gestión Ferretería",
        "status": "online",
        "version": "1.0.0"
    }

# Include router in app
app.include_router(api_router)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Startup event
@app.on_event("startup")
async def startup_event():
    """Initialize database indexes on startup"""
    logger.info("Creando índices de base de datos...")
    await create_indexes()
    logger.info("Índices creados exitosamente")
    
    # Create default admin user if no users exist
    users_count = await users_collection.count_documents({})
    if users_count == 0:
        logger.info("Creando usuario administrador por defecto...")
        admin_user = UserInDB(
            email="admin@ferreteria.com",
            nombre="Administrador",
            rol=UserRole.ADMIN,
            password_hash=hash_password("admin123"),
            estado=True
        )
        
        admin_dict = admin_user.model_dump()
        admin_dict['created_at'] = admin_dict['created_at'].isoformat()
        admin_dict['updated_at'] = admin_dict['updated_at'].isoformat()
        if admin_dict.get('last_login'):
            admin_dict['last_login'] = admin_dict['last_login'].isoformat()
        
        await users_collection.insert_one(admin_dict)
        logger.info("Usuario administrador creado: admin@ferreteria.com / admin123")

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    """Close database connection on shutdown"""
    from database import client
    client.close()
    logger.info("Conexión a base de datos cerrada")
