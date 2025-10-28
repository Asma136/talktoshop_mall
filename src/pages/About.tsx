export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">About Talktoshop</h1>

      <div className="prose prose-lg max-w-none">
        <p className="text-gray-700 mb-6">
          Talktoshop is your trusted online marketplace connecting quality vendors with customers
          across Nigeria. We pride ourselves on offering a diverse range of products from verified
          sellers, ensuring you get the best shopping experience.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Our Mission</h2>
        <p className="text-gray-700 mb-6">
          To provide a seamless online shopping platform that empowers both vendors and customers,
          making quality products accessible to everyone.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Why Choose Us?</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
          <li>Wide range of products across multiple categories</li>
          <li>Verified vendors and quality assurance</li>
          <li>Secure payment</li>
          <li>Fast and reliable delivery</li>
          <li>Excellent customer support</li>
          <li>Competitive pricing</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Our Categories</h2>
        <p className="text-gray-700 mb-6">
          We offer products in Fashion & Accessories, Food & Groceries, Health & Beauty,
          Electronics & Gadgets, Home & Living, Baby & Kids, Islamic & Religious items,
          Services, Agriculture, and Automobiles. ETC
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Contact Us</h2>
        <p className="text-gray-700">
          Have questions? Reach out to us at{' '}
          <a href="mailto:talktoshopmall@gmail.com" className="text-primary-600 hover:text-primary-700">
            talktoshopmall@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}
