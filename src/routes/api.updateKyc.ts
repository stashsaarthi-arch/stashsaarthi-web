import { createFileRoute } from '@tanstack/react-router';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const Route = createFileRoute('/api/updateKyc')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const { userId, frontUrl, backUrl } = body;

          if (!userId || !frontUrl || !backUrl) {
            return Response.json({ success: false, error: 'Missing required fields' }, { status: 400 });
          }

          // Update Firestore securely on the backend
          const userDocRef = doc(db, 'users', userId);
          await setDoc(userDocRef, {
            kycStatus: 'pending',
            aadhaarFrontUrl: frontUrl,
            aadhaarBackUrl: backUrl,
            updatedAt: new Date().toISOString()
          }, { merge: true });

          return Response.json({ success: true });
        } catch (error: any) {
          console.error('API Error updating KYC:', error);
          return Response.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 });
        }
      }
    }
  }
});
