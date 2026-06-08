import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../App.css";
import { useAuth } from "../contexts/AuthContext";
import { API_BASE_URL } from "../config";

type LoginProps = {
  isPage?: boolean;
};

const Login = ({ isPage = false }: LoginProps) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(isPage);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => {
    if (isPage) {
      navigate("/");
      return;
    }

    setIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Veuillez saisir votre adresse e-mail.");
      return;
    }

    if (!password) {
      setError("Veuillez saisir votre mot de passe.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Adresse e-mail ou mot de passe incorrect.");
        }

        if (response.status === 429) {
          throw new Error("Trop de tentatives. Réessayez dans quelques minutes.");
        }

        throw new Error(
          data.error || data.message || "Connexion impossible pour le moment.",
        );
      }

      if (!data.token) {
        throw new Error("Connexion impossible : aucun token reçu du serveur.");
      }

      login(data.token);
      localStorage.setItem("token", data.token);

      navigate("/"); // Redirection après connexion
    } catch (err: any) {
      if (err instanceof TypeError) {
        setError(
          "Impossible de joindre le serveur de connexion. En local, lancez le backend Symfony sur http://localhost:8000. Sur GitHub Pages, configurez VITE_API_BASE_URL avec l’URL de votre API en ligne.",
        );
        return;
      }

      setError(
        err.message ||
          "Impossible de se connecter. Vérifiez votre connexion puis réessayez.",
      );
    }
  };

  return (
    <>
      {!isPage && (
        <button
          onClick={handleOpen}
          className="bg-[#242424] text-white tracking-wider w-24 h-8 text-md px-4 rounded-md hover:text-yellow-400 hover:shadow-yellow-200 transition-colors"
        >
          Connexion
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
          <div className="bg-orange-100 text-[#242424] text-md tracking-wider p-8 rounded-lg shadow-md w-full max-w-md relative">
            
            {/* Bouton fermer en haut à droite */}
            <button
              type="button"
              onClick={handleClose}
              aria-label="Fermer la fenêtre de connexion"
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center text-xl font-bold leading-none text-[#8B0000] "
            >
              ×
            </button>

            <h2 className="text-2xl font-bold mb-6 text-center">Connexion</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 bg-orange-50 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Entrez votre email"
                  required
                />
              </div>

              {/* Mot de passe */}
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="password">
                  Mot de passe
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 bg-orange-50 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Entrez votre mot de passe"
                  required
                />
              </div>

              {/* Message d'erreur */}
              {error && <p className="text-red-600 text-sm">{error}</p>}

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Se connecter
              </button>
            </form>

            <p className="mt-4 text-md tracking-wider text-center ">
              Pas encore de compte ?{" "}
              <Link className="text-blue-600 hover:underline" to="/register">
                S'inscrire
              </Link>
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
