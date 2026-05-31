import { useState, useEffect } from "react";
import { BlogService } from "../../service/BlogService";
import { useNavigate } from "react-router-dom";

interface BlogPost {
  id: number;
  title: string;
  content: string;
  image?: string;
  video?: string | null;
  createdAt: string;
}

const VIDEO_ACCEPT =
  "video/*,.mp4,.m4v,.mov,.avi,.mkv,.webm,.ogg,.ogv,.3gp,.3g2,.wmv,.flv,.mpeg,.mpg";

export const CreateBlog = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: "",
    imageFile: null as File | null,
    video: null as File | null,
  });
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        imageFile: e.target.files[0],
        image: URL.createObjectURL(e.target.files[0]),
      });
    }
  };
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setFormData({
        ...formData,
        video: file,
      });
    }
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   try {
  //     const fd = new FormData();
  //     fd.append("title", formData.title);
  //     fd.append("content", formData.content);
  //     if (formData.imageFile) fd.append("imageFile", formData.imageFile);
  //     if (formData.video) fd.append("videoFile", formData.video);

  //     // debug
  //     for (const [k, v] of fd.entries()) console.log(k, v);

  //     await BlogService.create(fd);
  //     alert("Blog post created successfully!");
  //     navigate("/blogList");
  //     setFormData({ title: "", content: "", image: "", imageFile: null , video: null});
  //     await fetchBlogs();
  //   } catch (err) {
  //     setError("Failed to create post");
  //     console.error("Error creating post:", err);
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const fd = new FormData();
      fd.append("title", formData.title);
      fd.append("content", formData.content);
      if (formData.imageFile) fd.append("imageFile", formData.imageFile);
      if (formData.video) fd.append("videoFile", formData.video);

      await BlogService.create(fd);

      alert("Blog post created successfully!");
      navigate("/blogs");
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to create post"
      );
    }
  };

  return (
    <div className="min-h-screen bg-black/35 py-8 text-black w-full">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl text-orange-100 text-center font-bold mb-8">
          Create New Post
        </h2>
        {error && (
          <p className="mb-4 rounded bg-red-100 px-4 py-3 text-red-700">
            {error}
          </p>
        )}

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
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-4 py-2 border rounded h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="imageFile" className="block mb-2 font-medium">
              Choose Image
            </label>
            <input
              id="imageFile"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formData.image && (
              <img
                src={formData.image}
                alt="Preview"
                className="mt-4 w-40 h-40 object-cover rounded"
              />
            )}
          </div>
          <div>
            <label htmlFor="videoFile" className="block mb-2 font-medium">
              Choose Video
            </label>
            <input
              id="videoFile"
              type="file"
              accept={VIDEO_ACCEPT}
              onChange={handleVideoChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formData.video && (
              <p className="mt-2 text-sm text-gray-700">
                Vidéo sélectionnée : {formData.video.name}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Create Post
          </button>
        </form>
      </div>
    </div>
  );
};
