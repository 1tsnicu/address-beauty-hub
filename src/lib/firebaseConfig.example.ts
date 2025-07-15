// Firebase Configuration Helper
// Replace the values below with your actual Firebase project configuration

export const firebaseInstructions = {
  RO: {
    title: "Instrucțiuni pentru configurarea Firebase",
    steps: [
      "1. Accesează https://console.firebase.google.com/",
      "2. Creează un proiect nou sau selectează unul existent",
      "3. În setările proiectului, adaugă o aplicație web",
      "4. Copiază configurația și înlocuiește valorile din src/lib/firebase.ts",
      "5. Activează Firestore Database în modul test",
      "6. Activează Authentication (opțional)",
      "7. Activează Storage (opțional pentru imagini)",
    ],
    configExample: `
const firebaseConfig = {
  apiKey: "AIzaSy...", // Cheia ta API
  authDomain: "proiectul-tau.firebaseapp.com",
  projectId: "proiectul-tau",
  storageBucket: "proiectul-tau.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};`
  },
  RU: {
    title: "Инструкции по настройке Firebase",
    steps: [
      "1. Перейдите на https://console.firebase.google.com/",
      "2. Создайте новый проект или выберите существующий",
      "3. В настройках проекта добавьте веб-приложение",
      "4. Скопируйте конфигурацию и замените значения в src/lib/firebase.ts",
      "5. Активируйте Firestore Database в тестовом режиме",
      "6. Активируйте Authentication (опционально)",
      "7. Активируйте Storage (опционально для изображений)",
    ],
    configExample: `
const firebaseConfig = {
  apiKey: "AIzaSy...", // Ваш API ключ
  authDomain: "ваш-проект.firebaseapp.com",
  projectId: "ваш-проект",
  storageBucket: "ваш-проект.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};`
  }
};

// Sample Firestore security rules for testing
export const firestoreRules = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access on all documents to any user signed in to the application
    match /{document=**} {
      allow read, write: if true; // Change this for production!
    }
  }
}
`;

export const storageRules = `
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true; // Change this for production!
    }
  }
}
`;
