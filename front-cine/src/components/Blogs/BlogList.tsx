import { BlogService } from "../../service/BlogService";
import React, { useEffect, useState } from "react";
import ButtonRouge from "../Buttons/ButtonRouge";
import Button from "../Buttons/Button";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../../config";

const API_ORIGIN = API_BASE_URL.replace(/\/api$/, "");

interface BlogListProps {
  id: number;
  title: string;
  content: string;
  image?: string;
  video?: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function BlogList() {
  const [posts, setPosts] = useState<BlogListProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [navigate, setNavigate] = useState(false);

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
    <section className="bg-black/35 text-black p-4 sm:p-8 w-full min-h-screen">
      <div className="flex flex-col items-center justify-center gap-4 text-orange-100 mb-8 sm:flex-row sm:gap-12">
        <h1 className="text-center text-2xl font-bold sm:text-3xl">
          Les derniers articles de blogs
        </h1>

        <Link to="/create-blog">
          <button className="bg-[#8B0000] text-white tracking-wider w-28 text-md px-4 rounded-full hover:bg-blue-800 transition-colors">
            Créer Un Blog
          </button>
        </Link>
      </div>

      <div className="space-y-4 w-full max-w-4xl mx-auto">
        {posts
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .map((post) => (
            <article
              key={post.id}
              className="bg-orange-100/95 flex w-full flex-col gap-6 border-b rounded-lg p-4 sm:flex-row sm:p-6"
            >
              <div className="flex flex-1 flex-col">
                <h2 className="text-2xl truncate font-semibold mb-2">
                  {post.title}
                </h2>
                <p className="text-gray-600 line-clamp-3 mb-6">
                  {post.content}
                </p>
                <Link
                  className="mt-auto"
                  to={`/blog/${post.id}`}
                >
                  <Button variant="danger">En Savoir Plus</Button>
                </Link>
              </div>

              <div className="w-full sm:w-52">
                {post.image && (
                  <img
                    src={`${API_ORIGIN}/uploads/blogs/${post.image}`}
                    alt={post.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                {!post.image && post.video && (
                  <div className="mb-4">
                    {(() => {
                      const videoUrl = `${API_ORIGIN}/uploads/blogs/videos/${post.video}`;
                      return (
                        <>
                          <video
                            src={videoUrl}
                            className="w-full h-48 object-cover rounded-lg"
                            muted
                            controls
                          />
                          <a
                            href={videoUrl}
                            download
                            className="mt-2 inline-block text-blue-700 underline"
                          >
                            Télécharger
                          </a>
                        </>
                      );
                    })()}
                  </div>
                )}
                <time className="text-sm  text-gray-400">
                  {new Date(post.createdAt).toLocaleDateString("fr-FR")} |
                  Modifié le{" "}
                  {new Date(post.updatedAt).toLocaleDateString("fr-FR")}
                </time>
              </div>
            </article>
          ))}
      </div>
    </section>
  );
}
