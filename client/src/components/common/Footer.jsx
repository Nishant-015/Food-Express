import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Heart, ShieldCheck, Clock, Truck } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-gray-800">
          {/* Brand info */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-primary-500 flex items-center justify-center text-white">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-white">
                Foodie<span className="text-primary-500">Express</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your favorite local culinary delicacies, delivered warm and fresh to your doorstep in minutes.
            </p>
            <div className="flex items-center gap-3 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" /> 100% Hygienic & Safe Delivery
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Discover</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/restaurants" className="hover:text-primary-400 transition">
                  Browse Restaurants
                </Link>
              </li>
              <li>
                <Link to="/restaurants?cuisine=Pizza" className="hover:text-primary-400 transition">
                  Wood-fired Pizza
                </Link>
              </li>
              <li>
                <Link to="/restaurants?cuisine=Burgers" className="hover:text-primary-400 transition">
                  Gourmet Burgers
                </Link>
              </li>
              <li>
                <Link to="/restaurants?cuisine=Indian" className="hover:text-primary-400 transition">
                  Royal Indian Curries
                </Link>
              </li>
            </ul>
          </div>

          {/* Partner & Business */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">For Partners</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/register" className="hover:text-primary-400 transition">
                  Partner with Us (Register Restaurant)
                </Link>
              </li>
              <li>
                <Link to="/owner/dashboard" className="hover:text-primary-400 transition">
                  Restaurant Owner Portal
                </Link>
              </li>
              <li>
                <Link to="/admin/dashboard" className="hover:text-primary-400 transition">
                  Admin Control Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Guarantee Highlights */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Our Promise</h4>
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-white">Under 30 Min Delivery</p>
                <p className="text-xs text-gray-400">Guaranteed swift drop-off directly from partner kitchens.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Truck className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-white">Live Real-Time Tracking</p>
                <p className="text-xs text-gray-400">Step-by-step visibility from order placed to delivered.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} FoodieExpress Platform. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for food lovers everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
