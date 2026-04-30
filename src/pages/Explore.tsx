import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { products } from "@/data/products.ts";
import { Search, X, Mic, ChevronRight, ChevronDown, ChevronUp, Star, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { cn } from "@/lib/utils";

const PRICE_RANGES = [
  { label: "Below ₹500", min: 0, max: 500 },
  { label: "₹500 – ₹1,000", min: 500, max: 1000 },
  { label: "₹1,000 – ₹2,000", min: 1000, max: 2000 },
  { label: "Above ₹2,000", min: 2000, max: 999999 },
];

const SIDEBAR_RELATIONS = [
  { label: "For Him", value: "husband" },
  { label: "For Her", value: "wife" },
  { label: "For Kids", value: "sister" },
  { label: "For Parents", value: "mother" },
];

const SIDEBAR_OCCASIONS = [
  { label: "Birthday", value: "birthday" },
  { label: "Anniversary", value: "anniversary" },
  { label: "Festive", value: "festive" },
  { label: "Shaadi", value: "shaadi" },
];

const CATEGORY_META: Record<string, { icon: string; bg: string }> = {
  "fashion":        { icon: "👗", bg: "from-pink-100 to-rose-50" },
  "accessories":    { icon: "💍", bg: "from-violet-100 to-purple-50" },
  "beauty":         { icon: "💄", bg: "from-fuchsia-100 to-pink-50" },
  "cute gifts":     { icon: "🧸", bg: "from-amber-100 to-yellow-50" },
  "food":           { icon: "🍫", bg: "from-orange-100 to-amber-50" },
  "home decor":     { icon: "🏡", bg: "from-teal-100 to-emerald-50" },
  "surprise gifts": { icon: "🎉", bg: "from-blue-100 to-indigo-50" },
  "men":            { icon: "🎩", bg: "from-slate-100 to-gray-50" },
};

const SPECIAL_OFFERS = [
  { label: "For Him",     relation: "husband",  bg: "from-blue-400 to-indigo-500",   emoji: "🎩" },
  { label: "For Her",     relation: "wife",     bg: "from-pink-400 to-rose-500",     emoji: "👒" },
  { label: "For Parents", relation: "mother",   bg: "from-violet-400 to-purple-500", emoji: "👨‍👩‍👧" },
];

type Filters = {
  category?: string;
  relation?: string;
  occasion?: string;
  minPrice?: number;
  maxPrice?: number;
  tag?: string;
};

const allProducts=products;

function CheckItem({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group py-0.5">
      <div
        onClick={onChange}
        className={cn(
          "w-4 h-4 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0",
          checked ? "bg-violet-600 border-violet-600" : "border-gray-300 group-hover:border-violet-400"
        )}
      >
        {checked && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10"><path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
      </div>
      <span className="text-sm text-gray-700 group-hover:text-gray-900">{label}</span>
    </label>
  );
}

function FilterSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-violet-100 pb-4 mb-4 last:border-0 last:mb-0 last:pb-0">
      <button onClick={() => setOpen((v) => !v)} className="flex items-center justify-between w-full mb-3">
        <span className="font-semibold text-gray-800 text-sm">{title}</span>
        {open ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
      </button>
      {open && <div className="space-y-1.5">{children}</div>}
    </div>
  );
}

export default function Explore() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filters, setFilters] = useState<Filters>({});
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const newFilters: Filters = {};
    if (params.get("category")) newFilters.category = params.get("category")!;
    if (params.get("relation")) newFilters.relation = params.get("relation")!;
    if (params.get("occasion")) newFilters.occasion = params.get("occasion")!;
    if (params.get("tag")) newFilters.tag = params.get("tag")!;
    if (params.get("q")) setSearch(params.get("q")!);
    setFilters(newFilters);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);


  const [allProducts, setAllProducts] = useState<any[]>([]);
const [isLoading, setIsLoading] = useState(false);

useEffect(() => {
  setIsLoading(true);
  fetch("/api/products")
    .then((res) => res.json())
    .then((data) => {
      setAllProducts(Array.isArray(data) ? data : []);
      setIsLoading(false);
    })
    .catch(() => setIsLoading(false));
}, []);
  const filteredProducts = products;
