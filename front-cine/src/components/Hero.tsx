// Hero.tsx
import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

interface Filme {
  id: number;
  title: string;
  poster_path: string | null;
}

const API_URL = "https://api.themoviedb.org/3";
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export const Hero = () => {
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFilmes = async () => {
      try {
        const response = await fetch(`${API_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=fr-FR`);
        const data = await response.json();

        if (data.results && Array.isArray(data.results)) {
          setFilmes(data.results);
        } else {
          throw new Error('Données invalides');
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Erreur inattendue');
      } finally {
        setLoading(false);
      }
    };

    fetchFilmes();
  }, []);

  if (loading) return (
    <div className="h-96 bg-gray-900 flex items-center justify-center">
      <p className="text-yellow-400 text-xl">Chargement...</p>
    </div>
  );

  if (error) return (
    <div className="h-96 bg-gray-900 flex items-center justify-center">
      <p className="text-red-500 text-xl">{error}</p>
    </div>
  );

  return (
    <main className="h-96 bg-gray-900 flex items-center justify-center">
      <div className="w-full max-w-7xl mx-auto px-6">
        <Swiper 
          spaceBetween={30} 
          slidesPerView={1} 
          breakpoints={{ 
            640: { slidesPerView: 2 }, 
            1024: { slidesPerView: 3 } 
          }} 
          className="w-full"
        >
          {filmes.length > 0 ? (
            filmes.map((filme) => (
              <SwiperSlide key={filme.id} className="flex justify-center">
                <div className="bg-black rounded-lg shadow-xl overflow-hidden w-56 h-80 sm:w-64 sm:h-96">
                  {filme.poster_path ? (
                    <img 
                      src={`https://image.tmdb.org/t/p/w500${filme.poster_path}`} 
                      alt={filme.title} 
                      className="w-full h-full object-cover" 
                      onError={(e) => (e.target as HTMLImageElement).src = 'https://via.placeholder.com/250x375?text=Image+non+disponible'} 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-300 text-black">
                      Pas d'image
                    </div>
                  )}
                </div>
              </SwiperSlide>
            ))
          ) : (
            <SwiperSlide>
              <div className="w-full h-80 sm:h-96 flex items-center justify-center bg-gray-800 text-yellow-400">
                Aucun film
              </div>
            </SwiperSlide>
          )}
        </Swiper>
      </div>
    </main>
  );
};
