import { BlogService } from "../service/BlogService";
import React, { use, useEffect, useState } from "react";
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
    <section className="bg-orange-100 text-black pl-32 p-8 w-full h-screen">
      <div className=" flex items-center justify-center gap-12 text-black">
        <div className="flex text-3xl items-center ">
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
        <div className=" flex flex-col justify-center space-y-6 w-200 bg-amber-600">
         
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
              {post.image && (
                <img
                src={post.image} alt={post.title} className="w-full h-48 object-cover rounded-lg mb-4"  
                />
              )}
              <time className="text-sm text-gray-400">
                {new Date(post.createdAt).toLocaleDateString()} | Updated on{" "}
                {new Date(post.updatedAt).toLocaleDateString()}
              </time>
            </article>
          ))}
          <a href=""><ButtonRouge/></a>
        </div>
      
    </section>
  );
}