const recommended = allProducts.slice(0, 4);
const categories = [
  { name: "fashion" },
  { name: "accessories" },
  { name: "beauty" },
  { name: "home decor" },
];

  const hasActiveFilters = Object.values(filters).some((v) => v !== undefined) || debouncedSearch.length > 1;

  function handleVoiceSearch() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) { alert("Voice search is not supported in your browser."); return; }
    if (listening) { recognitionRef.current?.stop(); setListening(false); return; }
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.onstart = () => setListening(true);
    recognition.onresult = (e: any) => { setSearch(e.results[0][0].transcript); setListening(false); };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognition.start();
  }

  function toggleRelation(value: string) {
    setFilters((p) => ({ ...p, relation: p.relation === value ? undefined : value }));
  }

  function toggleOccasion(value: string) {
    setFilters((p) => ({ ...p, occasion: p.occasion === value ? undefined : value }));
  }

  function togglePrice(min: number, max: number) {
    setFilters((p) =>
      p.minPrice === min && p.maxPrice === max
        ? { ...p, minPrice: undefined, maxPrice: undefined }
        : { ...p, minPrice: min, maxPrice: max }
    );
  }

  function clearFilters() {
    setFilters({});
    setSearch("");
  }

  const topCategories = categories.filter((c) => c.name.toLowerCase() !== "gifts").slice(0, 6);

  return (
    <div className="min-h-screen pb-20 md:pb-0" style={{ background: "linear-gradient(180deg, #faf5ff 0%, #f5f3ff 50%, #fdf4ff 100%)" }}>
      <Navbar />

      {/* Hero Banner */}
      <div className="mx-3 mt-3 sm:mx-6 sm:mt-4 rounded-2xl overflow-hidden relative"
        style={{ background: "linear-gradient(135deg, #6d28d9 0%, #7c3aed 35%, #9333ea 65%, #a855f7 100%)", minHeight: 140 }}
      >
        {/* Background sparkles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-3 left-10 w-1.5 h-1.5 bg-yellow-300/70 rounded-full" />
          <div className="absolute top-8 left-1/3 w-1 h-1 bg-white/50 rounded-full" />
          <div className="absolute bottom-6 left-1/4 w-2 h-2 bg-pink-300/60 rounded-full" />
          <div className="absolute top-4 right-1/3 w-1.5 h-1.5 bg-yellow-200/60 rounded-full" />
          <div className="absolute bottom-4 right-24 w-1 h-1 bg-white/50 rounded-full" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.12)_0%,_transparent_60%)]" />
        </div>

        <div className="relative flex items-center px-6 sm:px-10 py-7 gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">
              Explore<br />Amazing Gifts!
            </h1>
            <button
              onClick={clearFilters}
              className="px-5 py-2 rounded-xl font-bold text-sm cursor-pointer hover:opacity-90 transition-opacity shadow-lg"
              style={{ background: "linear-gradient(135deg, #f59e0b, #fbbf24)" }}
            >
              Shop Now
            </button>
          </div>

          {/* Illustration area */}
          <div className="hidden sm:flex items-center justify-center flex-shrink-0 gap-3 pr-2">
            {/* Floating objects */}
            <div className="relative">
              <div className="text-5xl drop-shadow-lg">🧸</div>
              <div className="absolute -top-3 -right-2 text-2xl">🎈</div>
            </div>
            <div className="relative">
              <div className="text-4xl drop-shadow-lg">🎁</div>
              <div className="absolute -top-2 -left-2 text-xl">🎀</div>
            </div>
            {/* Robot mascot */}
            <div className="w-20 h-20 md:w-28 md:h-28 drop-shadow-2xl">
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
                <rect x="18" y="108" width="32" height="16" rx="8" fill="white" fillOpacity="0.4"/>
                <rect x="150" y="108" width="32" height="16" rx="8" fill="white" fillOpacity="0.4"/>
                <rect x="70" y="118" width="60" height="36" rx="10" fill="white" fillOpacity="0.15"/>
                <circle cx="84" cy="132" r="5" fill="white" fillOpacity="0.5"/>
                <circle cx="100" cy="132" r="5" fill="white" fillOpacity="0.6"/>
                <circle cx="116" cy="132" r="5" fill="white" fillOpacity="0.5"/>
                <rect x="63" y="174" width="30" height="15" rx="7.5" fill="white" fillOpacity="0.4"/>
                <rect x="107" y="174" width="30" height="15" rx="7.5" fill="white" fillOpacity="0.4"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Search bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 mt-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search gifts by name, occasion, or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-10 py-3 bg-white border border-violet-100 rounded-xl text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 transition-all"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            onClick={handleVoiceSearch}
            className={cn(
              "px-3.5 rounded-xl border shadow-sm transition-colors",
              listening ? "bg-red-500 border-red-500 text-white" : "bg-white border-violet-100 text-gray-500 hover:border-violet-300"
            )}
            title={listening ? "Stop" : "Voice search"}
          >
            <Mic className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main layout: sidebar + content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 flex gap-5 items-start">

        {/* Left sidebar filters */}
        <aside className="hidden md:block w-52 flex-shrink-0 bg-white rounded-2xl shadow-sm border border-violet-100 p-4 sticky top-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-500" />
              <span className="font-bold text-gray-800 text-sm">Filters</span>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>

          {/* Price */}
          <FilterSection title="Price">
            {PRICE_RANGES.map((r) => (
              <CheckItem
                key={r.label}
                label={r.label}
                checked={filters.minPrice === r.min && filters.maxPrice === r.max}
                onChange={() => togglePrice(r.min, r.max)}
              />
            ))}
          </FilterSection>

          {/* Relation */}
          <FilterSection title="Relation">
            {SIDEBAR_RELATIONS.map((r) => (
              <CheckItem
                key={r.value}
                label={r.label}
                checked={filters.relation === r.value}
                onChange={() => toggleRelation(r.value)}
              />
            ))}
          </FilterSection>

          {/* Occasion */}
          <FilterSection title="Occasion">
            {SIDEBAR_OCCASIONS.map((o) => (
              <CheckItem
                key={o.value}
                label={o.label}
                checked={filters.occasion === o.value}
                onChange={() => toggleOccasion(o.value)}
              />
            ))}
          </FilterSection>

          {/* Clear All */}
          {(Object.values(filters).some((v) => v !== undefined)) && (
            <button
              onClick={clearFilters}
              className="w-full mt-1 py-2 text-sm font-semibold text-violet-600 border border-violet-200 rounded-xl hover:bg-violet-50 transition-colors"
            >
              Clear All
            </button>
          )}
        </aside>

        {/* Content area */}
        <div className="flex-1 min-w-0">

          {hasActiveFilters ? (
            /* ── Filtered / Search results view ── */
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-500">
                  {isLoading ? "Finding gifts..." : `${products.length} gifts found`}
                  {debouncedSearch.length > 1 && ` for "${debouncedSearch}"`}
                </p>
                <button onClick={clearFilters} className="text-xs font-semibold text-violet-600 flex items-center gap-1 hover:underline">
                  <X className="w-3 h-3" /> Clear filters
                </button>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-xl overflow-hidden animate-pulse shadow-sm">
                      <div className="aspect-[4/5] bg-violet-50" />
                      <div className="p-3 space-y-2">
                        <div className="h-3 bg-violet-50 rounded w-2/3" />
                        <div className="h-4 bg-violet-50 rounded" />
                        <div className="h-3 bg-violet-50 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-4xl mb-3">🎁</p>
                  <p className="font-semibold text-gray-800">No gifts found</p>
                  <p className="text-sm text-gray-500 mt-1">Try a different search or adjust filters</p>
                  <button onClick={clearFilters} className="mt-4 px-5 py-2 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </>
          ) : (
            /* ── Default discovery view ── */
            <>
              {/* Shop by Category */}
              {topCategories.length > 0 && (
                <section className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="font-bold text-gray-900 text-base">Shop by Category</h2>
                    <Link href="#" onClick={() => setFilters({})}>
                      <div className="text-sm font-semibold text-violet-600 flex items-center gap-0.5 cursor-pointer hover:underline">
                        View All <ChevronRight className="w-4 h-4" />
                      </div>
                    </Link>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {topCategories.map((cat) => {
                      const key = Object.keys(CATEGORY_META).find((k) => cat.name.toLowerCase().includes(k));
                      const meta = key ? CATEGORY_META[key] : { icon: "🎁", bg: "from-gray-100 to-gray-50" };
                      return (
                        <button
                          key={cat.name}
                          onClick={() => setFilters({ category: cat.name })}
                          className={cn(
                            "flex flex-col items-center gap-1.5 p-3 bg-gradient-to-br rounded-xl border border-white/60 shadow-sm hover:shadow-md transition-all cursor-pointer",
                            meta.bg
                          )}
                        >
                          <span className="text-2xl">{meta.icon}</span>
                          <span className="text-xs font-semibold text-gray-700 capitalize text-center leading-tight">{cat.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Recommended Gifts */}
              {recommended.length > 0 && (
                <section className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="font-bold text-gray-900 text-base">Recommended Gifts</h2>
                    <Link href="#" onClick={() => setFilters({ tag: "premium" })}>
                      <div className="text-sm font-semibold text-violet-600 flex items-center gap-0.5 cursor-pointer hover:underline">
                        View All <ChevronRight className="w-4 h-4" />
                      </div>
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {recommended.slice(0, 4).map((product) => (
                      <div key={product.id} className="relative">
                        {/* AI badge */}
                        <div className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-violet-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                          <Sparkles className="w-2.5 h-2.5" />
                          AI Recommended
                        </div>
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Special Offers */}
              <section className="mb-4">
                <h2 className="font-bold text-gray-900 text-base mb-3">Special Offers</h2>
                <div className="grid grid-cols-3 gap-3">
                  {SPECIAL_OFFERS.map((offer) => (
                    <button
                      key={offer.relation}
                      onClick={() => setFilters({ relation: offer.relation })}
                      className={cn(
                        "relative rounded-2xl overflow-hidden aspect-[4/3] bg-gradient-to-br flex flex-col items-start justify-end p-4 cursor-pointer hover:opacity-90 transition-opacity shadow-md",
                        offer.bg
                      )}
                    >
                      {/* Sparkle decoration */}
                      <div className="absolute top-3 right-3 text-2xl opacity-70">{offer.emoji}</div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <span className="relative z-10 text-white font-bold text-sm drop-shadow">{offer.label}</span>
                    </button>
                  ))}
                </div>
              </section>

              {/* All products grid */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-bold text-gray-900 text-base">All Gifts</h2>
                  <p className="text-xs text-gray-400">{filteredProducts.length} items</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {filteredProducts.slice(0, 12).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                {filteredProducts.length > 12 && (
                  <div className="text-center mt-4">
                    <button
                      onClick={() => setFilters({ category: "fashion" })}
                      className="px-6 py-2.5 border border-violet-300 text-violet-600 font-semibold text-sm rounded-xl hover:bg-violet-50 transition-colors"
                    >
                      View All {filteredProducts.length} Gifts
                    </button>
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </div>

      {/* Mobile filter bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-violet-100 px-4 py-3 flex gap-3 z-30">
        <div className="flex-1 flex gap-2 overflow-x-auto scrollbar-hide">
          {SIDEBAR_RELATIONS.map((r) => (
            <button
              key={r.value}
              onClick={() => toggleRelation(r.value)}
              className={cn(
                "flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors",
                filters.relation === r.value
                  ? "bg-violet-600 border-violet-600 text-white"
                  : "bg-white border-violet-200 text-gray-600"
              )}
            >
              {r.label}
            </button>
          ))}
          {SIDEBAR_OCCASIONS.map((o) => (
            <button
              key={o.value}
              onClick={() => toggleOccasion(o.value)}
              className={cn(
                "flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors",
                filters.occasion === o.value
                  ? "bg-violet-600 border-violet-600 text-white"
                  : "bg-white border-violet-200 text-gray-600"
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
        {Object.values(filters).some((v) => v !== undefined) && (
          <button onClick={clearFilters} className="flex-shrink-0 text-xs font-semibold text-violet-600 border border-violet-200 px-3 rounded-full">
            Clear
          </button>
        )}
      </div>
    </div>
  );
}