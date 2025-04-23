// components/SongRecommendation.tsx
import { useEffect, useState } from "react";

interface Song {
  name: string;
  artist: string;
  image: string;
  url: string;
  embed: string;
}

interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface SpotifySearchResponse {
  tracks: {
    items: Array<{
      id: string;
      name: string;
      artists: { name: string }[];
      album: { images: { url: string }[] };
      external_urls: { spotify: string };
    }>;
  };
}

const moodQueryMap: Record<string, string[]> = {
  energický: ["Blinding Lights", "Titanium", "Can't Stop the Feeling"],
  pozitivní: ["Sunroof", "Happy", "Walking on Sunshine"],
  klidný: ["Snowman", "Breathe", "Weightless"],
  smutný: ["Someone Like You", "Let Her Go", "Fix You"],
  melancholický: ["River Flows In You", "Comptine d'un autre été", "Nara"],
};

export default function SongRecommendation({ mood }: { mood: string }) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const fetchSongs = async () => {
      const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!;
      const clientSecret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET!;

      const authRes = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          Authorization:
            "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
      });

      const auth: SpotifyTokenResponse = await authRes.json();
      const token = auth.access_token;

      const queries = moodQueryMap[mood] || [];

      const results: Song[] = [];
      for (const q of queries) {
        const searchRes = await fetch(
          `https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=track&limit=1`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const search: SpotifySearchResponse = await searchRes.json();
        const track = search.tracks?.items?.[0];
        if (track) {
          results.push({
            name: track.name,
            artist: track.artists.map((a) => a.name).join(", "),
            image: track.album.images[0].url,
            url: track.external_urls.spotify,
            embed: `https://open.spotify.com/embed/track/${track.id}`,
          });
        }
      }

      setSongs(results);
    };

    fetchSongs();
  }, [mood]);

  const current = songs[index];

  if (songs.length === 0)
    return <p className="mt-6">Loading recommendations...</p>;

  return (
    <div className="mt-8 rounded-xl z-50 p-4 bg-white/20 text-left">
      <p className="text-sm font-semibold mb-2">🎧 Song Suggestion</p>
      <iframe
        src={current.embed}
        className="mt-4 w-full rounded-xl"
        height="80"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      ></iframe>
      <button
        onClick={() => setIndex((i) => (i + 1) % songs.length)}
        className="mt-4 px-4 py-2 rounded-full bg-gray-700 hover:bg-gray-800 text-white"
      >
        Next
      </button>
    </div>
  );
}
