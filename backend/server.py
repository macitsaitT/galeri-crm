from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, UploadFile, File, Query, Header
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import StreamingResponse, Response
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import jwt
import bcrypt
import secrets
import hashlib
import requests
import io
from cryptography.fernet import Fernet
import base64

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Secret
JWT_SECRET = os.environ.get('JWT_SECRET', 'aslanbasoto-secret-key-2024')
JWT_ALGORITHM = "HS256"

# Create the main app
app = FastAPI(title="Aslanbaş Oto CRM API")
api_router = APIRouter(prefix="/api")
security = HTTPBearer()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ==================== MODELS ====================

class UserCreate(BaseModel):
    email: str
    password: str
    company_name: str = "Aslanbaş Oto"
    phone: str = ""
    email_verified: bool = False

class UserLogin(BaseModel):
    email: str
    password: str

class UserProfile(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    company_name: str = "Aslanbaş Oto"
    phone: str = ""
    address: str = ""
    logo_url: str = ""
    theme: str = "dark"
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class ProfileUpdate(BaseModel):
    company_name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    logo_url: Optional[str] = None
    theme: Optional[str] = None
    password: Optional[str] = None

class CarBase(BaseModel):
    brand: str
    model: str
    year: int
    plate: str
    km: str = ""
    vehicle_type: str = "Sedan"
    purchase_price: float = 0
    sale_price: float = 0
    description: str = ""
    status: str = "Stokta"
    entry_date: str = ""
    inspection_date: str = ""
    fuel_type: str = "Dizel"
    gear: str = "Otomatik"
    ownership: str = "stock"
    owner_name: str = ""
    owner_phone: str = ""
    commission_rate: float = 0
    photos: List[str] = []
    expertise: dict = {}
    package_info: str = ""
    engine_type: str = ""
    deposit_amount: float = 0
    sold_date: Optional[str] = None
    customer_id: Optional[str] = None
    customer_name: Optional[str] = None
    employee_share: float = 0
    insurance_start: str = ""
    insurance_end: str = ""
    province: str = ""
    district: str = ""
    expertise_score: int = 95
    tramer_amount: float = 0
    expertise_notes: str = ""

class CarCreate(CarBase):
    pass

class Car(CarBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    deleted: bool = False
    deleted_at: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class CustomerBase(BaseModel):
    name: str
    phone: str = ""
    type: str = "Potansiyel"
    notes: str = ""
    interested_car_id: str = ""

class CustomerCreate(CustomerBase):
    pass

class Customer(CustomerBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    deleted: bool = False
    deleted_at: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class TransactionBase(BaseModel):
    type: str  # income or expense
    category: str
    description: str = ""
    amount: float
    date: str
    car_id: Optional[str] = None

class TransactionCreate(TransactionBase):
    pass

class Transaction(TransactionBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    deleted: bool = False
    deleted_at: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

# ==================== AUTH HELPERS ====================

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())

def create_token(user_id: str, email: str) -> str:
    payload = {
        "user_id": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc).timestamp() + 86400 * 30  # 30 days
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("user_id")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        return {"user_id": user_id, "email": payload.get("email")}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ==================== AUTH ROUTES ====================

@api_router.post("/auth/register")
async def register(user: UserCreate):
    existing = await db.users.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Generate email verification code
    verification_code = str(secrets.randbelow(900000) + 100000)  # 6-digit code
    
    user_id = str(uuid.uuid4())
    user_doc = {
        "id": user_id,
        "email": user.email,
        "password_hash": hash_password(user.password),
        "company_name": user.company_name,
        "phone": user.phone,
        "address": "",
        "logo_url": "",
        "theme": "dark",
        "email_verified": False,
        "verification_code": verification_code,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.users.insert_one(user_doc)
    
    token = create_token(user_id, user.email)
    return {
        "token": token,
        "user": {"id": user_id, "email": user.email, "company_name": user.company_name, "phone": user.phone},
        "verification_code": verification_code,
        "requires_verification": True
    }

@api_router.post("/auth/verify-email")
async def verify_email(data: dict):
    code = data.get("code", "")
    email = data.get("email", "")
    
    user = await db.users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.get("email_verified"):
        return {"verified": True, "message": "Email already verified"}
    
    if user.get("verification_code") != code:
        raise HTTPException(status_code=400, detail="Invalid verification code")
    
    await db.users.update_one(
        {"email": email},
        {"$set": {"email_verified": True}, "$unset": {"verification_code": ""}}
    )
    
    return {"verified": True, "message": "Email verified successfully"}

@api_router.post("/auth/resend-verification")
async def resend_verification(data: dict):
    email = data.get("email", "")
    
    user = await db.users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.get("email_verified"):
        return {"message": "Email already verified"}
    
    new_code = str(secrets.randbelow(900000) + 100000)
    await db.users.update_one({"email": email}, {"$set": {"verification_code": new_code}})
    
    return {"verification_code": new_code, "message": "New code generated"}

@api_router.post("/auth/login")
async def login(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not verify_password(credentials.password, user.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_token(user["id"], user["email"])
    return {
        "token": token,
        "user": {
            "id": user["id"],
            "email": user["email"],
            "company_name": user.get("company_name", ""),
            "phone": user.get("phone", ""),
            "address": user.get("address", ""),
            "theme": user.get("theme", "dark")
        }
    }

@api_router.get("/auth/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    user = await db.users.find_one({"id": current_user["user_id"]}, {"_id": 0, "password_hash": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@api_router.put("/auth/profile")
async def update_profile(profile: ProfileUpdate, current_user: dict = Depends(get_current_user)):
    update_data = {k: v for k, v in profile.model_dump().items() if v is not None}
    
    if "password" in update_data:
        update_data["password_hash"] = hash_password(update_data.pop("password"))
    
    if update_data:
        update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
        await db.users.update_one({"id": current_user["user_id"]}, {"$set": update_data})
    
    user = await db.users.find_one({"id": current_user["user_id"]}, {"_id": 0, "password_hash": 0})
    return user

@api_router.delete("/auth/delete-account")
async def delete_account(current_user: dict = Depends(get_current_user)):
    user_id = current_user["user_id"]
    
    # Delete all user data
    await db.cars.delete_many({"user_id": user_id})
    await db.customers.delete_many({"user_id": user_id})
    await db.transactions.delete_many({"user_id": user_id})
    await db.users.delete_one({"id": user_id})
    
    return {"success": True, "message": "Account and all data deleted"}

# ==================== CAR ROUTES ====================

@api_router.get("/cars", response_model=List[Car])
async def get_cars(current_user: dict = Depends(get_current_user)):
    cars = await db.cars.find({"user_id": current_user["user_id"]}, {"_id": 0}).to_list(1000)
    return cars

@api_router.post("/cars", response_model=Car)
async def create_car(car: CarCreate, current_user: dict = Depends(get_current_user)):
    car_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    
    car_doc = car.model_dump()
    car_doc.update({
        "id": car_id,
        "user_id": current_user["user_id"],
        "deleted": False,
        "deleted_at": None,
        "created_at": now,
        "updated_at": now
    })
    
    await db.cars.insert_one(car_doc)
    
    # Return without _id
    result = await db.cars.find_one({"id": car_id}, {"_id": 0})
    return result

@api_router.put("/cars/{car_id}", response_model=Car)
async def update_car(car_id: str, car: CarCreate, current_user: dict = Depends(get_current_user)):
    existing = await db.cars.find_one({"id": car_id, "user_id": current_user["user_id"]})
    if not existing:
        raise HTTPException(status_code=404, detail="Car not found")
    
    update_data = car.model_dump()
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.cars.update_one({"id": car_id}, {"$set": update_data})
    result = await db.cars.find_one({"id": car_id}, {"_id": 0})
    return result

@api_router.patch("/cars/{car_id}")
async def patch_car(car_id: str, updates: dict, current_user: dict = Depends(get_current_user)):
    existing = await db.cars.find_one({"id": car_id, "user_id": current_user["user_id"]})
    if not existing:
        raise HTTPException(status_code=404, detail="Car not found")
    
    updates["updated_at"] = datetime.now(timezone.utc).isoformat()
    await db.cars.update_one({"id": car_id}, {"$set": updates})
    result = await db.cars.find_one({"id": car_id}, {"_id": 0})
    return result

@api_router.delete("/cars/{car_id}")
async def delete_car(car_id: str, permanent: bool = False, current_user: dict = Depends(get_current_user)):
    existing = await db.cars.find_one({"id": car_id, "user_id": current_user["user_id"]})
    if not existing:
        raise HTTPException(status_code=404, detail="Car not found")
    
    if permanent:
        await db.cars.delete_one({"id": car_id})
        # Also delete related transactions
        await db.transactions.delete_many({"car_id": car_id, "user_id": current_user["user_id"]})
    else:
        await db.cars.update_one({"id": car_id}, {"$set": {
            "deleted": True,
            "deleted_at": datetime.now(timezone.utc).isoformat()
        }})
        # Soft delete related transactions
        await db.transactions.update_many(
            {"car_id": car_id, "user_id": current_user["user_id"]},
            {"$set": {"deleted": True, "deleted_at": datetime.now(timezone.utc).isoformat()}}
        )
    
    return {"success": True}

@api_router.post("/cars/{car_id}/restore")
async def restore_car(car_id: str, current_user: dict = Depends(get_current_user)):
    existing = await db.cars.find_one({"id": car_id, "user_id": current_user["user_id"]})
    if not existing:
        raise HTTPException(status_code=404, detail="Car not found")
    
    await db.cars.update_one({"id": car_id}, {"$set": {"deleted": False, "deleted_at": None}})
    # Restore related transactions
    await db.transactions.update_many(
        {"car_id": car_id, "user_id": current_user["user_id"]},
        {"$set": {"deleted": False, "deleted_at": None}}
    )
    
    result = await db.cars.find_one({"id": car_id}, {"_id": 0})
    return result

# ==================== CUSTOMER ROUTES ====================

@api_router.get("/customers", response_model=List[Customer])
async def get_customers(current_user: dict = Depends(get_current_user)):
    customers = await db.customers.find({"user_id": current_user["user_id"]}, {"_id": 0}).to_list(1000)
    return customers

@api_router.post("/customers", response_model=Customer)
async def create_customer(customer: CustomerCreate, current_user: dict = Depends(get_current_user)):
    customer_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    
    customer_doc = customer.model_dump()
    customer_doc.update({
        "id": customer_id,
        "user_id": current_user["user_id"],
        "deleted": False,
        "deleted_at": None,
        "created_at": now
    })
    
    await db.customers.insert_one(customer_doc)
    result = await db.customers.find_one({"id": customer_id}, {"_id": 0})
    return result

@api_router.put("/customers/{customer_id}", response_model=Customer)
async def update_customer(customer_id: str, customer: CustomerCreate, current_user: dict = Depends(get_current_user)):
    existing = await db.customers.find_one({"id": customer_id, "user_id": current_user["user_id"]})
    if not existing:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    update_data = customer.model_dump()
    await db.customers.update_one({"id": customer_id}, {"$set": update_data})
    result = await db.customers.find_one({"id": customer_id}, {"_id": 0})
    return result

@api_router.delete("/customers/{customer_id}")
async def delete_customer(customer_id: str, permanent: bool = False, current_user: dict = Depends(get_current_user)):
    existing = await db.customers.find_one({"id": customer_id, "user_id": current_user["user_id"]})
    if not existing:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    if permanent:
        await db.customers.delete_one({"id": customer_id})
    else:
        await db.customers.update_one({"id": customer_id}, {"$set": {
            "deleted": True,
            "deleted_at": datetime.now(timezone.utc).isoformat()
        }})
    
    return {"success": True}

@api_router.post("/customers/{customer_id}/restore")
async def restore_customer(customer_id: str, current_user: dict = Depends(get_current_user)):
    existing = await db.customers.find_one({"id": customer_id, "user_id": current_user["user_id"]})
    if not existing:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    await db.customers.update_one({"id": customer_id}, {"$set": {"deleted": False, "deleted_at": None}})
    result = await db.customers.find_one({"id": customer_id}, {"_id": 0})
    return result

# ==================== TRANSACTION ROUTES ====================

@api_router.get("/transactions", response_model=List[Transaction])
async def get_transactions(current_user: dict = Depends(get_current_user)):
    transactions = await db.transactions.find({"user_id": current_user["user_id"]}, {"_id": 0}).to_list(5000)
    return transactions

@api_router.post("/transactions", response_model=Transaction)
async def create_transaction(transaction: TransactionCreate, current_user: dict = Depends(get_current_user)):
    transaction_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    
    transaction_doc = transaction.model_dump()
    transaction_doc.update({
        "id": transaction_id,
        "user_id": current_user["user_id"],
        "deleted": False,
        "deleted_at": None,
        "created_at": now
    })
    
    await db.transactions.insert_one(transaction_doc)
    result = await db.transactions.find_one({"id": transaction_id}, {"_id": 0})
    return result

@api_router.put("/transactions/{transaction_id}")
async def update_transaction(transaction_id: str, updates: dict, current_user: dict = Depends(get_current_user)):
    existing = await db.transactions.find_one({"id": transaction_id, "user_id": current_user["user_id"]})
    if not existing:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    await db.transactions.update_one({"id": transaction_id}, {"$set": updates})
    result = await db.transactions.find_one({"id": transaction_id}, {"_id": 0})
    return result

@api_router.delete("/transactions/{transaction_id}")
async def delete_transaction(transaction_id: str, permanent: bool = False, current_user: dict = Depends(get_current_user)):
    existing = await db.transactions.find_one({"id": transaction_id, "user_id": current_user["user_id"]})
    if not existing:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    if permanent:
        await db.transactions.delete_one({"id": transaction_id})
    else:
        await db.transactions.update_one({"id": transaction_id}, {"$set": {
            "deleted": True,
            "deleted_at": datetime.now(timezone.utc).isoformat()
        }})
    
    return {"success": True}

# ==================== DASHBOARD STATS ====================

@api_router.get("/stats")
async def get_stats(current_user: dict = Depends(get_current_user)):
    user_id = current_user["user_id"]
    
    # Get all non-deleted cars
    cars = await db.cars.find({"user_id": user_id, "deleted": False}, {"_id": 0}).to_list(1000)
    
    stock_cars = [c for c in cars if c.get("status") == "Stokta"]
    consignment_cars = [c for c in cars if c.get("ownership") == "consignment" and c.get("status") != "Satıldı"]
    sold_cars = [c for c in cars if c.get("status") == "Satıldı"]
    deposit_cars = [c for c in cars if c.get("status") == "Kapora Alındı"]
    
    # Get all non-deleted transactions
    transactions = await db.transactions.find({"user_id": user_id, "deleted": False}, {"_id": 0}).to_list(5000)
    
    total_income = sum(t.get("amount", 0) for t in transactions if t.get("type") == "income")
    total_expense = sum(t.get("amount", 0) for t in transactions if t.get("type") == "expense")
    
    # Stock value
    stock_value = sum(c.get("purchase_price", 0) for c in stock_cars)
    
    # Get customers count
    customers = await db.customers.count_documents({"user_id": user_id, "deleted": False})
    
    return {
        "total_cars": len(cars),
        "stock_cars": len(stock_cars),
        "consignment_cars": len(consignment_cars),
        "sold_cars": len(sold_cars),
        "deposit_cars": len(deposit_cars),
        "total_income": total_income,
        "total_expense": total_expense,
        "net_profit": total_income - total_expense,
        "stock_value": stock_value,
        "total_customers": customers
    }

# ==================== HEALTH CHECK ====================

@api_router.get("/")
async def root():
    return {"message": "Aslanbaş Oto CRM API", "status": "running"}

@api_router.get("/health")
async def health():
    return {"status": "healthy"}

# Include router
app.include_router(api_router)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
