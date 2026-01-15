# Instrucțiuni Setup MAIB - Fix Eroare crypto.subtle

## Problema

Eroarea `Cannot read properties of undefined (reading 'digest')` apare deoarece `crypto.subtle` nu este disponibil în browser pe HTTP (doar pe HTTPS).

## Soluție

Am actualizat codul să folosească `crypto-js` pentru SHA256, care funcționează în toate browserele.

### Pași de instalare:

1. **Instalează crypto-js:**
   ```bash
   cd frontend
   npm install crypto-js @types/crypto-js
   ```

2. **Verifică instalarea:**
   ```bash
   npm list crypto-js
   ```

3. **Repornește development server:**
   ```bash
   npm run dev
   ```

## Verificare

După instalare, eroarea ar trebui să dispară și semnăturile SHA256 vor fi generate corect.

## Alternativă pentru producție

În producție (HTTPS), `crypto.subtle` va funcționa automat, dar `crypto-js` rămâne ca fallback pentru compatibilitate maximă.

## Dacă problema persistă

1. Verifică că `crypto-js` este instalat:
   ```bash
   npm list crypto-js
   ```

2. Verifică import-ul în `maibPaymentService.ts`:
   ```typescript
   import CryptoJS from 'crypto-js';
   ```

3. Șterge cache-ul și reinstalează:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```
