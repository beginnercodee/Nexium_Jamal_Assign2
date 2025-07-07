"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [urduTranslation, setUrduTranslation] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simulated summary
    const fakeSummary =
      "This blog discusses the impact of mindfulness on productivity and how daily practices can rewire your brain.";
    const fakeTranslation =
      "یہ بلاگ ذہنی سکون کے اثرات اور روزمرہ مشقوں سے دماغ میں تبدیلی پر روشنی ڈالتا ہے۔";

    setSummary(fakeSummary);
    setUrduTranslation(fakeTranslation);
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
              <h2 className="text-lg font-semibold mt-4">🌐 Urdu Translation:</h2>
              <p>{urduTranslation}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
