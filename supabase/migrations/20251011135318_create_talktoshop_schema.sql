/*
  # Talktoshop Database Schema

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `price` (numeric)
      - `category` (text)
      - `subcategory` (text)
      - `vendor` (text)
      - `image_url` (text)
      - `stock` (integer, default 100)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `orders`
      - `id` (uuid, primary key)
      - `user_email` (text)
      - `user_name` (text)
      - `user_phone` (text)
      - `user_address` (text)
      - `items` (jsonb) - array of cart items
      - `total_amount` (numeric)
      - `payment_reference` (text)
      - `status` (text, default 'completed')
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Products: Public read access, admin-only write access
    - Orders: Users can read their own orders, admin can read all
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  price numeric NOT NULL,
  category text NOT NULL,
  subcategory text DEFAULT '',
  vendor text NOT NULL,
  image_url text DEFAULT '',
  stock integer DEFAULT 100,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email text NOT NULL,
  user_name text NOT NULL,
  user_phone text DEFAULT '',
  user_address text DEFAULT '',
  items jsonb NOT NULL,
  total_amount numeric NOT NULL,
  payment_reference text NOT NULL,
  status text DEFAULT 'completed',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are publicly readable"
  ON products FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Orders readable by owner or admin"
  ON orders FOR SELECT
  TO authenticated
  USING (
    auth.jwt()->>'email' = user_email
    OR auth.jwt()->>'email' = 'talktoshopmall@gmail.com'
  );

CREATE POLICY "Orders can be created by anyone"
  ON orders FOR INSERT
  TO public
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_products_vendor ON products(vendor);
CREATE INDEX IF NOT EXISTS idx_orders_user_email ON orders(user_email);
