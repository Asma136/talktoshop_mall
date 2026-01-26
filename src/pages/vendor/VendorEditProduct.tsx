import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';


import { 
  ArrowLeft, 
  Save, 
  X, 
  Plus, 
  Loader2,
  ImageIcon,
  AlertTriangle,
  Trash2,
  ChevronDown
} from 'lucide-react';

import { supabase } from "../../lib/supabase";




const CATEGORIES = [
  {
    name: 'Fashion & Accessories',
    subcategories: ['Clothing (Men)', 'Clothing (Women)', 'Clothing (Kids)', 'Shoes', 'Bags', 'Jewelry', 'Watches', 'Headwear', 'Eyewear']
  },
  {
    name: 'Food & Groceries',
    subcategories: ['Foodstuff', 'Spices & Condiments', 'Packaged Foods', 'Snacks & Drinks', 'Frozen Foods', 'Cereals & Baby Food', 'Organic/Herbal Foods']
  },
  {
    name: 'Health & Beauty',
    subcategories: ['Skincare', 'Haircare', 'Body Care', 'Perfumes', 'Makeup', 'Supplements & Vitamins', 'Herbal Products']
  },
  {
    name: 'Electronics & Gadgets',
    subcategories: ['Phones & Tablets', 'Accessories', 'Home Appliances', 'Computers & Accessories', 'TVs & Audio Devices']
  },
  {
    name: 'Home & Living',
    subcategories: ['Furniture', 'Kitchenware', 'Home Decor', 'Cleaning Supplies', 'Bedding']
  },
  {
    name: 'Baby & Kids',
    subcategories: ['Baby Clothes', 'Toys', 'Baby Care', 'School Supplies']
  },
  {
    name: 'Islamic & Religious',
    subcategories: ['Islamic Books', 'Hijabs & Jilbabs', 'Prayer Mats', 'Tasbih, Quran, etc.']
  },
  {
    name: 'Services',
    subcategories: ['Event Planning', 'Graphic Design', 'Tutorials & Online Classes', 'Repairs', 'Delivery Services']
  },
  {
    name: 'Agriculture',
    subcategories: ['Farm Produce', 'Fertilizers', 'Seeds & Tools']
  },
  {
    name: 'Automobiles',
    subcategories: ['Car Sales', 'Spare Parts', 'Car Accessories']
  }
];

// Form validation schema
const productSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().min(1, 'Price must be greater than 0'),
  stock: z.number().min(0, 'Stock cannot be negative'),
  location: z.string().min(1, 'Location is required'),
  category: z.string().min(1, 'Category is required'),
  subcategory: z.string().min(1, 'Subcategory is required'),
});

type ProductFormData = z.infer<typeof productSchema>;



