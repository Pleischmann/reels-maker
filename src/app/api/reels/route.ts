import { NextRequest, NextResponse } from "next/server";
import { getDb, initDb } from "@/app/lib/db";

export async function GET() {
  try {
    await initDb();
    const sql = getDb();
    const reels = await sql`SELECT * FROM reels ORDER BY created_at DESC`;
    return NextResponse.json(reels);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await initDb();
    const sql = getDb();
    const body = await req.json();

    const { url, title, image, scenario, shots, voiceover, music, post_description } = body;

    if (!url || !title) {
      return NextResponse.json({ error: "url i title są wymagane" }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO reels (url, title, image, scenario, shots, voiceover, music, post_description)
      VALUES (${url}, ${title}, ${image || null}, ${scenario || null}, ${shots ? JSON.stringify(shots) : "[]"}, ${voiceover || null}, ${music || null}, ${post_description || null})
      RETURNING *
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Podaj id" }, { status: 400 });
    }

    const sql = getDb();
    await sql`DELETE FROM reels WHERE id = ${parseInt(id)}`;
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
