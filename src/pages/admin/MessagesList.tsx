import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function MessagesList() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  // 🟢 Fetch all messages
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

  // 🟢 Delete message
  async function handleDelete(id: string) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this message?"
    );
    if (!confirmDelete) return;

    try {
      const { error } = await supabase.from("messages").delete().eq("id", id);
      if (error) throw error;

      // Update UI immediately
      setMessages((prev) => prev.filter((m) => m.id !== id));
      alert("Message deleted successfully!");
    } catch (err) {
      console.error("Error deleting message:", err);
      alert("Failed to delete message");
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md overflow-x-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Messages</h1>

      {loading ? (
        <p className="text-gray-600 text-center">Loading messages...</p>
      ) : messages.length === 0 ? (
        <p className="text-gray-600 text-center">No messages found.</p>
      ) : (
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

                {/* 🟢 Make message smaller and wrapped */}
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
      )}
    </div>
  );
}
