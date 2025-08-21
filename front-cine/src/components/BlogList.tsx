import { BlogService } from "../service/BlogService";
import React, { useEffect, useState } from "react";
import ButtonRouge from "./ButtonRouge";

interface BlogListProps {
  id: number;
  title: string;
  content: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export default function BlogList() {
  const [posts, setPosts] = useState<BlogListProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await BlogService.getAll();
        setPosts(data ?? []);
      } catch (error) {
        console.error("Erreur lors du chargement des posts :", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  return (
    <section className="bg-orange-100 text-black pl-32 p-8 w-full min-h-screen">
      <div className="flex items-center justify-center gap-12 text-black mb-8">
        <h1 className="text-3xl font-bold">Les derniers articles de blogs</h1>

        <a href="./createBlog_page">
          <button className="bg-[#8B0000] text-white tracking-wider w-28 h-8 text-md px-4 rounded-full hover:bg-blue-800 transition-colors">
            Créer Un Blog
          </button>
        </a>
      </div>

      <div className="space-y-6 w-full max-w-4xl mx-auto">
        {posts
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .map((post) => (
            <article
              key={post.id}
              className="bg-orange-100 flex w-100% gap-8 rounded-lg border-b p-6"
            >
             
              <div className=  "w-150">
                <h2 className="text-2xl truncate font-semibold mb-2">{post.title}</h2>
              <p className="text-gray-600 text-wrap truncate mb-4">{post.content}</p>
              </div>
             <div className="w-50">
               {post.image && (
                <img
                  src={`http://localhost:8000/uploads/blogs/${post.image}`}
                  alt={post.title}
                  className="w-50 h-48 col-span-1 object-cover rounded-lg mb-4"
                />
              )}
              <time className="text-sm  text-gray-400">
                {new Date(post.createdAt).toLocaleDateString("fr-FR")} | Modifié
                le {new Date(post.updatedAt).toLocaleDateString("fr-FR")}
              </time>
             </div>
           
            </article>
          ))}

        <a href="#">
          <ButtonRouge />
        </a>
      </div>
    </section>
  );
}
