import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
}

interface Genre {
  id: number;
  name: string;
}

const TMDB_API_KEY = "86533c13f5646bdeb5295938d02a5d82";
const API_URL = "https://api.themoviedb.org/3";

const Collection: React.FC = () => {
  const [filmsByGenre, setFilmsByGenre] = useState<Record<string, Movie[]>>({});

  useEffect(() => {
    const fetchGenresAndMovies = async () => {
      try {
        const genreRes = await fetch(
          `${API_URL}/genre/movie/list?api_key=${TMDB_API_KEY}&language=fr-FR`
        );
        const genreData = await genreRes.json();
        const genres: Genre[] = genreData.genres;

        const genreMovies: Record<string, Movie[]> = {};

        for (const genre of genres) {
          const movieRes = await fetch(
            `${API_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genre.id}&language=fr-FR`
          );
          const movieData = await movieRes.json();
          genreMovies[genre.name] = movieData.results.slice(0, 15); // Limit to 15 films per genre
        }

        setFilmsByGenre(genreMovies);
      } catch (error) {
        console.error("Erreur de récupération :", error);
      }
    };

    fetchGenresAndMovies();
  }, []);

  return (
    <section className="bg-[#242424] text-white px-6 py-10 space-y-12">
      {Object.entries(filmsByGenre).map(([genre, films]) => (
        <div className="w-full max-w-7xl mx-auto px-6" key={genre}>
          <h2 className="text-xl sm:text-2xl font-bold mb-4">{genre}</h2>
          <Swiper
            slidesPerView={6}
            spaceBetween={50}
            navigation
            pagination={{ clickable: true }}
            scrollbar={{ draggable: true }}
            modules={[Navigation]}
            className="w-full"
          >
            {films.map((film) => (
              <SwiperSlide
                key={film.id}
                className="w-[140px] sm:w-[180px] md:w-[220px]"
              >
                <div className="rounded-lg  overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300">
                  <img
                    src={
                      film.poster_path
                        ? `https://image.tmdb.org/t/p/w500${film.poster_path}`
                        : "/placeholder.jpg"
                    }
                    alt={film.title}
                    className="w-full h-[240px] object-cover"
                  />
                </div>
                <p className="mt-2 text-sm text-center line-clamp-1">
                  {film.title}
                </p>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ))}
    </section>
  );
};

export default Collection;
