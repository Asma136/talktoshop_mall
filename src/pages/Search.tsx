import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      searchProducts();
    }
  }, [query]);

  async function searchProducts() {
    try {
      setLoading(true);
      const searchTerm = `%${query}%`;

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`name.ilike.${searchTerm},vendor.ilike.${searchTerm},category.ilike.${searchTerm},subcategory.ilike.${searchTerm}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Search Results for "{query}"
      </h1>
      <p className="text-gray-600 mb-8">
        {loading ? 'Searching...' : `Found ${products.length} product${products.length !== 1 ? 's' : ''}`}
      </p>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md h-80 animate-pulse" />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg mb-4">No products found matching your search.</p>
          <p className="text-gray-500">Try different keywords or browse our categories.</p>
        </div>
      )}
    </div>
  );
}
