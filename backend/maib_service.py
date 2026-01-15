"""
MAIB eCommerce Payment Service
Serviciu backend pentru integrarea cu MAIB eCommerce NEW API
"""
import os
import hashlib
import hmac
import logging
from datetime import datetime, timedelta
import json
from typing import Dict, Optional, Any
from datetime import datetime
import httpx
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Configure logging
logger = logging.getLogger(__name__)

# MAIB Configuration
MAIB_CONFIG = {
    'project_id': os.getenv('MAIB_PROJECT_ID', '9B9C19AE-DC32-4128-9249-16412CCD7E6B'),
    'project_secret': os.getenv('MAIB_PROJECT_SECRET', 'efb8506c-0afb-4430-8e33-5b0336a18ccf'),
    'signature_key': os.getenv('MAIB_SIGNATURE_KEY', '4fa8f893-7f39-4f13-b5c2-34e6629b84dc'),
    'api_url': os.getenv('MAIB_API_URL', 'https://api.maibmerchants.md'),
    'api_endpoint': os.getenv('MAIB_API_ENDPOINT', '/v1/pay'),
    'test_mode': os.getenv('MAIB_TEST_MODE', 'true').lower() == 'true',
}

# Log configuration on startup (minimal)
logger.info(f"MAIB Configuration: Project ID={MAIB_CONFIG['project_id']}, API={MAIB_CONFIG['api_url']}, Test Mode={MAIB_CONFIG['test_mode']}")


