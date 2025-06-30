import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

interface FilmDetails {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  runtime: number;
  vote_average: number;
  genres: { id: number; name: string }[];
  credits: {
    cast: {
      id: number;
      name: string;
      character: string;
      image: string | null;
      profile_path: string | null;
    }[];
  };
}

export const FilmProduit = () => {
  const { id } = useParams();
  const [film, setFilm] = useState<FilmDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_TMDB_BASE_URL;
  const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY; //

  useEffect(() => {
    const fetchFilm = async () => {
      try {
        const response = await fetch(
          `${API_URL}/movie/${id}?api_key=${
            TMDB_API_KEY
          }&language=fr-FR&append_to_response=credits`
        );
        const data = await response.json();
        setFilm(data);
      } catch (error) {
        console.error("Error fetching film:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilm();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Chargement...
      </div>
    );
  if (!film)
    return (
      <div className="flex justify-center items-center h-screen">
        Film non trouvé
      </div>
    );

  // Formatage des données
  const year = new Date(film.release_date).getFullYear();
  const duration = `${Math.floor(film.runtime / 60)}h ${film.runtime % 60}m`;
  const genres = film.genres?.map((g) => g.name).join(" / ") || "";

  return (
    <div className="min-h-screen bg-orange-100 text-gray-900">
      <div>
        <img className="w-auto h-50% object-cover"
         src={  film.backdrop_path
                        ? `https://image.tmdb.org/t/p/original${film.backdrop_path}`
                        : "https://via.placeholder.com/250x375?text=Image+non+disponible"} alt={`Backdrop ${film.title}`} />
      </div>
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Titre du studio */}
        <h2 className="text-xl font-semibold mb-8"></h2>

        {/* Titre du film et informations */}
        <section className="mb-12">
          <h1 className="text-4xl font-bold mb-2">{film.title}</h1>
          <div className="flex items-center space-x-4 mb-6">
            <span>{year}</span>
            <span>{duration}</span>
            <span>{genres}</span>
            <span className="flex items-center">
              {film.vote_average.toFixed(1)} ★
            </span>
          </div>

          {/* Actions */}
          <div className="flex space-x-4 mb-8">
            <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
              Lire la Bande-annonce
            </button>
            <button className="border border-black px-4 py-2 rounded hover:bg-gray-100">
              Vu
            </button>
            <button className="border border-black px-4 py-2 rounded hover:bg-gray-100">
              À voir
            </button>
            <button className="border border-black px-4 py-2 rounded hover:bg-gray-100">
              J'aime
            </button>
            <button className="border border-black px-4 py-2 rounded hover:bg-gray-100">
              J'aime pas
            </button>
          </div>

          {/* Synopsis */}
          <p className="text-lg leading-relaxed max-w-3xl mb-12">
            {film.overview}
          </p>
        </section>

        {/* Distribution */}
        <section className="mb-16">
          <h3 className="text-2xl font-semibold mb-6">Distribution & équipe</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {film.credits?.cast.slice(0, 5).map((person) => (
              <div key={person.id} className="text-center">
                <div className="bg-gray-200 h-48 w-full mb-2 rounded">
                  <img className="h-full w-full object-cover rounded"
                    src={
                      person.profile_path
                        ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
                        : "https://via.placeholder.com/150x225?text=Image+non+disponible"
                    }
                    alt={person.image ? person.name : "Image non disponible"}
                  />
                </div>
                <p className="font-medium">{person.name}</p>
                <p className="text-gray-600">{person.character}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};
