# 🧠 Nexium Summarizer

An AI-powered blog summarizer with Urdu translation — built using **Next.js**, **Supabase**, **Framer Motion**, and a beautiful **glassmorphism UI**.

---

## 🌐 Live Demo

[🔗 View on Vercel](https://nexium-blog-summariser.vercel.app/)

---

## 🚀 Features

- ✨ Paste a blog URL and get an instant AI-generated summary
- 🌐 Urdu translation of the summary using a JS dictionary
- 📦 Save and view past summaries using Supabase
- ❌ Delete saved summaries
- 📱 Fully responsive design with dark mode
- 🎇 Animated particle background for aesthetic flair
- 🔍 Static logic for selected blog URLs for rapid prototyping

---

## 🛠️ Tech Stack

- **Frontend**: React (Next.js 14), Tailwind CSS, TypeScript
- **Backend**: Supabase (Database + API)
- **UI Enhancements**: Framer Motion, Lucide Icons, Shadcn UI
- **Styling**: Glassmorphism + Gradient background

---

## 📂 Folder Structure

<pre><code>```bash 📦src ┣ 📂app ┃ ┣ 📂api ┃ ┃ ┗ 📂save-content ┃ ┃ ┃ ┗ 📜route.ts ┃ ┣ 📜favicon.ico ┃ ┣ 📜globals.css ┃ ┣ 📜layout.tsx ┃ ┣ 📜page.tsx ┃ ┗ 📜providers.tsx ┣ 📂components ┃ ┣ 📂ui ┃ ┃ ┣ 📜BackgroundBlobs.tsx ┃ ┃ ┣ 📜button.tsx ┃ ┃ ┣ 📜card.tsx ┃ ┃ ┣ 📜input.tsx ┃ ┃ ┣ 📜SummarySkeleton.tsx ┃ ┃ ┗ 📜textarea.tsx ┃ ┣ 📜ParticlesBG.tsx ┃ ┗ 📜ThemeToggle.tsx ┗ 📂lib ┣ 📜mongodb.ts ┣ 📜supabase.ts ┗ 📜utils.ts ```</code></pre>

---

## 📦 Setup Instructions

```bash
# 1. Clone the repository
git clone https://github.com/beginnercodee/Nexium_Jamal_Assign2.git
cd nexium-summarizer

# 2. Install dependencies
pnpm install

# 3. Create a `.env.local` file with your Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key

# 4. Run locally
pnpm dev

Crafted with 💻 by Jamal Nadeem
**GitHub:**https://github.com/ • **LinkedIn:**https://www.linkedin.com/in/jamal-nadeem-488480252/