import React from "react";

interface Film {
  id: number;
  title: string;
  poster_path?: string;
  image?: string;
}

interface FilmCardProps {
  film: Film;
  baseUrl: string;
  placeholderUrl: string;
}

const FilmCard: React.FC<FilmCardProps> = ({ film, baseUrl, placeholderUrl }) => {
  const imageUrl = film.poster_path
    ? `${baseUrl}${film.poster_path}`
    : film.image || placeholderUrl;

  return (
    <div className="bg-beige-200 rounded-lg shadow-xl overflow-hidden w-56 h-80 sm:w-64 sm:h-96">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={film.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = placeholderUrl;
          }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-300 text-black">
          Pas d'image
        </div>
      )}
      <div className="p-3 text-center bg-gray-800">
        <h3 className="text-lg font-semibold text-yellow-400 line-clamp-2">
          {film.title}
        </h3>
      </div>
    </div>
  );
};

export default FilmCard;
