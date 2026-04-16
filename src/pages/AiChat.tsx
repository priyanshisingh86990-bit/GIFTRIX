import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Bot, User, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { cn } from "@/lib/utils";
import { products } from "@/data/products";

type ListProductsResponseItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  relations: string[];
  occasions: string[];
  tags: string[];
  keywords: string[];
};

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  products?: ListProductsResponseItem[];
};

const SUGGESTIONS = [
  "Gift for mom under ₹1000",
  "Best anniversary gift for wife",
  "Cute birthday gift for girlfriend",
  "Gift for dad who has everything",
  "Festive hamper under ₹2000",
];

const allProducts=products;

function parseGiftQuery(text: string, products: ListProductsResponseItem[]): {
  relation?: string;
  occasion?: string;
  maxPrice?: number;
} {
  const lower = text.toLowerCase();
  const relations = ["mother", "mom", "mum", "maa", "father", "dad", "papa", "girlfriend", "boyfriend", "wife", "husband", "sister", "brother", "friend", "family"];
  const occasions = ["birthday", "anniversary", "festive", "shaadi", "wedding", "diwali", "christmas", "rakhi"];

  let relation: string | undefined;
  let occasion: string | undefined;
  let maxPrice: number | undefined;

  for (const r of relations) {
    if (lower.includes(r)) {
      relation = r === "mom" || r === "mum" || r === "maa" ? "mother"
        : r === "dad" || r === "papa" ? "father"
          : r;
      break;
    }
  }

  for (const o of occasions) {
    if (lower.includes(o)) {
      occasion = o === "diwali" || o === "christmas" || o === "rakhi" ? "festive"
        : o === "wedding" ? "shaadi"
          : o;
      break;
    }
  }

  const priceMatch = lower.match(/(?:under|below|less than|upto|up to)\s*[₹rs.]?\s*(\d[\d,]*)/i);
  if (priceMatch) {
    maxPrice = parseInt(priceMatch[1].replace(/,/g, ""));
  }

  return { relation, occasion, maxPrice };
}

function generateResponse(
  query: string,
  products: ListProductsResponseItem[]
): { text: string; results: ListProductsResponseItem[] } {
  const { relation, occasion, maxPrice } = parseGiftQuery(query, products);

  let filtered = [...products];

  if (relation) {
    filtered = filtered.filter((p) =>
      p.relations.some((r) => r.toLowerCase().includes(relation.toLowerCase()))
    );
  }
  if (occasion) {
    filtered = filtered.filter((p) =>
      p.occasions.some((o) => o.toLowerCase().includes(occasion.toLowerCase()))
    );
  }
  if (maxPrice) {
    filtered = filtered.filter((p) => p.price <= maxPrice!);
  }

  // If no filters matched, do keyword search
  if (!relation && !occasion && !maxPrice) {
    const lower = query.toLowerCase();
    filtered = products.filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        p.keywords.some((k) => k.toLowerCase().includes(lower)) ||
        p.category.toLowerCase().includes(lower) ||
        p.tags.some((t) => t.toLowerCase().includes(lower))
    );
  }

  filtered = filtered.slice(0, 6);

  let text = "";
  if (filtered.length === 0) {
    text = "I couldn't find specific gifts for that query, but you can explore all gifts in the Explore section. Try being more specific — like 'gift for mom under ₹1000' or 'anniversary gift for wife'.";
  } else {
    const parts = [];
    if (relation) parts.push(`for ${relation}`);
    if (occasion) parts.push(`for ${occasion}`);
    if (maxPrice) parts.push(`under ₹${maxPrice.toLocaleString("en-IN")}`);
    const desc = parts.length ? parts.join(", ") : "matching your query";
    text = `Here are ${filtered.length} great gift ideas ${desc}:`;
  }

  return { text, results: filtered };
}

export default function AiChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Hello! I'm your AI gift assistant. Tell me who you're shopping for, the occasion, and your budget — and I'll find the perfect gift ideas for you.",
    },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const [products, setProducts] = useState<ListProductsResponseItem[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => { });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend(text?: string) {
    const query = text ?? input.trim();
    if (!query) return;
    setInput("");

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text: query,
    };

    const { text: responseText, results } = generateResponse(query, products);

    const assistantMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      text: responseText,
      products: results.length > 0 ? results : undefined,
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
  }

  return (
    <div className="min-h-screen bg-background flex flex-col pb-14 md:pb-0">
      <Navbar />

      {/* Header */}
      <div className="border-b border-border bg-card/50 px-4 py-3 flex items-center gap-3">
        <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center">
          <Bot className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Gift AI</p>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            <p className="text-xs text-muted-foreground">Online</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "flex-row")}>
            {/* Avatar */}
            <div className={cn(
              "w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center",
              msg.role === "assistant" ? "bg-primary/10" : "bg-muted"
            )}>
              {msg.role === "assistant" ? (
                <Sparkles className="w-4 h-4 text-primary" />
              ) : (
                <User className="w-4 h-4 text-muted-foreground" />
              )}
            </div>

            <div className={cn("max-w-[80%] space-y-3", msg.role === "user" ? "items-end" : "items-start")}>
              <div className={cn(
                "px-4 py-2.5 rounded-2xl text-sm",
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-tr-sm"
                  : "bg-card border border-border text-foreground rounded-tl-sm"
              )}>
                {msg.text}
              </div>

              {msg.products && msg.products.length > 0 && (
                <div className="grid grid-cols-2 gap-2 w-full max-w-sm">
                  {msg.products.slice(0, 4).map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="px-4 py-2">
          <p className="text-xs text-muted-foreground mb-2">Try asking:</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => handleSend(s)}
                className="flex-shrink-0 px-3 py-1.5 text-xs bg-card border border-border rounded-full text-foreground hover:border-primary hover:bg-primary/5 transition-colors whitespace-nowrap"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-4 py-3 border-t border-border bg-background">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ask me for gift ideas..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 px-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="p-2.5 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
