import { useAuth } from "../contexts/AuthContext";
import { useExit } from "../contexts/ExitContext";
import React from "react";


const Profile = () => {
  const { user } = useAuth();
   const { goBack } = useExit();
  

 

  return (
    <section>
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#242424]">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg text-justify text-gray-700">
          
          {/* Bouton X */}
          <div className="flex justify-end">
            <button
              className="border w-6 h-6 flex items-center justify-center font-bold text-red-500"
              onClick={goBack}
             
              title="Revenir à la page précédente"
              aria-label="Retour"
            >
              <a href="./Home"></a>
              X
            </button>
          </div>

          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold mb-4">
              Bienvenue, {user?.firstName} 👋
            </h1>
          </div>
          
          <ul>
            <li className="mb-2 text-2xl"><strong>Email :</strong> {user?.email}</li>
            <li className="mb-2 text-2xl"><strong>Nom d'utilisateur :</strong> {user?.username}</li>
            <li className="mb-2 text-2xl"><strong>Nom :</strong> {user?.firstName} {user?.lastName}</li>
            <li className="mb-2 text-2xl"><strong>Ville :</strong> {user?.city}, {user?.country}</li>
            <li className="mb-2 text-2xl"><strong>Centres d'intérêt :</strong> {user?.interests}</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Profile;
