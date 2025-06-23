import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import "swiper/css";

interface Filme {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
}

const API_URL = "https://api.themoviedb.org/3";
const TMDB_API_KEY = "86533c13f5646bdeb5295938d02a5d82";

export const FilmsPopular = () => {
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFilmes = async () => {
      try {
        const response = await fetch(
          `${API_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=fr-FR` // Changed to now_playing for "Sorties du moment"
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

{/* LES FILMS POPULAIRES */}
      <div className="w-full max-w-7xl mx-auto px-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-white">Les Films Plus Populaires</h2>
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
              <SwiperSlide key={filme.id} className="w-[140px] sm:w-[180px] md:w-[220px]">
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
                <p className="mt-2 text-sm text-center text-white line-clamp-1">{filme.title}</p>
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