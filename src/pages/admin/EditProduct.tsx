import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { CATEGORIES } from '../../types';

export default function EditProduct() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    subcategory: '',
    vendor: '',
    image_url: '',
    stock: ''
  });

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  async function fetchProduct() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          name: data.name,
          description: data.description || '',
          price: data.price.toString(),
          category: data.category,
          subcategory: data.subcategory || '',
          vendor: data.vendor,
          image_url: data.image_url || '',
          stock: data.stock.toString()
        });
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      alert('Failed to load product');
      navigate('/admin');
    } finally {
      setLoading(false);
    }
  }

  const selectedCategory = CATEGORIES.find((c) => c.name === formData.category);
  const subcategories = selectedCategory?.subcategories || [];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'category' ? { subcategory: '' } : {})
    }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          category: formData.category,
          subcategory: formData.subcategory,
          vendor: formData.vendor,
          image_url: formData.image_url,
          stock: parseInt(formData.stock),
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      alert('Product updated successfully!');
      navigate('/admin');
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Product</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Product Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              Price (₦) *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
              Stock Quantity *
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.name} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {subcategories.length > 0 && (
          <div>
            <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 mb-2">
              Subcategory
            </label>
            <select
              id="subcategory"
              name="subcategory"
              value={formData.subcategory}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select a subcategory</option>
              {subcategories.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label htmlFor="vendor" className="block text-sm font-medium text-gray-700 mb-2">
            Vendor Name *
          </label>
          <input
            type="text"
            id="vendor"
            name="vendor"
            value={formData.vendor}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* UPDATED IMAGE UPLOAD SECTION STARTS HERE */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Image
          </label>

          {formData.image_url && (
            <div className="mb-3">
              <img
                src={formData.image_url}
                alt="Product preview"
                className="w-32 h-32 object-cover rounded-lg border"
              />
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              const fileName = `${Date.now()}-${file.name}`;
              const { data, error } = await supabase.storage
                .from('product-images')
                .upload(`products/${fileName}`, file, { upsert: true });

              if (error) {
                alert('Image upload failed: ' + error.message);
                return;
              }

              const { data: publicData } = supabase.storage
                .from('product-images')
                .getPublicUrl(`products/${fileName}`);

              setFormData((prev) => ({
                ...prev,
                image_url: publicData.publicUrl,
              }));
            }}
            className="block w-full text-sm text-gray-700"
          />
        </div>
        {/*  UPDATED IMAGE UPLOAD SECTION ENDS HERE */}

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:bg-gray-400"
          >
            {saving ? 'Saving Changes...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