class MaibPaymentService:
    """Serviciu pentru gestionarea plăților MAIB"""

    access_token: Optional[str] = None
    access_token_expires_at: Optional[datetime] = None

    @staticmethod
    async def get_access_token() -> str:
        """
        Obține și cache-uiește access token-ul MAIB.
        """
        # Refolosim token-ul dacă este încă valid
        if (
            MaibPaymentService.access_token
            and MaibPaymentService.access_token_expires_at
            and MaibPaymentService.access_token_expires_at > datetime.utcnow()
        ):
            return MaibPaymentService.access_token

        token_url = f"{MAIB_CONFIG['api_url'].rstrip('/')}/v1/generate-token"
        payload = {
            "projectId": MAIB_CONFIG["project_id"],
            "projectSecret": MAIB_CONFIG["project_secret"],
        }

        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(token_url, json=payload)
            if not resp.is_success:
                try:
                    error_data = resp.json()
                except:
                    error_data = {'raw': resp.text, 'statusCode': resp.status_code}
                logger.info("MAIB generate-token Response (Error):")
                logger.info(json.dumps(error_data, indent=2, ensure_ascii=False))
                raise Exception(f"Eroare la generarea token-ului MAIB: {resp.status_code}")

            data = resp.json()
            logger.info("MAIB generate-token Response:")
            logger.info(json.dumps(data, indent=2, ensure_ascii=False))
            
            result = data.get("result") or {}
            access_token = result.get("accessToken")
            expires_in = result.get("expiresIn") or 300

            if not access_token:
                raise Exception("Token MAIB lipsă în răspuns")

            MaibPaymentService.access_token = access_token
            # expiră puțin mai devreme (buffer 30s)
            MaibPaymentService.access_token_expires_at = datetime.utcnow() + timedelta(
                seconds=max(30, expires_in - 30)
            )

            return access_token
    
    @staticmethod
    def generate_signature(data: Dict[str, Any]) -> str:
        """
        Generează hash SHA256 pentru semnătură MAIB
        Conform documentației MAIB: SHA256(query_string + &key=signatureKey)
        
        Args:
            data: Dicționar cu datele pentru semnătură
            
        Returns:
            Hash SHA256 în format hex (lowercase)
        """
        try:
            # Sortăm cheile alfabetic (excludem signature dacă există)
            filtered_data = {k: v for k, v in data.items() if k != 'signature'}
            
            sorted_keys = sorted(filtered_data.keys())
            
            # Construim string-ul pentru semnătură
            signature_parts = []
            for key in sorted_keys:
                value = filtered_data[key]
                # Tratăm valorile null/undefined ca string gol
                if value is None:
                    value = ''
                signature_parts.append(f"{key}={value}")
            
            signature_string = '&'.join(signature_parts)
            
            # Adăugăm signature key
            full_string = f"{signature_string}&key={MAIB_CONFIG['signature_key']}"
            
            # Generăm hash SHA256
            hash_obj = hashlib.sha256(full_string.encode('utf-8'))
            hash_hex = hash_obj.hexdigest()
            
            return hash_hex
            
        except Exception as e:
            logger.error(f"❌ Error generating signature: {str(e)}", exc_info=True)
            raise Exception(f"Eroare la generarea semnăturii: {str(e)}")
    
    @staticmethod
    async def create_payment_session(request_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Creează o sesiune de plată MAIB (direct payment) folosind access token.
        
        Args:
            request_data: Datele pentru crearea sesiunii de plată
            
        Returns:
            Dicționar cu răspunsul de la MAIB (payId, formUrl, etc.)
        """
        try:
            # Pregătim datele pentru request (API nou: /v1/pay cu Access Token)
            items = request_data.get("items") or []
            mapped_items = []
            for it in items:
                try:
                    # Validăm că toate câmpurile necesare există și nu sunt goale
                    item_id = it.get("id")
                    item_name = it.get("name")
                    item_price = it.get("price")
                    item_quantity = it.get("quantity")
                    
                    # Skip items invalide (fără id, name sau price)
                    if not item_id or not item_name or item_price is None:
                        continue
                    
                    mapped_items.append(
                        {
                            "id": str(item_id),
                            "name": str(item_name),
                            "price": float(item_price),
                            "quantity": int(item_quantity or 1),
                        }
                    )
                except (ValueError, TypeError) as e:
                    logger.warning(f"Skipping invalid item: {e}")
                    continue

            amount_value = float(request_data.get("amount", 0))
            currency_value = request_data.get("currency", "MDL")
            # API MAIB test suportă de regulă MDL; dacă primim altă valută, o forțăm pe MDL
            if currency_value not in ("MDL", "MDL "):
                currency_value = "MDL"
            description_value = request_data.get("orderDescription", "")[:255]

            order_data = {
                "amount": amount_value,
                "currency": currency_value,
                "description": description_value,
                "language": request_data.get("language", "ro"),
                "orderId": request_data.get("orderId"),
                "clientName": request_data.get("customerName"),
                "email": request_data.get("customerEmail"),
                "clientIp": request_data.get("clientIp") or "127.0.0.1",
            }
            
            # Adăugăm câmpuri opționale doar dacă există și nu sunt goale
            # Conform Postman collection: callBackUrl (cu C majusculă), nu callbackUrl
            if request_data.get("customerPhone"):
                order_data["phone"] = request_data.get("customerPhone")
            
            # MAIB folosește callBackUrl (cu C majusculă) conform documentației
            callback_url = request_data.get("callbackUrl") or request_data.get("callBackUrl")
            if callback_url:
                order_data["callBackUrl"] = callback_url
            
            ok_url = request_data.get("redirectUrl") or request_data.get("successUrl") or request_data.get("okUrl")
            if ok_url:
                order_data["okUrl"] = ok_url
            
            # failUrl este obligatoriu conform MAIB API
            fail_url = request_data.get("failUrl")
            if not fail_url:
                # Dacă nu este setat, folosim același URL ca okUrl sau un URL default
                fail_url = ok_url or "http://localhost:3000/plata-esuata"
            order_data["failUrl"] = fail_url
            
            # Adăugăm items doar dacă există și nu sunt goale
            if mapped_items and len(mapped_items) > 0:
                order_data["items"] = mapped_items

            # Eliminăm orice câmp de semnătură transmis din frontend
            order_data.pop("signature", None)
            
            # Construim URL-ul (forțăm /v1/pay dacă a rămas vechiul path)
            endpoint_path = MAIB_CONFIG['api_endpoint']
            if not endpoint_path:
                endpoint_path = "/v1/pay"
            if "payment/session" in endpoint_path:
                endpoint_path = "/v1/pay"
            if not endpoint_path.startswith('/'):
                endpoint_path = f"/{endpoint_path}"
            
            api_url = MAIB_CONFIG['api_url']
            if api_url.endswith('/'):
                api_url = api_url.rstrip('/')
            
            full_url = f"{api_url}{endpoint_path}"
            
            # Obținem access token
            access_token = await MaibPaymentService.get_access_token()

            # Pregătim headers (Bearer token) și X-Project-Id (unele integrări îl cer)
            headers = {
                'Content-Type': 'application/json',
                'Authorization': f"Bearer {access_token}",
                'X-Project-Id': MAIB_CONFIG['project_id'],
            }
            
            # Facem request către MAIB API
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    full_url,
                    json=order_data,
                    headers=headers
                )
                
                if not response.is_success:
                    try:
                        error_data = response.json()
                    except:
                        error_data = {'raw': response.text, 'statusCode': response.status_code}
                    logger.info("MAIB pay Response (Error):")
                    logger.info(json.dumps(error_data, indent=2, ensure_ascii=False))
                    error_message = error_data.get('message') or error_data.get('error') or error_data.get('raw') or f"HTTP error! status: {response.status_code}"
                    raise Exception(f"MAIB API Error ({response.status_code}): {error_message}")
                
                data = response.json()
                logger.info("MAIB pay Response:")
                logger.info(json.dumps(data, indent=2, ensure_ascii=False))
                
                result_obj = data.get("result") if isinstance(data, dict) else None
                pay_id = None
                form_url = None
                if result_obj:
                    pay_id = result_obj.get("payId")
                    form_url = result_obj.get("payUrl") or result_obj.get("paymentUrl")
                else:
                    pay_id = data.get("payId") if isinstance(data, dict) else None
                    form_url = data.get("payUrl") if isinstance(data, dict) else None
                
                return {
                    'orderId': (result_obj.get('orderId') if result_obj else None) or request_data.get('orderId'),
                    'payId': pay_id,
                    'formUrl': form_url,
                    'redirectUrl': request_data.get('redirectUrl'),
                    'expiresAt': data.get('expiresAt'),
                }
                
        except httpx.TimeoutException:
            raise Exception("Timeout la comunicarea cu MAIB API")
        except httpx.RequestError as e:
            logger.error(f"MAIB API Request Error: {str(e)}", exc_info=True)
            raise Exception(f"Eroare la comunicarea cu MAIB API: {str(e)}")
        except Exception as e:
            logger.error(f"MAIB Payment Session Error: {str(e)}", exc_info=True)
            raise Exception(f"Eroare la crearea sesiunii de plată MAIB: {str(e)}")

    @staticmethod
    async def check_payment_status(pay_id: str, order_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Verifică statusul unei plăți folosind GET /v1/pay-info/{payId} cu Bearer token.
        Conform documentației MAIB: GET {{apiurl}}/v1/pay-info/{id}
        """
        try:
            # Obținem access token
            access_token = await MaibPaymentService.get_access_token()

            headers = {
                "Authorization": f"Bearer {access_token}",
                "X-Project-Id": MAIB_CONFIG["project_id"],
            }

            # Conform Postman collection: GET /v1/pay-info/{payId}
            status_url = f"{MAIB_CONFIG['api_url'].rstrip('/')}/v1/pay-info/{pay_id}"

            async with httpx.AsyncClient(timeout=30.0) as client:
                resp = await client.get(status_url, headers=headers)

                # Logăm răspunsul de la MAIB
                if resp.status_code == 404:
                    logger.info("MAIB pay-info Response (404):")
                    logger.info(json.dumps({"statusCode": 404, "message": "Not found (normal in sandbox)"}, indent=2))
                    return {
                        "ok": True,
                        "payId": pay_id,
                        "status": "unknown_sandbox",
                        "orderId": order_id,
                        "raw": {
                            "warning": "pay-info returned 404 in sandbox. Using redirect/callback as source of truth.",
                            "statusCode": resp.status_code,
                        },
                    }

                if not resp.is_success:
                    try:
                        err = resp.json()
                    except Exception:
                        err = {"raw": resp.text, "statusCode": resp.status_code}
                    logger.info("MAIB pay-info Error Response:")
                    logger.info(json.dumps(err, indent=2, ensure_ascii=False))
                    msg = err.get("message") or err.get("error") or err.get("raw") or f"HTTP error! status: {resp.status_code}"
                    raise Exception(f"MAIB Status Error ({resp.status_code}): {msg}")

                data = resp.json()
                logger.info("MAIB pay-info Response:")
                logger.info(json.dumps(data, indent=2, ensure_ascii=False))

                result_obj = data.get("result") if isinstance(data, dict) else None
                status_value = None
                order_id_value = None
                if result_obj:
                    status_value = result_obj.get("status") or result_obj.get("transactionStatus")
                    order_id_value = result_obj.get("orderId")
                else:
                    status_value = data.get("status") if isinstance(data, dict) else None
                    order_id_value = data.get("orderId") if isinstance(data, dict) else None

                return {
                    "ok": data.get("ok", True),
                    "payId": pay_id,
                    "status": status_value,
                    "orderId": order_id_value,
                    "raw": data,
                }

        except Exception as e:
            logger.error(f"Error checking MAIB payment status: {str(e)}", exc_info=True)
            raise Exception(f"Eroare la verificarea statusului plății MAIB: {str(e)}")

    @staticmethod
    async def refund_payment(pay_id: str, refund_amount: Optional[float] = None) -> Dict[str, Any]:
        """
        Efectuează refund (parțial sau complet) pentru o plată MAIB.
        Conform documentației: POST /v1/refund
        
        Args:
            pay_id: Identificatorul tranzacției de returnat
            refund_amount: Suma de returnat (opțional, dacă lipsește se face refund complet)
            
        Returns:
            Dicționar cu răspunsul de la MAIB
        """
        try:
            # Obținem access token
            access_token = await MaibPaymentService.get_access_token()

            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {access_token}",
                "X-Project-Id": MAIB_CONFIG["project_id"],
            }

            # Pregătim payload-ul
            payload = {
                "payId": pay_id,
            }
            
            # Adăugăm refundAmount doar dacă este specificat
            if refund_amount is not None:
                payload["refundAmount"] = float(refund_amount)

            refund_url = f"{MAIB_CONFIG['api_url'].rstrip('/')}/v1/refund"

            async with httpx.AsyncClient(timeout=30.0) as client:
                resp = await client.post(refund_url, json=payload, headers=headers)

                if not resp.is_success:
                    try:
                        error_data = resp.json()
                    except:
                        error_data = {"raw": resp.text, "statusCode": resp.status_code}
                    logger.info("MAIB refund Response (Error):")
                    logger.info(json.dumps(error_data, indent=2, ensure_ascii=False))
                    msg = error_data.get("message") or error_data.get("error") or error_data.get("raw") or f"HTTP error! status: {resp.status_code}"
                    raise Exception(f"MAIB Refund Error ({resp.status_code}): {msg}")

                data = resp.json()
                logger.info("MAIB refund Response:")
                logger.info(json.dumps(data, indent=2, ensure_ascii=False))

                result_obj = data.get("result") if isinstance(data, dict) else None
                
                return {
                    "ok": data.get("ok", True),
                    "payId": result_obj.get("payId") if result_obj else pay_id,
                    "orderId": result_obj.get("orderId") if result_obj else None,
                    "status": result_obj.get("status") if result_obj else None,
                    "statusCode": result_obj.get("statusCode") if result_obj else None,
                    "statusMessage": result_obj.get("statusMessage") if result_obj else None,
                    "refundAmount": result_obj.get("refundAmount") if result_obj else refund_amount,
                    "raw": data,
                }

        except Exception as e:
            logger.error(f"Error processing MAIB refund: {str(e)}", exc_info=True)
            raise Exception(f"Eroare la procesarea refund-ului MAIB: {str(e)}")
