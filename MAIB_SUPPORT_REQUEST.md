# Request Suport MAIB - Eroare 404

## Date de Contact
**Email:** [email protected]  
**Data:** 2026-01-15  
**Proiect:** Address Beauty Hub - Integrare MAIB eCommerce

---

## Problema
Endpoint-ul API returnează **404 Not Found** pentru toate endpoint-urile testate.

## Credențiale de Test Furnizate
- **Project ID:** `9B9C19AE-DC32-4128-9249-16412CCD7E6B`
- **Project Secret:** `efb8506c-0afb-4430-8e33-5b0336a18ccf`
- **Signature Key:** `4fa8f893-7f39-4f13-b5c2-34e6629b84dc`

## Endpoint-uri Testate (toate returnează 404)

### 1. Endpoint Standard
- **URL:** `https://api.maibmerchants.md/api/v1/payment/session`
- **Status:** 404 Not Found
- **Răspuns:** Empty response body

### 2. Endpoint fără /api
- **URL:** `https://api.maibmerchants.md/v1/payment/session`
- **Status:** 404 Not Found
- **Răspuns:** Empty response body

## Detalii Tehnice Request

### Headers Trimise
```
Content-Type: application/json
Authorization: Bearer efb8506c-0afb-4430-8e33-5b0336a18ccf
X-Project-Id: 9B9C19AE-DC32-4128-9249-16412CCD7E6B
```

### Body Request (exemplu)
```json
{
  "projectId": "9B9C19AE-DC32-4128-9249-16412CCD7E6B",
  "amount": "4.00",
  "currency": "RON",
  "orderId": "temp-1768470823881-r7u1ga0lj",
  "orderDescription": "Comandă - 1 produs(e)",
  "customerEmail": "mariamancro@gmail.com",
  "customerName": "nicoleta nicck",
  "callbackUrl": "http://192.168.88.44:3000/api/payment/maib/callback",
  "redirectUrl": "http://192.168.88.44:3000/comanda-confirmata",
  "customerPhone": "+37365476321",
  "language": "ro",
  "billingStreet": "str. Stefan cel Mare",
  "billingCity": "Chisinau",
  "billingCountry": "MD",
  "billingPostalCode": "2032",
  "signature": "8139bb1d435bd444d5e311e5d14e8f4a24aa3e6b88f531a7627c53f3d389f824"
}
```

### Semnătură SHA256
- **Algoritm:** SHA256
- **Format:** Conform documentației MAIB: `SHA256(query_string + &key=signatureKey)`
- **Lungime:** 64 caractere (hex)
- **Verificare:** Semnătura este generată corect conform algoritmului specificat

## Verificări Efectuate

### ✅ Configurație
- Project ID este corect
- Project Secret este corect
- Signature Key este corect
- Toate credențialele sunt încărcate din variabile de mediu

### ✅ Request
- Headers sunt corecte
- Body-ul conține toate câmpurile necesare
- Semnătura este generată corect (SHA256)
- URL-ul este construit corect

### ✅ Implementare
- Codul respectă documentația MAIB eCommerce NEW API
- Semnătura este generată conform specificațiilor
- Request-ul este formatat corect

## Întrebări pentru Suport MAIB

1. **Care este URL-ul exact pentru API-ul de test?**
   - Este `https://api.maibmerchants.md` corect?
   - Există un subdomain diferit pentru test (ex: `test-api.maibmerchants.md`)?

2. **Care este endpoint-ul corect pentru crearea sesiunii de plată?**
   - Este `/api/v1/payment/session` corect?
   - Sau este `/v1/payment/session`?
   - Sau alt endpoint?

3. **Este proiectul de test activat în platforma maibmerchants.md?**
   - Project ID: `9B9C19AE-DC32-4128-9249-16412CCD7E6B`
   - Credențialele sunt active și au acces la API?

4. **Există configurații suplimentare necesare?**
   - Trebuie configurate URL-uri de callback în platformă?
   - Există restricții IP sau alte setări de securitate?

5. **Documentație API:**
   - Unde pot găsi documentația completă pentru API-ul de test?
   - Există diferențe între API-ul de test și cel de producție?

## Loguri Complete

### Request Details
```
Timestamp: 2026-01-15T09:53:43.893Z
Method: POST
URL: https://api.maibmerchants.md/v1/payment/session
Duration: 286ms
Status: 404 Not Found
Status Text: (empty)
Response Headers: (available in full logs)
Response Body: (empty)
```

### Error Response
```json
{
  "timestamp": "2026-01-15T09:53:44.183Z",
  "status": 404,
  "statusText": "",
  "url": "https://api.maibmerchants.md/v1/payment/session",
  "duration": "286ms",
  "error": {
    "raw": ""
  }
}
```

## Pași Următori

1. **Așteptăm confirmarea de la MAIB:**
   - URL-ul exact pentru test
   - Endpoint-ul corect
   - Statusul proiectului

2. **După confirmare:**
   - Vom actualiza configurația
   - Vom testa din nou
   - Vom confirma funcționarea

## Contact

**Email:** [email protected]  
**Proiect:** Address Beauty Hub  
**Integrare:** MAIB eCommerce NEW API

---

**Notă:** Implementarea este completă și respectă documentația MAIB. Problema este la nivelul configurației API-ului sau al activării proiectului în platforma MAIB.