const VendorEditProduct = () => {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [vendorStatus, setVendorStatus] = useState<'pending' | 'approved' | 'rejected'>('approved');
  const [productNotFound, setProductNotFound] = useState(false);
  
  // Image state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  
  // Color picker state
  const [colors, setColors] = useState<string[]>([]);
  const [currentColor, setCurrentColor] = useState('#1B3A5F');


  // Category state
  const [availableSubcategories, setAvailableSubcategories] = useState<string[]>([]);

  // Color error state (move to stateful)
  const [colorError, setColorError] = useState('');

  // Add color handler
  const addColor = () => {
    if (!/^#[0-9A-Fa-f]{6}$/.test(currentColor)) {
      setColorError('Please enter a valid hex color (e.g. #1B3A5F)');
      return;
    }
    if (colors.includes(currentColor)) {
      setColorError('Color already added');
      return;
    }
    setColors([...colors, currentColor]);
    setColorError('');
  };

  // Remove color handler
  const removeColor = (color: string) => {
    setColors(colors.filter((c) => c !== color));
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  const watchedCategory = watch('category');

  // Update subcategories when category changes
  useEffect(() => {
    if (watchedCategory) {
      const category = CATEGORIES.find(c => c.name === watchedCategory);
      if (category) {
        setAvailableSubcategories(category.subcategories);
      }
    } else {
      setAvailableSubcategories([]);
    }
  }, [watchedCategory]);
useEffect(() => {
  const fetchProduct = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/vendor/login");
        return;
      }

      // Get vendor
      const { data: vendor, error: vendorError } = await supabase
        .from("vendors")
        .select("id, status")
        .eq("user_id", user.id)
        .single();

      if (vendorError || !vendor) {
        setProductNotFound(true);
        return;
      }

      setVendorStatus(vendor.status);

      // Fetch product owned by vendor
      const { data: product, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .eq("vendor_id", vendor.id)
        .single();

      if (error || !product) {
        setProductNotFound(true);
        return;
      }

      // Populate form (MATCHES ADD PRODUCT)
      setValue("name", product.name);
      setValue("description", product.description);
      setValue("price", product.price);
      setValue("stock", product.stock);
      setValue("location", product.location);
      setValue("category", product.category);

      const category = CATEGORIES.find(c => c.name === product.category);
      if (category) {
        setAvailableSubcategories(category.subcategories);
      }

      setValue("subcategory", product.subcategory);

      setColors(product.colors || []);
      setExistingImageUrl(product.image_url || null);

    } catch (err) {
      console.error("Error fetching product:", err);
      setProductNotFound(true);
    } finally {
      setIsLoading(false);
    }
  };

  fetchProduct();
}, [productId, navigate, setValue]);



  const onSubmit = async (data: ProductFormData) => {
  setIsSubmitting(true);

  try {
    let imageUrl = existingImageUrl;

    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `products/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, imageFile, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: imageData } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      imageUrl = imageData.publicUrl;
    }

    const { error } = await supabase
      .from('products')
      .update({
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
        location: data.location,
        category: data.category,
        subcategory: data.subcategory,
        colors,
        image_url: imageUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', productId);

    if (error) throw error;

    alert('Product updated successfully');
    navigate('/vendor/products');
  } catch (err) {
    console.error(err);
    alert('Failed to update product');
  } finally {
    setIsSubmitting(false);
  }
  };


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#1B3A5F]" />
      </div>
    );
  }

  if (productNotFound) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">
            The product you're looking for doesn't exist or you don't have permission to edit it.
          </p>
          <button
            onClick={() => navigate('/vendor/products')}
            className="bg-[#1B3A5F] text-white px-6 py-2 rounded-lg hover:bg-[#152d4a] transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

    if (vendorStatus !== 'approved') {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Restricted</h2>
            <p className="text-gray-600 mb-6">
              {vendorStatus === 'pending' 
                ? 'Your vendor account is still under review.'
                : 'Your vendor account has been rejected. Please contact support.'}
            </p>
            <button
              onClick={() => navigate('/vendor/dashboard')}
              className="bg-[#1B3A5F] text-white px-6 py-2 rounded-lg hover:bg-[#152d4a] transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      );
    }

  const displayImage = imagePreview || existingImageUrl;

const removeImage = () => {
  setImageFile(null);
  setImagePreview(null);
  setExistingImageUrl(null);
};


const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }
};




  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/vendor/products')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Edit Product</h1>
            </div>
            <span className="text-sm text-gray-500">ID: {productId}</span>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Image Upload */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Product Image</h2>
            
            {displayImage ? (
              <div className="relative w-full max-w-xs">
                <img
                  src={displayImage}
                  alt="Product preview"
                  className="w-full h-48 object-cover rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                {!imagePreview && existingImageUrl && (
                  <label className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1.5 rounded-lg text-sm cursor-pointer hover:bg-white transition-colors border border-gray-200">
                    Change Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#D91C81] hover:bg-pink-50 transition-all">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <ImageIcon className="w-10 h-10 text-gray-400 mb-3" />
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-[#D91C81]">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Product Details */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Product Details</h2>
            
            <div className="space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  {...register('name')}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D91C81] focus:border-transparent outline-none transition-all"
                  placeholder="Enter product name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              {/* Category and Subcategory */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <div className="relative">
                    <select
                      {...register('category')}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D91C81] focus:border-transparent outline-none transition-all appearance-none bg-white"
                    >
                      <option value="">Select category</option>
                      {CATEGORIES.map((category) => (
                        <option key={category.name} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                  {errors.category && (
                    <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                  )}
                </div>



                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subcategory *
                  </label>
                  <div className="relative">
                    <select
                      {...register('subcategory')}
                      disabled={!watchedCategory}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D91C81] focus:border-transparent outline-none transition-all appearance-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="">
                        {watchedCategory ? 'Select subcategory' : 'Select category first'}
                      </option>
                      {availableSubcategories.map((subcategory) => (
                        <option key={subcategory} value={subcategory}>
                          {subcategory}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                  {errors.subcategory && (
                    <p className="text-red-500 text-sm mt-1">{errors.subcategory.message}</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  {...register('description')}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D91C81] focus:border-transparent outline-none transition-all resize-none"
                  placeholder="Describe your product..."
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                )}
              </div>

              {/* Price and Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (₦) *
                  </label>
                  <input
                    type="number"
                    {...register('price', { valueAsNumber: true })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D91C81] focus:border-transparent outline-none transition-all"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    {...register('stock', { valueAsNumber: true })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D91C81] focus:border-transparent outline-none transition-all"
                    placeholder="0"
                    min="0"
                  />
                  {errors.stock && (
                    <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>
                  )}
                </div>
              </div>

            
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vendor Location
                </label>
                <input
                  type="text"
                  {...register('location')}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg "
                  placeholder="Vendor location"
                />
                <p className="text-xs text-gray-500 mt-1">Enter your location</p>
              </div>
            </div>
          </div>

          {/* Color Selection */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Product Colors</h2>
            
            {/* Color Picker */}
            <div className="flex flex-wrap items-end gap-3 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={currentColor}
                    onChange={(e) => setCurrentColor(e.target.value)}
                    className="w-12 h-10 rounded cursor-pointer border border-gray-300"
                  />
                  <input
                    type="text"
                    value={currentColor}
                    onChange={(e) => setCurrentColor(e.target.value)}
                    className="w-28 px-3 py-2 border border-gray-300 rounded-lg text-sm uppercase"
                    placeholder="#000000"
                  />
                </div>
              </div>
              
              <button
                type="button"
                onClick={addColor}
                className="flex items-center gap-2 px-4 py-2 bg-[#1B3A5F] text-white rounded-lg hover:bg-[#152d4a] transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Color
              </button>
            </div>
            
            {colorError && (
              <p className="text-red-500 text-sm mb-3">{colorError}</p>
            )}

            {/* Color Swatches */}
            {colors.length > 0 ? (
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  Selected colors ({colors.length}): <span className="text-xs text-gray-400">Click to remove</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => removeColor(color)}
                      className="group relative w-10 h-10 rounded-full border-2 border-gray-200 hover:border-red-400 transition-all shadow-sm hover:shadow-md"
                      style={{ backgroundColor: color }}
                      title={`${color} - Click to remove`}
                    >
                      <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 rounded-full">
                        <X className="w-4 h-4 text-white" />
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No colors added yet</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => navigate('/vendor/products')}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-[#D91C81] text-white rounded-lg hover:bg-[#c01872] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};


  

  



export default VendorEditProduct;