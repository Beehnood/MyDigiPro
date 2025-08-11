import { useState, useEffect } from "react";
import { BlogService } from "../service/BlogService"; // Corrigez le chemin si nécessaire

interface BlogPost {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

export const CreateBlog = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await BlogService.getAll();
      setBlogs(response);
    } catch (err) {
      setError("Failed to fetch blogs");
      console.error("Error fetching blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await BlogService.create(formData);
      alert("Blog post created successfully!");
      setFormData({ title: "", content: "" });
      // Rafraîchir la liste après création
      await fetchBlogs();
    } catch (err) {
      setError("Failed to create post");
      console.error("Error creating post:", err);
    }
  };

  return (
    <div className="bg-[#242424] min-h-screen py-8 text-black w-full">
      <div className="  max-w-4xl mx-auto">
        <h2 className="text-2xl text-orange-100 text-center font-bold mb-8">
          Create New Post
        </h2>

        {/* Formulaire de création */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-orange-100 p-6 rounded-lg shadow-md mb-8"
        >
          <div>
            <label htmlFor="title" className="block mb-2 font-medium">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="content" className="block mb-2 font-medium">
              Content
            </label>
            <textarea
              id="content"
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Create Post
          </button>
        </form>

        {/* Liste des articles */}
        <div className="space-y-4">
          <h3 className="text-xl  text-orange-100 font-semibold mb-4">
            Recent Posts
          </h3>

          {loading && <p className="text-center py-4">Loading...</p>}
          {error && <p className="text-red-500 text-center py-4">{error}</p>}

          {blogs.length > 0
            ? blogs
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                .map((blog) => (
                  <article
                    key={blog.id}
                    className="bg-orange-100 p-6 rounded-lg shadow-md"
                  >
                    <h4 className="text-lg font-semibold mb-2">{blog.title}</h4>
                    <p className="text-gray-700 mb-3">{blog.content}</p>
                    <p className="text-sm text-gray-500">
                      Posted on: {new Date(blog.createdAt).toLocaleDateString()}
                    </p>
                  </article>
                ))
            : !loading && <p className="text-center py-4">No blog posts yet</p>}
        </div>
      </div>
    </div>
  );
};
