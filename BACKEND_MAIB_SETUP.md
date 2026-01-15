# Setup Backend MAIB Integration

## Configurare Backend

### 1. Instalează Dependențele

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configurează Variabilele de Mediu

Creează `backend/.env` cu următoarele variabile:

```env
# MongoDB
MONGO_URL=your_mongo_url
DB_NAME=your_db_name

# MAIB eCommerce Configuration
MAIB_PROJECT_ID=9B9C19AE-DC32-4128-9249-16412CCD7E6B
MAIB_PROJECT_SECRET=efb8506c-0afb-4430-8e33-5b0336a18ccf
MAIB_SIGNATURE_KEY=4fa8f893-7f39-4f13-b5c2-34e6629b84dc
MAIB_API_URL=https://api.maibmerchants.md
MAIB_API_ENDPOINT=/api/v1/payment/session
MAIB_TEST_MODE=true
```

### 3. Pornește Backend-ul

```bash
cd backend
uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

## Configurare Frontend

### 1. Adaugă Backend URL în `.env`

Adaugă în `frontend/.env`:

```env
VITE_BACKEND_URL=http://localhost:8000
```

**Pentru producție:**
```env
VITE_BACKEND_URL=https://your-backend-domain.com
```

### 2. Repornește Frontend

```bash
cd frontend
npm run dev
```

## Verificare

### Backend Logs

Când faci o comandă, vei vedea în terminalul backend:

```
🔧 MAIB Configuration Loaded:
   Project ID: 9B9C19AE-DC32-4128-9249-16412CCD7E6B
   API URL: https://api.maibmerchants.md
   ...

🔵 MAIB Payment Session Request Started
   Timestamp: 2026-01-15T10:00:00.000Z
   ...

🔐 MAIB Signature Generation:
   ...

📡 MAIB API Request Details:
   ...

📤 MAIB Request Headers:
   ...

📦 MAIB Request Body:
   ...

📥 MAIB Response Received:
   Status: 200
   ...
```

### Frontend Logs

În consolă vei vedea:

```
🔵 MAIB Payment Request (via Backend):
   Backend URL: http://localhost:8000/api/payment/maib/session
   ...

📥 Backend Response Status:
   Status: 200
   ...

✅ Backend Response Success:
   ...
```

## Avantaje

✅ **Securitate:** Credențialele MAIB nu sunt expuse în frontend  
✅ **Loguri detaliate:** Toate request-urile sunt logate în terminalul backend  
✅ **Crypto nativ:** Folosim `hashlib` Python pentru SHA256 (mai rapid și sigur)  
✅ **Gestionare erori:** Erorile sunt gestionate centralizat în backend  
✅ **Scalabilitate:** Ușor de adăugat rate limiting, caching, etc.

## Troubleshooting

### Eroare: Connection refused

**Soluție:** Verifică că backend-ul rulează pe portul 8000:
```bash
curl http://localhost:8000/api/
```

### Eroare: CORS

**Soluție:** Backend-ul are deja CORS configurat pentru `*`. Dacă ai probleme, verifică `server.py`.

### Eroare: Module not found

**Soluție:** Instalează dependențele:
```bash
pip install httpx
```

## Endpoint Backend

**POST** `/api/payment/maib/session`

**Request Body:**
```json
{
  "amount": 100.00,
  "currency": "MDL",
  "orderId": "order-123",
  "orderDescription": "Comandă test",
  "customerEmail": "test@example.com",
  "customerName": "Test User",
  "callbackUrl": "http://localhost:3000/api/payment/maib/callback",
  "redirectUrl": "http://localhost:3000/comanda-confirmata",
  "customerPhone": "+37312345678",
  "language": "ro",
  "billingAddress": {
    "street": "str. Test",
    "city": "Chisinau",
    "country": "MD",
    "postalCode": "2000"
  }
}
```

**Response:**
```json
{
  "orderId": "order-123",
  "payId": "pay-id-from-maib",
  "formUrl": "https://api.maibmerchants.md/payment/form/pay-id",
  "redirectUrl": "http://localhost:3000/comanda-confirmata",
  "expiresAt": "2026-01-15T10:30:00Z"
}
```
