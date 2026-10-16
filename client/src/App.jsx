import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Providers
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';

// Layout Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Public Pages
import HomePage from './pages/public/HomePage';
import RestaurantListingPage from './pages/public/RestaurantListingPage';
import RestaurantDetailsPage from './pages/public/RestaurantDetailsPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import NotFoundPage from './pages/public/NotFoundPage';

// Customer Pages
import CartPage from './pages/customer/CartPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import OrdersPage from './pages/customer/OrdersPage';
import OrderDetailsPage from './pages/customer/OrderDetailsPage';
import ProfilePage from './pages/customer/ProfilePage';

// Owner Pages
import OwnerDashboard from './pages/owner/OwnerDashboard';
import RestaurantManagePage from './pages/owner/RestaurantManagePage';
import MenuManagePage from './pages/owner/MenuManagePage';
import OwnerOrdersPage from './pages/owner/OwnerOrdersPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagePage from './pages/admin/UserManagePage';
import RestaurantAdminPage from './pages/admin/RestaurantAdminPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <div className="flex flex-col min-h-screen bg-gray-50/50">
              <Navbar />

              <main className="flex-1">
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/restaurants" element={<RestaurantListingPage />} />
                  <Route path="/restaurants/:id" element={<RestaurantDetailsPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />

                  {/* Customer authenticated routes */}
                  <Route
                    path="/cart"
                    element={
                      <ProtectedRoute allowedRoles={['customer', 'admin']}>
                        <CartPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/checkout"
                    element={
                      <ProtectedRoute allowedRoles={['customer', 'admin']}>
                        <CheckoutPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/orders"
                    element={
                      <ProtectedRoute allowedRoles={['customer', 'admin']}>
                        <OrdersPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/orders/:id"
                    element={
                      <ProtectedRoute allowedRoles={['customer', 'restaurant_owner', 'admin']}>
                        <OrderDetailsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Restaurant Owner routes */}
                  <Route
                    path="/owner/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={['restaurant_owner', 'admin']}>
                        <OwnerDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/owner/restaurant"
                    element={
                      <ProtectedRoute allowedRoles={['restaurant_owner', 'admin']}>
                        <RestaurantManagePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/owner/menu"
                    element={
                      <ProtectedRoute allowedRoles={['restaurant_owner', 'admin']}>
                        <MenuManagePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/owner/orders"
                    element={
                      <ProtectedRoute allowedRoles={['restaurant_owner', 'admin']}>
                        <OwnerOrdersPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin routes */}
                  <Route
                    path="/admin/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/users"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <UserManagePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/restaurants"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <RestaurantAdminPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/orders"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AdminOrdersPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* 404 Catch-all */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>

              <Footer />
            </div>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
