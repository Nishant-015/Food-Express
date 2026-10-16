import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import {
  UtensilsCrossed,
  ShoppingBag,
  User,
  LogOut,
  Menu,
  X,
  Compass,
  ClipboardList,
  Store,
  ShieldAlert,
  ChevronDown
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isCustomer, isOwner, isAdmin, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-primary-400 flex items-center justify-center text-white shadow-md shadow-primary-500/20 group-hover:scale-105 transition transform">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-gray-900 group-hover:text-primary-600 transition">
                Foodie<span className="text-primary-500">Express</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {/* If Admin */}
            {isAdmin && (
              <>
                <Link
                  to="/admin/dashboard"
                  className={`px-3 py-2 rounded-xl text-sm font-semibold transition ${
                    isActive('/admin/dashboard')
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Admin Overview
                </Link>
                <Link
                  to="/admin/users"
                  className={`px-3 py-2 rounded-xl text-sm font-semibold transition ${
                    isActive('/admin/users')
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Users
                </Link>
                <Link
                  to="/admin/restaurants"
                  className={`px-3 py-2 rounded-xl text-sm font-semibold transition ${
                    isActive('/admin/restaurants')
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Restaurants
                </Link>
                <Link
                  to="/admin/orders"
                  className={`px-3 py-2 rounded-xl text-sm font-semibold transition ${
                    isActive('/admin/orders')
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  All Orders
                </Link>
              </>
            )}

            {/* If Restaurant Owner */}
            {isOwner && (
              <>
                <Link
                  to="/owner/dashboard"
                  className={`px-3 py-2 rounded-xl text-sm font-semibold transition ${
                    isActive('/owner/dashboard')
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/owner/restaurant"
                  className={`px-3 py-2 rounded-xl text-sm font-semibold transition ${
                    isActive('/owner/restaurant')
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Restaurant
                </Link>
                <Link
                  to="/owner/menu"
                  className={`px-3 py-2 rounded-xl text-sm font-semibold transition ${
                    isActive('/owner/menu')
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Menu
                </Link>
                <Link
                  to="/owner/orders"
                  className={`px-3 py-2 rounded-xl text-sm font-semibold transition ${
                    isActive('/owner/orders')
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Orders
                </Link>
              </>
            )}

            {/* Customer & Public Links */}
            {!isAdmin && !isOwner && (
              <>
                <Link
                  to="/"
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition ${
                    isActive('/')
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/restaurants"
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-1.5 ${
                    isActive('/restaurants')
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Compass className="w-4 h-4" />
                  Restaurants
                </Link>

                {isAuthenticated && (
                  <Link
                    to="/orders"
                    className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-1.5 ${
                      isActive('/orders')
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <ClipboardList className="w-4 h-4" />
                    My Orders
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Shopping Cart button (Visible for Customers / Guests) */}
            {!isAdmin && !isOwner && (
              <Link
                to="/cart"
                className="relative p-2.5 rounded-xl text-gray-700 hover:bg-gray-100 hover:text-primary-600 transition"
                title="View Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {cart.itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-scale-in">
                    {cart.itemCount}
                  </span>
                )}
              </Link>
            )}

            {/* User Dropdown or Login/Register */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-semibold transition"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 text-white flex items-center justify-center text-xs uppercase font-bold">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="hidden sm:inline max-w-[100px] truncate">{user?.name}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-fade-in"
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs text-gray-400 font-medium">Signed in as</p>
                      <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-primary-50 text-primary-600">
                        {user?.role?.replace('_', ' ')}
                      </span>
                    </div>

                    {isCustomer && (
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition"
                      >
                        <User className="w-4 h-4" />
                        My Profile & Addresses
                      </Link>
                    )}

                    {isOwner && (
                      <Link
                        to="/owner/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition"
                      >
                        <Store className="w-4 h-4" />
                        Partner Dashboard
                      </Link>
                    )}

                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition"
                      >
                        <ShieldAlert className="w-4 h-4" />
                        Platform Admin
                      </Link>
                    )}

                    <div className="border-t border-gray-100 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-primary-600 transition"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold bg-primary-500 hover:bg-primary-600 text-white rounded-xl shadow-md shadow-primary-500/20 transition"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-xl transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-2 pb-6 space-y-1">
          {isAdmin ? (
            <>
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-base font-semibold text-gray-700 hover:bg-gray-50"
              >
                Admin Overview
              </Link>
              <Link
                to="/admin/users"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-base font-semibold text-gray-700 hover:bg-gray-50"
              >
                User Management
              </Link>
              <Link
                to="/admin/restaurants"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-base font-semibold text-gray-700 hover:bg-gray-50"
              >
                Restaurants
              </Link>
              <Link
                to="/admin/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-base font-semibold text-gray-700 hover:bg-gray-50"
              >
                All Orders
              </Link>
            </>
          ) : isOwner ? (
            <>
              <Link
                to="/owner/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-base font-semibold text-gray-700 hover:bg-gray-50"
              >
                Dashboard
              </Link>
              <Link
                to="/owner/restaurant"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-base font-semibold text-gray-700 hover:bg-gray-50"
              >
                My Restaurant
              </Link>
              <Link
                to="/owner/menu"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-base font-semibold text-gray-700 hover:bg-gray-50"
              >
                Manage Menu
              </Link>
              <Link
                to="/owner/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-base font-semibold text-gray-700 hover:bg-gray-50"
              >
                Live Orders
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-base font-semibold text-gray-700 hover:bg-gray-50"
              >
                Home
              </Link>
              <Link
                to="/restaurants"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-base font-semibold text-gray-700 hover:bg-gray-50"
              >
                Restaurants
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    to="/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl text-base font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    My Orders
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl text-base font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Profile
                  </Link>
                </>
              )}
            </>
          )}

          {isAuthenticated ? (
            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-base font-semibold text-rose-600 hover:bg-rose-50"
            >
              Log Out
            </button>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-800"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 bg-primary-500 rounded-xl text-sm font-semibold text-white shadow-md"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
