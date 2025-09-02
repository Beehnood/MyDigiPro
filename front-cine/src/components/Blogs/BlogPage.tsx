import { api } from "../../service/Http-service";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

type BlogPost = {
  id: number;
  title: string;
  content: string;
  image?: string;
};

function BlogPage() {
  const { id } = useParams<{ id: string }>(); // récupération de l'id dans l'URL
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState<BlogPost | null>(null);

  const fetchBlog = async () => {
    try {
      const response = await api.get(`/blogs/${id}`);
      const data = response.data;
      console.log("✅ Blog reçu :", data);
      setBlog(data);
    } catch (err) {
      console.error("❌ error:", err);
      setError("Échec de la récupération du blog");
    } finally {
      setLoading(false);
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
    <section className="bg-orange-100 w-full min-h-screen p-8">
      <div className="container p-12 rounded-lg mx-auto">
        {/* Title */}
        <div>
          <h1 className="font-extrabold italic text-black text-6xl mb-6">
           "{blog.title}"
          </h1>
           {/* Image si dispo */}
        {blog.image && (
          <div className="w-full text-black mb-6">
            <img
              src={`http://localhost:8000/uploads/blogs/${blog.image}`}
              alt={blog.title}
              className="w-full max-h-96 object-cover rounded-lg mb-4"
            />
          </div>
        )}
        {/* content */}
          <p className="font-light text-black mb-6">{blog.content}</p>
        </div>

       
      </div>
    </section>
  );
}

export default BlogPage;
