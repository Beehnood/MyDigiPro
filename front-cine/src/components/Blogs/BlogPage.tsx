import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../service/Http-service";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "../Buttons/Button";
import { BlogService } from "../../service/BlogService";
import { API_BASE_URL } from "../../config";

const API_ORIGIN = API_BASE_URL.replace(/\/api$/, "");

type BlogPost = {
  id: number;
  title: string;
  content: string;
  image?: string;
  video?: string | null;
  user: { id: number; username: string };
};

type TUser = {
  id: number;
  username: string;
};

function BlogPage() {
  const { user } = useAuth() as { user: TUser | null };
  const { id } = useParams<{ id: string }>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const navigate = useNavigate();

  const fetchBlog = async () => {
    try {
      const response = await api.get(`/blogs/${id}`);
      setBlog(response.data);
    } catch (err) {
      console.error("❌ error:", err);
      setError("Échec de la récupération du blog");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet article ?"))
      return;
    try {
      await BlogService.deleteById(Number(id));
      alert("Article supprimé avec succès");
      navigate("/blogs");
    } catch (err) {
      console.error("Erreur lors de la suppression : ", err);
      alert("Échec de la suppression de l'article");
    }
  };

  useEffect(() => {
    if (id) fetchBlog();
  }, [id]);

  if (loading) {
    return <p className="text-center text-white">Chargement...</p>;
  }

  if (error) {
    return <p className="text-center text-red-600">{error}</p>;
  }

  if (!blog) {
    return <p className="text-center text-yellow-400">Aucun article trouvé.</p>;
  }

  return (
    <section className="bg-black/35 w-full min-h-screen p-4 sm:p-8">
      <div className="container bg-orange-100/95 p-4 sm:p-8 md:p-12 rounded-lg mx-auto">
        <h1 className="font-extrabold italic text-black text-3xl sm:text-5xl md:text-6xl mb-6 break-words">
          "{blog?.title}"
        </h1>
        

        {blog.image && (
          <div className="w-full text-black mb-6">
            <img
              src={`${API_ORIGIN}/uploads/blogs/${blog?.image}`}
              alt={blog?.title}
              className="w-full max-h-96 object-cover rounded-lg mb-4"
            />
          </div>
        )}
        {blog.video && (
          <div className="w-full text-black mb-6">
            {(() => {
              const videoUrl = `${API_ORIGIN}/uploads/blogs/videos/${blog.video}`;
              return (
                <>
            <video
              src={videoUrl}
              className="w-full max-h-96 rounded-lg bg-black"
              controls
            />
                  <a
                    href={videoUrl}
                    download
                    className="mt-2 inline-block text-blue-700 underline"
                  >
                    Télécharger la vidéo
                  </a>
                </>
              );
            })()}
          </div>
        )}
         <p className="font-light bg-amber-400 text-black mb-6 p-3">{blog?.content}</p>
         {user && user.id === blog.user.id && (
        
        <div className="flex flex-col gap-4 mt-6 sm:flex-row">
          <Link to={`/editBlog/${blog.id}`}>
            <Button variant="warning">Modifier</Button>
          </Link>
          <Button onClick={handleDelete} variant="danger">
            Supprimer
          </Button>
        </div>
        
      )} 
           
      </div>
      {/* Boutons d’action → seulement pour l’auteur */}
     
       
      
    
     
    </section>
  );
}

export default BlogPage;
