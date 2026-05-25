import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../service/Http-service";

function EditBlogPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<{
    title: string;
    content: string;
    image: string | null;
    imageFile?: File | null;
  }>({
    title: "",
    content: "",
    image: null,
    imageFile: null,
  });

  // Charger le blog existant
  useEffect(() => {
    if (!id) return;
    api
      .get(`/blogs/${id}`)
      .then((res) => {
        setFormData({
          title: res.data.title,
          content: res.data.content,
          image: res.data.image
            ? `http://127.0.0.1:8000/uploads/blogs/${res.data.image}`
            : null,
          imageFile: null,
        });
      })
      .catch((err) => console.error("Erreur chargement blog:", err));
  }, [id]);

  // Gérer l'image choisie
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setFormData({
        ...formData,
        imageFile: file,
        image: URL.createObjectURL(file),
      });
    }
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("content", formData.content);
      if (formData.imageFile) {
        data.append("imageFile", formData.imageFile);
      }

      data.append("_method", "PUT")

    
      await api.post(`/blogs/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });


      alert("Blog modifié avec succès !");
      navigate(`/blogList`);
    } catch (err) {
      console.error("Erreur lors de la modification :", err);
      alert("Impossible de modifier le blog.");
    }
  };

  return (
    <div className="min-h-screen bg-black/35 py-8 text-black w-full">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl text-orange-100 text-center font-bold mb-8">
          Edit Blog Post
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-orange-100 p-6 rounded-lg shadow-md mb-8"
        >
          {/* Title */}
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

          {/* Content */}
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

          {/* Image */}
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

          {/* Button */}
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditBlogPage;
