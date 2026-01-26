import { Link } from "react-router-dom";
import { Store, Users, Shield, CreditCard, FileCheck, Upload, CheckCircle, ClipboardCheck, ArrowRight } from "lucide-react";

const VendorOnboarding = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#1B3A5F] via-[#162e4c] to-[#102339] text-white py-20 md:py-28 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#D91C81]/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#D91C81]/10 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            
            <span className="text-sm font-medium">Join One Of The Fatest Growing Marketplace In Nigeria</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Sell on <span className="text-[#D91C81]">TalkToShop</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10">
            Reach more customers, grow your business, and sell with confidence on Nigeria's trusted marketplace
          </p>
          
          <Link
            to="/vendor/register"
            className="inline-flex items-center gap-2 bg-[#D91C81] hover:bg-[#ae1667] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg shadow-[#D91C81]/30 hover:shadow-xl hover:shadow-[#D91C81]/40 hover:-translate-y-0.5"
          >
            Join Our Vendors
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Why Sell With TalkToShop */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1B3A5F] mb-4">
              Why Sell With TalkToShop?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join our successful vendors who trust us to grow their business
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              {
                icon: Users,
                title: "Access Thousands of Buyers",
                description: "Tap into our growing customer base actively looking for products like yours"
              },
              {
                icon: Store,
                title: "Easy Product Management",
                description: "Intuitive dashboard to manage inventory, orders, and pricing effortlessly"
              },
              {
                icon: CreditCard,
                title: "Secure and fast Payments",
                description: "Get paid quickly and securely with our trusted payment processing"
              },
              {
                icon: Shield,
                title: "Trusted Nigerian Marketplace",
                description: "Built for Nigerian vendors and buyers with local support"
              }
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-[#D91C81]/20 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-[#D91C81]/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#D91C81]/20 transition-colors">
                  <item.icon className="w-6 h-6 text-[#D91C81]" />
                </div>
                <h3 className="text-lg font-semibold text-[#1B3A5F] mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1B3A5F] mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Start selling in just 4 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: 1,
                icon: FileCheck,
                title: "Pay and Register as a Vendor",
                description: "Create your vendor account with your basic information"
              },
              {
                step: 2,
                icon: ClipboardCheck,
                title: "Submit Business Details",
                description: "Provide your business information and required documents"
              },
              {
                step: 3,
                icon: CheckCircle,
                title: "Get Approved by Admin",
                description: "Our team reviews and approves your application"
              },
              {
                step: 4,
                icon: Upload,
                title: "Start Uploading Products",
                description: "List your products and start selling immediately"
              }
            ].map((item, index) => (
              <div key={index} className="relative">
                {/* Connector line */}
                {index < 3 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-full h-0.5 bg-gradient-to-r from-[#D91C81] to-[#D91C81]/30" />
                )}
                
                <div className="relative z-10 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#1B3A5F] to-[#162e4c] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-white font-bold text-xl">{item.step}</span>
                  </div>
                  <div className="w-10 h-10 bg-[#D91C81]/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <item.icon className="w-5 h-5 text-[#D91C81]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#1B3A5F] mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1B3A5F] mb-4">
              Requirements
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Make sure you have the following ready before you apply
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {[
              {
                title: "Valid Business Information",
                description: "Business name, address, phone number, and email address"
              },
              {
                title: "CAC Certificate Upload",
                description: "Proof of business registration with the Corporate Affairs Commission"
              },
              {
                title: "Agreement to Terms and Policies",
                description: "Accept our vendor terms of service, privacy policy, and marketplace guidelines"
              }
            ].map((item, index) => (
              <div
                key={index}
                className={`flex items-start gap-4 p-6 ${
                  index !== 2 ? "border-b border-gray-100" : ""
                }`}
              >
                <div className="w-8 h-8 bg-[#D91C81] rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#1B3A5F] mb-1">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-[#1B3A5F] via-[#162e4c] to-[#102339] text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D91C81]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#D91C81]/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Store className="w-12 h-12 text-[#D91C81] mx-auto mb-6" />
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Grow Your Business?
          </h2>
          
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
            Join TalkToShop today and connect with thousands of customers waiting to discover your products. Start your journey to success now.
          </p>
          
          <Link
            to="/vendor/register"
            className="inline-flex items-center gap-2 bg-[#D91C81] hover:bg-[#ae1667] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg shadow-[#D91C81]/30 hover:shadow-xl hover:shadow-[#D91C81]/40 hover:-translate-y-0.5"
          >
            Register Now
            <ArrowRight className="w-5 h-5" />
          </Link>
          
          <p className="text-white/60 text-sm mt-6">
            Already a vendor? <Link to="/vendor/login" className="text-[#D91C81] hover:underline">Sign in here</Link>
          </p>
        </div>
      </section>
    </div>
  );
};

export default VendorOnboarding;
