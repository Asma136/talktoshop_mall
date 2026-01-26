import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

const VendorLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  //  Login
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    setError(error.message);
    setLoading(false);
    return;
  }

  const user = data.user;
  if (!user) {
    setError("Login failed");
    setLoading(false);
    return;
  }

  //  Fetch vendor profile 
  const { data: vendor, error: vendorError } = await supabase
    .from("vendors")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (vendorError || !vendor) {
    setError("Vendor record not found");
    setLoading(false);
    return;
  }

  // Redirect based on status 
  navigate("/vendor/dashboard");
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-2 text-center">
          Vendor Login
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Sign in to manage your store
        </p>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white py-2 rounded text-sm font-semibold"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
        <div className="text-right mt-2">
  <button
    type="button"
    onClick={() => navigate("/forgot-password")}
    className="text-sm text-blue-600 hover:underline"
  >
    Forgot password?
  </button>
</div>


        <div className="mt-6 text-center text-sm text-gray-500"> Don’t have a vendor account?{" "} <a href="/vendor/register" className="text-blue-600 hover:underline" > Register here </a> </div>
      </div>
    </div>
  );
};

export default VendorLogin;
