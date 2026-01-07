import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Product, CATEGORIES } from '../types';
import ProductCard from '../components/ProductCard';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { motion } from "framer-motion"; 


export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

   
  const heroImages = ['/hero-bg21.jpg', '/hero-bg27.jpg', '/hero-bg25.jpg'];
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    // Change background every 5 seconds
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  async function fetchFeaturedProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .limit(8);

      if (error) throw error;
      setFeaturedProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/*  Animated Hero Section */}
      <section className="relative h-[90vh] overflow-hidden text-white">
  {/* Background crossfade images */}
  {heroImages.map((image, index) => (
    <div
      key={index}
      className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
        index === currentImage ? "opacity-100" : "opacity-0"
      }`}
      style={{ backgroundImage: `url(${image})`,
        backgroundColor: '#111', // fallback color while loading
    filter: 'brightness(0.95)',
    }}
    ></div>
  ))}

  {/* Overlay */}
  <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/60"></div>

  {/* Animated Text */}
  <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
    {/* Hero Title */}
    <motion.h1
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="text-5xl font-bold mb-6"
    >
      <h1
  className="text-3xl sm:text-4xl md:text-5xl font-semibold mb-6 tracking-wide leading-tight text-center"
>
  Welcome to <span className="text-white">TalkTo</span>
  <span className="text-white">Shop</span>
</h1>

    </motion.h1>

    {/* Hero Subtitle */}
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.3 }}
      className="text-xl mb-8 text-gray-100"
    >
      Your trusted marketplace for quality products from verified vendors
    </motion.p>

    {/* Button Animation */}
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.6 }}
        className="flex flex-col sm:flex-row gap-4"

    >
      <Link
        to="/shop"
        className="inline-flex items-center bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
      >
        Start Shopping <ArrowRight className="ml-2 h-5 w-5" />
      </Link>
      
      <Link
        to="/vendor/onboarding"
        className="inline-flex items-center justify-center bg-pink-600 text-white px-8 py-3 rounded-lg font-semibold
               hover:bg-pink-700 hover:shadow-lg hover:scale-105 transition-all duration-300"
  >
        Become A Vendor
      </Link>
    </motion.div>
  </div>

  
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 1.2, duration: 0.8 }}
    className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
  >
    <ArrowDown className="w-6 h-6 animate-bounce text-white" />
  </motion.div>
</section>




      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((category) => (
            <Link
              key={category.name}
              to={`/category/${category.name}`}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow text-center group"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-primary-500 transition-colors">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
          <Link
            to="/shop"
            className="text-secondary-500 hover:text-secondary-600 font-semibold flex items-center"
          >
            View All
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md h-80 animate-pulse" />
            ))}
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No products available yet.</p>
          </div>
        )}
      </section>

      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="bg-primary-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Products</h3>
              <p className="text-gray-600">Curated selection from verified vendors</p>
            </div>
            <div>
              <div className="bg-primary-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
              <p className="text-gray-600">Safe and secure payment with method</p>
            </div>
            <div>
              <div className="bg-primary-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Quick and reliable delivery service</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
