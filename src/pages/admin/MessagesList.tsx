import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function MessagesList() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      console.error("Error fetching messages:", err);
      alert("Failed to load messages");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this message?"
    );
    if (!confirmDelete) return;

    try {
      const { error } = await supabase.from("messages").delete().eq("id", id);
      if (error) throw error;

      setMessages((prev) => prev.filter((m) => m.id !== id));
      alert("Message deleted successfully!");
    } catch (err) {
      console.error("Error deleting message:", err);
      alert("Failed to delete message");
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Messages</h1>

      {loading ? (
        <p className="text-gray-600 text-center">Loading messages...</p>
      ) : messages.length === 0 ? (
        <p className="text-gray-600 text-center">No messages found.</p>
      ) : (
        <>
          {/* 🖥 Desktop Table View */}
          <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full border border-gray-200 text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-3 text-left font-semibold">Name</th>
                  <th className="p-3 text-left font-semibold">Email</th>
                  <th className="p-3 text-left font-semibold">Subject</th>
                  <th className="p-3 text-left font-semibold">Message</th>
                  <th className="p-3 text-left font-semibold">Date</th>
                  <th className="p-3 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((m) => (
                  <tr
                    key={m.id}
                    className="border-t hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-3 text-gray-800">{m.name}</td>
                    <td className="p-3 text-gray-600 break-all">{m.email}</td>
                    <td className="p-3 text-gray-700">{m.subject}</td>
                    <td className="p-3 text-gray-600 text-sm max-w-xs break-words whitespace-pre-wrap">
                      {m.message}
                    </td>
                    <td className="p-3 text-gray-500 text-xs">
                      {new Date(m.created_at).toLocaleString()}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDelete(m.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 📱 Mobile Card View */}
          <div className="space-y-4 md:hidden">
            {messages.map((m) => (
              <div
                key={m.id}
                className="bg-white rounded-lg shadow-md p-4 space-y-2"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-900">{m.name}</p>
                    <p className="text-xs text-gray-500 break-all">{m.email}</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    {new Date(m.created_at).toLocaleString()}
                  </p>
                </div>

                <p className="text-sm text-gray-700 font-semibold">
                  {m.subject}
                </p>

                <p className="text-sm text-gray-600 whitespace-pre-wrap break-words">
                  {m.message}
                </p>

                <div className="flex justify-end">
                  <button
                    onClick={() => handleDelete(m.id)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
