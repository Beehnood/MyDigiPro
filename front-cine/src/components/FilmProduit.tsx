import { useParams } from "react-router-dom";
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
  const [providers, setProviders] = useState<
    { provider_id: number; provider_name: string; logo: string; link: string }[]
  >([]);

  const API_URL = import.meta.env.VITE_TMDB_BASE_URL;
  const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Film + cast
        const response = await fetch(
          `${API_URL}/movie/${id}?api_key=${TMDB_API_KEY}&language=fr-FR&append_to_response=credits`
        );
        const data = await response.json();
        setFilm(data);

        // Providers
        const providersRes = await fetch(
          `${API_URL}/movie/${id}/watch/providers?api_key=${TMDB_API_KEY}`
        );
        const providersData = await providersRes.json();

        const frProviders = providersData.results?.FR?.flatrate || [];
        const providerList = frProviders.map((p: any) => ({
          provider_id: p.provider_id,
          provider_name: p.provider_name,
          logo: `https://image.tmdb.org/t/p/w92${p.logo_path}`,
          link: `https://www.themoviedb.org/movie/${id}/watch`, // lien TMDB
        }));

        setProviders(providerList);
      } catch (error) {
        console.error("Erreur chargement film/providers :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  // Formatage
  const year = new Date(film.release_date).getFullYear();
  const duration = `${Math.floor(film.runtime / 60)}h ${film.runtime % 60}m`;
  const genres = film.genres?.map((g) => g.name).join(" / ") || "";

  return (
    <div className="min-h-screen bg-[#242424] text-orange-100">
      {/* Backdrop */}
      <div>
        <img
          className="w-auto h-50% object-cover"
          src={
            film.backdrop_path
              ? `https://image.tmdb.org/t/p/original${film.backdrop_path}`
              : "https://via.placeholder.com/250x375?text=Image+non+disponible"
          }
          alt={`Backdrop ${film.title}`}
        />
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Film infos */}
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

          {/* Boutons actions */}
          <div className="flex space-x-4 mb-8">
            <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
              Lire la Bande-annonce
            </button>
            <button className="border border-orange-100 px-4 py-2 rounded hover:bg-orange-100 hover:text-black">
              Vu
            </button>
            <button className="border border-orange-100 px-4 py-2 rounded hover:bg-orange-100 hover:text-black">
              À voir
            </button>
            <button className="border border-orange-100 px-4 py-2 rounded hover:bg-orange-100 hover:text-black">
              J'aime
            </button>
            <button className="border border-orange-100 px-4 py-2 rounded hover:bg-orange-100 hover:text-black">
              J'aime pas
            </button>
          </div>

          {/* Synopsis */}
          <p className="text-lg leading-relaxed max-w-3xl mb-12">
            {film.overview}
          </p>
        </section>

        {/* Providers */}
        {providers.length > 0 && (
          <section className="mb-16">
            <h3 className="text-2xl font-semibold mb-6">Disponible sur</h3>
            <div className="flex space-x-6">
              {providers.map((provider) => (
                <a
                  key={provider.provider_id}
                  href={provider.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center"
                >
                  <img
                    src={provider.logo}
                    alt={provider.provider_name}
                    className="w-12 h-12 rounded mb-2"
                  />
                  <span className="text-sm">{provider.provider_name}</span>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Cast */}
        <section className="mb-16">
          <h3 className="text-2xl font-semibold mb-6">Distribution & équipe</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {film.credits?.cast.slice(0, 5).map((person) => (
              <div key={person.id} className="text-center">
                <div className="bg-gray-200 h-48 w-full mb-2 rounded">
                  <img
                    className="h-full w-full object-cover rounded"
                    src={
                      person.profile_path
                        ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
                        : "https://via.placeholder.com/150x225?text=Image+non+disponible"
                    }
                    alt={person.name}
                  />
                </div>
                <p className="font-medium">{person.name}</p>
                <p className="text-white">{person.character}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};
