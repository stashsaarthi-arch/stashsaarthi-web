import { getApps, initializeApp, applicationDefault, cert, App } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { Firestore } from 'firebase-admin/firestore';

let adminApp: App | null = null;

export function getFirebaseAdmin() {
  if (!getApps().length) {
    const projectId = process.env['FIREBASE_ADMIN_PROJECT_ID'];
    const clientEmail = process.env['FIREBASE_ADMIN_CLIENT_EMAIL'];
    let privateKey = process.env['FIREBASE_ADMIN_PRIVATE_KEY'];

    if (privateKey) {
      privateKey = privateKey.replace(/\\n/g, '\n');
    }

    if (!projectId || !clientEmail || !privateKey) {
      console.error('[FirebaseAdmin Error]: Missing one or more required admin environment variables.');
      return null;
    }

    try {
      adminApp = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    } catch (initErr) {
      console.error('[FirebaseAdmin Error]: Failed to initialize app:', initErr);
      return null;
    }
  } else {
    adminApp = getApps()[0];
  }
  
  return {
    auth: getAuth(adminApp),
    firestore: getFirestore(adminApp)
  };
}
