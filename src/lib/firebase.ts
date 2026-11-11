import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { connectAuthEmulator, getAuth, type Auth } from "firebase/auth";
import {
  connectFirestoreEmulator,
  getFirestore,
  type Firestore,
} from "firebase/firestore";

export const useEmulator = process.env.NEXT_PUBLIC_FIREBASE_EMULATOR === "true";

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "demo-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "demo-whisperbox",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

type Clients = { app: FirebaseApp; auth: Auth; db: Firestore };
let clients: Clients | null = null;

/** Lazily creates the Firebase clients (browser only). */
export function firebase(): Clients {
  if (clients) return clients;

  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  if (useEmulator) {
    connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
    connectFirestoreEmulator(db, "127.0.0.1", 8080);
  }

  clients = { app, auth, db };
  return clients;
}
