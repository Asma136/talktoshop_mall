import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import { ShoppingCart, ArrowLeft } from 'lucide-react';




type Review = {
  id: string;
  product_id: string;
  rating: number;
  comment: string;
    user_id?: string;
  created_at: string;
};
export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);




  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  async function fetchProduct() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, description, price, stock, image_url, category, subcategory, vendors(business_name), location, created_at, updated_at, colors')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) {
        let vendor = { id: '', name: '' };
        if (Array.isArray(data.vendors) && data.vendors.length > 0) {
          const v = data.vendors[0];
          vendor = {
            id: v && typeof v === 'object' && 'id' in v && typeof v.id === 'string' ? v.id : '',
            name: v && typeof v === 'object' && 'business_name' in v && typeof v.business_name === 'string' ? v.business_name : '',
          };
        } else if (data.vendors && typeof data.vendors === 'object' && 'business_name' in data.vendors && typeof (data.vendors as any).business_name === 'string') {
          vendor = {
            id: (data.vendors as any).id || '',
            name: (data.vendors as any).business_name,
          };
        } else if (typeof data.vendors === 'string') {
          vendor = {
            id: '',
            name: data.vendors,
          };
        } else {
          vendor = { id: '', name: '' };
        }
        setProduct({
          id: data.id,
          name: data.name,
          description: data.description,
          price: data.price,
          stock: data.stock,
          image_url: data.image_url,
          category: data.category,
          subcategory: data.subcategory,
          vendor: vendor,
          vendor_id: (Array.isArray(data.vendors) && data.vendors[0] && typeof data.vendors[0] === 'object' && 'id' in data.vendors[0] && typeof data.vendors[0].id === 'string')
            ? data.vendors[0].id
            : (data.vendors && typeof data.vendors === 'object' && 'id' in data.vendors && typeof (data.vendors as any).id === 'string'
                ? (data.vendors as any).id
                : ''),
          vendors: data.vendors,
          location: data.location || '',
          created_at: data.created_at || '',
          updated_at: data.updated_at || '',
          colors: data.colors || []
        });
      } else {
        setProduct(null);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  }


async function fetchReviews() {

    if (!id) return;

  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('product_id', id)
    .order('created_at', { ascending: false });

  if (error) console.error('Error fetching reviews:', error);
  else { console.log('Fetched reviews:', data);
setReviews(data ?? []);}
}


useEffect(() => {
  if (id) fetchReviews();
}, [id]);




const [rating, setRating] = useState(0);
const [comment, setComment] = useState('');

const submitReview = async () => {

    if (rating < 1 || rating > 5) {
    return alert('Please select a rating between 1 and 5 stars');
  }

  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser();

  if (authError || !user) return alert('Failed: You must be logged in.');

  const { error } = await supabase
    .from('reviews')
    .insert([{
      product_id: id,
      rating,
      comment,
      user_id: user.id,  
    }]);

  if (error) return alert('Failed to submit review: ' + error.message);

  setRating(0);
  setComment('');
  fetchReviews(); 
};










const handleAddToCart = () => {
  if (product) {
    let vendorName: string = "Unknown vendor";
    if (typeof product.vendor === 'string') {
      vendorName = product.vendor;
    } else if (product.vendor && typeof product.vendor === 'object' && 'name' in product.vendor && typeof product.vendor.name === 'string') {
      vendorName = product.vendor.name;
    }
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        vendor: product.vendor_id || vendorName,
        colors: selectedColor ? [selectedColor] : [],

      });
    }
  }
};

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-200 rounded-lg mb-8"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-center text-gray-600">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to="/shop"
        className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Shop
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gray-100 rounded-lg overflow-hidden">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/600x600?text=No+Image';
              }}
            />
          ) : (
            <div className="w-full h-96 flex items-center justify-center text-gray-400">
              No Image Available
            </div>
          )}
        </div>

        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>

          <div className="mb-6">
            <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mr-2">
              {product.category}
            </span>
            {product.subcategory && (
              <span className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                {product.subcategory}
              </span>
            )}
          </div>

          <p>
            Vendor:{' '}
            <span className="font-medium">
              {typeof product.vendor === 'string'
                ? product.vendor || 'Unknown vendor'
                : product.vendor && typeof product.vendor === 'object' && 'name' in product.vendor && typeof product.vendor.name === 'string'
                  ? product.vendor.name
                  : 'Unknown vendor'}
            </span>
          </p>


          <div className="mb-6">
            <p className="text-4xl font-bold text-primary-600">₦{product.price.toLocaleString()}</p>
          </div>

          {product.description && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
            </div>
          )}

{product.location && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Location</h2>
              <p className="text-gray-700 whitespace-pre-line">{product.location}</p>
            </div>
          )}

          


          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
              >
                -
              </button>
              <span className="text-xl font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
              >
                +
              </button>
            </div>
          </div>
    

{Array.isArray(product.colors) && product.colors.length > 0 && (
  <div className="flex gap-2 mt-2">
    {product.colors.map((color: string, index: number) => (
      <button
        key={index}
        type="button"
        className={`w-8 h-8 rounded-full border-2 transition-all
          ${selectedColor === color ? "border-black scale-110" : "border-gray-300"}
        `}
        style={{ backgroundColor: color }}
        onClick={() => setSelectedColor(color)}
        title={color}
      />
    ))}
  </div>
)}

          <button
            onClick={handleAddToCart}
            className="w-full bg-primary-600 text-white py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center"
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            Add to Cart
          </button>

          {product.stock !== undefined && (
            <p className="text-sm text-gray-600 mt-4">
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </p>
          )}


          <div className="mt-8">
  <h2 className="text-xl font-semibold mb-4">Reviews</h2>

  {/* Existing reviews */}
  {reviews.length === 0 ? (
    <p className="text-gray-500">No reviews yet.</p>
  ) : (
    <div className="space-y-4 mb-6">
      {reviews.map((r) => (
        <div key={r.id} className="border-b pb-2">
          <div className="text-yellow-500 mb-1">
{'★'.repeat(Number(r.rating)) + '☆'.repeat(5 - Number(r.rating))}
          </div>
          <p className="text-gray-700">{r.comment}</p>
          <small className="text-gray-500">
            {new Date(r.created_at).toLocaleDateString()}
          </small>
        </div>
      ))}
    </div>
  )}

  {/* Leave a review form */}
  <div className="border p-4 rounded">
    <h3 className="text-lg font-semibold mb-2">Leave a Review</h3>

    <div className="flex items-center mb-2">
      <label className="mr-2">Rating:</label>
      <select
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        className="border px-2 py-1 rounded"
      >
        <option value={0}>Select rating</option>
        <option value={1}>1 ★</option>
        <option value={2}>2 ★</option>
        <option value={3}>3 ★</option>
        <option value={4}>4 ★</option>
        <option value={5}>5 ★</option>
      </select>
    </div>

    <textarea
      value={comment}
      onChange={(e) => setComment(e.target.value)}
      className="w-full border rounded p-2 mb-2"
      placeholder="Write your review..."
      rows={3}
    />

    <button
      onClick={submitReview}
      className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 cursor-pointer"
    >
      Submit Review
    </button>
  </div>
</div>


        </div>
      </div>
    </div>
  );
}
