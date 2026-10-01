import { Buffer } from "node:buffer";
import { getAdminAuth, getAdminDb } from "@/lib/firebaseAdmin";
export async function handleUpdateKyc(request: Request): Promise<Response> {
  const { v2: cloudinary } = await import("cloudinary");
  cloudinary.config({
    cloud_name: process.env["CLOUDINARY_CLOUD_NAME"] || "",
    api_key: process.env["CLOUDINARY_API_KEY"] || "",
    api_secret: process.env["CLOUDINARY_API_SECRET"] || "",
  });
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ success: false, error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const auth = await getAdminAuth();
    const db = await getAdminDb();
    if (!auth || !db) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Backend authentication service is temporarily unconfigured.",
        }),
        { status: 503, headers: { "Content-Type": "application/json" } },
      );
    }

    if (
      !process.env["CLOUDINARY_CLOUD_NAME"] ||
      !process.env["CLOUDINARY_API_KEY"] ||
      !process.env["CLOUDINARY_API_SECRET"]
    ) {
      return new Response(
        JSON.stringify({ success: false, error: "Cloudinary credentials unconfigured on server." }),
        { status: 503, headers: { "Content-Type": "application/json" } },
      );
    }

    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ success: false, error: "Unauthorized: Missing or invalid token format" }),
        { status: 401, headers: { "Content-Type": "application/json" } },
      );
    }

    const idToken = authHeader.split("Bearer ")[1];
    if (!idToken) {
      return new Response(
        JSON.stringify({ success: false, error: "Unauthorized: Invalid token structure" }),
        { status: 401, headers: { "Content-Type": "application/json" } },
      );
    }

    let decodedToken;
    try {
      decodedToken = await auth.verifyIdToken(idToken);
    } catch (verifyError) {
      return new Response(
        JSON.stringify({ success: false, error: "Unauthorized: Token verification failed" }),
        { status: 401, headers: { "Content-Type": "application/json" } },
      );
    }
    const authenticatedUid = decodedToken.uid;

    const formData = await request.formData();
    const frontImageFile = formData.get("frontImage");
    const backImageFile = formData.get("backImage");

    if (
      !frontImageFile ||
      !(frontImageFile instanceof Blob) ||
      !backImageFile ||
      !(backImageFile instanceof Blob)
    ) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing or invalid required fields (must be files)",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const uploadToCloudinarySecure = async (imageBlob: Blob): Promise<string> => {
      const arrayBuffer = await imageBlob.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: `kyc_documents/${authenticatedUid}`,
            type: "authenticated",
            access_mode: "authenticated",
            timeout: 50000,
          },
          (error, result) => {
            if (error) {
              reject(new Error(error.message || "Failed to upload image to Cloudinary"));
            } else if (result) {
              resolve(result.secure_url);
            }
          },
        );
        uploadStream.end(buffer);
      });
    };

    const [frontUrl, backUrl] = await Promise.all([
      uploadToCloudinarySecure(frontImageFile),
      uploadToCloudinarySecure(backImageFile),
    ]);

    const userDocRef = db.collection("users").doc(authenticatedUid);
    await userDocRef.set(
      {
        kycStatus: "pending",
        aadhaarFrontUrl: frontUrl,
        aadhaarBackUrl: backUrl,
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    );

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("API Error updating KYC:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message || "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
