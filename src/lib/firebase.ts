import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import fileConfig from '../../firebase-applet-config.json';

// Prefer environment variables (Vite: VITE_*) for sharing-safe overrides.
// Falls back to the committed `firebase-applet-config.json` if env vars are not present.
const env: any = typeof import.meta !== 'undefined' ? import.meta.env : process.env;

function getEnvConfig() {
  const cfg = {
    apiKey: env.VITE_FIREBASE_API_KEY || env.FIREBASE_API_KEY,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || env.FIREBASE_AUTH_DOMAIN,
    projectId: env.VITE_FIREBASE_PROJECT_ID || env.FIREBASE_PROJECT_ID,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId:
      env.VITE_FIREBASE_MESSAGING_SENDER_ID || env.FIREBASE_MESSAGING_SENDER_ID,
    appId: env.VITE_FIREBASE_APP_ID || env.FIREBASE_APP_ID,
  };
  // Return null if no key present so caller can fallback to file config
  return cfg.apiKey ? cfg : null;
}

const firebaseConfig =
  getEnvConfig() || {
    apiKey: fileConfig.apiKey,
    authDomain: fileConfig.authDomain,
    projectId: fileConfig.projectId,
    storageBucket: fileConfig.storageBucket,
    messagingSenderId: fileConfig.messagingSenderId,
    appId: fileConfig.appId,
  };

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app, fileConfig.firestoreDatabaseId || undefined);
export const storage = getStorage(app);

export default app;
