import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { Trash2, Plus, Minus } from 'lucide-react';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-8">Start shopping to add items to your cart.</p>
        <Link
          to="/shop"
          className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }


  console.log('CART CONTENT:', cart);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4"
              >
                <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/96x96?text=No+Image';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      No Image
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.vendor}</p>
                  {Array.isArray(item.colors) && item.colors.length > 0 && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-gray-600 text-sm">Color:</span>
                      {item.colors.map((color, idx) => (
                        <span
                          key={idx}
                          className="w-5 h-5 rounded-full border border-gray-300"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  )}



                  <p className="text-primary-600 font-bold mt-1">₦{item.price.toLocaleString()}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="bg-gray-200 p-2 rounded-lg hover:bg-gray-300"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="bg-gray-200 p-2 rounded-lg hover:bg-gray-300"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-600 hover:text-red-700 p-2"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

            <div className="space-y-3 mb-4">
  {cart.map((item) => (
    <div key={item.id} className="flex justify-between items-start">
      <div>
        <p className="text-gray-900 font-medium">
          {item.name} × {item.quantity}
        </p>

        {Array.isArray(item.colors) && item.colors.length > 0 && (
          <div className="flex items-center gap-1 mt-1">
            <span className="text-gray-600 text-sm">Color:</span>
            {item.colors.map((color, idx) => (
              <span
                key={idx}
                className="w-4 h-4 rounded-full border border-gray-300"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        )}
      </div>

      <p className="text-gray-900 font-medium">
        ₦{(item.price * item.quantity).toLocaleString()}
      </p>
    </div>
  ))}

  <div className="flex justify-between text-gray-600 pt-2 border-t">
    <span>Subtotal</span>
    <span>₦{cartTotal.toLocaleString()}</span>
  </div>

  <div className="flex justify-between text-gray-600">
    <span>Delivery</span>
    <span>Calculated at checkout</span>
  </div>
</div>


            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between text-xl font-bold text-gray-900">
                <span>Total</span>
                <span>₦{cartTotal.toLocaleString()}</span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="block w-full bg-primary-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Proceed to Checkout
            </Link>

            <Link
              to="/shop"
              className="block w-full text-center text-primary-600 hover:text-primary-700 font-medium mt-4"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
