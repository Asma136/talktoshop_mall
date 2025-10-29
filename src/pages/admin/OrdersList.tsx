import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function OrdersList() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(id: string, newStatus: string) {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      setOrders((prev) =>
        prev.map((order) =>
          order.id === id ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update order status");
    }
  }

  async function handleDelete(id: string) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      const { error } = await supabase.from("orders").delete().eq("id", id);
      if (error) throw error;
      setOrders((prev) => prev.filter((order) => order.id !== id));
      alert("Order deleted successfully!");
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Failed to delete order");
    }
  }

  const toggleExpand = (id: string) => {
    setExpandedOrder(expandedOrder === id ? null : id);
  };

  const getItemsArray = (items: any) => {
    if (!items) return [];
    if (typeof items === "string") {
      try {
        return JSON.parse(items);
      } catch {
        return [];
      }
    }
    return Array.isArray(items) ? items : [];
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Orders</h1>

      {loading ? (
        <p className="text-gray-600 text-center">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-600 text-center">No orders yet.</p>
      ) : (
        <>
          {/* 🖥 Desktop Table */}
          <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Total (₦)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => {
                  const items = getItemsArray(order.items);
                  return (
                    <>
                      <tr key={order.id}>
                        <td className="px-6 py-4">{order.user_name || "—"}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {order.user_email || "—"}
                        </td>
                        <td className="px-6 py-4 font-semibold">
                          ₦{Number(order.total_amount).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(order.id, e.target.value)
                            }
                            className={`px-3 py-1 rounded-full text-sm font-semibold cursor-pointer ${
                              order.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : order.status === "cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-right space-x-3">
                          <button
                            onClick={() => toggleExpand(order.id)}
                            className="text-blue-600 hover:underline"
                          >
                            {expandedOrder === order.id ? "Hide" : "View"}
                          </button>
                          <button
                            onClick={() => handleDelete(order.id)}
                            className="text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>

                      {expandedOrder === order.id && (
                        <tr key={`${order.id}-details`}>
                          <td colSpan={6} className="bg-gray-50 px-6 py-4">
                            <div className="text-sm text-gray-700">
                              <p>
                                <strong>Phone:</strong> {order.user_phone || "—"}
                              </p>
                              <p>
                                <strong>Address:</strong>{" "}
                                {order.user_address || "—"}
                              </p>

                              <div className="mt-2">
                                <p className="font-semibold mb-1">Items:</p>
                                <ul className="list-disc pl-6">
                                  {items.map((item: any) => (
                                    <li key={item.id}>
                                      {item.name} × {item.quantity} — ₦
                                      {(item.price * item.quantity).toLocaleString()}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* 📱 Mobile Cards */}
          <div className="space-y-4 md:hidden">
            {orders.map((order) => {
              const items = getItemsArray(order.items);
              return (
                <div
                  key={order.id}
                  className="bg-white rounded-lg shadow-md p-4 space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {order.user_name || "—"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {order.user_email || "—"}
                      </p>
                    </div>
                    <p className="font-bold">
                      ₦{Number(order.total_amount).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex justify-between items-center">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value)
                      }
                      className={`px-3 py-1 rounded-full text-sm font-semibold cursor-pointer ${
                        order.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : order.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>

                    <div className="text-xs text-gray-500">
                      {new Date(order.created_at).toLocaleString()}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 text-sm">
                    <button
                      onClick={() => toggleExpand(order.id)}
                      className="text-blue-600 hover:underline"
                    >
                      {expandedOrder === order.id ? "Hide" : "View"}
                    </button>
                    <button
                      onClick={() => handleDelete(order.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>

                  {expandedOrder === order.id && (
                    <div className="bg-gray-50 rounded p-3 text-sm text-gray-700">
                      <p>
                        <strong>Phone:</strong> {order.user_phone || "—"}
                      </p>
                      <p>
                        <strong>Address:</strong> {order.user_address || "—"}
                      </p>
                      <div className="mt-2">
                        <p className="font-semibold mb-1">Items:</p>
                        <ul className="list-disc pl-5">
                          {items.map((item: any) => (
                            <li key={item.id}>
                              {item.name} × {item.quantity} — ₦
                              {(item.price * item.quantity).toLocaleString()}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
