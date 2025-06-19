import { useAuth } from "../contexts/AuthContext";

const Profile = () => {
  const { user } = useAuth();

//   if (!user) return null; // Par sécurité

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#242424]">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg text-center text-gray-700">
        <h1 className="text-2xl font-bold mb-4">
          Bienvenue, {user?.firstName} 👋
        </h1>
        <p className="mb-2">
          <strong>Email :</strong> {user?.email}
        </p>
        <p className="mb-2">
          <strong>Nom d'utilisateur :</strong> {user?.username}
        </p>
        <p className="mb-2">
          <strong>Nom :</strong> {user?.firstName} {user?.lastName}
        </p>
        <p className="mb-2">
          <strong>Ville :</strong> {user?.city}, {user?.country}
        </p>
        <p className="mb-2">
          <strong>Centres d'intérêt :</strong> {user?.interests}
        </p>
      </div>
    </div>
  );
};

export default Profile;
