import { neon } from "@neondatabase/serverless";

export function getDb() {
  return neon(process.env.DATABASE_URL!);
}

export async function initDb() {
  const sql = getDb();
  await sql`ALTER TABLE reels ADD COLUMN IF NOT EXISTS shots JSONB DEFAULT '[]'`.catch(() => {});
  await sql`
    CREATE TABLE IF NOT EXISTS reels (
      id SERIAL PRIMARY KEY,
      url TEXT NOT NULL,
      title TEXT NOT NULL,
      image TEXT,
      scenario TEXT,
      shots JSONB DEFAULT '[]',
      voiceover TEXT,
      music TEXT,
      post_description TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
}
