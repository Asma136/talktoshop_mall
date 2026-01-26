import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    const { data } = await supabase
      .from("blogs")
      .select("*")
      .order("created_at", { ascending: false });

    setBlogs(data || []);
  };

  const deleteBlog = async (id: string) => {
    if (!confirm("Delete this blog?")) return;

    await supabase.from("blogs").delete().eq("id", id);
    fetchBlogs();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">Manage Blogs</h1>
        <button
          onClick={() => navigate("/admin/blogs/new")}
          className="bg-primary-600 text-white px-4 py-2 rounded"
        >
          Add New Blog
        </button>
      </div>

      {blogs.map(blog => (
        <div key={blog.id} className="border p-4 mb-2 flex justify-between">
          <div>
            <h3 className="font-semibold">{blog.title}</h3>
            <p className="text-sm text-gray-500">
              {new Date(blog.created_at).toDateString()}
            </p>
          </div>

          <div className="space-x-2">
            <button
              onClick={() => navigate(`/admin/blogs/edit/${blog.id}`)}
              className="text-blue-600"
            >
              Edit
            </button>
            <button
              onClick={() => deleteBlog(blog.id)}
              className="text-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
