// src/firebaseConfig.ts
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "481f1908576db97037a118148858cc858fe4570c",
  authDomain: "https://accounts.google.com/o/oauth2/auth",
  projectId: "business-137ec",
  messagingSenderId: "112299600028808346377"
};

export const getFirebaseApp = () => {
  return initializeApp(firebaseConfig);
};
