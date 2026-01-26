import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { use } from "framer-motion/client";

export default function AdminAddBlog() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();


  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Auto-generate slug from title
  const handleTitleChange = (value: string) => {
    setTitle(value);
    setSlug(
      value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
    );
  };

  // Upload image to Supabase Storage
  async function uploadBlogImage(file: File) {
    setUploading(true);

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `blogs/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("blog-images")
      .upload(filePath, file);

    if (uploadError) {
      setUploading(false);
      throw uploadError;
    }

  const { data } = supabase.storage.from("blog-images").getPublicUrl(filePath);
  const publicUrl = data.publicUrl; 

  setUploading(false);
  setImageUrl(publicUrl); 
  return publicUrl;
  }



  useEffect(() => {
  if (!id) return;

  const fetchBlog = async () => {
    const { data, error } = await supabase
      .from("blogs")
      .select("title, slug, content, image_url")
      .eq("id", id)
      .single();

    if (error) {
      alert("Failed to load blog");
      return;
    }

    setTitle(data.title);
    setSlug(data.slug);
    setContent(data.content);
    setImageUrl(data.image_url);
  };

  fetchBlog();
}, [id]);
  // Submit blog
  const handleSubmit = async () => {
  if (!title || !content) {
    return alert("Title and content are required");
  }

  try {
    setLoading(true);

    //  Get the currently logged-in user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      setLoading(false);
      return alert("You must be logged in to publish a blog");
    }

    let uploadedImageUrl = imageUrl;

    //  Upload image if provided
    if (imageFile) {
      uploadedImageUrl = await uploadBlogImage(imageFile);
      setImageUrl(uploadedImageUrl);
    }

    const { error } = await supabase.from("blogs").insert({
      title,
      slug,
      content,
      image_url: uploadedImageUrl,
      published: true,
      user_id: user.id, 
    });

    if (error) throw error;

    alert("Blog published successfully!");
    navigate("/admin/blogs");
  } catch (err: any) {
    alert("Failed to publish blog: " + err.message);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Add New Blog</h1>

      {/* Title */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="Blog title"
        />
      </div>

      {/* Slug */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Slug</label>
        <input
          type="text"
          value={slug}
          readOnly
          className="w-full border rounded px-3 py-2 bg-gray-100"
        />
      </div>

      {/* Image Upload */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Blog Cover Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setImageFile(e.target.files[0]);
            }
          }}
          className="block w-full border rounded p-2"
        />
        {uploading && <p className="text-sm text-blue-600 mt-2">Uploading image...</p>}
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Preview"
            className="mt-3 w-full max-h-64 object-cover rounded"
          />
        )}
      </div>

      {/* Content */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          className="w-full border rounded px-3 py-2"
          placeholder="Write your blog content here..."
        />
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading || uploading}
        className="bg-primary-600 text-white px-6 py-3 rounded hover:bg-primary-700 disabled:opacity-50"
      >
        {loading ? "Publishing..." : "Publish Blog"}
      </button>
    </div>
  );
}
