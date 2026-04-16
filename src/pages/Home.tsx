

import {useState, useEffect} from "react";
import { Link } from "wouter";
import { products } from "@/data/products";
import { ChevronRight, Star, Sparkles, Gift } from "lucide-react";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";

const RELATIONS = [
  { label: "For Mom", value: "mother", icon: "👩" },
  { label: "For Dad", value: "father", icon: "👨" },
  { label: "For Girlfriend", value: "girlfriend", icon: "💕" },
  { label: "For Boyfriend", value: "boyfriend", icon: "💑" },
  { label: "For Wife", value: "wife", icon: "👸" },
  { label: "For Husband", value: "husband", icon: "🤴" },
  { label: "For Sister", value: "sister", icon: "👧" },
  { label: "For Brother", value: "brother", icon: "👦" },
  { label: "For Friend", value: "friend", icon: "🤝" },
];

const OCCASIONS = [
  { label: "Birthday", icon: "🎂", value: "birthday" },
  { label: "Anniversary", icon: "💍", value: "anniversary" },
  { label: "Festive", icon: "🪔", value: "festive" },
  { label: "Shaadi", icon: "💒", value: "shaadi" },
  { label: "Just Because", icon: "🎁", value: "just" },
];

interface ProductRowProps {
  title: string;
  emoji: string;
  products: ListProductsResponseItem[];
  viewAllHref: string;
  accent?: string;
}

