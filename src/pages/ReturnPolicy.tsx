import { Link } from 'react-router-dom';

export default function ReturnPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Return Policy</h1>

      <p className="mb-4 text-gray-700">
        At TalkToShop, we want you to be completely satisfied with your purchase. 
        If you are not happy with a product, you may request a return under the conditions outlined below.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">1. Eligibility for Returns</h2>
      <p className="text-gray-700 mb-4">
        - Products must be unused, in their original packaging, and in the same condition as received.<br/>
        - Perishable items or digital products are not eligible for return.<br/>
        - Returns must be requested within 7 days of delivery.
      </p>

      
      <h2 className="text-2xl font-semibold mt-6 mb-2">2. Refunds</h2>
      <p className="text-gray-700 mb-4">
        - Once your return is approved, you will receive a message from the admin/vendor<br/>
        - Refunds are processed within 5-7 business days to your original payment method.<br/>
        - Delivery fees are non-refundable unless the return is due to our error.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">3. Exchanges</h2>
      <p className="text-gray-700 mb-4">
        - Exchanges are subject to product availability.<br/>
        - Contact our support team for assistance with exchanges.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">4. Contact Us</h2>
      <p className="text-gray-700 mb-4">
        For any questions regarding your return, please contact us at 
        <a  className="text-blue-600 hover:underline"> talktoshopmall@gmail.com</a>.
      </p>
    </div>
  );
}
