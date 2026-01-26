import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Link } from "react-router-dom";

export default function BlogList() {
  const [blogs, setBlogs] = useState<any[]>([]);

  useEffect(() => {
    supabase
      .from("blogs")
      .select("title, slug, created_at")
      .order("created_at", { ascending: false })
      .then(({ data }) => setBlogs(data || []));
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Our Blog</h1>

      {blogs.map(blog => (
        <Link
          key={blog.slug}
          to={`/blog/${blog.slug}`}
          className="block border p-4 mb-3 hover:bg-gray-50"
        >
          <h2 className="font-semibold text-lg">{blog.title}</h2>
          <p className="text-sm text-gray-500">
            {new Date(blog.created_at).toDateString()}
          </p>
        </Link>
      ))}
    </div>
  );
}
