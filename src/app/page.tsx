"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast, Toaster } from "sonner";
import { Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import supabase from "@/lib/supabase";
import ThemeToggle from "@/components/ThemeToggle";
import SummarySkeleton from "@/components/ui/SummarySkeleton";

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
    const confirm = window.confirm("Are you sure you want to delete this summary?");
    if (!confirm) return;

    const { error } = await supabase.from("summaries").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete summary.");
    } else {
      toast.success("Deleted summary.");
      setSavedSummaries((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSummary("");
setUrduTranslation("");

    setIsLoading(true);

    const fakeBlogContent = `
      Mindfulness has become a major focus in recent years. 
      It helps people manage stress, increase focus, and improve emotional health. 
      Daily mindfulness practices such as meditation or breathing exercises 
      can rewire your brain and create a more balanced life.
    `;

    const res = await fetch("/api/save-content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, content: fakeBlogContent }),
    });

    if (!res.ok) {
      toast.error("Failed to save to MongoDB");
      setIsLoading(false);
      return;
    }

    const fakeSummary = summarizeBlog(fakeBlogContent);
    const translated = translateToUrdu(fakeSummary);
    setSummary(fakeSummary);
    setUrduTranslation(translated);

    const { error } = await supabase
      .from("summaries")
      .insert([{ url, summary: fakeSummary }]);

    if (error) {
      toast.error("Saved to MongoDB but failed to save to Supabase");
    } else {
      toast.success("Saved to MongoDB + Supabase!");
      fetchSummaries();
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 3000);
    }

    setUrl("");
    setIsLoading(false);
  };

  return (
    <main className="relative flex items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="absolute top-4 right-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <ThemeToggle />
        </motion.div>
      </div>
      <Toaster position="top-right" richColors />

      <div className="w-full max-w-2xl space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="rounded-2xl shadow-xl backdrop-blur-md bg-white/80 dark:bg-black/40">
            <CardContent className="space-y-4 mt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🧠</span>
                  <h1 className="text-2xl font-bold tracking-tight text-gray-800 dark:text-white">
                    Nexium Summarizer
                  </h1>
                </div>
              </div>

              {showBanner && (
                <div className="bg-green-100 text-green-800 text-sm px-4 py-2 rounded-lg shadow-md transition">
                  ✅ Blog summarized and saved successfully!
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="url"
                  placeholder="Enter blog URL"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                />

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full inline-flex items-center justify-center bg-black text-white py-2 px-4 rounded-md transition hover:bg-gray-800"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2 text-sm">Summarizing...</span>
                  ) : (
                    "Summarize Blog"
                  )}
                </motion.button>

                {/* Show shimmer loader below the button */}
                {isLoading && <SummarySkeleton />}
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Show summarized result */}
        {summary && (
  <Card className="mt-6 bg-white/70 dark:bg-black/30 rounded-xl">
    <CardContent className="space-y-3">
      <h2 className="text-lg font-semibold">📝 AI Summary:</h2>
      <p>{summary}</p>
      <h2 className="text-lg font-semibold mt-4">🌐 Urdu Translation:</h2>
      <p className="text-right font-noto text-base">
  {urduTranslation}
</p>
    </CardContent>
  </Card>
)}


        {/* Saved summaries */}
        {savedSummaries.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="mt-8 bg-white/70 dark:bg-black/30 rounded-xl">
              <CardContent className="p-4 space-y-3">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  📚 Saved Summaries:
                </h2>
                <AnimatePresence>
                  {savedSummaries.map((summary) => (
                    <motion.div
                      key={summary.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="group relative p-4 border rounded-lg bg-white/80 dark:bg-gray-900 hover:shadow-lg transition-all"
                    >
                      <a
                        href={summary.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-blue-600 underline break-words"
                      >
                        {summary.url}
                      </a>
                      <p className="text-sm mt-2 text-gray-800 dark:text-gray-100">
                        {summary.summary}
                      </p>

                      <button
                        onClick={() => handleDelete(summary.id)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition opacity-0 group-hover:opacity-100"
                        aria-label="Delete summary"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </main>
  );
}
