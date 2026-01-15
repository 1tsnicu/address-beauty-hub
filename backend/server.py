from fastapi import FastAPI, APIRouter, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any, Union
import uuid
from datetime import datetime
from maib_service import MaibPaymentService


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Configure logging FIRST (before using logger)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# MAIB Payment Models
class BillingAddress(BaseModel):
    street: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    postalCode: Optional[str] = None

class Item(BaseModel):
    id: Union[str, int]
    name: str
    price: float
    quantity: int


class MaibPaymentSessionRequest(BaseModel):
    amount: float
    currency: str = "MDL"
    orderId: str
    orderDescription: str
    customerEmail: str
    customerName: str
    callbackUrl: str
    redirectUrl: str
    customerPhone: Optional[str] = None
    language: Optional[str] = "ro"
    billingAddress: Optional[BillingAddress] = None
    items: Optional[List[Item]] = None
    clientIp: Optional[str] = None

class MaibPaymentSessionResponse(BaseModel):
    orderId: str
    payId: str
    formUrl: str
    redirectUrl: str
    expiresAt: Optional[str] = None


class MaibPaymentStatusRequest(BaseModel):
    payId: str
    orderId: Optional[str] = None


class MaibPaymentStatusResponse(BaseModel):
    ok: bool
    payId: str
    status: Optional[str] = None
    orderId: Optional[str] = None
    raw: Optional[Dict[str, Any]] = None

class MaibCallbackRequest(BaseModel):
    """Model pentru callback-ul MAIB - toate câmpurile sunt opționale pentru flexibilitate"""
    payId: Optional[str] = None
    orderId: Optional[str] = None
    status: Optional[str] = None
    transactionId: Optional[str] = None
    errorCode: Optional[str] = None
    errorMessage: Optional[str] = None
    amount: Optional[float] = None
    currency: Optional[str] = None
    signature: Optional[str] = None


class MaibRefundRequest(BaseModel):
    payId: str
    refundAmount: Optional[float] = None


class MaibRefundResponse(BaseModel):
    ok: bool
    payId: str
    orderId: Optional[str] = None
    status: Optional[str] = None
    statusCode: Optional[str] = None
    statusMessage: Optional[str] = None
    refundAmount: Optional[float] = None
    raw: Optional[Dict[str, Any]] = None

# MAIB Payment Routes
@api_router.post("/payment/maib/session", response_model=MaibPaymentSessionResponse)
async def create_maib_payment_session(request: MaibPaymentSessionRequest, http_request: Request):
    """
    Creează o sesiune de plată MAIB
    """
    try:
        request_data = request.dict()
        # completează clientIp dacă nu a fost trimis
        if not request_data.get("clientIp"):
            # încearcă să extragi din x-forwarded-for sau din client.host
            forwarded = http_request.headers.get("x-forwarded-for")
            client_ip = (forwarded.split(",")[0].strip() if forwarded else http_request.client.host) if http_request.client else "127.0.0.1"
            request_data["clientIp"] = client_ip
        result = await MaibPaymentService.create_payment_session(request_data)
        return MaibPaymentSessionResponse(**result)
    except Exception as e:
        logger.error(f"Error creating MAIB payment session: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@api_router.post("/payment/maib/status", response_model=MaibPaymentStatusResponse)
async def get_maib_payment_status(request: MaibPaymentStatusRequest):
    """
    Verifică statusul unei plăți MAIB prin payId (folosește /v1/pay-info)
    """
    try:
        result = await MaibPaymentService.check_payment_status(request.payId, request.orderId)
        return MaibPaymentStatusResponse(**result)
    except Exception as e:
        logger.error(f"Error checking MAIB payment status: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@api_router.post("/payment/maib/refund", response_model=MaibRefundResponse)
async def refund_maib_payment(request: MaibRefundRequest):
    """
    Efectuează refund (parțial sau complet) pentru o plată MAIB
    """
    try:
        result = await MaibPaymentService.refund_payment(request.payId, request.refundAmount)
        return MaibRefundResponse(**result)
    except Exception as e:
        logger.error(f"Error processing MAIB refund: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@api_router.post("/payment/maib/callback")
async def maib_callback(request: Request):
    """
    Endpoint pentru callback-ul server-to-server de la MAIB
    MAIB trimite datele ca query parameters sau în body (JSON/form)
    """
    import json
    
    try:
        # Încercăm să extragem datele din query parameters (MAIB trimite de obicei așa)
        callback_data = dict(request.query_params)
        
        # Dacă nu avem date în query, încercăm din body
        if not callback_data:
            try:
                body_data = await request.json()
                callback_data = body_data if isinstance(body_data, dict) else {}
            except:
                # Dacă nu e JSON, încercăm form data
                try:
                    form_data = await request.form()
                    callback_data = dict(form_data)
                except:
                    pass
        
        # Logăm răspunsul de la MAIB
        logger.info("MAIB Callback Received:")
        logger.info(json.dumps(callback_data, indent=2, ensure_ascii=False))
        
        # Validăm că avem cel puțin payId și orderId
        pay_id = callback_data.get('payId') or callback_data.get('pay_id')
        order_id = callback_data.get('orderId') or callback_data.get('order_id')
        status = callback_data.get('status') or callback_data.get('Status')
        
        if not pay_id or not order_id:
            return JSONResponse(
                status_code=400,
                content={"error": "Missing required fields: payId or orderId"}
            )
        
        # Determinăm dacă plata a reușit
        is_success = status and status.upper() in ['SUCCESS', 'OK', 'APPROVED']
        is_failed = status and status.upper() in ['FAILED', 'FAIL', 'CANCELLED', 'CANCEL', 'DECLINED']
        
        # Returnăm 200 OK pentru a confirma că am primit callback-ul
        return JSONResponse(
            status_code=200,
            content={
                "ok": True,
                "message": "Callback received",
                "payId": pay_id,
                "orderId": order_id,
                "status": status,
                "isSuccess": is_success,
                "isFailed": is_failed
            }
        )
        
    except Exception as e:
        logger.error(f"Error processing MAIB callback: {str(e)}", exc_info=True)
        # Returnăm totuși 200 pentru a nu face MAIB să retrimită callback-ul
        return JSONResponse(
            status_code=200,
            content={"ok": False, "error": str(e)}
        )

# Include the router in the main app
app.include_router(api_router)

# Validation error handler to log 422 bodies
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    body = await request.body()
    logger.error("Validation error on %s %s", request.method, request.url.path)
    logger.error("Request body: %s", body.decode("utf-8") if body else "<empty>")
    logger.error("Errors: %s", exc.errors())
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors()},
    )

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
