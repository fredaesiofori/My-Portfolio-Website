import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Use Vite `import.meta.env` when available, otherwise fallback to process.env
const env: any = typeof import.meta !== 'undefined' ? import.meta.env : process.env;

// Inline the firebase-applet-config.json values as a hardcoded fallback.
// These are the same non-secret web config values Firebase Hosting would expose.
const appletConfig = {
  apiKey: 'AIzaSyCILgPaZNW1ZA0-D_P28KSdQVkJpgcy9Gw',
  authDomain: 'alertgh-11142.firebaseapp.com',
  projectId: 'alertgh-11142',
  storageBucket: 'alertgh-11142.firebasestorage.app',
  messagingSenderId: '730078449473',
  appId: '1:730078449473:web:c6ea3bada985ceddbf5bc0',
};

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || appletConfig.apiKey,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || appletConfig.authDomain,
  projectId: env.VITE_FIREBASE_PROJECT_ID || appletConfig.projectId,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || appletConfig.storageBucket,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || appletConfig.messagingSenderId,
  appId: env.VITE_FIREBASE_APP_ID || appletConfig.appId,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
