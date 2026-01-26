import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';

import Home from './pages/Home';
import Shop from './pages/Shop';
import Category from './pages/Category';
import ProductDetail from './pages/ProductDetail';
import Search from './pages/Search';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ThankYou from './pages/ThankYou';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AddProduct from './pages/admin/AddProduct';
import EditProduct from './pages/admin/EditProduct';
import OrdersList from './pages/admin/OrdersList';
import MessagesList from './pages/admin/MessagesList';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VendorOnboarding from './pages/vendor/VendorOnboarding'; 
import VendorRegister from "./pages/vendor/VendorRegister";
import VendorTerms from "./pages/vendor/VendorTerms";
import VendorDashboard from "./pages/vendor/VendorDashboard";
import VendorProducts from "./pages/vendor/VendorProducts";
import VendorAddProduct from "./pages/vendor/VendorAddProduct";
import VendorEditProduct from "./pages/vendor/VendorEditProduct";
import VendorOrders from "./pages/vendor/VendorOrders";
import VendorLogin from "./pages/vendor/VendorLogin";
import AdminVendorManagement from './pages/admin/AdminVendorManagement';
import ReturnPolicy from './pages/ReturnPolicy';
import BlogList from "./pages/blog/BlogList";
import BlogDetail from "./pages/blog/BlogDetail";
import AdminBlogs from "./pages/admin/AdminBlogs";
import AdminAddBlog from "./pages/admin/AdminAddBlog";


function App() {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <CartProvider>
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/vendor/onboarding" element={<VendorOnboarding />} />
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/category/:categoryName" element={<Category />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/search" element={<Search />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/vendor/register" element={<VendorRegister />} />
                <Route path="/vendor/terms" element={<VendorTerms />} />
                <Route path="/vendor/dashboard" element={<VendorDashboard />} />
              <Route path="/vendor/products" element={<VendorProducts />} />
              <Route path="/vendor/products/add" element={<VendorAddProduct />} />
             <Route path="/vendor/products/edit/:productId" element={<VendorEditProduct />} />
              <Route path="/vendor/orders" element={<VendorOrders />} />
                <Route  path="/admin/vendors"
element={<AdminVendorManagement />}
/>
<Route path="/vendor/login" element={<VendorLogin />} />
<Route path="/return-policy" element={<ReturnPolicy />} />

<Route path="/admin/blogs" element={<AdminBlogs />} />
<Route path="/admin/blogs/new" element={<AdminAddBlog />} />
<Route path="/admin/blogs/edit/:id" element={<AdminAddBlog />} />

<Route path="/blog" element={<BlogList />} />
<Route path="/blog/:slug" element={<BlogDetail />} />













              {/*  Protected User Routes */}
              <Route
                path="/cart"
                element={
                  <ProtectedRoute>
                    <Cart />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/thank-you"
                element={
                  <ProtectedRoute>
                    <ThankYou />
                  </ProtectedRoute>
                }
              />

              {/* Admin Protected Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/add-product"
                element={
                  <ProtectedRoute adminOnly>
                    <AddProduct />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/edit-product/:id"
                element={
                  <ProtectedRoute adminOnly>
                    <EditProduct />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <ProtectedRoute adminOnly>
                    <OrdersList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/messages"
                element={
                  <ProtectedRoute adminOnly>
                    <MessagesList />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Layout>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
