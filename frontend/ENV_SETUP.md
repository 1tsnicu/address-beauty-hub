# Configurare Variabile de Mediu

Acest ghid explică cum să configurezi variabilele de mediu pentru aplicația Address Beauty Hub.

## Fișiere de Configurare

### `.env` (Local Development)
Acest fișier conține valorile reale ale variabilelor de mediu și **NU** trebuie commitat în Git.

### `.env.example` (Template)
Acest fișier conține template-ul cu toate variabilele necesare, fără valori sensibile. Acesta **trebuie** commitat în Git.

## Pași de Configurare

### 1. Copiază Template-ul

```bash
cd frontend
cp .env.example .env
```

### 2. Completează Valorile

Deschide `.env` și completează valorile pentru fiecare variabilă:

#### Supabase Configuration

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Unde găsești aceste valori:**
1. Mergi la [Supabase Dashboard](https://app.supabase.com)
2. Selectează proiectul tău
3. Mergi la **Settings** > **API**
4. Copiază:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

#### MAIB eCommerce Configuration

```env
VITE_MAIB_PROJECT_ID=your-project-id
VITE_MAIB_PROJECT_SECRET=your-project-secret
VITE_MAIB_SIGNATURE_KEY=your-signature-key
VITE_MAIB_API_URL=https://api.maibmerchants.md
VITE_MAIB_TEST_MODE=true
```

**Pentru TEST (deja configurate):**
- Valorile de test sunt deja setate în `.env`
- Folosește cardul de test: `5102180060101124` (Exp: 06/28, CVV: 760)

**Pentru PRODUCȚIE:**
- Contactează MAIB pentru credențialele de producție
- Setează `VITE_MAIB_TEST_MODE=false`
- Înlocuiește valorile cu cele de producție

#### Admin Configuration

```env
VITE_ADMIN_EMAILS=admin@example.com,admin2@example.com
```

**Cum funcționează:**
- Adaugă email-urile adminilor separate prin virgulă
- Utilizatorii cu aceste email-uri vor avea acces automat la panoul de administrare
- Exemplu: `admin@addressbeauty.md,manager@addressbeauty.md`

#### Application Configuration

```env
VITE_APP_URL=http://localhost:5173
```

**Development:**
- `http://localhost:5173` (sau portul tău local)

**Production:**
- `https://your-domain.com`
- Folosit pentru callback-uri și redirect-uri MAIB

## Verificare Configurare

După ce ai configurat `.env`, verifică că totul funcționează:

1. **Restart Development Server:**
   ```bash
   npm run dev
   ```
   ⚠️ **Important:** Trebuie să repornești serverul după modificarea `.env`

2. **Verifică în Browser Console:**
   - Deschide DevTools (F12)
   - Verifică că nu apar erori legate de variabile de mediu

3. **Testează Funcționalitățile:**
   - Autentificare (Supabase)
   - Acces Admin (VITE_ADMIN_EMAILS)
   - Plată MAIB (dacă este configurată)

## Securitate

### ⚠️ IMPORTANT - Nu Commita `.env`!

Fișierul `.env` conține informații sensibile și **NU** trebuie commitat în Git.

**Verifică că `.env` este în `.gitignore`:**
```bash
# Ar trebui să vezi .env în .gitignore
cat frontend/.gitignore | grep .env
```

### Pentru Echipă

1. Fiecare dezvoltator creează propriul `.env` din `.env.example`
2. Pentru producție, configurează variabilele în platforma de hosting:
   - **Vercel:** Settings > Environment Variables
   - **Netlify:** Site settings > Environment variables
   - **Supabase:** Project Settings > Environment variables

## Troubleshooting

### Variabilele nu se încarcă

1. **Verifică prefixul:** Toate variabilele trebuie să înceapă cu `VITE_`
2. **Restart server:** Repornește development server-ul
3. **Verifică sintaxa:** Nu folosi spații în jurul `=` în `.env`

### Erori Supabase

- Verifică că `VITE_SUPABASE_URL` și `VITE_SUPABASE_ANON_KEY` sunt corecte
- Verifică că proiectul Supabase este activ
- Verifică că anon key-ul are permisiunile corecte

### Erori MAIB

- Verifică că toate credențialele MAIB sunt corecte
- Pentru test, folosește valorile din `.env.example`
- Verifică că `VITE_MAIB_API_URL` este corect

## Suport

Pentru probleme:
1. Verifică că toate variabilele sunt setate corect
2. Verifică că serverul a fost repornit
3. Verifică console-ul browser-ului pentru erori
4. Contactează echipa de dezvoltare

