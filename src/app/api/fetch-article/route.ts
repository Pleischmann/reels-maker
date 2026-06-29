import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string" || !url.includes("magazif.com")) {
      return NextResponse.json(
        { error: "Podaj prawidłowy URL z magazif.com" },
        { status: 400 }
      );
    }

    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; ReelsMaker/1.0)",
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Nie udało się pobrać strony" },
        { status: 502 }
      );
    }

    const html = await res.text();

    const title = extractMeta(html, "og:title") || extractTag(html, "title") || "";
    const description = extractMeta(html, "og:description") || "";
    const image = extractMeta(html, "og:image") || "";

    return NextResponse.json({ title, description, image, url });
  } catch {
    return NextResponse.json(
      { error: "Błąd serwera" },
      { status: 500 }
    );
  }
}

function extractMeta(html: string, property: string): string {
  const regex = new RegExp(
    `<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']*)["']`,
    "i"
  );
  const match = html.match(regex);
  if (match) return match[1];

  const regexReversed = new RegExp(
    `<meta[^>]+content=["']([^"']*)["'][^>]+(?:property|name)=["']${property}["']`,
    "i"
  );
  const matchReversed = html.match(regexReversed);
  return matchReversed ? matchReversed[1] : "";
}

function extractTag(html: string, tag: string): string {
  const regex = new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`, "i");
  const match = html.match(regex);
  return match ? match[1].trim() : "";
}
