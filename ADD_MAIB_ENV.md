# Adăugare Configurație MAIB în .env

## Problema
Datele MAIB nu sunt configurate în fișierul `.env`, ceea ce cauzează eroarea 404.

## Soluție Rapidă

### Opțiunea 1: Adaugă manual în `.env`

Deschide `frontend/.env` și adaugă următoarele linii:

```env
# MAIB eCommerce Configuration
# Datele de TEST furnizate de MAIB
VITE_MAIB_PROJECT_ID=9B9C19AE-DC32-4128-9249-16412CCD7E6B
VITE_MAIB_PROJECT_SECRET=efb8506c-0afb-4430-8e33-5b0336a18ccf
VITE_MAIB_SIGNATURE_KEY=4fa8f893-7f39-4f13-b5c2-34e6629b84dc
VITE_MAIB_API_URL=https://api.maibmerchants.md
# Endpoint-ul API (opțional, default: /api/v1/payment/session)
# Dacă primești 404, poți încerca endpoint-uri alternative:
# VITE_MAIB_API_ENDPOINT=/v1/payment/session
# VITE_MAIB_API_ENDPOINT=/payment/session
# VITE_MAIB_API_ENDPOINT=/api/payment/create
VITE_MAIB_API_ENDPOINT=/api/v1/payment/session
VITE_MAIB_TEST_MODE=true
```

### Opțiunea 2: Folosește script-ul automat

```bash
cd /Users/megapromotingholding/Documents/address-beauty-hub
chmod +x frontend/add-maib-env.sh
./frontend/add-maib-env.sh
```

## Verificare

După adăugare, verifică că datele sunt corecte:

```bash
cd frontend
cat .env | grep MAIB
```

Ar trebui să vezi toate cele 5 variabile MAIB.

## Repornește Development Server

**IMPORTANT:** După modificarea `.env`, trebuie să repornești serverul:

```bash
# Oprește serverul (Ctrl+C)
# Apoi pornește din nou:
npm run dev
```

## Verificare Funcționare

După repornire, verifică în consolă că nu mai apare eroarea 404 și că vezi:
- `MAIB API Endpoint: https://api.maibmerchants.md/api/v1/payment/session`
- `MAIB Request Data: {...}`

## Dacă Problema Persistă

1. Verifică că toate variabilele încep cu `VITE_`
2. Verifică că nu există spații în jurul `=`
3. Verifică că URL-ul este exact: `https://api.maibmerchants.md` (fără trailing slash)
4. Repornește serverul după modificări
