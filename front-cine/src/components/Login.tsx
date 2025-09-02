import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../App.css";
import { useAuth } from "../contexts/AuthContext";
import { Register } from "./Register";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Identifiants incorrects");
      }

      const data = await response.json();
      login(data.token);
      localStorage.setItem("token", data.token);

      navigate("/"); // Redirection après connexion
    } catch (err: any) {
      setError(err.message || "Erreur de connexion");
    }
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="bg-[#242424] text-white tracking-wider w-24 h-8 text-md px-4 rounded-md hover:text-yellow-400 hover:shadow-yellow-200 transition-colors"
      >
        Connexion
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
          <div className="bg-orange-100 text-[#242424] text-md tracking-wider p-8 rounded-lg shadow-md w-full max-w-md relative">
            
            {/* Bouton fermer en haut à droite */}
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 text-red-600 hover:text-red-800"
            >
              ✕
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
              <span className=" text-blue-600 hover:underline">
                <Link to="Register">
                </Link>
              </span>
             
             
              
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
