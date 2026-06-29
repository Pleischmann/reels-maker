"use client";

import { useState } from "react";

interface ArticleData {
  title: string;
  description: string;
  image: string;
  url: string;
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [article, setArticle] = useState<ArticleData | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setArticle(null);
    setCopied(false);

    if (!url.includes("magazif.com")) {
      setError("Wklej link do artykułu z magazif.com");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/fetch-article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (!res.ok) throw new Error("Nie udało się pobrać artykułu");
      const data = await res.json();
      setArticle(data);
    } catch {
      setError("Nie udało się pobrać artykułu. Sprawdź link i spróbuj ponownie.");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (!article) return;
    navigator.clipboard.writeText(`/reels ${article.url}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-col flex-1 items-center px-4 py-12 sm:py-20">
      <header className="text-center mb-12">
        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full border border-[var(--card-border)] text-xs tracking-widest uppercase text-[var(--muted)]">
          MAGAZIF
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          Reels <span className="text-[var(--accent)]">Maker</span>
        </h1>
        <p className="text-[var(--muted)] max-w-md mx-auto text-lg">
          Wklej link do artykułu MAGAZIF — wygeneruj pakiet produkcyjny do rolki na Instagram i Facebook.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="w-full max-w-xl mb-8">
        <div className="flex gap-3">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://magazif.com/..."
            required
            className="flex-1 px-4 py-3 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-[var(--accent)] text-black font-semibold hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {loading ? "Pobieram..." : "Pobierz"}
          </button>
        </div>
        {error && (
          <p className="mt-3 text-red-400 text-sm">{error}</p>
        )}
      </form>

      {article && (
        <div className="w-full max-w-xl rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] overflow-hidden">
          {article.image && (
            <div className="relative w-full h-56 sm:h-64 overflow-hidden">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
            {article.description && (
              <p className="text-[var(--muted)] text-sm mb-4 line-clamp-3">
                {article.description}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleCopy}
                className="flex-1 px-4 py-3 rounded-xl bg-[var(--accent)] text-black font-semibold hover:bg-[var(--accent-hover)] transition-colors text-center"
              >
                {copied ? "Skopiowano!" : "Kopiuj komendę /reels"}
              </button>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 rounded-xl border border-[var(--card-border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--accent)] transition-colors text-center"
              >
                Zobacz artykuł
              </a>
            </div>
            <div className="mt-4 p-3 rounded-lg bg-[var(--background)] border border-[var(--card-border)]">
              <p className="text-xs text-[var(--muted)] mb-1">Komenda do Claude Code:</p>
              <code className="text-sm text-[var(--accent)] break-all">/reels {article.url}</code>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-auto pt-12 pb-6 text-center text-xs text-[var(--muted)]">
        Reels Maker by MAGAZIF — pakiety produkcyjne do rolek IG/FB
      </footer>
    </div>
  );
}
