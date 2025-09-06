import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../service/Http-service";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "../Buttons/Button";
import { BlogService } from "../../service/BlogService";

type BlogPost = {
  id: number;
  title: string;
  content: string;
  image?: string;
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
      navigate("/blogList");
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
  console.log("user",user)
   console.log("user.id", user?.id)
    console.log(blog.user.id)
     console.log("blog",blog)

  return (
    <section className="bg-orange-100 w-full min-h-screen p-8">
      <div className="container p-12 rounded-lg mx-auto">
        <h1 className="font-extrabold italic text-black text-6xl mb-6">
          "{blog?.title}"
        </h1>
        

        {blog.image && (
          <div className="w-full text-black mb-6">
            <img
              src={`http://localhost:8000/uploads/blogs/${blog?.image}`}
              alt={blog?.title}
              className="w-full max-h-96 object-cover rounded-lg mb-4"
            />
          </div>
        )}
         <p className="font-light bg-amber-400 text-black mb-6">{blog?.content}</p>
         {user && user.id === blog.user.id && (
        
        <div className="flex gap-4 mt-6">
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
