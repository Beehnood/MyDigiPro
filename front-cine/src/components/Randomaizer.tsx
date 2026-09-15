import { useState } from "react";
import axios from "axios";
import { FilmIcon, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "../service/Http-service";

type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
};

const PROVIDERS = [
  { id: 8, name: "Netflix" },
  { id: 9, name: "Prime Video" },
  { id: 337, name: "Disney+" },
  { id: 350, name: "Apple TV+" },
];

export default function Randomizer() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedProviders, setSelectedProviders] = useState<number[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const navigate = useNavigate();
  const assetBaseUrl = import.meta.env.BASE_URL;

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const toggleProvider = (id: number) => {
    setSelectedProviders((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const randomize = async () => {
    if (loading || movies.length >= 3) return;

    setLoading(true);
    setError("");

    try {
      const params: { providers?: string } = {};
      if (selectedProviders.length) {
        params.providers = selectedProviders.join(",");
      }
      // optionnel : params.region = 'FR'; params.monetization = 'flatrate';

      const res = await api.get<Movie>("/randomize", { params });
      setMovies((previous) => [...previous, res.data]);
    } catch (e: unknown) {
      setError(axios.isAxiosError(e) ? e.response?.data?.error || "Erreur pendant le tirage." : "Erreur pendant le tirage.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button type="button" onClick={handleOpen} aria-label="Ouvrir le randomizer">
        <img
          className="w-8 h-6"
          src={`${assetBaseUrl}randomize.png`}
          alt=""
        />
      </button>
      {isOpen && (
        <div className="fixed antialiased inset-0 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className="relative max-h-[90vh] overflow-y-auto bg-zinc-900 text-white p-4 sm:p-8 rounded-2xl w-full max-w-[700px] shadow-2xl border border-yellow-500/20">
            <div className="absolute -top-4 right-8 w-0 h-0 border-l-[20px] border-r-[20px] border-b-[20px] border-transparent border-b-zinc-900" />

            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-orange-100 drop-shadow-md">
              Randomizer
            </h2>

            {error && (
              <p className="text-red-400 text-center mb-4 animate-pulse">
                {error}
              </p>
            )}

            {/* Sélecteur de plateformes */}
            <div className="mb-6">
              <p className="mb-2 text-sm opacity-80">
                Filtrer par plateformes :
              </p>
              <div className="flex flex-wrap gap-3">
                {PROVIDERS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => toggleProvider(p.id)}
                    className={`px-3 py-2 rounded-xl border transition ${
                      selectedProviders.includes(p.id)
                        ? "bg-yellow-400 text-black border-yellow-400"
                        : "border-white/20 hover:border-yellow-400"
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            <div aria-busy={loading} className="relative min-h-[200px] bg-zinc-800/50 rounded-xl p-4">
              {loading && (
                <div role="status" className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-zinc-900/80">
                  <Loader2 aria-hidden="true" className="animate-spin w-12 h-12 text-yellow-500" />
                  <span className="sr-only">Tirage en cours</span>
                </div>
              )}
              <div className="grid grid-cols-3 gap-3 sm:gap-6">
                {Array.from({ length: 3 }, (_, index) => {
                  const movie = movies[index];
                  return movie ? (
                    <button
                      type="button"
                      key={`movie-${index}-${movie.id}`}
                      disabled={loading}
                      aria-label={`Choisir ${movie.title}`}
                      onClick={() => {
                        handleClose();
                        navigate(`/film/${movie.id}`);
                      }}
                      className="min-w-0 text-center rounded-xl transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow-400 disabled:cursor-wait"
                    >
                      {movie.poster_path ? (
                        <img
                          src={movie.poster_path.startsWith("https://")
                            ? movie.poster_path
                            : `https://image.tmdb.org/t/p/w200/${movie.poster_path.replace(/^\//, "")}`}
                          alt={movie.title}
                          className="aspect-[2/3] w-full object-cover rounded-lg shadow-lg mb-2 border-2 border-yellow-500/30"
                        />
                      ) : (
                        <div className="aspect-[2/3] flex items-center justify-center rounded-lg bg-black/30 mb-2">
                          <span className="text-sm">Affiche indisponible</span>
                        </div>
                      )}
                      <h3 className="text-sm sm:text-lg font-semibold text-white break-words">{movie.title}</h3>
                    </button>
                  ) : (
                    <div
                      key={`placeholder-${index}`}
                      aria-label={`Emplacement film ${index + 1}`}
                      className="aspect-[2/3] flex items-center justify-center bg-black/30 border border-white/10 rounded-xl"
                    >
                      <FilmIcon aria-hidden="true" className="w-10 h-10 sm:w-16 sm:h-16 text-white opacity-80" />
                    </div>
                  );
                })}
              </div>
            </div>
            {/* BTNS */}
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row sm:gap-8">
              <div className="flex items-center">
                <button
                  onClick={randomize}
                  className=" bg-orange-100 hover:bg-yellow-400 text-black font-bold px-8 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed"
                  disabled={loading || movies.length >= 3}
                >
                  {movies.length >= 3 ? "Les 3 films sont proposés" : "🎲 Lancer le tirage"}
                </button>
              </div>
              <div className="flex items-center">
                <button
                  onClick={handleClose}
                  className=" bg-yellow-400 hover:bg-red-400 text-black hover:text-white font-bold px-8 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
