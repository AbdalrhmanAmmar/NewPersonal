import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, PieChart, TrendingUp, Shield, ChevronRight, Check, ArrowRight, Star } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section with Gradient Background */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80')] mix-blend-overlay opacity-10 bg-cover bg-center" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Smart Money Management,
              <br />
              <span className="text-blue-200">Simplified</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto">
              Take control of your finances with our intuitive expense tracker. Set budgets, track spending, and achieve your financial goals.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-4 bg-white text-blue-600 rounded-full text-lg font-semibold hover:bg-blue-50 transition-colors flex items-center group"
              >
                Get Started Free
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 bg-blue-700 text-white rounded-full text-lg font-semibold hover:bg-blue-800 transition-colors border border-blue-400">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
              <div className="text-3xl font-bold mb-2">50K+</div>
              <div className="text-blue-100">Active Users</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
              <div className="text-3xl font-bold mb-2">$2M+</div>
              <div className="text-blue-100">Money Saved</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
              <div className="text-3xl font-bold mb-2">4.9/5</div>
              <div className="text-blue-100">User Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to master your finances
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive suite of tools helps you track, analyze, and optimize your spending habits.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Wallet className="w-8 h-8 text-blue-600" />}
              title="Smart Expense Tracking"
              description="Automatically categorize and track your expenses in real-time. Get insights into your spending patterns."
            />
            <FeatureCard
              icon={<PieChart className="w-8 h-8 text-blue-600" />}
              title="Visual Analytics"
              description="Beautiful charts and graphs help you understand where your money goes at a glance."
            />
            <FeatureCard
              icon={<TrendingUp className="w-8 h-8 text-blue-600" />}
              title="Goal Setting"
              description="Set and track financial goals with our intuitive goal-setting features and progress tracking."
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8 text-blue-600" />}
              title="Bank-Grade Security"
              description="Your financial data is protected with the highest level of encryption and security measures."
            />
            <FeatureCard
              icon={<Star className="w-8 h-8 text-blue-600" />}
              title="Custom Budgets"
              description="Create personalized budgets that match your lifestyle and financial goals."
            />
            <FeatureCard
              icon={<ArrowRight className="w-8 h-8 text-blue-600" />}
              title="Smart Notifications"
              description="Get timely alerts about unusual spending, bill payments, and goal progress."
            />
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Loved by thousands of users
            </h2>
            <p className="text-xl text-gray-600">
              Here's what our community has to say about their experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="This app has completely transformed how I manage my money. The insights are invaluable!"
              author="Sarah Johnson"
              role="Small Business Owner"
              image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150"
            />
            <TestimonialCard
              quote="Finally, an expense tracker that's both powerful and easy to use. Highly recommended!"
              author="Michael Chen"
              role="Software Engineer"
              image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150"
            />
            <TestimonialCard
              quote="The goal tracking feature helped me save for my dream vacation. It's amazing!"
              author="Emily Rodriguez"
              role="Marketing Manager"
              image="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150"
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to take control of your finances?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join thousands of users who are already mastering their money management with our app.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-4 bg-white text-blue-600 rounded-full text-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center group"
          >
            Start Your Free Trial
            <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p>© 2024 ExpenseTracker. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="p-6 rounded-2xl bg-white border border-gray-100 hover:border-blue-100 hover:shadow-lg transition-all group">
    <div className="mb-4 p-3 bg-blue-50 rounded-xl w-fit group-hover:bg-blue-100 transition-colors">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2 text-gray-900">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const TestimonialCard = ({ quote, author, role, image }: { quote: string; author: string; role: string; image: string }) => (
  <div className="p-6 rounded-2xl bg-white border border-gray-100 hover:shadow-lg transition-all">
    <div className="flex items-center mb-4">
      <img src={image} alt={author} className="w-12 h-12 rounded-full mr-4" />
      <div>
        <div className="font-semibold text-gray-900">{author}</div>
        <div className="text-gray-500 text-sm">{role}</div>
      </div>
    </div>
    <p className="text-gray-600 italic">"{quote}"</p>
  </div>
);

export default LandingPage;