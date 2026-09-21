import { createFileRoute } from '@tanstack/react-router';
import { getFirebaseAdmin } from '@/lib/firebase-admin';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary from secure environment variables
cloudinary.config({
  cloud_name: process.env['CLOUDINARY_CLOUD_NAME'] || '',
  api_key: process.env['CLOUDINARY_API_KEY'] || '',
  api_secret: process.env['CLOUDINARY_API_SECRET'] || ''
});

export const Route = createFileRoute('/api/updateKyc')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const adminApp = getFirebaseAdmin();
          if (!adminApp) {
            return Response.json({ success: false, error: 'Firebase Admin credentials unconfigured or invalid on server.' }, { status: 500 });
          }

          // 1. Verify Authorization Header
          const authHeader = request.headers.get('Authorization');
          if (!authHeader?.startsWith('Bearer ')) {
            return Response.json({ success: false, error: 'Unauthorized: Missing or invalid token format' }, { status: 401 });
          }
          
          const idToken = authHeader.split('Bearer ')[1];
          if (!idToken) {
            return Response.json({ success: false, error: 'Unauthorized: Invalid token structure' }, { status: 401 });
          }
          let decodedToken;
          try {
            decodedToken = await adminApp.auth.verifyIdToken(idToken);
          } catch (verifyError) {
            return Response.json({ success: false, error: 'Unauthorized: Token verification failed' }, { status: 401 });
          }
          const authenticatedUid = decodedToken.uid;

          const formData = await request.formData();
          const frontImageFile = formData.get('frontImage') as Blob | null;
          const backImageFile = formData.get('backImage') as Blob | null;

          if (!frontImageFile || !backImageFile) {
            return Response.json({ success: false, error: 'Missing required fields' }, { status: 400 });
          }

          // Convert Blob to ArrayBuffer then Buffer for Cloudinary SDK
          const uploadToCloudinarySecure = async (imageBlob: Blob): Promise<string> => {
            const arrayBuffer = await imageBlob.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            
            return new Promise((resolve, reject) => {
              const uploadStream = cloudinary.uploader.upload_stream({
                folder: `kyc_documents/${authenticatedUid}`,
                type: 'authenticated',
                access_mode: 'authenticated',
                timeout: 50000
              }, (error, result) => {
                if (error) {
                  reject(new Error(error.message || 'Failed to upload image to Cloudinary'));
                } else if (result) {
                  resolve(result.secure_url);
                }
              });
              uploadStream.end(buffer);
            });
          };

          // 2. Upload images to Cloudinary securely
          const [frontUrl, backUrl] = await Promise.all([
            uploadToCloudinarySecure(frontImageFile),
            uploadToCloudinarySecure(backImageFile)
          ]);

          // 3. Update Firestore securely on the backend tied exclusively to authenticatedUid
          const db = adminApp.firestore;
          const userDocRef = db.collection('users').doc(authenticatedUid);
          await userDocRef.set({
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
