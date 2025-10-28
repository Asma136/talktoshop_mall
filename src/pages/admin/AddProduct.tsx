import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { CATEGORIES } from '../../types';

export default function AddProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // image file selected by admin
  const [imageFile, setImageFile] = useState<File | null>(null); // 👈 used

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    subcategory: '',
    vendor: '',
    stock: '100',
  });

  // selectedCategory + subcategories are used in the UI below
  const selectedCategory = CATEGORIES.find((c) => c.name === formData.category);
  const subcategories = selectedCategory?.subcategories || []; // 👈 used

  // handleChange is used on all text/select/textarea inputs below
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'category' ? { subcategory: '' } : {}),
    }));
  }; // 👈 used

  // image file input handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = '';

      if (imageFile) {
        setUploading(true);
        const fileName = `${Date.now()}-${imageFile.name}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(uploadData.path);

        imageUrl = publicUrlData.publicUrl;
        setUploading(false);
      }

      const { error } = await supabase.from('products').insert({
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price || '0'),
        category: formData.category,
        subcategory: formData.subcategory,
        vendor: formData.vendor,
        image_url: imageUrl,
        stock: parseInt(formData.stock || '0'),
      });

      if (error) throw error;

      alert(' Product added successfully!');
      navigate('/admin');
    } catch (err: any) {
      console.error('Error adding product:', err);
      alert('Failed to add product: ' + (err.message || JSON.stringify(err)));
    } finally {
      setLoading(false);
      setUploading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Add New Product</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* Product Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Product Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"                      // 👈 name used by handleChange
            value={formData.name}
            onChange={handleChange}          // 👈 used
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"               // 👈 name used by handleChange
            value={formData.description}
            onChange={handleChange}          // 👈 used
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Price + Stock */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              Price (₦) *
            </label>
            <input
              type="number"
              id="price"
              name="price"                     // 👈 name used by handleChange
              value={formData.price}
              onChange={handleChange}          // 👈 used
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
              name="stock"                     // 👈 name used by handleChange
              value={formData.stock}
              onChange={handleChange}          // 👈 used
              required
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            id="category"
            name="category"                    // 👈 name used by handleChange
            value={formData.category}
            onChange={handleChange}            // 👈 used
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

        {/* Subcategory - uses subcategories array */}
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

        {/* Vendor */}
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

        {/* File upload */}
        <div>
          <label htmlFor="image_file" className="block text-sm font-medium text-gray-700 mb-2">
            Product Image *
          </label>
          <input
            type="file"
            id="image_file"
            accept="image/*"
            onChange={handleImageChange}
            required
            className="w-full"
          />
          {uploading && <p className="text-sm text-gray-500 mt-2">Uploading image...</p>}
          {imageFile && (
            <p className="text-sm text-gray-500 mt-2">Selected: {imageFile.name}</p>
          )}
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:bg-gray-400"
          >
            {loading ? 'Adding Product...' : 'Add Product'}
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
