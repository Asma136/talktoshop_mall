import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import { supabase } from "../../lib/supabase";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
  colors?: string;
}

interface VendorOrder {
  id: string;
  order_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  items: OrderItem[];
  total_amount: number;
  created_at: string;
}

export default function VendorOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState<VendorOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<VendorOrder[]>([]);
  const [search, setSearch] = useState("");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    fetchVendorOrders();
  }, []);

  async function fetchVendorOrders() {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("Vendor not logged in");
        return;
      }

      const vendorId = user.id;
      console.log(" Vendor ID:", vendorId);

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const vendorOrders: VendorOrder[] = [];

      data.forEach((order: any) => {
        const items = Array.isArray(order.items) ? order.items : [];

        //  Vendor filtering logic can be added later here
        const vendorItems = items;

        if (vendorItems.length === 0) return;

        const total = vendorItems.reduce(
          (sum: number, item: any) =>
            sum + item.price * item.quantity,
          0
        );

        vendorOrders.push({
          id: order.id,
          order_id: order.id.slice(0, 8).toUpperCase(),
          customer_name: order.user_name,
          customer_email: order.user_email,
          customer_phone: order.user_phone,
          customer_address: order.user_address,
          items: vendorItems,
          total_amount: total,
          created_at: order.created_at,
        });
      });

      setOrders(vendorOrders);
      setFilteredOrders(vendorOrders);
    } catch (err) {
      console.error("Error loading vendor orders:", err);
    }
  }

  useEffect(() => {
    setFilteredOrders(
      orders.filter(
        (o) =>
          o.order_id.toLowerCase().includes(search.toLowerCase()) ||
          o.customer_name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, orders]);

  const toggleExpand = (id: string) => {
    setExpandedOrder(expandedOrder === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <button
        onClick={() => navigate("/vendor/dashboard")}
        className="flex items-center gap-2 mb-6 text-sm"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <h1 className="text-2xl font-bold mb-4">Vendor Orders</h1>

      <div className="mb-4 relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={16} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search orders..."
          className="pl-10 w-full border rounded p-2"
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Order</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-right"></th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map((order) => (
              <>
                <tr key={order.id} className="border-t">
                  <td className="p-3">#{order.order_id}</td>
                  <td className="p-3">{order.customer_name}</td>
                  <td className="p-3 font-semibold">
                    ₦{order.total_amount.toLocaleString()}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => toggleExpand(order.id)}
                      className="text-blue-600 hover:underline"
                    >
                      {expandedOrder === order.id ? "Hide" : "View"}
                    </button>
                  </td>
                </tr>

                {expandedOrder === order.id && (
                  <tr key={`${order.id}-details`}>
                    <td colSpan={4} className="bg-gray-50 p-4">
                      <div className="text-sm text-gray-700 space-y-3">
                        <p>
                          <strong>Email:</strong> {order.customer_email}
                        </p>
                        <p>
                          <strong>Phone:</strong> {order.customer_phone}
                        </p>
                        <p>
                          <strong>Delivery Address:</strong>{" "}
                          {order.customer_address}
                        </p>

                        <div>
                          <p className="font-semibold mb-1">Items:</p>
                          <ul className="list-disc pl-5 space-y-1">
                            {order.items.map((item) => (
                              <li key={item.id}>
                                {item.name} × {item.quantity} — ₦
                                {(item.price * item.quantity).toLocaleString()}

                                {(item.colors || Array.isArray(item.colors)) && (
  <div className="flex items-center gap-1 mt-1">
    <span className="text-gray-600 text-xs">Color:</span>

    {Array.isArray(item.colors)
      ? item.colors.map((color: string, idx: number) => (
          <span
            key={idx}
            className="w-4 h-4 rounded-full border border-gray-300 inline-block"
            style={{ backgroundColor: color }}
            title={color}
          />
        ))
      : (
          <span
            className="w-4 h-4 rounded-full border border-gray-300 inline-block"
            style={{ backgroundColor: item.colors }}
            title={item.colors}
          />
        )}
  </div>
)}


                              </li>
                            ))}
                          </ul>
                        </div>

                        <p className="text-xs text-gray-500">
                          Ordered on{" "}
                          {new Date(order.created_at).toLocaleString()}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
