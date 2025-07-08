"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast, Toaster } from "sonner";
import { Loader2 } from "lucide-react";
import supabase from "@/lib/supabase";

// Urdu Dictionary
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

// Fake summarizer
const summarizeBlog = (content: string) => {
  const firstSentence = content.split(".")[0];
  return `${firstSentence.trim()}. (AI Summary)`;
};

// Urdu Translator
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const fakeBlogContent = `
      Mindfulness has become a major focus in recent years. 
      It helps people manage stress, increase focus, and improve emotional health. 
      Daily mindfulness practices such as meditation or breathing exercises 
      can rewire your brain and create a more balanced life.
    `;

    // Save content to MongoDB
    const res = await fetch("/api/save-content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, content: fakeBlogContent }),
    });

    if (!res.ok) {
      toast.error("Failed to save content to MongoDB.");
      setIsLoading(false);
      return;
    }

    const fakeSummary = summarizeBlog(fakeBlogContent);
    const translated = translateToUrdu(fakeSummary);
    setSummary(fakeSummary);
    setUrduTranslation(translated);

    // Save summary to Supabase
    const { error } = await supabase
      .from("summaries")
      .insert([{ url, summary: fakeSummary }]);

    if (error) {
      console.error("Supabase Error:", error.message);
      toast.error("Saved to MongoDB but failed to save to Supabase.");
    } else {
      toast.success("Saved to MongoDB + Supabase!");
      setShowBanner(true); // ← Show success banner
      setTimeout(() => setShowBanner(false), 3000); // ← Auto-hide after 3 seconds
    }

    setUrl("");
    setIsLoading(false);
  };

  return (
    <main className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <Toaster position="top-right" richColors />

      <div className="w-full max-w-2xl space-y-6">
        <Card className="rounded-2xl shadow-xl backdrop-blur-md bg-white/80 dark:bg-black/40">
          <CardContent className="space-y-4 mt-6">
            <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white">
              🧠 AI Blog Summarizer
            </h1>

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
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Summarizing...
                  </span>
                ) : (
                  "Summarize Blog"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {summary && (
          <Card>
            <CardContent className="mt-6 space-y-3">
              <h2 className="text-lg font-semibold">📝 AI Summary:</h2>
              <p>{summary}</p>
              <h2 className="text-lg font-semibold mt-4">
                🌐 Urdu Translation:
              </h2>
              <p>{urduTranslation}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
