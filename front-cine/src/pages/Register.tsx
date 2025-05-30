import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";

export const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    username: "",
    firstName: "",
    lastName: "",
    country: "",
    city: "",
    interests: "",
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Erreur lors de l'inscription");
      }

      // Rediriger vers la page de connexion après inscription
      navigate("/login");
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-center min-h-screen bg-[#242424]">
        <form
          onSubmit={handleSubmit}
          className="bg-orange-100 my-6 p-8 rounded-lg shadow-md w-full max-w-md space-y-4"
        >
          <h2 className="text-2xl tracking-wider font-bold mb-4 text-[#242424] text-center">Inscription</h2>

          {[
            ["Prénom", "firstName"],
            ["Nom", "lastName"],
            ["Nom d'utilisateur", "username"],
            ["Pays", "country"],
            ["Ville", "city"],
            ["Genres d'intérêts", "interests"],
            ["Email", "email"],
            ["Mot de passe", "password"],
          ].map(([label, name]) => (
            <div key={name}>
              <label className="block text-[#242424] text-md tracking-wider font-medium mb-1" htmlFor={name}>
                {label}
              </label>
              <input
                type={name === "password" ? "password" : "text"}
                id={name}
                name={name}
                value={form[name as keyof typeof form]}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 bg-orange-50 text-[#242424] rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`Entrez votre ${label.toLowerCase()}`}
              />
            </div>
          ))}

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 tracking-wider rounded hover:bg-blue-700 transition-colors"
          >
            S'inscrire
          </button>
        </form>
      </div>
    </div>
  );
};


