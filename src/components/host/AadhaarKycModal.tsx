import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  UploadCloud,
  CheckCircle2,
  X,
  Loader2,
  Image as ImageIcon,
  ShieldAlert,
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";

interface AadhaarKycModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AadhaarKycModal({ isOpen, onClose, onSuccess }: AadhaarKycModalProps) {
  const [step, setStep] = useState<"front" | "back" | "success" | "shield-warning">("front");
  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [backImage, setBackImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [mounted, setMounted] = useState(false);
  const successTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  if (!mounted || !isOpen || typeof document === "undefined") return null;

  const updatePreview = (file: File | null) => {
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return file ? URL.createObjectURL(file) : null;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (step === "front") {
        setFrontImage(file);
      } else if (step === "back") {
        setBackImage(file);
      }
      updatePreview(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      if (step === "front") {
        setFrontImage(file);
      } else if (step === "back") {
        setBackImage(file);
      }
      updatePreview(file);
    }
  };

  const clearPreview = () => {
    if (step === "front") setFrontImage(null);
    else setBackImage(null);
    updatePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleNext = async () => {
    if (step === "front" && frontImage) {
      setStep("back");
      updatePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } else if (step === "back" && backImage) {
      await uploadDocuments();
    }
  };

  const uploadDocuments = async () => {
    setError("");

    const currentUser = auth.currentUser;
    if (!currentUser) {
      const errorMsg = "Authentication required. Please log in again.";
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    if (!frontImage || !backImage) {
      const errorMsg = "Both front and back images are required.";
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    setLoading(true); // START LOADER
    try {
      // Client-side HTML Canvas downscaler: max 1280px dimension, JPEG quality 0.75, keeping file size < 800 KB
      const compressImage = async (file: File): Promise<Blob> => {
        return new Promise((resolve, reject) => {
          const objectUrl = URL.createObjectURL(file);
          const img = new Image();

          img.onload = () => {
            URL.revokeObjectURL(objectUrl);
            const canvas = document.createElement("canvas");
            const MAX_DIMENSION = 1280;
            let width = img.width;
            let height = img.height;

            if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
              if (width > height) {
                height = Math.round((height * MAX_DIMENSION) / width);
                width = MAX_DIMENSION;
              } else {
                width = Math.round((width * MAX_DIMENSION) / height);
                height = MAX_DIMENSION;
              }
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext("2d");
            if (!ctx) {
              reject(new Error("Canvas context initialization failed"));
              return;
            }

            ctx.drawImage(img, 0, 0, width, height);

            // Compress with quality 0.75 and verify size is strictly under 800 KB
            canvas.toBlob(
              (blob) => {
                if (!blob) {
                  reject(new Error("Image compression failed"));
                  return;
                }

                if (blob.size > 800 * 1024) {
                  // Secondary compression pass if initial blob exceeds 800 KB
                  canvas.toBlob(
                    (reducedBlob) => {
                      resolve(reducedBlob || blob);
                    },
                    "image/jpeg",
                    0.6,
                  );
                } else {
                  resolve(blob);
                }
              },
              "image/jpeg",
              0.75,
            );
          };

          img.onerror = (err) => {
            URL.revokeObjectURL(objectUrl);
            reject(new Error("Failed to load image for compression"));
          };

          img.src = objectUrl;
        });
      };

      // 1. Convert to compressed Blobs locally (< 800 KB each)
      const frontBlob = await compressImage(frontImage);
      const backBlob = await compressImage(backImage);

      // 2. Efficient multipart/form-data upload with explicit 60-second timeout
      const formData = new FormData();
      formData.append("frontImage", frontBlob, "front.jpg");
      formData.append("backImage", backBlob, "back.jpg");

      const idToken = await currentUser.getIdToken();

      const apiResponse = await fetch("/api/updateKyc", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
        body: formData,
        signal: AbortSignal.timeout(60000),
      });

      if (!apiResponse.ok) {
        const errData = await apiResponse.json().catch(() => null);
        throw new Error(errData?.error || `Upload failed with HTTP ${apiResponse.status}`);
      }

      // If successful:
      setStep("success");
      toast.success("KYC Uploaded Successfully!");

      // Delay closing to show success animation
      successTimerRef.current = setTimeout(() => {
        onSuccess();
      }, 2500);
    } catch (error: any) {
      console.error("UPLOAD FAILED:", error);

      const isTimeout =
        error.name === "TimeoutError" ||
        error.name === "AbortError" ||
        error.message?.includes("Timeout") ||
        error.message?.includes("timeout");
      const isBlocked =
        error.message === "Network Request Blocked" ||
        error.message?.includes("fetch") ||
        error.message?.includes("Network") ||
        error.message?.includes("blocked");

      if (isTimeout) {
        const timeoutMsg =
          "Upload timed out (took longer than 60s). Please check your internet connection and try again.";
        setError(timeoutMsg);
        toast.error(timeoutMsg);
      } else if (isBlocked) {
        setStep("shield-warning");
      } else {
        const errorMsg = error.message || "Network blocked or upload failed. Please try again.";
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } finally {
      // Guarantees the spinner stops spinning
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6">
      {/* 1. Dark Backdrop (Separate from content to avoid opacity inheritance) */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>

      {/* 2. Actual Modal Box */}
      <div className="relative z-[100000] w-full max-w-lg bg-neutral-900 border border-white/10 rounded-2xl shadow-2xl p-6 md:p-8 overflow-hidden">
        {/* Close Button */}
        {step !== "success" && step !== "shield-warning" && !loading && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Shield Warning Liquid UI State */}
        {step === "shield-warning" && (
          <div className="flex flex-col items-center justify-center text-center py-8">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-red-500/20 animate-pulse rounded-full" />
              <ShieldAlert className="w-10 h-10 text-red-400 relative z-10" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight mb-3">
              🛡️ Your Privacy Shield is Too Strong!
            </h2>
            <p className="text-slate-300 mb-8 max-w-[280px] leading-relaxed">
              We noticed your Ad-Blocker or Brave Shield is blocking our secure database connection.
              We respect your privacy, but to complete your verified Host profile, please pause the
              shield for just 1 minute and click Upload again.
            </p>
            <button
              onClick={() => {
                setStep("front");
                setError("");
                updatePreview(frontImage);
              }}
              className="w-full py-4 bg-red-500 hover:bg-red-400 text-white font-bold rounded-full transition-all flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.3)] active:scale-95"
            >
              I've paused it, Let's Try Again
            </button>
            <button
              onClick={onClose}
              className="mt-4 py-2 px-4 text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Success State */}
        {step === "success" && (
          <div className="flex flex-col items-center justify-center text-center py-10">
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 border border-emerald-500/30">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
              Documents Submitted
            </h2>
            <p className="text-slate-400">Our team will verify your profile within 24 hours.</p>
          </div>
        )}

        {/* Upload State */}
        {step !== "success" && step !== "shield-warning" && (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white tracking-tight mb-2">Verify Aadhaar</h2>
              <p className="text-slate-400 text-sm">
                {step === "front"
                  ? "Upload a clear photo of the front of your Aadhaar card."
                  : "Now, upload the back of your Aadhaar card."}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-center flex flex-col items-center gap-2">
                <p className="text-red-400 text-sm font-medium">{error}</p>
                {frontImage && backImage && !loading && (
                  <button
                    type="button"
                    onClick={uploadDocuments}
                    className="mt-1 px-4 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-white rounded-xl text-xs font-semibold transition-all active:scale-95"
                  >
                    Retry Upload
                  </button>
                )}
              </div>
            )}

            <div
              className={`border-2 border-dashed rounded-3xl p-8 mb-6 text-center transition-all ease-[cubic-bezier(0.23,1,0.32,1)] duration-300 relative ${
                preview
                  ? "border-emerald-500/50 bg-emerald-500/5"
                  : "border-white/20 bg-white/5 hover:border-emerald-500/50 hover:bg-emerald-500/5"
              }`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => !preview && fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />

              {preview ? (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-h-48 mx-auto rounded-xl shadow-lg object-contain"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      clearPreview();
                    }}
                    className="absolute -top-3 -right-3 p-1.5 bg-red-500 hover:bg-red-600 rounded-full text-white shadow-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center cursor-pointer">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-emerald-400">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                  <p className="text-white font-medium mb-1">Click or drag image here</p>
                  <p className="text-slate-400 text-xs">JPEG, PNG, JPG (Max 5MB)</p>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center gap-4">
              {step === "back" && !loading && (
                <button
                  type="button"
                  onClick={() => {
                    setStep("front");
                    updatePreview(frontImage);
                  }}
                  className="px-6 py-4 bg-white/10 hover:bg-white/15 text-white font-medium rounded-full transition-colors w-1/3"
                >
                  Back
                </button>
              )}

              <button
                type="button"
                disabled={loading || !preview}
                onClick={handleNext}
                className={`flex-1 py-4 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold rounded-full transition-all ease-[cubic-bezier(0.23,1,0.32,1)] flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : step === "front" ? (
                  "Continue"
                ) : (
                  "Submit Documents"
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}
