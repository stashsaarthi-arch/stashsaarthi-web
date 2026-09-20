import { createFileRoute } from '@tanstack/react-router';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const Route = createFileRoute('/api/updateKyc')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const { userId, frontBase64, backBase64 } = body;

          if (!userId || !frontBase64 || !backBase64) {
            return Response.json({ success: false, error: 'Missing required fields' }, { status: 400 });
          }

          // 1. Upload Base64 images to Cloudinary from the server
          const uploadToCloudinary = async (base64Str: string) => {
            const formData = new FormData();
            formData.append('file', base64Str);
            formData.append('upload_preset', 'stashsaarthi-web');

            const response = await fetch('https://api.cloudinary.com/v1_1/nkof0cgp/image/upload', {
              method: 'POST',
              body: formData,
            });

            if (!response.ok) {
              const errData = await response.json().catch(() => null);
              throw new Error(errData?.error?.message || 'Failed to upload image to Cloudinary');
            }
            const data = await response.json();
            return data.secure_url;
          };

          const [frontUrl, backUrl] = await Promise.all([
            uploadToCloudinary(frontBase64),
            uploadToCloudinary(backBase64)
          ]);

          // 2. Update Firestore securely on the backend
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
