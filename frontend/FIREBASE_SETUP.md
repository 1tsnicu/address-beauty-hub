# 🔧 Configurarea Firebase pentru Address Beauty Hub

## ⚠️ Problema: "Missing or insufficient permissions"

Această eroare apare când regulile de securitate Firestore blochează accesul la baza de date.

## 🛠️ Soluția: Actualizarea Regulilor Firestore

### Pasul 1: Accesați Firebase Console
1. Deschideți [Firebase Console](https://console.firebase.google.com/)
2. Selectați proiectul **adress-beauty-d78f0**
3. Navigați la **Firestore Database** din meniul lateral

### Pasul 2: Actualizați Regulile
1. Click pe tab-ul **Rules** în Firestore
2. Înlocuiți regulile existente cu următoarele reguli de testare:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Reguli pentru testare - permit acces complet
    // ⚠️ ATENȚIE: Folosiți doar pentru dezvoltare/testare
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### Pasul 3: Publicați Regulile
1. Click pe butonul **Publish** pentru a aplica noile reguli
2. Confirmați schimbarea

## 🧪 Testarea Conexiunii

După actualizarea regulilor:

1. Reîncărcați pagina: http://localhost:8081/admin/database
2. Click pe **"Testează Conexiunea"** pentru a verifica accesul
3. Dacă testul este reușit, procedați cu **"Populează Baza de Date"**

## 🔒 Reguli de Producție (Pentru mai târziu)

Pentru un mediu de producție, folosiți reguli mai restrictive:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Produse - citire publică, scriere autentificată
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Cursuri - citire publică, scriere autentificată
    match /courses/{courseId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Clienți - acces doar pentru utilizatori autentificați
    match /customers/{customerId} {
      allow read, write: if request.auth != null;
    }
    
    // Comenzi - acces doar pentru proprietar sau admin
    match /orders/{orderId} {
      allow read, write: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         request.auth.token.admin == true);
    }
  }
}
```

## 📊 După Configurare

Odată regulile actualizate, veți putea:

✅ Importa toate datele din `clienti.json` (200+ clienți)
✅ Adăuga produsele beauty cu prețuri în EUR/MDL  
✅ Încărca cursurile complete cu instructori
✅ Accesa interfața de gestionare clienți
✅ Utiliza magazinul online funcțional

## 🔗 Link-uri Utile

- **Firebase Console**: https://console.firebase.google.com/project/adress-beauty-d78f0
- **Aplicația**: http://localhost:8081
- **Admin Database**: http://localhost:8081/admin/database
- **Gestionare Clienți**: http://localhost:8081/admin/clienti
