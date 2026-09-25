import { useState, useRef } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/useAuthStore";

const slideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 40 : -40,
    opacity: 0,
    scale: 0.98
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 400, damping: 35 }
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 40 : -40,
    opacity: 0,
    scale: 0.98,
    transition: { type: "spring", stiffness: 400, damping: 35 }
  })
};

export function SpaceListingForm() {
  const { user } = useAuthStore();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Core Form State
  const [formData, setFormData] = useState({
    location: "",
    spaceType: "Room",
    capacity: 5,
  });
  
  // Storage State
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const nextStep = () => { setDirection(1); setStep(s => s + 1); };
  const prevStep = () => { setDirection(-1); setStep(s => s - 1); };

  const handleUploadAndSubmit = async () => {
    if (!user) return setError("Authentication required");
    if (!file) return setError("Please provide an image of the space");
    
    setLoading(true);
    setError(null);

    try {
      // 1. Upload Image to Supabase Storage Bucket
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('host_spaces')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Retrieve Public URL for display
      const { data: { publicUrl } } = supabase.storage
        .from('host_spaces')
        .getPublicUrl(filePath);

      // 3. Insert Host Listing into Database
      const { error: dbError } = await supabase.from('host_listings').insert([{
        user_id: user.id,
        location: formData.location,
        space_type: formData.spaceType,
        capacity: formData.capacity,
        image_url: publicUrl,
        status: 'pending_verification'
      }]);

      if (dbError) throw dbError;

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to list space");
    } finally {
      setLoading(false);
    }
  };

  // SUCCESS UI
  if (success) {
    return (
      <div className="w-full min-h-[60vh] bg-transparent flex items-center justify-center relative z-10 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="w-full max-w-lg bg-white/5 backdrop-blur-2xl border border-host-primary/40 rounded-3xl p-10 text-center shadow-[0_0_50px_-12px_rgba(245,158,11,0.2)]"
        >
           <div className="w-20 h-20 bg-host-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-host-primary/40">
              <svg className="w-10 h-10 text-host-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'GTA6-Heading' }}>Space Listed</h2>
            <p className="text-white/70 mb-8 leading-relaxed">Your micro-storage space is securely locked in. Our safety protocol team will contact you shortly for physical verification.</p>
            <button
              onClick={() => { setSuccess(false); setStep(1); setFile(null); }}
              className="px-6 py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors w-full"
            >
              List Additional Space
            </button>
        </motion.div>
      </div>
    );
  }

  // MULTI-STEP FORM UI
  return (
    <div className="w-full min-h-[60vh] bg-transparent flex flex-col items-center justify-center relative z-10 p-4">
      <div className="w-full max-w-lg">
        {/* Animated Progress Indicator */}
        <div className="flex justify-between items-center mb-8 px-2">
           {[1, 2, 3].map((num) => (
             <div key={num} className="flex flex-col items-center gap-2">
               <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-500 ${step >= num ? 'bg-host-primary border-host-primary text-black font-bold shadow-[0_0_15px_rgba(245,158,11,0.4)]' : 'bg-white/5 border-white/20 text-white/40'}`}>
                 {num}
               </div>
               <span className={`text-xs font-semibold ${step >= num ? 'text-host-primary' : 'text-white/30'}`}>
                 {num === 1 ? 'Details' : num === 2 ? 'Capacity' : 'Visuals'}
               </span>
             </div>
           ))}
        </div>

        {/* Dynamic Step Container with PopLayout */}
        <div className="relative w-full overflow-hidden bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl min-h-[400px]">
          <AnimatePresence mode="popLayout" initial={false} custom={direction}>
            {step === 1 && (
              <motion.div
                key="step1"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full p-8 flex flex-col h-full justify-between"
              >
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: 'GTA6-Heading' }}>Space Details</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">Location / Landmark</label>
                      <input 
                        type="text" 
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        placeholder="e.g. Kakadeo, Near Allen"
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-host-primary/50 focus:ring-1 focus:ring-host-primary/50 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">Space Type</label>
                      <select 
                        value={formData.spaceType}
                        onChange={(e) => setFormData({...formData, spaceType: e.target.value})}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-host-primary/50 transition-all appearance-none"
                      >
                        <option value="Room">Spare Room</option>
                        <option value="Garage">Secure Garage</option>
                        <option value="Basement">Basement</option>
                      </select>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={nextStep}
                  disabled={!formData.location}
                  className="mt-8 w-full bg-host-primary text-black font-bold py-4 rounded-xl hover:bg-white transition-all disabled:opacity-50"
                >
                  Continue to Capacity
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full p-8 flex flex-col h-full justify-between"
              >
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: 'GTA6-Heading' }}>Capacity & Limits</h2>
                  <p className="text-white/60 text-sm mb-8">How many standard student bags/boxes can your space securely hold?</p>
                  
                  <div className="flex flex-col items-center py-6">
                    <div className="text-6xl font-bold text-host-primary mb-6 tracking-tighter">{formData.capacity}</div>
                    <div className="flex items-center gap-6">
                      <button onClick={() => setFormData(s => ({...s, capacity: Math.max(1, s.capacity - 1)}))} className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-host-primary hover:text-host-primary transition-colors text-2xl">-</button>
                      <button onClick={() => setFormData(s => ({...s, capacity: s.capacity + 1}))} className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-host-primary hover:text-host-primary transition-colors text-2xl">+</button>
                    </div>
                  </div>
                  <div className="text-center mt-4">
                    <p className="text-white/40 text-sm">Estimated Monthly Passive Income</p>
                    <p className="text-xl font-bold text-white mt-1">₹{(formData.capacity * 180).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex gap-4 mt-8">
                  <button onClick={prevStep} className="w-1/3 border border-white/20 text-white font-bold py-4 rounded-xl hover:bg-white/5 transition-all">Back</button>
                  <button onClick={nextStep} className="w-2/3 bg-host-primary text-black font-bold py-4 rounded-xl hover:bg-white transition-all">Continue to Visuals</button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full p-8 flex flex-col h-full justify-between"
              >
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: 'GTA6-Heading' }}>Space Verification</h2>
                  
                  {/* Drag and Drop Zone */}
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-full h-48 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all ${file ? 'border-host-primary bg-host-primary/5' : 'border-white/20 bg-black/20 hover:border-host-primary/50 hover:bg-white/5'}`}
                  >
                    {file ? (
                      <div className="text-center">
                        <div className="text-host-primary mb-2">
                          <svg className="w-8 h-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <p className="text-white font-medium">{file.name}</p>
                        <p className="text-white/50 text-xs mt-1">Click to replace</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <svg className="w-10 h-10 text-white/30 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <p className="text-white/70 font-medium">Drag & Drop or Click to Upload</p>
                        <p className="text-white/40 text-xs mt-2">Required for safety protocol</p>
                      </div>
                    )}
                    <input 
                      type="file" 
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setFile(e.target.files[0]);
                        }
                      }}
                      className="hidden"
                    />
                  </div>
                  
                  {error && <p className="text-red-400 text-sm text-center mt-4">{error}</p>}
                </div>
                <div className="flex gap-4 mt-8">
                  <button onClick={prevStep} disabled={loading} className="w-1/3 border border-white/20 text-white font-bold py-4 rounded-xl hover:bg-white/5 transition-all disabled:opacity-50">Back</button>
                  <button 
                    onClick={handleUploadAndSubmit} 
                    disabled={loading || !file}
                    className="w-2/3 bg-host-primary text-black font-bold py-4 rounded-xl hover:bg-white transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                        Uploading...
                      </>
                    ) : "List Space"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