function ProductRow({ title, emoji, products, viewAllHref, accent = "text-violet-600" }: ProductRowProps) {
  if (products.length === 0) return null;
  return (
    <section className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">{emoji}</span>
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        </div>
        <Link href={viewAllHref}>
          <div className={`text-sm font-semibold flex items-center gap-0.5 cursor-pointer hover:underline ${accent}`}>
            See all <ChevronRight className="w-4 h-4" />
          </div>
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {products.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export default function Home() {
 const [allProducts,setAllProducts]  = useState (products);
const [recommended,setRecommended] = useState (products.slice(0, 4));
const [loading, setLoading] = useState(false);


  // Build non-overlapping sections — each product only appears once
  const usedIds = new Set<number>();

  const premiumProducts = recommended.slice(0, 4);
  premiumProducts.forEach((p) => usedIds.add(p.id));

  const pick = (filterFn: (p: typeof allProducts[0]) => boolean, limit = 4) => {
    const results: typeof allProducts = [];
    for (const p of allProducts) {
      if (!usedIds.has(p.id) && filterFn(p)) {
        results.push(p);
        usedIds.add(p.id);
        if (results.length >= limit) break;
      }
    }
    return results;
  };

  const herProducts = pick((p) =>
    p.category.toLowerCase().includes("women") ||
    (p.category.toLowerCase().includes("fashion") && !p.category.toLowerCase().includes("men"))
  );

  const himProducts = pick((p) =>
    p.category.toLowerCase().includes("men") && !p.category.toLowerCase().includes("women")
  );

  const cuteProducts = pick((p) =>
    p.category.toLowerCase().includes("cute")
  );

  const beautyProducts = pick((p) =>
    p.category.toLowerCase().includes("beauty")
  );

  const foodProducts = pick((p) =>
    p.category.toLowerCase().includes("food") ||
    p.category.toLowerCase().includes("surprise")
  );

  const homeProducts = pick((p) =>
    p.category.toLowerCase().includes("home decor")
  );

  return (
    <div className="min-h-screen pb-16 md:pb-0" style={{ background: "linear-gradient(180deg, #faf5ff 0%, #f5f3ff 30%, #fdf4ff 60%, #fff7ed 100%)" }}>
      <Navbar />

      {/* Hero Banner */}
      <section className="relative overflow-hidden mx-4 mt-4 rounded-2xl sm:mx-6 lg:mx-8"
        style={{ background: "linear-gradient(135deg, #7c3aed 0%, #9333ea 40%, #c026d3 70%, #db2777 100%)" }}
      >
        {/* Sparkle dots */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-4 left-10 w-1.5 h-1.5 bg-white/50 rounded-full" />
          <div className="absolute top-10 left-1/4 w-1 h-1 bg-white/40 rounded-full" />
          <div className="absolute top-6 right-1/3 w-2 h-2 bg-yellow-200/60 rounded-full" />
          <div className="absolute bottom-8 left-1/3 w-1.5 h-1.5 bg-white/50 rounded-full" />
          <div className="absolute top-1/2 right-12 w-1 h-1 bg-pink-200/70 rounded-full" />
          <div className="absolute bottom-12 right-1/4 w-2 h-2 bg-white/30 rounded-full" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.15)_0%,_transparent_60%)]" />
        </div>

        <div className="relative flex items-center px-6 sm:px-10 py-8 sm:py-12 gap-6">
          {/* Text content */}
          <div className="flex-1 min-w-0">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-white mb-4">
              <Sparkles className="w-3 h-3" />
              AI-Powered Gift Discovery
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight mb-3">
              Find the Perfect Gift<br className="hidden sm:block" /> for Everyone
            </h1>
            <p className="text-white/80 text-sm sm:text-base mb-6 max-w-md">
              70+ curated Indian gifts across fashion, beauty, food, and home decor — for every relationship and budget.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link href="/explore">
                <div className="px-5 py-2.5 bg-white text-violet-700 font-bold rounded-xl text-sm cursor-pointer hover:bg-white/90 transition-colors shadow-lg">
                  Browse Gifts
                </div>
              </Link>
              <Link href="/ai-suggestions">
                <div className="px-5 py-2.5 bg-white/20 border border-white/30 text-white font-semibold rounded-xl text-sm cursor-pointer hover:bg-white/30 transition-colors backdrop-blur">
                  AI Picks for Me
                </div>
              </Link>
            </div>
          </div>

          {/* Robot mascot */}
          <div className="hidden sm:flex flex-shrink-0 items-center justify-center">
            <div className="relative">
              <div className="w-36 h-36 md:w-48 md:h-48 drop-shadow-2xl">
                <svg viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <rect x="50" y="100" width="100" height="80" rx="20" fill="white" fillOpacity="0.15"/>
                  <rect x="55" y="105" width="90" height="70" rx="16" fill="white" fillOpacity="0.25"/>
                  <rect x="45" y="40" width="110" height="70" rx="22" fill="white" fillOpacity="0.9"/>
                  <circle cx="78" cy="70" r="14" fill="white"/>
                  <circle cx="122" cy="70" r="14" fill="white"/>
                  <circle cx="78" cy="70" r="8" fill="#2563eb"/>
                  <circle cx="122" cy="70" r="8" fill="#2563eb"/>
                  <circle cx="81" cy="67" r="3" fill="white"/>
                  <circle cx="125" cy="67" r="3" fill="white"/>
                  <path d="M82 86 Q100 96 118 86" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                  <line x1="100" y1="40" x2="100" y2="22" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                  <circle cx="100" cy="18" r="6" fill="#fbbf24"/>
                  <rect x="15" y="108" width="35" height="18" rx="9" fill="white" fillOpacity="0.4"/>
                  <rect x="150" y="108" width="35" height="18" rx="9" fill="white" fillOpacity="0.4"/>
                  <rect x="155" y="88" width="28" height="22" rx="5" fill="#fce7f3"/>
                  <rect x="155" y="88" width="28" height="9" rx="5" fill="#ec4899"/>
                  <line x1="169" y1="88" x2="169" y2="110" stroke="#ec4899" strokeWidth="2"/>
                  <rect x="70" y="118" width="60" height="38" rx="10" fill="white" fillOpacity="0.15"/>
                  <circle cx="84" cy="132" r="5" fill="white" fillOpacity="0.5"/>
                  <circle cx="100" cy="132" r="5" fill="white" fillOpacity="0.6"/>
                  <circle cx="116" cy="132" r="5" fill="white" fillOpacity="0.5"/>
                  <rect x="63" y="174" width="30" height="16" rx="8" fill="white" fillOpacity="0.4"/>
                  <rect x="107" y="174" width="30" height="16" rx="8" fill="white" fillOpacity="0.4"/>
                </svg>
              </div>
              {/* Floating hearts */}
              <div className="absolute -top-2 -right-2 text-lg animate-bounce">💜</div>
              <div className="absolute -bottom-1 -left-3 text-sm">🎁</div>
            </div>
          </div>
        </div>
      </section>

      {/* Occasion pills */}
      <section className="max-w-7xl mx-auto px-4 pt-6">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {OCCASIONS.map((occ) => (
            <Link key={occ.value} href={`/explore?occasion=${occ.value}`}>
              <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-white border border-violet-100 rounded-full text-sm font-medium text-gray-700 hover:bg-violet-50 hover:border-violet-300 hover:text-violet-700 shadow-sm transition-colors cursor-pointer whitespace-nowrap">
                <span>{occ.icon}</span>
                {occ.label}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Shop by Relation */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Shop By Relation</h2>
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
          {RELATIONS.map((rel) => (
            <Link key={rel.value} href={`/explore?relation=${rel.value}`}>
              <div className="flex flex-col items-center gap-1.5 p-3 bg-white border border-violet-100 rounded-xl hover:bg-violet-50 hover:border-violet-300 shadow-sm transition-all cursor-pointer text-center">
                <span className="text-2xl">{rel.icon}</span>
                <span className="text-xs font-semibold text-gray-700 leading-tight">{rel.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Premium Picks */}
      {premiumProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <h2 className="text-lg font-bold text-gray-900">Premium Picks</h2>
            </div>
            <Link href="/explore?tag=premium">
              <div className="text-sm font-semibold text-violet-600 flex items-center gap-0.5 cursor-pointer hover:underline">
                See all <ChevronRight className="w-4 h-4" />
              </div>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {premiumProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* For Her */}
      <ProductRow
        title="Gifts for Her"
        emoji="👒"
        products={herProducts}
        viewAllHref="/explore?relation=girlfriend"
        accent="text-pink-600"
      />

      {/* For Him */}
      <ProductRow
        title="Gifts for Him"
        emoji="🎩"
        products={himProducts}
        viewAllHref="/explore?relation=husband"
        accent="text-blue-600"
      />

      {/* Cute Gifts */}
      <ProductRow
        title="Cute Gifts"
        emoji="🧸"
        products={cuteProducts}
        viewAllHref="/explore?category=cute%20gifts"
        accent="text-amber-600"
      />

      {/* Beauty & Care */}
      <ProductRow
        title="Beauty and Self Care"
        emoji="💄"
        products={beautyProducts}
        viewAllHref="/explore?category=beauty"
        accent="text-fuchsia-600"
      />

      {/* Sweet Hampers */}
      <ProductRow
        title="Sweet Hampers and Food Gifts"
        emoji="🍫"
        products={foodProducts}
        viewAllHref="/explore?category=food"
        accent="text-orange-600"
      />

      {/* Home Decor */}
      <ProductRow
        title="Home Decor Gifts"
        emoji="🏡"
        products={homeProducts}
        viewAllHref="/explore?category=home%20decor"
        accent="text-teal-600"
      />

      {/* AI Banner */}
      <section className="max-w-7xl mx-auto px-4 py-6 pb-8">
        <div className="relative rounded-2xl overflow-hidden p-6 sm:p-8 flex items-center gap-6"
          style={{ background: "linear-gradient(135deg, #ede9fe 0%, #fce7f3 100%)" }}
        >
          <div className="flex-1">
            <div className="text-2xl mb-2">🤖</div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Not sure what to gift?</h3>
            <p className="text-gray-600 text-sm mb-4">Let our AI find the perfect gift based on your budget and relationship.</p>
            <div className="flex gap-2 flex-wrap">
              <Link href="/ai-suggestions">
                <div className="px-4 py-2 rounded-xl text-sm font-semibold text-white cursor-pointer hover:opacity-90 transition-opacity"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #c026d3)" }}
                >
                  AI Gift Finder
                </div>
              </Link>
              <Link href="/ai-chat">
                <div className="px-4 py-2 rounded-xl text-sm font-semibold text-violet-700 bg-white border border-violet-200 cursor-pointer hover:bg-violet-50 transition-colors">
                  Chat with AI
                </div>
              </Link>
            </div>
          </div>
          <div className="hidden sm:block text-6xl flex-shrink-0">🎁</div>
        </div>
      </section>
    </div>
  );
}
