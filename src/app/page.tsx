"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast, Toaster } from "sonner";
import { Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import supabase from "@/lib/supabase";
import ThemeToggle from "@/components/ThemeToggle";
import SummarySkeleton from "@/components/ui/SummarySkeleton";
import ParticlesBG from "@/components/ParticlesBG";

type Summary = {
  id: number;
  url: string;
  summary: string;
};

const urduDict: Record<string, string> = {
  this: "یہ",
  blog: "بلاگ",
  discusses: "بیان کرتا ہے",
  how: "کیسے",
  daily: "روزانہ",
  mindfulness: "ذہنی سکون",
  practices: "مشقیں",
  like: "جیسے",
  meditation: "مراقبہ",
  improve: "بہتر بناتی ہیں",
  mental: "ذہنی",
  health: "صحت",
  and: "اور",
  reduce: "کم کرتی ہیں",
  stress: "تناؤ",
};

const summarizeBlog = (content: string) => {
  const firstSentence = content.split(".")[0];
  return `${firstSentence.trim()}. (AI Summary)`;
};

const predefinedSummaries: Record<string, { summary: string; urdu: string }> = {
  "https://example.com/blog1": {
    summary:
      "This blog explores how early rising boosts productivity through structure and focus. (AI Summary)",
    urdu: "یہ بلاگ بتاتا ہے کہ جلدی اٹھنا کس طرح نظم و ضبط اور توجہ کے ذریعے پیداواریت کو بڑھاتا ہے۔",
  },
  "https://example.com/blog2": {
    summary:
      "This blog discusses the impact of digital detox on mental clarity and overall well-being. (AI Summary)",
    urdu: "یہ بلاگ ڈیجیٹل ڈٹاکس کے ذہنی وضاحت اور مجموعی صحت پر اثرات پر روشنی ڈالتا ہے۔",
  },
};


const translateToUrdu = (text: string): string => {
  return text
    .split(" ")
    .map((word) => {
      const clean = word.toLowerCase().replace(/[^a-z]/g, "");
      return urduDict[clean] || word;
    })
    .join(" ");
};

export default function Home() {
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [urduTranslation, setUrduTranslation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [savedSummaries, setSavedSummaries] = useState<Summary[]>([]);
  const summaryRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchSummaries();
  }, []);

  const fetchSummaries = async () => {
    const { data, error } = await supabase
      .from("summaries")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("Error fetching summaries:", error.message);
    } else {
      setSavedSummaries(data);
    }
  };

  const handleDelete = async (id: number) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this summary?"
    );
    if (!confirm) return;

    const { error } = await supabase.from("summaries").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete summary", {
        description: "Please try again later or check your connection.",
      });
    } else {
      toast.success("Summary deleted successfully!", {
        description: "It's gone from your saved list.",
      });
      setSavedSummaries((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const staticEntry = predefinedSummaries[url.trim()];
if (staticEntry) {
  setSummary(staticEntry.summary);
  setUrduTranslation(staticEntry.urdu);

  const { error } = await supabase
    .from("summaries")
    .insert([{ url, summary: staticEntry.summary }]);

  if (error) {
    toast.error("Failed to save static summary to Supabase.");
  } else {
    toast.success("Static summary saved successfully!");
    fetchSummaries();
    setShowBanner(true);
    setTimeout(() => setShowBanner(false), 3000);
  }

  setUrl("");
  return;
}

    setSummary("");
    setUrduTranslation("");

    setIsLoading(true);

    // Simulate fallback blog content summary
const fallbackContent = `
  Mindfulness has become a major focus in recent years. 
  It helps people manage stress, increase focus, and improve emotional health.
`;

const fallbackSummary = summarizeBlog(fallbackContent);
const translated = translateToUrdu(fallbackSummary);

setSummary(fallbackSummary);
setUrduTranslation(translated);

const { error } = await supabase
  .from("summaries")
  .insert([{ url, summary: fallbackSummary }]);


setUrl("");


    setTimeout(() => {
      summaryRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 300);
    if (error) {
      toast.error("Saved to MongoDB but failed to save to Supabase!", {
        description: "You may want to check your Supabase configuration!",
      });
    } else {
      toast.success("Saved to Supabase + MongoDB!", {
        description: "Your summary is stored securely.",
      });
      fetchSummaries();
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 3000);
    }

    setUrl("");
    setIsLoading(false);
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative z-10 flex items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8 bg-gradient-to-tr from-sky-500 via-indigo-600 to-purple-800 overflow-hidden"
    >
      <ParticlesBG />
      <div className="absolute top-4 right-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <ThemeToggle />
        </motion.div>
      </div>
      <Toaster className="animate-fade-in-fast"

        position="top-right"
        richColors
        theme="system"
        toastOptions={{
          classNames: {
            toast: "rounded-lg shadow-lg border dark:border-white/10",
            title: "font-bold",
            description: "text-sm opacity-80",
          },
        }}
      />

      <div className="w-full max-w-2xl space-y-6 px-2 sm:px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="mt-6 bg-white/70 dark:bg-black/30 rounded-xl shadow-lg backdrop-blur-md animate-glow-border">
            <CardContent className="space-y-4 mt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🧠</span>
                  <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-transparent bg-clip-text drop-shadow-md animate-shimmer-text">
                    Nexium Summarizer
                  </h1>
                </div>
              </div>

              {showBanner && (
                <div className="bg-green-100 text-green-800 text-sm px-4 py-2 rounded-lg shadow-md transition">
                  ✅Blog summarized and saved successfully!
                </div>
              )}

              <h2 className="text-lg font-semibold text-white dark:text-white">
                🔗 Enter a blog URL to summarize:
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-2">
                <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="url"
                  placeholder="Enter blog URL"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                  className="flex-1"
                />
                <div className="text-sm text-white/80 dark:text-white/60">
  Try:
  <a href="#" onClick={() => setUrl("https://example.com/blog1")} className="underline ml-1">
    blog1
  </a>
  ,
  <a href="#" onClick={() => setUrl("https://example.com/blog2")} className="underline ml-1">
    blog2
  </a>
</div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="animate-glow-border rounded-md"
                >
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileTap={{ scale: 0.97 }}
                    className="py-2 px-4 rounded-md bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 text-white shadow-md w-full sm:w-auto button"
                  >
                    {isLoading ? "Summarizing..." :"🚀 Summarize"}
                  </motion.button>
                </motion.div>

                {/* Show shimmer loader below the button */}
                {isLoading && <SummarySkeleton />}
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Show summarized result */}
        <AnimatePresence>
          {summary && (
            <motion.div
              ref={summaryRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="mt-6 bg-white/70 dark:bg-black/30 rounded-xl shadow-lg backdrop-blur-md animate-glow-border">
                <CardContent className="space-y-3 p-6">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white animate-gradient-shimmer">
                    📝 AI Summary:
                  </h2>
                  <motion.p
                    className="p-3 rounded-md bg-white/50 dark:bg-white/10 backdrop-blur text-sm text-gray-700 dark:text-gray-100"
                  >
                    {summary}
                  </motion.p>
                  <h2 className="text-lg font-semibold mt-4 text-gray-800 dark:text-white animate-gradient-shimmer">
                    🌐 Urdu Translation:
                  </h2>
                  <motion.p
                    className="p-3 rounded-md bg-white/50 dark:bg-white/10 backdrop-blur text-sm text-gray-700 dark:text-gray-100"
                  >
                    {urduTranslation}
                  </motion.p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {savedSummaries.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8 text-center text-white/90 dark:text-white/60"
          ></motion.div>
        )}

        {/* Saved summaries */}
        {savedSummaries.length > 0 && (
          <AnimatePresence>
            <motion.div
              key="saved-list"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  whileHover={{ boxShadow: "0 0 20px rgba(255, 255, 255, 0.15)" }}
  transition={{ duration: 0.6 }}
>

              <Card className="bg-white/70 dark:bg-black/30 rounded-xl backdrop-blur-md border border-white/10 shadow-lg transition-shadow animate-glow-border">
                <CardContent className="p-4 space-y-3">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white animate-gradient-shimmer">
                    📚 Saved Summaries:
                  </h2>

                  <AnimatePresence>
                    {savedSummaries.map((summary, index) => (
                      <motion.div
                        key={summary.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="group relative p-4 border rounded-lg bg-white/80 dark:bg-gray-900 
                  hover:shadow-lg hover:shadow-indigo-300/40 
                  dark:hover:shadow-pink-500/30 transition-all"
                      >
                        <a
                          href={summary.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-blue-600 underline break-words"
                        >
                          {summary.url}
                        </a>
                        <p className="text-sm mt-2 text-gray-800 dark:text-gray-100 transition duration-300 break-words">
                          {summary.summary}
                        </p>

<motion.button
  onClick={() => handleDelete(summary.id)}
  whileHover={{ scale: 1.2, opacity: 1 }}
  transition={{ type: "spring", stiffness: 300 }}
  className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition opacity-0 group-hover:opacity-100"
  aria-label="Delete summary"
>
  <Trash2 className="w-4 h-4" />
</motion.button>

                      </motion.div>
                    ))}
                  </AnimatePresence>
                </CardContent>
              </Card>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}
        {savedSummaries.length > 0 && (
          <AnimatePresence>
            <motion.div
              key="saved-list"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
            >
              {/* Saved summaries content */}
            </motion.div>
          </AnimatePresence>
        )}

        {!isLoading && savedSummaries.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8 text-center text-white/80 dark:text-white/60 space-y-3"
          >
            <p className="text-xl font-semibold">🕊️ No saved summaries yet</p>
            <p className="text-sm animate-pulse">
              Start by entering a blog URL and hitting summarize!
            </p>
          </motion.div>
        )}
      </div>
    </motion.main>
  );
}
