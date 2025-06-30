import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import { useNavigate } from "react-router-dom";
import { FilmProduit } from "./FilmProduit";

interface Filme {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
}

const API_URL = import.meta.env.VITE_TMDB_BASE_URL;
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY; // Use environment variable or fallback

export const FilmsNowPlaying = () => {
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilm, setSelectedFilm] = useState<Filme | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFilmes = async () => {
      try {
        const response = await fetch(
          `${API_URL}/movie/now_playing?api_key=${TMDB_API_KEY}&language=fr-FR` // Changed to now_playing for "Sorties du moment"
        );
        const data = await response.json();

        if (data.results && Array.isArray(data.results)) {
          setFilmes(data.results);
        } else {
          throw new Error("Données invalides");
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "Erreur inattendue");
      } finally {
        setLoading(false);
      }
    };

    fetchFilmes();
  }, []);

  if (selectedFilm) {
    return (
      <div className="bg-[#242424] h-screen flex items-center justify-center">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white">
          <h2 className="text-2xl font-bold mb-4">{selectedFilm.title}</h2>
          <img
            src={
              selectedFilm.poster_path
                ? `https://image.tmdb.org/t/p/w500${selectedFilm.poster_path}`
                : "https://via.placeholder.com/250x375?text=Image+non+disponible"
            }
            alt={selectedFilm.title}
            className="w-full h-[240px] object-cover mb-4"
          />
          <p className="text-xl text-gray-400">
            {new Date(selectedFilm.release_date).toLocaleDateString("fr-FR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <button
            onClick={() => setSelectedFilm(null)}
            className="mt-4 bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500 transition-colors"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  if (loading)
    return (
      <div className="h-96 bg-[#242424] flex items-center justify-center">
        <p className="text-yellow-400 text-xl">Chargement...</p>
      </div>
    );

  if (error)
    return (
      <div className="h-96 bg-[#242424] flex items-center justify-center">
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    );

  return (
    <main className="bg-[#242424] py-10">
      {/* LES FILMS SORTIES DU MOMENTS */}
      <div className="w-full max-w-7xl mx-auto px-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-white">
          Sorties du moment
        </h2>
        <Swiper
          slidesPerView={6}
          spaceBetween={50}
          navigation
          pagination={{ clickable: true }}
          scrollbar={{ draggable: true }}
          modules={[Navigation]}
          className="w-full"
        >
          {filmes.length > 0 ? (
            filmes.map((filme) => (
              <SwiperSlide
                key={filme.id}
                 onClick={() => navigate(`/film/${filme.id}`)
                 
                } 
                
              >
                <div className="rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300">
                  <img
                    src={
                      filme.poster_path
                        ? `https://image.tmdb.org/t/p/w500${filme.poster_path}`
                        : "https://via.placeholder.com/250x375?text=Image+non+disponible"
                    }
                    alt={filme.title}
                    className="w-full h-[240px] object-cover"
                  />
                </div>
                <p className="mt-2 text-2xl text-center text-white line-clamp-1">
                  {filme.title}
                </p>
                <p className="text-xl text-gray-400 text-center">
                  {new Date(filme.release_date).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </SwiperSlide>
            ))
          ) : (
            <SwiperSlide>
              <div className="w-full h-[240px] flex items-center justify-center bg-gray-800 text-yellow-400">
                Aucun film
              </div>
            </SwiperSlide>
          )}
        </Swiper>
      </div>
    </main>
  );
};
