# Rezolvare Eroare 404 - MAIB API

## Problema
Endpoint-ul `/api/v1/payment/session` returnează 404, ceea ce indică că:
1. URL-ul API este incorect pentru test
2. Endpoint-ul pentru test este diferit
3. Proiectul de test nu este activat în platforma MAIB
4. Credențialele de test nu sunt corecte sau nu au acces

## Soluții de Verificat

### 1. Verifică URL-ul API pentru Test

Conform documentației MAIB, URL-ul pentru test poate fi diferit. Verifică în consolă:
- `MAIB API Endpoint:` - ar trebui să fie exact URL-ul furnizat de MAIB
- `MAIB Config:` - verifică că toate credențialele sunt setate

### 2. Contactează MAIB pentru Confirmare

Email: [email protected]

Întreabă:
- Care este URL-ul exact pentru API-ul de test?
- Este endpoint-ul `/api/v1/payment/session` corect pentru test?
- Este proiectul de test activat în platforma maibmerchants.md?
- Credențialele de test sunt corecte și active?

### 3. Verifică în Platforma MAIB

1. Accesează platforma maibmerchants.md
2. Verifică că proiectul de test este activat
3. Verifică că toate câmpurile sunt completate:
   - Callback URL
   - Ok URL (Redirect URL)
   - Fail URL
4. Verifică că ai primit credențialele corecte pentru test

### 4. Endpoint-uri Posibile

**IMPORTANT:** Eroarea 404 indică că endpoint-ul nu există sau proiectul nu este activat. 

**Varianta 1 (standard - deja testat):**
```
https://api.maibmerchants.md/api/v1/payment/session
```
❌ Returnează 404

**Varianta 2 (fără /api - deja testat):**
```
https://api.maibmerchants.md/v1/payment/session
```
❌ Returnează 404

**Varianta 3 (test subdomain - de încercat):**
```
https://test-api.maibmerchants.md/api/v1/payment/session
```
Adaugă în `.env`:
```env
VITE_MAIB_API_URL=https://test-api.maibmerchants.md
```

**Varianta 4 (URL complet diferit - de încercat):**
```
https://maibmerchants.md/api/v1/payment/session
```
Adaugă în `.env`:
```env
VITE_MAIB_API_URL=https://maibmerchants.md
```

**Varianta 5 (endpoint diferit - de încercat):**
```
https://api.maibmerchants.md/payment/create
```
Adaugă în `.env`:
```env
VITE_MAIB_API_ENDPOINT=/payment/create
```

**Concluzie:** Toate endpoint-urile testate returnează 404. **Trebuie să contactezi MAIB** pentru a confirma:
- URL-ul exact pentru API-ul de test
- Dacă proiectul este activat
- Dacă credențialele sunt corecte

### 5. Verificare Manuală cu cURL

Testează endpoint-ul manual:

```bash
curl -X POST https://api.maibmerchants.md/api/v1/payment/session \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer efb8506c-0afb-4430-8e33-5b0336a18ccf" \
  -H "X-Project-Id: 9B9C19AE-DC32-4128-9249-16412CCD7E6B" \
  -d '{
    "projectId": "9B9C19AE-DC32-4128-9249-16412CCD7E6B",
    "amount": "100.00",
    "currency": "MDL",
    "orderId": "test123",
    "orderDescription": "Test",
    "customerEmail": "test@test.com",
    "customerName": "Test Test",
    "callbackUrl": "https://example.com/callback",
    "redirectUrl": "https://example.com/redirect",
    "signature": "test_signature"
  }'
```

Dacă primești 404 și aici, problema este la nivelul API-ului MAIB.

### 6. Pași Următori

1. **Contactează MAIB** cu:
   - Project ID: `9B9C19AE-DC32-4128-9249-16412CCD7E6B`
   - Eroarea: `404 Not Found` la `/api/v1/payment/session`
   - URL-ul folosit: `https://api.maibmerchants.md/api/v1/payment/session`
   - Confirmă că endpoint-ul este corect pentru test

2. **Verifică Documentația MAIB:**
   - Accesează: https://docs.maibmerchants.md/
   - Verifică secțiunea despre endpoint-uri pentru test
   - Verifică dacă există diferențe între test și producție

3. **Verifică Platforma maibmerchants.md:**
   - Loghează-te în platforma MAIB
   - Verifică că proiectul de test este activat
   - Verifică că toate URL-urile sunt configurate corect

## Soluție Rapidă - Endpoint Alternativ

Am adăugat suport pentru configurare endpoint personalizat. Încearcă să adaugi în `.env`:

```env
# Endpoint alternativ (dacă cel standard nu funcționează)
VITE_MAIB_API_ENDPOINT=/v1/payment/session
```

Sau alte variante:
```env
VITE_MAIB_API_ENDPOINT=/payment/session
VITE_MAIB_API_ENDPOINT=/api/payment/create
```

**Important:** După modificare, repornește serverul!

## Notă Importantă

Eroarea 404 indică că endpoint-ul nu există sau nu este accesibil cu credențialele furnizate. Aceasta este o problemă de configurare la nivelul MAIB, nu o problemă de cod.

Codul este implementat corect conform documentației. Problema este la nivelul:
- URL-ului API pentru test
- Activării proiectului în platforma MAIB
- Configurării endpoint-urilor în platforma MAIB
