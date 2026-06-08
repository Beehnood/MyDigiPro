import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export const FilmProduit = () => {
  const { id } = useParams<{ id: string }>();
  const [film, setFilm] = useState<any>(null);
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_TMDB_BASE_URL;
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    const fetchFilm = async () => {
      const res = await fetch(
        `${API_URL}/movie/${id}?api_key=${API_KEY}&language=fr-FR&append_to_response=credits,watch/providers`
      );
      const data = await res.json();
      setFilm(data);
      setProviders(data.watch?.providers?.results?.FR?.flatrate || []);
      setLoading(false);
    };
    fetchFilm();
  }, [id]);

  if (loading || !film) return <div className="min-h-screen bg-black/35 text-white flex items-center justify-center">Chargement...</div>;

  const year = new Date(film.release_date).getFullYear();
  const duration = `${Math.floor(film.runtime / 60)}h ${film.runtime % 60}min`;
  const genres = film.genres.map((g: any) => g.name).join(" / ");

  return (
    <div className="min-h-screen bg-black/35 text-white">
      {/* HERO avec backdrop + overlay texte */}
      <div className="relative min-h-screen">
        <img
          src={`https://image.tmdb.org/t/p/original${film.backdrop_path}`}
          alt={film.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#242424] via-[#242424]/70 to-transparent" />

        <div className="relative z-10 flex min-h-screen flex-col justify-end px-4 pb-10 pt-32 sm:px-8 md:px-16 md:pb-20">
          {/* Titre + infos */}
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold mb-4 drop-shadow-2xl break-words">
            {film.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-base sm:text-xl md:text-2xl mb-8 text-gray-200">
            <span>{year}</span>
            <span>{duration}</span>
            <span>{genres}</span>
            <span className="text-yellow-400 flex items-center gap-2">
              {film.vote_average.toFixed(1)} ★
            </span>
          </div>

          {/* Boutons actions */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-6 mb-10">
            <button className="bg-white text-black px-6 py-3 sm:px-10 sm:py-4 rounded-full text-base sm:text-lg font-bold flex items-center gap-3 hover:bg-gray-200 transition">
              ▶ Lire la Bande-annonce
            </button>
            {["Vu", "À voir", "J'aime", "J'aime pas"].map((txt) => (
              <button
                key={txt}
                className="border border-gray-400 px-4 py-2 sm:px-6 sm:py-3 rounded-full hover:bg-white hover:text-black transition text-base sm:text-lg"
              >
                {txt}
              </button>
            ))}
          </div>

          {/* Synopsis sur l'image */}
          <p className="max-w-4xl text-base md:text-xl leading-relaxed text-gray-200 drop-shadow-lg">
            {film.overview}
          </p>

          {/* Où regarder */}
          {providers.length > 0 && (
            <div className="mt-8 w-full rounded-2xl bg-[#242424] p-4 sm:p-6 md:absolute md:right-8 md:top-1/2 md:mt-0 md:w-80 md:-translate-y-1/2">
              <h3 className="text-xl font-bold mb-6 underline">Où regarder</h3>
              {providers.map((p: any) => (
                <div key={p.provider_id} className="flex items-center justify-between gap-4 mb-5">
                  <div className="flex items-center gap-4">
                    <img
                      src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
                      alt={p.provider_name}
                      className="w-12 h-12 rounded-lg"
                    />
                    <span>{p.provider_name}</span>
                  </div>
                  <button className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-full text-sm font-bold">
                    Voir
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Casting 5 personnes */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-16 bg-black/35">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8">Distribution</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {film.credits.cast.slice(0, 5).map((actor: any) => (
            <div key={actor.id} className="text-center">
              <img
                src={
                  actor.profile_path
                    ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                    : "/placeholder.jpg"
                }
                alt={actor.name}
                className="w-full rounded-xl mb-3 object-cover aspect-[2/3]"
              />
              <p className="font-semibold">{actor.name}</p>
              <p className="text-gray-400 text-sm">{actor.character}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
