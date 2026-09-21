import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

export function getAdminAuth() {
  if (!getApps().length) {
    const projectId = process.env['FIREBASE_ADMIN_PROJECT_ID'];
    const clientEmail = process.env['FIREBASE_ADMIN_CLIENT_EMAIL'];
    const privateKey = process.env['FIREBASE_ADMIN_PRIVATE_KEY']?.replace(/\\n/g, '\n');

    if (!projectId || !clientEmail || !privateKey) {
      console.warn('[FirebaseAdmin] Missing environment variables. Admin SDK not initialized.');
      return null;
    }

    try {
      initializeApp({
        credential: cert({ projectId, clientEmail, privateKey }),
      });
    } catch (e) {
      console.error('[FirebaseAdmin] Initialization error:', e);
      return null;
    }
  }
  const app = getApps()[0];
  return app ? getAuth(app) : null;
}

export function getAdminDb() {
  if (!getApps().length) {
    getAdminAuth();
  }
  const app = getApps()[0];
  return app ? getFirestore(app) : null;
}
