import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { supabase } from '../lib/supabase';

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [showBankInfo, setShowBankInfo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText('0123456789');
    alert(' Account number copied!');
  };

  // 🟩 UPDATED FUNCTION BELOW
  const handlePaymentConfirmed = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('orders').insert({
        user_email: formData.email,
        user_name: formData.name,
        user_phone: formData.phone,
        user_address: formData.address,
        items: cart,
        total_amount: cartTotal,
        payment_reference: 'BANK_TRANSFER',
        status: 'pending', 
      });

      if (error) throw error;

      alert('Order placed successfully! Please complete payment via bank transfer.');
      navigate('/thank-you');

      // 🟩 FIX: Move clearCart AFTER navigate so Thank You page loads correctly
      setTimeout(() => {
        clearCart();
      }, 500);
    } catch (error) {
      console.error('Error saving order:', error);
      alert('Failed to save order. Please contact support.');
    } finally {
      setIsSubmitting(false);
    }
  };
  // 🟩 END OF UPDATED FUNCTION

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  const isFormValid = formData.name && formData.email && formData.phone && formData.address;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Delivery Info */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Delivery Information</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Address *</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

            <div className="space-y-2 mb-4">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-sm text-gray-600">
                  <span>{item.name} x {item.quantity}</span>
                  <span>₦{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between text-xl font-bold text-gray-900">
                <span>Total</span>
                <span>₦{cartTotal.toLocaleString()}</span>
              </div>
            </div>

            {!showBankInfo ? (
              <button
                onClick={() => setShowBankInfo(true)}
                disabled={!isFormValid}
                className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                  isFormValid
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'bg-gray-400 text-white cursor-not-allowed'
                }`}
              >
                Continue to Pay
              </button>
            ) : (
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-3">Bank Transfer Details</h3>
                <p className="text-gray-700">Account Name: <strong>Abdullah Ademola Adeleke</strong></p>
                <p className="text-gray-700">Bank: <strong>Opay</strong></p>
                <p className="text-gray-700 mb-3">Account Number: <strong>6102308982</strong></p>

                <button
                  onClick={handleCopy}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mb-3"
                >
                  Copy Account Number
                </button>

                <p className="text-sm text-gray-600 mb-4">
                  After payment, send proof of payment and delivery details to our WhatsApp:{" "}
                  <a
                    href="https://wa.me/2349025236766"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 font-semibold"
                  >
                    Click here
                  </a>
                </p>

                <button
                  onClick={handlePaymentConfirmed}
                  disabled={isSubmitting}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                >
                  {isSubmitting ? 'Saving Order...' : 'I Have Made Payment'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
