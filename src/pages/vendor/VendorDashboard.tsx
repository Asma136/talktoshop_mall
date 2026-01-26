import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  ShoppingCart,
  Clock,
  XCircle,
} from "lucide-react";
import { supabase } from "../../lib/supabase";


interface VendorStats {
  totalProducts: number;
  
  
}

interface VendorData {
  id: string;
  businessName: string;
  status: "pending" | "approved" | "rejected";
}


const StatCard = ({
  title,
  value,
  icon: Icon,
  prefix = "",
  onClick,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  prefix?: string;
  onClick?: () => void;
}) => (
  <div
    onClick={onClick}
    className="bg-white rounded-xl border p-6 cursor-pointer hover:shadow-md transition"
  >
    <div className="flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold">
          {prefix}
          {value.toLocaleString()}
        </p>
      </div>
      <Icon className="h-6 w-6 text-[#1B3A5F]" />
    </div>
  </div>
);

const StatusCard = ({ status }: { status: "pending" | "rejected" }) => {
  const isPending = status === "pending";

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="bg-white p-8 rounded-xl text-center max-w-md">
        <div
          className={`mx-auto h-16 w-16 rounded-full flex items-center justify-center ${
            isPending ? "bg-yellow-100" : "bg-red-100"
          }`}
        >
          {isPending ? (
            <Clock className="text-yellow-600" />
          ) : (
            <XCircle className="text-red-600" />
          )}
        </div>

        <h2 className="text-xl font-semibold mt-4">
          {isPending ? "Under Review" : "Application Rejected"}
        </h2>

        <p className="text-gray-600 mt-2">
          {isPending
            ? "Your vendor account is being reviewed."
            : "Your vendor application was rejected. Contact admin."}
        </p>
      </div>
    </div>
  );
};


const VendorDashboard = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [vendor, setVendor] = useState<VendorData | null>(null);
  const [stats, setStats] = useState<VendorStats>({
    totalProducts: 0,
      
  });

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      

      /*  Check auth */
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/vendor/login");
        return;
      }

      /*  Fetch vendor profile */
      const { data: vendorData, error: vendorError } = await supabase
        .from("vendors")
        .select("id, business_name, status")
        .eq("user_id", user.id)
        .single();

      if (vendorError || !vendorData) {
        navigate("/vendor/register");
        return;
      }

      const vendorProfile: VendorData = {
        id: vendorData.id,
        businessName: vendorData.business_name,
        status: vendorData.status,
      };

      setVendor(vendorProfile);

      /*  If approved → load stats */
      if (vendorProfile.status === "approved") {
        const [{ count: productCount }] =
  await Promise.all([
    supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("vendor_id", vendorProfile.id),

    supabase
      .from("orders")
      .select("id, total_amount, items"),
  ]);


  
         
   
            

        setStats({
  totalProducts: productCount || 0,


  

  
});

      }

      setLoading(false);
    };

    loadDashboard();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="h-10 w-10 border-4 border-[#1B3A5F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!vendor) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b p-6">
        <h1 className="text-2xl font-bold">
          Welcome, {vendor.businessName}
        </h1>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {vendor.status !== "approved" ? (
          <StatusCard status={vendor.status} />
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                title="Products"
                value={stats.totalProducts}
                icon={Package}
                onClick={() => navigate("/vendor/products")}
              />
              <StatCard
                title="Orders"
                value = {""}
                icon={ShoppingCart}
                onClick={() => navigate("/vendor/orders")}
              />
              
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default VendorDashboard;
