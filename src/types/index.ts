export interface Product {
  vendors: any;
  colors: boolean;
  location: any;
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  subcategory: string;
  image_url: string;
  stock: number;
  created_at: string;
  updated_at: string;
    vendor_id: string;

  vendor?: {
    id: string;
    name: string;
  };

}

export interface Order {
  id: string;
  user_email: string;
  user_name: string;
  user_phone: string;
  user_address: string;
  items: CartItem[];
  total_amount: number;
  payment_reference: string;
  status: string;
  created_at: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
  vendor: string;
}

export const CATEGORIES = [
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
