import { BlogService } from "../service/BlogService";
import React, { use, useEffect, useState } from "react";
import ButtonRouge from "./ButtonRouge";

interface BlogListProps {
  id: number;
  title: string;
  content: string;
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
        setPosts(data);
      } catch (error) {
        console.log("Error fetching posts");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <section className="bg-orange-100 text-black p-8 w-full h-screen">
      <div className="flex items-center justify-center gap-12 text-black">
        <div className="text-3xl items-center ">
          <h1 >
            {" "}
            Les dernièrs articles de blogs
          </h1>
        </div>

         <span>
            <button className="bg-[#8B0000] text-white items-center tracking-wider w-28 h-8 text-md px-4 rounded-full hover:bg-blue-800 transition-colors">
              <a href="./createBlog_page">Créer Un Blog</a>
            </button>
          </span>
          </div>
        <div className="space-y-6">
         
          {posts.
          sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                ).map((post) => (
            <article
              key={post.id}
              className="bg-orange-100 p-6 "
            >
              <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
              <p className="text-gray-600 mb-4">{post.content}</p>
              <time className="text-sm text-gray-400">
                {new Date(post.createdAt).toLocaleDateString()} | Updated on{" "}
                {new Date(post.updatedAt).toLocaleDateString()}
              </time>
            </article>
          ))}
        </div>
      
    </section>
  );
}
