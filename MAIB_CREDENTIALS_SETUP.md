# Configurare Credențiale MAIB

## Credențiale de Test Furnizate

```env
# MAIB Test Credentials
VITE_MAIB_PROJECT_ID=9B9C19AE-DC32-4128-9249-16412CCD7E6B
VITE_MAIB_PROJECT_SECRET=efb8506c-0afb-4430-8e33-5b0336a18ccf
VITE_MAIB_SIGNATURE_KEY=4fa8f893-7f39-4f13-b5c2-34e6629b84dc

# MAIB API Endpoints
VITE_MAIB_API_URL=https://api.maibmerchants.md
VITE_MAIB_API_ENDPOINT=/api/v1/payment/session
VITE_MAIB_TEST_MODE=true
```

## Instrucțiuni de Configurare

### 1. Adaugă în `frontend/.env`

Deschide `frontend/.env` și adaugă următoarele linii:

```env
# MAIB eCommerce Configuration
VITE_MAIB_PROJECT_ID=9B9C19AE-DC32-4128-9249-16412CCD7E6B
VITE_MAIB_PROJECT_SECRET=efb8506c-0afb-4430-8e33-5b0336a18ccf
VITE_MAIB_SIGNATURE_KEY=4fa8f893-7f39-4f13-b5c2-34e6629b84dc
VITE_MAIB_API_URL=https://api.maibmerchants.md
VITE_MAIB_API_ENDPOINT=/api/v1/payment/session
VITE_MAIB_TEST_MODE=true
```

**IMPORTANT:** 
- Toate variabilele trebuie să înceapă cu `VITE_` pentru ca Vite să le încarce
- Nu adăuga spații în jurul `=`
- Nu adăuga ghilimele în jurul valorilor

### 2. Verifică Configurația

După adăugare, verifică că toate variabilele sunt setate:

```bash
cd frontend
cat .env | grep MAIB
```

Ar trebui să vezi toate cele 6 variabile MAIB.

### 3. Repornește Development Server

**CRITIC:** După modificarea `.env`, trebuie să repornești serverul:

```bash
# Oprește serverul (Ctrl+C)
# Apoi pornește din nou:
npm run dev
```

### 4. Verificare în Consolă

După repornire, verifică în consolă (F12 → Console) că vezi:

```
🔧 MAIB Configuration Loaded: {
  projectId: '9B9C19AE-DC32-4128-9249-16412CCD7E6B',
  apiUrl: 'https://api.maibmerchants.md',
  apiEndpoint: '/api/v1/payment/session',
  isTestMode: true,
  hasProjectSecret: true,
  hasSignatureKey: true,
  ...
}
```

Dacă vezi `projectSecretSource: 'env'` și `signatureKeySource: 'env'`, înseamnă că configurația este corectă!

## Endpoint-uri Configurate

### Endpoint Standard (Default)
- **URL:** `https://api.maibmerchants.md/api/v1/payment/session`
- **Config:** `VITE_MAIB_API_ENDPOINT=/api/v1/payment/session`

### Dacă Primești 404

Dacă endpoint-ul standard returnează 404, poți încerca endpoint-uri alternative:

**Varianta 1 (fără /api):**
```env
VITE_MAIB_API_ENDPOINT=/v1/payment/session
```

**Varianta 2 (endpoint simplu):**
```env
VITE_MAIB_API_ENDPOINT=/payment/session
```

**Varianta 3 (URL diferit):**
```env
VITE_MAIB_API_URL=https://test-api.maibmerchants.md
VITE_MAIB_API_ENDPOINT=/api/v1/payment/session
```

## Verificare Funcționare

După configurare, când faci o comandă, verifică în consolă:

1. **Configurație încărcată:**
   ```
   🔧 MAIB Configuration Loaded: {...}
   ```

2. **Semnătură generată:**
   ```
   🔐 MAIB Signature Generation: {...}
   ✅ MAIB Signature Generated: {...}
   ```

3. **Request trimis:**
   ```
   📡 MAIB API Endpoint: https://api.maibmerchants.md/api/v1/payment/session
   📤 MAIB Request Headers: {...}
   📦 MAIB Request Body: {...}
   ```

4. **Răspuns primit:**
   - **Succes:** `✅ MAIB Response Success: {...}`
   - **Eroare:** `❌ MAIB API Error: {...}`

## Troubleshooting

### Problema: Variabilele nu se încarcă

**Soluție:**
1. Verifică că toate variabilele încep cu `VITE_`
2. Verifică că nu există spații în jurul `=`
3. Repornește serverul după modificări
4. Șterge cache-ul browser-ului (Ctrl+Shift+R)

### Problema: 404 Not Found

**Soluție:**
1. Verifică URL-ul exact în consolă
2. Încearcă endpoint-uri alternative (vezi mai sus)
3. Contactează MAIB pentru a confirma endpoint-ul corect
4. Verifică că proiectul este activat în platforma MAIB

### Problema: Eroare de semnătură

**Soluție:**
1. Verifică că `VITE_MAIB_SIGNATURE_KEY` este corect
2. Verifică logurile de generare a semnăturii în consolă
3. Asigură-te că folosești SHA256 corect

## Contact MAIB

Dacă problema persistă după verificarea tuturor configurărilor:

**Email:** [email protected]  
**Document:** Vezi `MAIB_SUPPORT_REQUEST.md` pentru detalii complete
