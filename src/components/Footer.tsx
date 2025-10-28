import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <img src="/IMG_0384.jpeg" alt="Talktoshop" className="h-10 mb-4" />
            <p className="text-gray-400 text-sm">
              Your trusted online marketplace for quality products from verified vendors.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/shop" className="text-gray-400 hover:text-white">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/category/Fashion & Accessories" className="text-gray-400 hover:text-white">
                  Fashion & Accessories
                </Link>
              </li>
              <li>
                <Link to="/category/Food & Groceries" className="text-gray-400 hover:text-white">
                  Food & Groceries
                </Link>
              </li>
              <li>
                <Link to="/category/Health & Beauty" className="text-gray-400 hover:text-white">
                  Health & Beauty
                </Link>
              </li>
              <li>
                <Link to="/category/Electronics & Gadgets" className="text-gray-400 hover:text-white">
                  Electronics & Gadgets
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Email: talktoshopmall@gmail.com</li>
              <li>Support: +2349025236766</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Talktoshop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
