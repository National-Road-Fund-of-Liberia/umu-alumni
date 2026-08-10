import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Credentials come from env vars, not a checked-in service account file,
// so this works the same locally and on Vercel. Guard against re-init
// because next dev's hot reload re-evaluates this module.
function getAdminApp() {
  const existing = getApps()[0];
  if (existing) return existing;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Missing Firebase Admin credentials. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY."
    );
  }

  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

export const adminApp = getAdminApp();
export const adminDb = getFirestore(adminApp);

// settings() can only run once per instance, and hot reload re-runs this file
try {
  adminDb.settings({ ignoreUndefinedProperties: true });
} catch (error) {
  if (!(error instanceof Error) || !error.message.includes("already been initialized")) {
    throw error;
  }
}
