// pages/api/spotify.ts
import type { NextApiRequest, NextApiResponse } from "next";

const moodQueryMap: Record<string, string[]> = {
  energický: ["Blinding Lights", "Titanium", "Can't Stop the Feeling"],
  pozitivní: ["Sunroof", "Happy", "Walking on Sunshine"],
  klidný: ["Snowman", "Breathe", "Weightless"],
  smutný: ["Someone Like You", "Let Her Go", "Fix You"],
  melancholický: ["River Flows In You", "Comptine d'un autre été", "Nara"],
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const mood = req.query.mood as string;

  if (!mood) return res.status(400).json({ error: "Mood is required." });

  const clientId = process.env.CLIENT_ID!;
  const clientSecret = process.env.CLIENT_SECRET!;

  const authRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const auth = await authRes.json();
  const token = auth.access_token;

  const queries = moodQueryMap[mood] || [];

  const results = [];

  for (const q of queries) {
    const searchRes = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=track&limit=1`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const search = await searchRes.json();
    const track = search.tracks?.items?.[0];
    if (track) {
      results.push({
        name: track.name,
        artist: track.artists.map((a: any) => a.name).join(", "),
        image: track.album.images[0].url,
        url: track.external_urls.spotify,
        embed: `https://open.spotify.com/embed/track/${track.id}`,
      });
    }
  }

  return res.status(200).json({ songs: results });
}
