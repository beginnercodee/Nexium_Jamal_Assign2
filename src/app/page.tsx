"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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

// Fake AI summarizer
const summarizeBlog = (content: string) => {
  // Fake logic using first sentence
  const firstSentence = content.split(".")[0];
  return `${firstSentence.trim()}. (AI Summary)`;
};


// Urdu Translator
const translateToUrdu = (text: string): string => {
  return text
    .split(" ")
    .map((word) => {
      const cleanWord = word.toLowerCase().replace(/[^a-z]/g, "");
      return urduDict[cleanWord] || word;
    })
    .join(" ");
};

export default function Home() {
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [urduTranslation, setUrduTranslation] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simulated blog content (for future use)
    const fakeBlogContent = `
      Mindfulness has become a major focus in recent years. 
      It helps people manage stress, increase focus, and improve emotional health. 
      Daily mindfulness practices such as meditation or breathing exercises 
      can rewire your brain and create a more balanced life.
    `;

    const fakeSummary = summarizeBlog(fakeBlogContent);
    const translated = translateToUrdu(fakeSummary);

    setSummary(fakeSummary);
    setUrduTranslation(translated);
  };

  return (
    <main className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="w-full max-w-2xl space-y-6">
        <Card className="rounded-2xl shadow-xl backdrop-blur-md bg-white/80 dark:bg-black/40">
          <CardContent className="space-y-4 mt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="url"
                placeholder="Enter blog URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
              <Button type="submit" className="w-full">
                Summarize Blog
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
