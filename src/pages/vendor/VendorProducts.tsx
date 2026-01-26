import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  Plus,
  Pencil,
  Trash2,
  AlertTriangle,
  Search,
  MoreVertical,
  ImageIcon,
} from "lucide-react";
import { supabase } from "../../lib/supabase";


interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  image_url: string | null;
  category: string;
  subcategory: string;
}

interface VendorData {
  id: string;
  businessName: string;
  status: "pending" | "approved" | "rejected";
}


const ProductCard = ({
  product,
  onEdit,
  onDelete,
}: {
  product: Product;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  const [menu, setMenu] = useState(false);

  const stockBadge =
    product.stock === 0
      ? "bg-red-100 text-red-700"
      : product.stock < 10
      ? "bg-yellow-100 text-yellow-700"
      : "bg-green-100 text-green-700";

  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      <div className="relative aspect-square bg-gray-100">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <ImageIcon className="h-12 w-12 text-gray-300" />
          </div>
        )}

        <button
          onClick={() => setMenu(!menu)}
          className="absolute top-2 right-2 bg-white rounded-full p-1 shadow"
        >
          <MoreVertical size={16} />
        </button>

        {menu && (
          <div className="absolute right-2 top-10 bg-white border rounded shadow z-10">
            <button
              onClick={() => onEdit(product.id)}
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 w-full text-sm"
            >
              <Pencil size={14} /> Edit
            </button>
            <button
              onClick={() => onDelete(product.id)}
              className="flex items-center gap-2 px-4 py-2 hover:bg-red-50 text-red-600 w-full text-sm"
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        )}
      </div>

      <div className="p-4">
        <p className="text-xs text-gray-500">{product.category}</p>
        <h3 className="font-semibold truncate">{product.name}</h3>
        <p className="text-[#1B3A5F] font-bold mt-1">
          ₦{product.price.toLocaleString()}
        </p>

        <div className="flex justify-between mt-2 text-sm">
          <span className={`px-2 py-1 rounded ${stockBadge}`}>
            {product.stock} units
          </span>
        </div>
      </div>
    </div>
  );
};


const WarningCard = ({ status }: { status: "pending" | "rejected" }) => (
  <div className="flex justify-center items-center min-h-[60vh]">
    <div className="bg-white p-8 rounded-xl text-center max-w-md">
      <AlertTriangle className="mx-auto text-yellow-500 mb-4" size={40} />
      <h2 className="text-xl font-semibold">Access Restricted</h2>
      <p className="text-gray-600 mt-2">
        {status === "pending"
          ? "Your vendor account is under review."
          : "Your vendor account was rejected. Contact admin."}
      </p>
    </div>
  </div>
);


const VendorProducts = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [vendor, setVendor] = useState<VendorData | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      /*  Auth */
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/vendor/login");
        return;
      }

      /*  Vendor */
      const { data: vendorData } = await supabase
        .from("vendors")
        .select("id, business_name, status")
        .eq("user_id", user.id)
        .single();

      if (!vendorData) {
        navigate("/vendor/register");
        return;
      }

      setVendor({
        id: vendorData.id,
        businessName: vendorData.business_name,
        status: vendorData.status,
      });

      /*  Products */
      if (vendorData.status === "approved") {
        const { data: productData } = await supabase
          .from("products")
          .select("id, name, price, stock, image_url, category, subcategory")
          .eq("vendor_id", vendorData.id)
          .order("created_at", { ascending: false });

        setProducts(productData || []);
      }

      setLoading(false);
    };

    loadData();
  }, [navigate]);

  const confirmDelete = async () => {
    if (!deleteId || !vendor) return;

    await supabase
      .from("products")
      .delete()
      .eq("id", deleteId)
      .eq("vendor_id", vendor.id);

    setProducts(products.filter((p) => p.id !== deleteId));
    setDeleteId(null);
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="h-10 w-10 border-4 border-[#1B3A5F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Package /> My Products
        </h1>

        {vendor?.status === "approved" && (
          <button
            onClick={() => navigate("/vendor/products/add")}
            className="bg-[#D91C81] text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus size={18} /> Add Product
          </button>
        )}
      </div>

      {vendor?.status !== "approved" ? (
        <WarningCard status={vendor!.status} />
      ) : (
        <>
          <div className="relative mb-6 max-w-md">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="pl-10 w-full border rounded-lg p-2"
            />
          </div>

          {filtered.length === 0 ? (
            <p className="text-gray-500">No products found.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={(id) => navigate(`/vendor/products/edit/${id}`)}
                  onDelete={(id) => setDeleteId(id)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* DELETE CONFIRM */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg">
            <p className="mb-4">Delete this product?</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)}>Cancel</button>
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorProducts;
