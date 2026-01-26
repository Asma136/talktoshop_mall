import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type VendorStatus = "pending" | "approved" | "rejected";

interface Vendor {
  id: string;
  business_name: string;
  owner_name: string;
  email: string;
  phone: string;
  cac_url: string;
  status: VendorStatus;
}

const AdminVendorManagement = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch vendors from Supabase
  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("vendors")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch vendors:", error);
      alert("Failed to fetch vendors. Check console.");
    } else {
      setVendors(data || []);
    }

    setLoading(false);
  };

  // Update vendor status
  const updateStatus = async (id: string, status: VendorStatus) => {
    const { error } = await supabase
      .from("vendors")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update vendor status.");
      return;
    }

    setVendors((prev) =>
      prev.map((vendor) =>
        vendor.id === id ? { ...vendor, status } : vendor
      )
    );
  };

  // Delete a vendor
  const deleteVendor = async (id: string) => {
    if (!confirm("Are you sure you want to delete this vendor?")) return;

    const { error } = await supabase
      .from("vendors")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Failed to delete vendor:", error);
      alert("Failed to delete vendor.");
      return;
    }

    // Remove deleted vendor from state
    setVendors((prev) => prev.filter((vendor) => vendor.id !== id));
  };

  if (loading) {
    return <p className="p-8 text-center">Loading vendors...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Vendor Management</h1>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Business</th>
              <th className="p-3">Owner</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">CAC</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {vendors.map((vendor) => (
              <tr key={vendor.id} className="border-t">
                <td className="p-3 font-medium">{vendor.business_name}</td>
                <td className="p-3">{vendor.owner_name}</td>
                <td className="p-3">{vendor.email}</td>
                <td className="p-3">{vendor.phone}</td>
                <td className="p-3">
                  <a
                    href={
                      supabase.storage
                        .from("vendor-documents")
                        .getPublicUrl(vendor.cac_url).data.publicUrl
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline"
                  >
                    View
                  </a>
                </td>
                <td className="p-3 capitalize">{vendor.status}</td>
                <td className="p-3 text-center space-x-2">
                  <button
                    onClick={() => updateStatus(vendor.id, "approved")}
                    className="px-3 py-1 bg-green-600 text-white rounded text-xs"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => updateStatus(vendor.id, "rejected")}
                    className="px-3 py-1 bg-red-600 text-white rounded text-xs"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => deleteVendor(vendor.id)}
                    className="px-3 py-1 bg-gray-600 text-white rounded text-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {vendors.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No vendor applications found.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminVendorManagement;
