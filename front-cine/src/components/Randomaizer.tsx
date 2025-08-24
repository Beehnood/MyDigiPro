import { useState } from "react";
import axios from "axios";
import { FilmIcon, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "../service/Http-service";

type Movie = {
  id: number;
  title: string;
  poster_path: string;
};

export default function Randomizer() {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const randomize = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await api.get("/randomize");
      console.log("Réponse API:", res.data);
      setMovie(res.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
        <div className="relative bg-zinc-900 text-white p-8 rounded-2xl w-[700px] max-w-full shadow-2xl border border-yellow-500/20">
          <div className="absolute -top-4 right-8 w-0 h-0 border-l-[20px] border-r-[20px] border-b-[20px] border-transparent border-b-zinc-900" />

          <h2 className="text-3xl font-bold text-center mb-6 text-orange-100 drop-shadow-md">
            Randomizer
          </h2>

          {error && (
            <p className="text-red-400 text-center mb-4 animate-pulse">
              {error}
            </p>
          )}

          <div className="flex justify-center items-center min-h-[200px] bg-zinc-800/50 rounded-xl p-4">
            {loading ? (
              <Loader2 className="animate-spin w-12 h-12 text-yellow-500" />
            ) : movie ? (
              <div className="text-center transition-all duration-300 hover:scale-105">
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w200/${movie.poster_path}`
                      : "/images/default-poster.png" // 👈 image par défaut (place-la dans public/images/)
                  }
                  alt={movie.title}
                  key={movie.id}
                  onClick={() => navigate(`/film/${movie.id}`)}
                  className="rounded-lg shadow-lg mx-auto mb-2 border-2 border-yellow-500/30"
                />
                <h3 className="text-xl font-semibold text-white">
                  {movie.title}
                </h3>
              </div>
            ) : (
              <div className="flex flex-wrap justify-center gap-6">
                {[...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-black/30 border border-white/10 p-6 rounded-xl transform hover:scale-105 transition-transform duration-200"
                  >
                    <FilmIcon className="w-16 h-16 text-white opacity-80" />
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* BTNS */}
          <div className="mt-8 flex justify-center gap-8 ">
            <div className="flex items-center">
              <button
                onClick={randomize}
                className=" bg-orange-100 hover:bg-yellow-400 text-black font-bold px-8 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed"
                disabled={loading}
              >
                🎲 Lancer le tirage
              </button>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => navigate("/")}
                className=" bg-yellow-400 hover:bg-red-400 text-black hover:text-white font-bold px-8 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed"
                disabled={loading}
              >
                Accueil
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
