# Integrare MAIB eCommerce

Acest document descrie integrarea metodei de plată MAIB eCommerce în aplicația Address Beauty Hub.

## Configurare

### Variabile de Mediu

Adaugă următoarele variabile în fișierul `.env` (sau `.env.local`):

```env
# MAIB eCommerce Configuration
VITE_MAIB_PROJECT_ID=9B9C19AE-DC32-4128-9249-16412CCD7E6B
VITE_MAIB_PROJECT_SECRET=efb8506c-0afb-4430-8e33-5b0336a18ccf
VITE_MAIB_SIGNATURE_KEY=4fa8f893-7f39-4f13-b5c2-34e6629b84dc
VITE_MAIB_API_URL=https://api.maibmerchants.md
VITE_MAIB_TEST_MODE=true
```

**Notă:** Datele de mai sus sunt pentru mediu de test. Pentru producție, folosește credențialele de producție furnizate de MAIB.

### Baza de Date

Rulează scriptul SQL pentru a adăuga câmpurile necesare pentru stocarea informațiilor despre plăți MAIB:

```bash
# În Supabase SQL Editor sau prin psql
psql -f database/maib_payment_fields.sql
```

Sau rulează manual SQL-ul din `database/maib_payment_fields.sql`.

## Date de Test

Pentru testare, folosește următoarele date:

- **Cardholder:** Test Test
- **Card number:** 5102180060101124
- **Exp. date:** 06/28
- **CVV:** 760

## Funcționalități Implementate

### 1. Serviciu de Plată MAIB
- **Fișier:** `frontend/src/services/maibPaymentService.ts`
- **Funcții:**
  - `createPaymentSession()` - Creează o sesiune de plată în MAIB
  - `checkPaymentStatus()` - Verifică statusul unei plăți
  - `processCallback()` - Procesează callback-ul de la MAIB

### 2. Integrare în Checkout
- **Fișier:** `frontend/src/components/CheckoutPage.tsx`
- Când utilizatorul selectează "Card bancar", se creează automat o sesiune de plată MAIB
- Utilizatorul este redirecționat către formularul de plată MAIB

### 3. Pagină de Callback
- **Fișier:** `frontend/src/components/MaibCallbackPage.tsx`
- **Rută:** `/api/payment/maib/callback`
- Procesează răspunsurile de la gateway-ul MAIB și actualizează statusul comenzii

### 4. Pagină Termeni și Condiții de Plată
- **Fișier:** `frontend/src/pages/PaymentTermsPage.tsx`
- **Rută:** `/termeni-plata`
- Informații despre metodele de plată și securitatea tranzacțiilor

### 5. Actualizare Baza de Date
- **Fișier:** `database/maib_payment_fields.sql`
- Adaugă câmpuri pentru:
  - `maib_pay_id` - ID-ul sesiunii de plată
  - `maib_transaction_id` - ID-ul tranzacției
  - `maib_payment_status` - Statusul plății
  - `maib_callback_data` - Datele complete din callback

## Fluxul de Plată

1. **Utilizatorul completează checkout-ul** și selectează "Card bancar"
2. **Se creează comanda** în baza de date cu status `pending`
3. **Se creează sesiunea de plată MAIB** și se salvează `payId` în comandă
4. **Utilizatorul este redirecționat** către formularul de plată MAIB
5. **Utilizatorul completează plata** în formularul MAIB
6. **MAIB trimite callback** către `/api/payment/maib/callback`
7. **Se actualizează comanda** cu statusul plății și `transactionId`
8. **Utilizatorul este redirecționat** către pagina de confirmare

## Testare

### Teste Necesare (conform cerințelor MAIB):

1. **Achitare** - Testează o plată completă cu cardul de test
2. **Returnare** - Testează funcționalitatea de returnare/refund
3. **Expediții Pay ID** - Verifică că `payId` este generat și salvat corect

### Verificări:

- [ ] Plata cu cardul funcționează end-to-end
- [ ] Callback-ul procesează corect răspunsurile MAIB
- [ ] Statusul comenzii se actualizează corect după plată
- [ ] Coșul se șterge doar după plată reușită
- [ ] Pagina de confirmare afișează corect informațiile comenzii

## Securitate

- Toate tranzacțiile sunt procesate prin platforma securizată MAIB
- Datele cardului nu sunt stocate pe serverele noastre
- Semnăturile sunt verificate pentru toate callback-urile
- Folosim HTTPS pentru toate comunicările

## Documentație MAIB

- **Documentație API:** https://docs.maibmerchants.md/
- **Plugin-uri disponibile:** https://maibmerchants.md/ro/plugin-uri
- **SDK:** https://maibmerchants.md/ro/sdk

## Suport

Pentru probleme sau întrebări despre integrarea MAIB, contactează:
- Suport MAIB: [contact MAIB]
- Echipa de dezvoltare: [contact echipă]

