import { api } from "../service/Http-service";
import { API_BASE_URL } from "../config";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type RegisterProps = {
  isPage?: boolean;
};

const passwordRules = [
  "8 caractères minimum",
  "1 lettre majuscule",
  "1 lettre minuscule",
  "1 chiffre",
];

const getPasswordError = (password: string) => {
  if (password.length < 8) {
    return "Le mot de passe doit contenir au moins 8 caractères.";
  }

  if (!/[A-Z]/.test(password)) {
    return "Le mot de passe doit contenir au moins une lettre majuscule.";
  }

  if (!/[a-z]/.test(password)) {
    return "Le mot de passe doit contenir au moins une lettre minuscule.";
  }

  if (!/\d/.test(password)) {
    return "Le mot de passe doit contenir au moins un chiffre.";
  }

  return null;
};

export const Register = ({ isPage = false }: RegisterProps) => {
  const navigate = useNavigate();

  const [form, setForm] = useState<any>({
    email: "",
    password: "",
    username: "",
    firstName: "",
    lastName: "",
    country: "",
    city: "",
    interests: ["", "", ""], // 3 genres choisis
  });

  const fallbackGenres = [
    { id: 28, name: "Action" },
    { id: 35, name: "Comédie" },
    { id: 18, name: "Drame" },
    { id: 27, name: "Horreur" },
    { id: 878, name: "Science-Fiction" },
    { id: 10749, name: "Romance" },
    { id: 16, name: "Animation" },
    { id: 99, name: "Documentaire" },
  ];

  const [error, setError] = useState<string | null>(null);
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(isPage);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  // Charger la liste des genres depuis le backend
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await api.get("/movies/genres");
        const data = await response.data;
        setGenres(data);
      } catch (err) {
        console.error("❌ Erreur:", err);
        setGenres(fallbackGenres);
      }
    };

    fetchGenres();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGenreChange = (index: number, value: string) => {
    const updated = [...form.interests];
    updated[index] = value;
    setForm({ ...form, interests: updated });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const passwordError = getPasswordError(form.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(
          data.error || data.message || "Erreur lors de l'inscription",
        );
      }

      navigate("/login");
    } catch (err: any) {
      setError(
        err.message ||
          "Impossible de créer le compte pour le moment. Vérifiez votre connexion puis réessayez.",
      );
    }
  };

  return (
    <>
      {/* Bouton d'ouverture */}
      {!isPage && (
        <button
          onClick={handleOpen}
          className="bg-yellow-400 text-black tracking-wider w-24 h-8 text-md px-4 rounded-md hover:text-black transition-colors"
        >
          Inscription
        </button>
      )}

      {/* Modale */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center  bg-opacity-50 backdrop-blur-sm z-50">
          <div
            className="bg-orange-100 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 rounded-2xl shadow-md space-y-4 relative"
            onClick={(e) => e.stopPropagation()} // empêcher fermeture quand on clique dans la modale
          >
            <h2 className="text-2xl font-bold mb-4 text-[#242424] text-center">
              Inscription
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {/* Inputs texte */}
                {[
                  ["Prénom", "firstName"],
                  ["Nom", "lastName"],
                  ["Nom d'utilisateur", "username"],
                  ["Pays", "country"],
                  ["Ville", "city"],
                  ["Email", "email"],
                  ["Mot de passe", "password"],
                ].map(([label, name]) => (
                  <div key={name} className="col-span-1">
                    <label
                      className="block text-[#242424] font-medium mb-1"
                      htmlFor={name}
                    >
                      {label}
                    </label>
                    <input
                      type={name === "password" ? "password" : "text"}
                      id={name}
                      name={name}
                      value={form[name]}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 bg-orange-50 text-[#242424] rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={`Entrez votre ${label.toLowerCase()}`}
                    />
                    {name === "password" && (
                      <p className="mt-1 text-xs leading-5 text-gray-700">
                        Mot de passe requis : {passwordRules.join(", ")}.
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Sélecteurs de genres */}
              <div>
                <label className="block text-[#242424] font-medium mb-2">
                  Choisissez 3 genres préférés :
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {[0, 1, 2].map((i) => (
                    <select
                      key={i}
                      value={form.interests[i]}
                      onChange={(e) => handleGenreChange(i, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 bg-orange-50 text-[#242424] rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">-- Sélectionner un genre --</option>
                      {genres.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.name}
                        </option>
                      ))}
                    </select>
                  ))}
                </div>
              </div>

              {/* Boutons */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  S'inscrire
                </button>
                {!isPage && (
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 bg-yellow-400 text-black py-2 rounded hover:bg-red-700 hover:text-white transition-colors"
                  >
                    Fermer
                  </button>
                )}
              </div>

              {error && <p className="text-red-600 text-sm">{error}</p>}
            </form>
          </div>
        </div>
      )}
    </>
  );
};
