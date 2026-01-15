# Troubleshooting MAIB API - Eroare 404

## Problema: HTTP 404 la crearea sesiunii de plată

Eroarea `404` la endpoint-ul `/api/v1/payment/session` poate apărea din următoarele motive:

### 1. URL API Incorect

Verifică că URL-ul API este corect în `.env`:
```env
VITE_MAIB_API_URL=https://api.maibmerchants.md
```

**Important:** 
- URL-ul trebuie să înceapă cu `https://`
- Nu trebuie să se termine cu `/`
- Pentru test, folosește exact URL-ul furnizat de MAIB

### 2. Endpoint-ul Poate Fi Diferit pentru Test

Conform documentației MAIB, endpoint-urile pot fi:
- **Test:** `https://api.maibmerchants.md/api/v1/payment/session`
- **Producție:** Va fi furnizat de MAIB după activarea proiectului

### 3. Verificare Configurare

Verifică în consola browser-ului:
1. Deschide DevTools (F12)
2. Tab Network
3. Caută request-ul către MAIB API
4. Verifică:
   - URL-ul complet
   - Headers (Authorization, X-Project-Id)
   - Body-ul request-ului

### 4. Soluții

#### Soluția 1: Verifică URL-ul în cod
În consolă, vei vedea:
```
MAIB API Endpoint: [URL-ul folosit]
MAIB Request Data: [datele trimise]
```

Verifică că URL-ul este corect.

#### Soluția 2: Contactează MAIB
Dacă URL-ul pare corect dar primești 404:
1. Verifică că ai acces la API-ul de test
2. Contactează suportul MAIB la [email protected]
3. Confirmă că:
   - Project ID este corect
   - Project Secret este corect
   - API URL pentru test este corect

#### Soluția 3: Verifică Credențialele
Asigură-te că folosești credențialele corecte pentru mediu de test:
- Project ID: `9B9C19AE-DC32-4128-9249-16412CCD7E6B`
- Project Secret: `efb8506c-0afb-4430-8e33-5b0336a18ccf`
- Signature Key: `4fa8f893-7f39-4f13-b5c2-34e6629b84dc`

### 5. Debugging

Am adăugat logging în cod pentru a vedea exact ce se trimite:
- Verifică consola pentru `MAIB API Endpoint`
- Verifică `MAIB Request Data` (fără signature pentru securitate)
- Verifică răspunsul de eroare complet

### 6. Verificare Manuală

Poți testa endpoint-ul manual cu curl:
```bash
curl -X POST https://api.maibmerchants.md/api/v1/payment/session \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer efb8506c-0afb-4430-8e33-5b0336a18ccf" \
  -H "X-Project-Id: 9B9C19AE-DC32-4128-9249-16412CCD7E6B" \
  -d '{"projectId":"9B9C19AE-DC32-4128-9249-16412CCD7E6B","amount":"100.00","currency":"MDL","orderId":"test123","orderDescription":"Test","customerEmail":"test@test.com","customerName":"Test Test","callbackUrl":"https://example.com/callback","redirectUrl":"https://example.com/redirect","signature":"..."}'
```

### 7. Contact MAIB

Dacă problema persistă:
- Email: [email protected]
- Menționează:
  - Project ID
  - Eroarea exactă (404)
  - URL-ul folosit
  - Că folosești API-ul de test
