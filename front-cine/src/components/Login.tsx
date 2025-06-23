import { Navbar } from "./Navbar"; 
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { useAuth } from "../contexts/AuthContext";


const Login = () => {
const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

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
        // Vérifie si la réponse est correcte
      if (!response.ok) {
        throw new Error("Identifiants incorrects");
      }

      const data = await response.json();
      login(data.token);
      localStorage.setItem("token", data.token); // ou data.jwt selon ton backend

      navigate("/"); // ou la route que tu veux après connexion
    } catch (err: any) {
      setError(err.message || "Erreur de connexion");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#242424]">
      <div className="bg-orange-100 text-[#242424] text-md tracking-wider p-8 rounded-lg shadow-md w-full max-w-md">
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
            <label
              className="block text-sm tracking-wider font-medium mb-2"
              htmlFor="password"
            >
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 tracking-wider py-2 border border-gray-300 bg-orange-50 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Entrez votre mot de passe"
              required
            />
          </div>

          {/* Message d'erreur */}
          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white tracking-wider py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Se connecter
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}

            className="w-full bg-yellow-400 text-black tracking-wider py-2 rounded hover:bg-red-700 hover:text-white transition-colors"
          >
            Acceuil
          </button>
        </form>
        <p className="mt-4 text-md tracking-wider text-center">
          Pas encore de compte ?{" "}
          <a
            href="/register"
            className="text-blue-600 hover:underline"
          >
            S'inscrire
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;