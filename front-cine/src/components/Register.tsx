import { api } from "../service/Http-service";
import { API_BASE_URL } from "../config";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";

type RegisterProps = {
  isPage?: boolean;
};

type RegisterForm = {
  email: string;
  password: string;
  username: string;
  interests: string[];
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

const textFields: Array<{
  label: string;
  name: "username" | "email" | "password";
}> = [
  { label: "Nom d'utilisateur", name: "username" },
  { label: "Email", name: "email" },
  { label: "Mot de passe", name: "password" },
];

export const Register = ({ isPage = false }: RegisterProps) => {
  const navigate = useNavigate();

  const [form, setForm] = useState<RegisterForm>({
    email: "",
    password: "",
    username: "",
    interests: ["", "", ""],
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
  const handleClose = () => {
    if (isPage) {
      navigate("/login");
      return;
    }

    setIsOpen(false);
  };

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

    const selectedInterests = form.interests.filter(Boolean);
    if (selectedInterests.length !== 3) {
      setError("Veuillez choisir 3 genres préférés.");
      return;
    }

    if (new Set(selectedInterests).size !== 3) {
      setError("Veuillez choisir 3 genres différents.");
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
      if (err instanceof TypeError) {
        setError(
          "Impossible de joindre le serveur d’inscription. En local, lancez le backend Symfony sur http://localhost:8000. Sur GitHub Pages, configurez VITE_API_BASE_URL avec l’URL de votre API en ligne.",
        );
        return;
      }

      setError(
        err.message ||
          "Impossible de créer le compte pour le moment. Vérifiez votre connexion puis réessayez.",
      );
    }
  };

  const registerModal = isOpen ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div
        className="relative max-h-[90vh] w-full max-w-2xl space-y-4 overflow-y-auto rounded-2xl bg-orange-100 p-4 shadow-md sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-center text-2xl font-bold text-[#242424]">
          Inscription
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Inputs texte */}
            {textFields.map(({ label, name }) => (
              <div key={name} className="col-span-1">
                <label
                  className="mb-1 block font-medium text-[#242424]"
                  htmlFor={name}
                >
                  {label}
                </label>
                <input
                  type={
                    name === "password"
                      ? "password"
                      : name === "email"
                        ? "email"
                        : "text"
                  }
                  id={name}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  required
                  className="w-full rounded border border-gray-300 bg-orange-50 px-3 py-2 text-[#242424] focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <label className="mb-2 block font-medium text-[#242424]">
              Choisissez 3 genres préférés :
            </label>
            <div className="grid grid-cols-1 gap-2">
              {[0, 1, 2].map((i) => (
                <select
                  key={i}
                  value={form.interests[i]}
                  onChange={(e) => handleGenreChange(i, e.target.value)}
                  className="w-full rounded border border-gray-300 bg-orange-50 px-3 py-2 text-[#242424] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">-- Sélectionner un genre --</option>
                  {genres.map((g) => (
                    <option
                      key={g.id}
                      value={g.name}
                      disabled={
                        form.interests.includes(String(g.name)) &&
                        form.interests[i] !== String(g.name)
                      }
                    >
                      {g.name}
                    </option>
                  ))}
                </select>
              ))}
            </div>
          </div>

          {/* Boutons */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 rounded bg-yellow-400 py-2 text-black transition-colors hover:bg-red-700 hover:text-white"
            >
              Fermer
            </button>

            <button
              type="submit"
              className="flex-1 rounded bg-blue-600 py-2 text-white transition-colors hover:bg-blue-700"
            >
              S'inscrire
            </button>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </form>
      </div>
    </div>
  ) : null;

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

      {/* Le portail évite qu'un parent responsive `hidden` masque la modale. */}
      {registerModal && createPortal(registerModal, document.body)}
    </>
  );
};
