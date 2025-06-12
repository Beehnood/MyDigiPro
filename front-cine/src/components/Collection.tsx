import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

interface Movie {
  tmdbId: number;
  title: string;
  posterPath: string | null;
  note: number;
}

const Collection: React.FC = () => {
  const [filmsByGenre, setFilmsByGenre] = useState<Record<string, Movie[]>>({});

  useEffect(() => {
    fetch("http://localhost:8000/api/films/by-genre")
      .then((res) => res.json())
      .then(setFilmsByGenre)
      .catch(console.error);
  }, []);

  return (
    <section className="bg-black text-white px-6 py-10 space-y-12">
      {Object.entries(filmsByGenre).map(([genre, films]) => (
        <div key={genre}>
          <h2 className="text-xl sm:text-2xl font-bold mb-4">{genre}</h2>
          <Swiper
            slidesPerView="auto"
            spaceBetween={16}
            navigation
            modules={[Navigation]}
            className="w-full"
          >
            {films.map((film) => (
              <SwiperSlide
                key={film.tmdbId}
                className="w-[140px] sm:w-[180px] md:w-[220px]"
              >
                <div className="rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300">
                  <img
                    src={
                      film.posterPath
                        ? `https://image.tmdb.org/t/p/w500${film.posterPath}`
                        : "/placeholder.jpg"
                    }
                    alt={film.title}
                    className="w-full h-[240px] object-cover"
                  />
                </div>
                <p className="mt-2 text-sm text-center line-clamp-1">{film.title}</p>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ))}
    </section>
  );
};

export default Collection;
