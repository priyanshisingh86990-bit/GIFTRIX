import { useState } from "react";
import { useLocation } from "wouter";
import { Gift, Eye, EyeOff, Loader2, Mail, Lock, User } from "lucide-react";
import { setToken } from "@/lib/auth";
import { cn } from "@/lib/utils";

export default function Login() {
  const [, navigate] = useLocation();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");


  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const fakeToken = "demo-user-token";

    // force save
    localStorage.setItem("token", fakeToken);
    // ✅ USER SAVE (IMPORTANT)
    const finalName =
      name ||
      email.split("@")[0].replace(/[0-9]/g, "").replace(/[^a-zA-Z]/g, " ");

    localStorage.setItem("user", JSON.stringify({
      name: finalName,
      email: email
    }));

    // ✅ YEH LINE ADD KAR (IMPORTANT)
    window.dispatchEvent(new Event("storage"));


    // 🔥 HARD REDIRECT (bypass all router bugs)
    window.location.href = "/explore";
  }



  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(135deg, #f3e8ff 0%, #ede9fe 25%, #e9d5ff 50%, #f5d0fe 75%, #fce7f3 100%)"
      }}
    >
      {/* Decorative background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-violet-300/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-20 w-80 h-80 bg-pink-300/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl" />
        {/* Floating sparkle dots */}
        <div className="absolute top-12 left-1/4 w-2 h-2 bg-violet-400/60 rounded-full" />
        <div className="absolute top-1/4 right-1/4 w-1.5 h-1.5 bg-pink-400/60 rounded-full" />
        <div className="absolute bottom-1/3 left-1/5 w-2.5 h-2.5 bg-purple-400/40 rounded-full" />
        <div className="absolute top-2/3 right-1/5 w-1 h-1 bg-fuchsia-400/60 rounded-full" />
        <div className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-violet-300/60 rounded-full" />
      </div>

      {/* Main card */}
      <div className="relative w-full max-w-4xl bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden min-h-[560px] flex">

        {/* Left: Form */}
        <div className="flex-1 p-8 sm:p-12 flex flex-col justify-center">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-9 h-9 bg-violet-100 rounded-xl flex items-center justify-center">
              <Gift className="w-5 h-5 text-violet-600" />
            </div>
            <span className="text-xl font-bold text-gray-800">Giftrix</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {mode === "login" ? "Welcome back!" : "Create account"}
          </h1>
          <p className="text-gray-500 text-sm mb-8">
            {mode === "login"
              ? "Please login to continue shopping for the perfect gift."
              : "Join Giftrix and discover curated Indian gifts."}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  required
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/80 border border-violet-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 transition-all"
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                required
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/80 border border-violet-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 transition-all"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-white/80 border border-violet-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit" onClick={handleSubmit}
              disabled={isLoading}
              className="w-full py-3 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, #7c3aed, #9333ea, #c026d3)" }}
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === "login" ? "Continue" : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            {mode === "login" ? (
              <>
                New to Giftrix?{" "}
                <button
                  onClick={() => { setMode("signup"); setError(""); }}
                  className="text-violet-600 font-semibold hover:underline"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => { setMode("login"); setError(""); }}
                  className="text-violet-600 font-semibold hover:underline"
                >
                  Login
                </button>
              </>
            )}
          </p>

          <p className="text-center text-xs text-gray-400 mt-3">
            By continuing you agree to our Terms &amp; Conditions and Privacy Policy
          </p>
        </div>

        {/* Right: Illustration panel */}
        <div className="hidden md:flex flex-col items-center justify-center w-80 relative overflow-hidden"
          style={{ background: "linear-gradient(160deg, #ede9fe 0%, #ddd6fe 40%, #f5d0fe 100%)" }}
        >
          {/* Decorative dots */}
          <div className="absolute top-6 right-6 w-3 h-3 bg-violet-400/40 rounded-full" />
          <div className="absolute top-16 left-8 w-2 h-2 bg-pink-400/50 rounded-full" />
          <div className="absolute bottom-16 right-8 w-2 h-2 bg-purple-400/40 rounded-full" />
          <div className="absolute bottom-8 left-6 w-3 h-3 bg-fuchsia-400/30 rounded-full" />

          {/* Robot mascot SVG */}
          <div className="relative mb-6">
            <div className="w-48 h-48 flex items-center justify-center">
              <svg viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xl">
                {/* Body */}
                <rect x="50" y="100" width="100" height="80" rx="20" fill="white" fillOpacity="0.9" />
                <rect x="55" y="105" width="90" height="70" rx="16" fill="url(#bodyGrad)" />
                {/* Head */}
                <rect x="45" y="40" width="110" height="70" rx="22" fill="white" fillOpacity="0.95" />
                <rect x="50" y="45" width="100" height="60" rx="18" fill="url(#headGrad)" />
                {/* Eyes */}
                <circle cx="78" cy="72" r="14" fill="white" />
                <circle cx="122" cy="72" r="14" fill="white" />
                <circle cx="78" cy="72" r="8" fill="#2563eb" />
                <circle cx="122" cy="72" r="8" fill="#2563eb" />
                <circle cx="81" cy="69" r="3" fill="white" />
                <circle cx="125" cy="69" r="3" fill="white" />
                {/* Smile */}
                <path d="M82 88 Q100 98 118 88" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" />
                {/* Antenna */}
                <line x1="100" y1="40" x2="100" y2="20" stroke="white" strokeWidth="3" strokeLinecap="round" />
                <circle cx="100" cy="16" r="6" fill="#c026d3" />
                {/* Arms */}
                <rect x="15" y="110" width="35" height="18" rx="9" fill="white" fillOpacity="0.85" />
                <rect x="150" y="110" width="35" height="18" rx="9" fill="white" fillOpacity="0.85" />
                {/* Gift box held */}
                <rect x="158" y="90" width="26" height="22" rx="4" fill="#f0abfc" />
                <rect x="158" y="90" width="26" height="8" rx="4" fill="#c026d3" />
                <line x1="171" y1="90" x2="171" y2="112" stroke="#c026d3" strokeWidth="2" />
                {/* Chest screen */}
                <rect x="72" y="120" width="56" height="36" rx="8" fill="white" fillOpacity="0.3" />
                <circle cx="84" cy="133" r="5" fill="#7c3aed" fillOpacity="0.6" />
                <circle cx="100" cy="133" r="5" fill="#a855f7" fillOpacity="0.6" />
                <circle cx="116" cy="133" r="5" fill="#c026d3" fillOpacity="0.6" />
                {/* Feet */}
                <rect x="65" y="175" width="28" height="16" rx="8" fill="white" fillOpacity="0.7" />
                <rect x="107" y="175" width="28" height="16" rx="8" fill="white" fillOpacity="0.7" />
                <defs>
                  <linearGradient id="bodyGrad" x1="50" y1="100" x2="150" y2="180" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                  <linearGradient id="headGrad" x1="45" y1="40" x2="155" y2="110" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#7c3aed" />
                    <stop offset="100%" stopColor="#9333ea" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* Floating gift boxes */}
          <div className="absolute top-10 right-4 w-12 h-12 bg-white/60 rounded-xl shadow-sm flex items-center justify-center rotate-12">
            <Gift className="w-6 h-6 text-violet-500" />
          </div>
          <div className="absolute bottom-20 left-4 w-10 h-10 bg-white/60 rounded-xl shadow-sm flex items-center justify-center -rotate-12">
            <Gift className="w-5 h-5 text-pink-500" />
          </div>

          <p className="text-center text-sm font-medium text-violet-700 px-6 text-center leading-snug">
            Find the perfect gift for everyone you love
          </p>
        </div>
      </div>
    </div>
  );
}
