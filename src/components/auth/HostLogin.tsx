import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@tanstack/react-router";
import * as z from "zod";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { motion } from "framer-motion";

const hostLoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type HostLoginFormValues = z.infer<typeof hostLoginSchema>;

export function HostLogin() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<HostLoginFormValues>({
    resolver: zodResolver(hostLoginSchema),
  });

  const onSubmit = async (data: HostLoginFormValues) => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.navigate({ to: '/dashboard' });
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-transparent relative z-10 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl"
      >
        <h2 className="text-3xl font-bold text-host-primary mb-6 text-center" style={{ fontFamily: 'GTA6-Heading' }}>Host Access</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Email</label>
            <input
              {...register("email")}
              type="email"
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-host-primary/50 transition-all"
              placeholder="host@example.com"
            />
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Password</label>
            <input
              {...register("password")}
              type="password"
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-host-primary/50 transition-all"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {error && <div className="text-red-400 text-sm text-center bg-red-400/10 p-3 rounded-lg">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-host-primary text-black font-bold py-3 px-4 rounded-lg transition-all hover:bg-host-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Authenticating..." : "Enter Vault"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
