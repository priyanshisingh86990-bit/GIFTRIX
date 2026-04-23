import { getRecommendations } from "../ai/recommendation"
import { getPersonalizedFeed } from "../ai/personalized"
import products from "../data/products"
import { useState, useEffect } from "react";
import { Sparkles, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { cn } from "@/lib/utils";
import { products } from "@/data/products.ts";
const STEP_QUESTIONS = [
  {
    id: "relation",
    question: "Who is this gift for?",
    options: [
      { label: "Mom", value: "mother", emoji: "👩" },
      { label: "Dad", value: "father", emoji: "👨" },
      { label: "Girlfriend", value: "girlfriend", emoji: "💕" },
      { label: "Boyfriend", value: "boyfriend", emoji: "💑" },
      { label: "Wife", value: "wife", emoji: "👸" },
      { label: "Husband", value: "husband", emoji: "🤴" },
      { label: "Sister", value: "sister", emoji: "👧" },
      { label: "Brother", value: "brother", emoji: "👦" },
      { label: "Friend", value: "friend", emoji: "🤝" },
    ],
  },
  {
    id: "occasion",
    question: "What is the occasion?",
    options: [
      { label: "Birthday", value: "birthday", emoji: "🎂" },
      { label: "Anniversary", value: "anniversary", emoji: "💍" },
      { label: "Festive", value: "festive", emoji: "🪔" },
      { label: "Shaadi", value: "shaadi", emoji: "💒" },
      { label: "Just Because", value: "just because", emoji: "🎁" },
    ],
  },
  {
    id: "budget",
    question: "What is your budget?",
    options: [
      { label: "Under ₹500", value: "500", emoji: "💸" },
      { label: "₹500 – ₹1,500", value: "1500", emoji: "💵" },
      { label: "₹1,500 – ₹5,000", value: "5000", emoji: "💴" },
      { label: "Above ₹5,000", value: "9999999", emoji: "💎" },
    ],
  },
];

const allProducts=products;


type Answers = { relation?: string; occasion?: string; budget?: string };

export default function AiSuggestions() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [done, setDone] = useState(false);

  const budgetMax = parseInt(answers.budget || "9999999");
  const budgetMin = answers.budget === "500" ? 0 : answers.budget === "1500" ? 500 : answers.budget === "5000" ? 1500 : 5000;

  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!done) return;

    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        let filtered = Array.isArray(data) ? data : [];

        if (answers.relation) {
          filtered = filtered.filter((p) =>
            p.relations?.includes(answers.relation)
          );
        }

        if (answers.occasion) {
          filtered = filtered.filter((p) =>
            p.occasions?.includes(answers.occasion)
          );
        }

        filtered = filtered.filter(
          (p) => p.price >= budgetMin && p.price <= budgetMax
        );

        setProducts(filtered);
      })
      .catch(() => { });
  }, [done, answers]);

  function handleAnswer(key: string, value: string) {
    const newAnswers = { ...answers, [key]: value };
    setAnswers(newAnswers);
    if (step < STEP_QUESTIONS.length - 1) {
      setStep((s) => s + 1);
    } else {
      setDone(true);
    }
  }

  function restart() {
    setStep(0);
    setAnswers({});
    setDone(false);
  }

  const currentQuestion = STEP_QUESTIONS[step];
  const suggestions = getRecommendations(products, "Red Shoes")
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-2xl mb-3">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">AI Gift Suggestions</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Answer a few quick questions and we'll find the perfect gift
          </p>
        </div>

        {!done ? (
          <div>
            {/* Progress */}
            <div className="flex gap-2 mb-6">
              {STEP_QUESTIONS.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex-1 h-1.5 rounded-full transition-colors",
                    i <= step ? "bg-primary" : "bg-muted"
                  )}
                />
              ))}
            </div>

            {/* Question */}
            <h2 className="text-xl font-semibold text-foreground mb-4">{currentQuestion.question}</h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {currentQuestion.options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleAnswer(currentQuestion.id, opt.value)}
                  className="flex flex-col items-center gap-2 p-4 bg-card border border-card-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-center"
                >
                  <span className="text-3xl">{opt.emoji}</span>
                  <span className="text-sm font-medium text-foreground">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            {/* Results summary */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  {products.length} gift{products.length !== 1 ? "s" : ""} found
                </h2>
                <p className="text-sm text-muted-foreground capitalize">
                  For {answers.relation} · {answers.occasion} · Budget up to ₹{budgetMax === 9999999 ? "unlimited" : budgetMax.toLocaleString("en-IN")}
                </p>
              </div>
              <button
                onClick={restart}
                className="text-sm text-primary font-medium hover:underline flex items-center gap-1"
              >
                Start over
              </button>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-12 bg-card border border-border rounded-2xl">
                <p className="text-4xl mb-3">😕</p>
                <p className="font-medium text-foreground">No gifts found for this combination</p>
                <p className="text-sm text-muted-foreground mt-1">Try different options</p>
                <button
                  onClick={restart}
                  className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
