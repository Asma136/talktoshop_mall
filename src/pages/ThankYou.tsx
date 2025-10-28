import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ThankYou() {
  const navigate = useNavigate();

  useEffect(() => {
    // 🎉 Trigger confetti when the page loads
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });

    // ⏳ Auto redirect after 10 seconds
    const timer = setTimeout(() => {
      navigate('/');
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <CheckCircle className="h-24 w-24 text-green-600 mx-auto mb-6 animate-bounce" />

      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Thank You for Your Order!
      </h1>

      <p className="text-lg text-gray-600 mb-6">
        We’ve received your order successfully. Please ensure you’ve completed your payment if you haven’t already.
      </p>

      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8 shadow-sm">
        <p className="text-gray-700">
          Once your payment is confirmed, our team will process your order and contact you for delivery.
        </p>
      </div>

      <div className="space-x-4">
        <Link
          to="/shop"
          className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
        >
          Continue Shopping
        </Link>

        <Link
          to="/"
          className="inline-block bg-white text-primary-600 border-2 border-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
        >
          Back to Home
        </Link>
      </div>

      <p className="text-sm text-gray-500 mt-6">
        You’ll be redirected to the home page automatically in 10 seconds...
      </p>
    </div>
  );
}
