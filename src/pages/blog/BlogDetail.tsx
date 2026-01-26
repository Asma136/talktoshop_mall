import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useParams } from "react-router-dom";

export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState<any>(null);

  useEffect(() => {
    supabase
      .from("blogs")
      .select("*")
      .eq("slug", slug)
      .eq("published", true) 

      .single()
      .then(({ data }) => setBlog(data));
  }, [slug]);

  if (!blog) return null;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{blog.title}</h1>
      <p className="text-sm text-gray-500 mb-6">
        {new Date(blog.created_at).toDateString()}
      </p>

              <img
          src={blog.image_url}
          alt={blog.title}
          className="w-full max-h-[400px] object-cover rounded-lg mb-6"
        />


      <div className="leading-relaxed whitespace-pre-line">
        {blog.content}
      </div>
    </div>
  );
}
