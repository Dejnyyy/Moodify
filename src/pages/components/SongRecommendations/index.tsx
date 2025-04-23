// components/SongRecommendation.tsx
import { useEffect, useState } from "react";

interface Song {
  name: string;
  artist: string;
  image: string;
  url: string;
  embed: string;
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

      const auth = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          Authorization: "Basic " + btoa(`${clientId}:${clientSecret}`),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
      }).then((res) => res.json());

      const token = auth.access_token;

      const queries = moodQueryMap[mood] || [];

      const results: Song[] = [];
      for (const q of queries) {
        const search = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=track&limit=1`, {
          headers: { Authorization: `Bearer ${token}` },
        }).then((res) => res.json());

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

      setSongs(results);
    };

    fetchSongs();
  }, [mood]);

  const current = songs[index];

  if (!current) return <p className="mt-6">Loading recommendations...</p>;

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
      {index < songs.length - 1 && (
        <button
          onClick={() => setIndex((i) => i + 1)}
          className="mt-4 px-4 py-2 rounded-full bg-black/40 hover:bg-gray-800/80 text-white"
        >
          Next suggestion
        </button>
      )}
    </div>
  );
}
