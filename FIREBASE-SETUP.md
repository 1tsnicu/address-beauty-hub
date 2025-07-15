# Firebase Integration - Adress Beauty Hub

Această aplicație folosește Firebase pentru gestionarea datelor. Aici vei găsi toate instrucțiunile pentru configurarea și popularea bazei de date.

## 🔧 Configurarea Firebase

### 1. Crearea Proiectului Firebase

1. Accesează [Firebase Console](https://console.firebase.google.com/)
2. Creează un proiect nou sau selectează unul existent
3. În setările proiectului, adaugă o aplicație web
4. Copiază configurația generată

### 2. Configurarea Aplicației

1. Deschide fișierul `src/lib/firebase.ts`
2. Înlocuiește configurația cu datele tale:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "your-project-id.firebaseapp.com", 
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

### 3. Activarea Serviciilor Firebase

#### Firestore Database
1. În Firebase Console, accesează "Firestore Database"
2. Creează o bază de date în modul "test" 
3. Copiază regulile de securitate din secțiunea de mai jos

#### Authentication (Opțional)
1. Accesează "Authentication" în Firebase Console
2. Activează metodele de autentificare dorite (Email/Password, Google, etc.)

#### Storage (Opțional)
1. Accesează "Storage" în Firebase Console
2. Activează serviciul pentru stocarea imaginilor

## 🌱 Popularea Bazei de Date

### Automatic prin UI

1. Rulează aplicația: `npm run dev`
2. Accesează: `http://localhost:8081/admin/database`
3. Folosește interfața pentru a popula baza de date cu toate produsele și cursurile

### Manual prin cod

```typescript
import { seedDatabase } from '@/lib/seedData';

// Populează baza de date cu toate datele
await seedDatabase();
```

## 📊 Structura Bazei de Date

### Colecții Firebase

- **products** - Toate produsele din magazin
- **courses** - Cursurile de beauty disponibile  
- **categories** - Categoriile de produse
- **newsletter** - Abonații la newsletter
- **contacts** - Mesajele din formularul de contact
- **orders** - Comenzile plasate (viitor)
- **users** - Utilizatorii înregistrați (viitor)

### Exemplu de Produs

```json
{
  "name": "Gene false 3D Volume Negre",
  "price": 45.99,
  "originalPrice": 59.99,
  "category": "lashes",
  "inStock": true,
  "rating": 4.8,
  "reviews": 124,
  "description": "Gene false voluminoase 3D...",
  "variants": [
    {
      "id": 101,
      "size": "S", 
      "length": "8mm",
      "price": 45.99,
      "stockQuantity": 25
    }
  ]
}
```

### Exemplu de Curs

```json
{
  "title": "Start-Up (3 zile)",
  "titleRu": "Start-Up (3 дня)",
  "duration": "3 zile / 21 ore",
  "price": {
    "eur": 330,
    "mdl": 6600
  },
  "level": "beginner",
  "featured": true,
  "available": true,
  "maxStudents": 12,
  "currentStudents": 8,
  "certificateIncluded": true,
  "instructor": {
    "name": "Ana Popescu",
    "experience": "8 ani experiență"
  }
}
```

## 🛡️ Reguli de Securitate

### Firestore Rules (Dezvoltare)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Acces complet pentru dezvoltare
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### Firestore Rules (Producție)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Produse și cursuri - doar citire pentru publicul general
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    match /courses/{courseId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Newsletter - doar scriere pentru formulare publice
    match /newsletter/{subscriberId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Contacte - doar scriere pentru formulare publice
    match /contacts/{contactId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

## 🔧 Hook-uri și Servicii Disponibile

### Hooks

```typescript
// Pentru produse
const { products, loading, error, fetchProducts } = useFirebaseProducts();

// Pentru cursuri  
const { courses, loading, error, fetchCourses } = useFirebaseCourses();
```

### Servicii

```typescript
// Produse
await ProductService.addProduct(product);
await ProductService.getAllProducts();
await ProductService.getProductsByCategory('lashes');

// Cursuri
await CourseService.addCourse(course);
await CourseService.getAllCourses();

// Newsletter
await NewsletterService.addSubscriber(email, language);

// Contacte
await ContactService.addContact(contactData);
```

## 🚀 Comenzi Utile

```bash
# Rulează aplicația în dezvoltare
npm run dev

# Construiește pentru producție
npm run build

# Vizualizează aplicația construită
npm run preview
```

## 📁 Fișiere Relevante

- `src/lib/firebase.ts` - Configurația Firebase
- `src/lib/firebaseService.ts` - Serviciile pentru CRUD operații
- `src/lib/seedData.ts` - Script pentru popularea bazei de date
- `src/hooks/useFirebase.ts` - Hook-uri React pentru Firebase
- `src/components/DatabaseSetupPage.tsx` - Interfață admin pentru gestionarea bazei de date

## ⚠️ Notă Importantă

- Înlocuiește configurația Firebase cu datele tale reale
- Pentru producție, actualizează regulile de securitate
- Testează toate funcționalitățile înainte de deployment
- Păstrează cheile API în siguranță (folosește variabile de mediu în producție)

## 🆘 Probleme Frecvente

### "Firebase not initialized"
- Verifică dacă ai înlocuit configurația în `firebase.ts`
- Asigură-te că toate serviciile sunt activate în Firebase Console

### "Permission denied"
- Verifică regulile de securitate din Firestore
- Pentru dezvoltare, folosește reguli permisive

### "Network request failed"
- Verifică conexiunea la internet
- Asigură-te că proiectul Firebase este activ

Pentru mai multe detalii, consultă [documentația Firebase](https://firebase.google.com/docs).
