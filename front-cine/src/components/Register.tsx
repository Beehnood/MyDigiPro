import { api } from "../service/Http-service";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Register = () => {
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

  const [error, setError] = useState<string | null>(null);
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);

  // Charger la liste des genres depuis ton backend
  useEffect(() => {
  const fetchGenres = async () => {
    try {


      const response = await api.get("/movies/genres");

      console.log(response)

      // if (!response.ok) {
      //   throw new Error("Erreur lors de la récupération des genres");
      // }

      const data = await response.data;
      console.log("✅ Genres reçus :", data);
      setGenres(data); // tu affiches enfin les genres
    } catch (err) {
      console.error("❌ Erreur:", err);
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

    try {
      const response = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      console.log("register response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de l'inscription");
      }

      navigate("/login_page");
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue");
    }
  };

  return (
    <div className="flex h-full items-center justify-center min-h-screen bg-[#242424]">
      <form
        onSubmit={handleSubmit}
        className="bg-orange-100 my-6 p-8 rounded-2xl shadow-md space-y-4"
      >
        <h2 className="text-2xl  font-bold mb-4 text-[#242424] text-center">
          Inscription
        </h2>

        {/* Inputs texte */}
        <div className="flex items-centre gap-6 justify-around">
          <div className=" ">
          {[
          ["Prénom", "firstName"],
          ["Nom", "lastName"],
          ["Nom d'utilisateur", "username"],
          ["Pays", "country"],
          ["Ville", "city"],
          ["Email", "email"],
          ["Mot de passe", "password"],
        ].map(([label, name]) => (
          <div key={name}>
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
            
          </div>
          
        ))}


        </div>
          
        {/* Sélecteurs de genres */}
        <div>
          <label className="block text-[#242424] gap-6 font-medium mb-2">
            Choisissez 3 genres préférés :
          </label>
          {[0, 1, 2].map((i) => (
            <select
              key={i}
              value={form.interests[i]}
              onChange={(e) => handleGenreChange(i, e.target.value)}
              className="w-full px-3 py-2 mb-2 border border-gray-300 bg-orange-50 text-[#242424] rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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

        <div className=" flex items-center justify-center gap-6 m-2 ">
         <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
        >
          S'inscrire
        </button>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="w-full bg-yellow-400 text-black py-2 rounded hover:bg-red-700 hover:text-white transition-colors"
        >
          Accueil
        </button>
       </div>


        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

       
        </div>
      </form>
    </div>
  );
};
