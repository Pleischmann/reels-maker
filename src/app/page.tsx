"use client";

import { useEffect, useState } from "react";

interface Shot {
  time: string;
  label: string;
  description: string;
  image_url: string;
  caption: string;
}

interface Reel {
  id: number;
  url: string;
  title: string;
  image: string | null;
  scenario: string | null;
  shots: Shot[] | null;
  voiceover: string | null;
  music: string | null;
  post_description: string | null;
  created_at: string;
}

export default function Home() {
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    fetchReels();
  }, []);

  async function fetchReels() {
    try {
      const res = await fetch("/api/reels");
      if (res.ok) {
        setReels(await res.json());
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Na pewno usunąć tę rolkę?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/reels?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setReels(reels.filter((r) => r.id !== id));
      }
    } finally {
      setDeleting(null);
    }
  }

  function toggleExpand(id: number) {
    setExpandedId(expandedId === id ? null : id);
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
          Pakiety produkcyjne do rolek Instagram i Facebook z artykułów MAGAZIF.
        </p>
      </header>

      <main className="w-full max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">
            Historia rolek
            <span className="ml-2 text-sm text-[var(--muted)] font-normal">
              ({reels.length})
            </span>
          </h2>
        </div>

        {loading ? (
          <div className="text-center text-[var(--muted)] py-16">Ładowanie...</div>
        ) : reels.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)]">
            <p className="text-[var(--muted)] text-lg mb-2">Brak rolek</p>
            <p className="text-[var(--muted)] text-sm">
              Użyj komendy <code className="text-[var(--accent)]">/reels URL</code> w Claude Code, aby wygenerować pierwszą rolkę.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {reels.map((reel) => (
              <div
                key={reel.id}
                className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleExpand(reel.id)}
                  className="w-full flex items-center gap-4 p-4 text-left hover:bg-[#1a1a1a] transition-colors"
                >
                  {reel.image && (
                    <img
                      src={reel.image}
                      alt={reel.title}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{reel.title}</h3>
                    <p className="text-xs text-[var(--muted)] mt-1">
                      {new Date(reel.created_at).toLocaleDateString("pl-PL", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <span className="text-[var(--muted)] text-xl flex-shrink-0">
                    {expandedId === reel.id ? "−" : "+"}
                  </span>
                </button>

                {expandedId === reel.id && (
                  <div className="px-4 pb-4 border-t border-[var(--card-border)]">
                    {reel.shots && reel.shots.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-semibold text-[var(--accent)] mb-3">Ujęcia</h4>
                        <div className="flex gap-3 overflow-x-auto pb-3 -mx-1 px-1">
                          {reel.shots.map((shot, i) => (
                            <div key={i} className="flex-shrink-0 w-[168px]">
                              <div className="relative rounded-xl overflow-hidden bg-black" style={{ aspectRatio: "9/16" }}>
                                <img
                                  src={shot.image_url}
                                  alt={shot.caption}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                                  <p className="text-white text-[10px] font-bold leading-tight">{shot.caption}</p>
                                </div>
                                <div className="absolute top-1 left-1 bg-black/60 rounded px-1.5 py-0.5">
                                  <span className="text-white text-[9px] font-mono">{shot.time}</span>
                                </div>
                              </div>
                              <p className="text-[10px] text-[var(--muted)] mt-1.5 leading-tight">{shot.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {reel.voiceover && (
                      <Section title="Tekst lektora" content={reel.voiceover} />
                    )}
                    {reel.music && (
                      <Section title="Muzyka" content={reel.music} />
                    )}
                    {reel.post_description && (
                      <Section title="Opis posta" content={reel.post_description} />
                    )}
                    {reel.scenario && (
                      <Section title="Pełny scenariusz" content={reel.scenario} />
                    )}

                    <div className="flex gap-3 mt-4">
                      <a
                        href={reel.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl border border-[var(--card-border)] text-sm text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--accent)] transition-colors"
                      >
                        Zobacz artykuł
                      </a>
                      <button
                        onClick={() => handleDelete(reel.id)}
                        disabled={deleting === reel.id}
                        className="px-4 py-2 rounded-xl border border-red-900 text-sm text-red-400 hover:bg-red-950 transition-colors disabled:opacity-50"
                      >
                        {deleting === reel.id ? "Usuwanie..." : "Usuń"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="mt-auto pt-12 pb-6 text-center text-xs text-[var(--muted)]">
        Reels Maker by MAGAZIF — pakiety produkcyjne do rolek IG/FB
      </footer>
    </div>
  );
}

function Section({ title, content }: { title: string; content: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-1">
        <h4 className="text-sm font-semibold text-[var(--accent)]">{title}</h4>
        <button
          onClick={handleCopy}
          className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
        >
          {copied ? "Skopiowano!" : "Kopiuj"}
        </button>
      </div>
      <div className="text-sm text-[var(--foreground)] whitespace-pre-wrap bg-[var(--background)] rounded-lg p-3 border border-[var(--card-border)]">
        {content}
      </div>
    </div>
  );
}
