import { useEffect } from "react";
import { X, Camera, Scan } from "lucide-react";

interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
}

interface ARPreviewModalProps {
  product: Product | null;
  onClose: () => void;
}

export function handleARPreview(product: Product) {
  // TODO: integrate AR SDK here (future AI/AR team)
  // e.g., ARKit, AR.js, 8th Wall, or custom WebXR implementation
  console.log("AR Preview requested for product:", product.id, product.name);
}

export default function ARPreviewModal({ product, onClose }: ARPreviewModalProps) {
  useEffect(() => {
    if (!product) return;
    handleARPreview(product);
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [product, onClose]);

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      {/* Camera-like dark overlay */}
      <div className="absolute inset-0 bg-black/90" />

      {/* Corner viewfinder decorations */}
      <div className="absolute top-6 left-6 w-10 h-10 border-t-2 border-l-2 border-violet-400 rounded-tl-sm" />
      <div className="absolute top-6 right-6 w-10 h-10 border-t-2 border-r-2 border-violet-400 rounded-tr-sm" />
      <div className="absolute bottom-6 left-6 w-10 h-10 border-b-2 border-l-2 border-violet-400 rounded-bl-sm" />
      <div className="absolute bottom-6 right-6 w-10 h-10 border-b-2 border-r-2 border-violet-400 rounded-br-sm" />

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 py-4 z-10">
        <div className="flex items-center gap-2 text-violet-300">
          <Camera className="w-4 h-4" />
          <span className="text-sm font-medium">AR Preview</span>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center gap-6" onClick={(e) => e.stopPropagation()}>
        {/* Scanning ring animation */}
        <div className="relative flex items-center justify-center">
          <div className="absolute w-64 h-64 rounded-full border-2 border-violet-400/30 animate-ping" style={{ animationDuration: "2s" }} />
          <div className="absolute w-56 h-56 rounded-full border border-violet-400/50" />
          {/* Product image */}
          <div className="w-48 h-48 rounded-2xl overflow-hidden border-2 border-violet-400/60 shadow-2xl shadow-violet-500/20">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
          {/* Scan line animation */}
          <div className="absolute inset-0 flex items-start justify-center overflow-hidden rounded-2xl" style={{ width: 192, height: 192, margin: "auto" }}>
            <div
              className="w-full h-0.5 bg-gradient-to-r from-transparent via-violet-400 to-transparent"
              style={{
                animation: "scanline 2s ease-in-out infinite",
              }}
            />
          </div>
        </div>

        {/* Product info */}
        <div className="text-center">
          <p className="text-white font-semibold text-lg">{product.name}</p>
          <div className="flex items-center gap-2 justify-center mt-2">
            <Scan className="w-4 h-4 text-violet-400 animate-pulse" />
            <p className="text-violet-300 text-sm">Initializing AR Preview...</p>
          </div>
          <p className="text-gray-400 text-xs mt-1">AR integration coming soon</p>
        </div>

        {/* Bottom bar */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-colors border border-white/10"
          >
            Close Preview
          </button>
        </div>
      </div>

      <style>{`
        @keyframes scanline {
          0% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(192px); opacity: 0.8; }
          100% { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
