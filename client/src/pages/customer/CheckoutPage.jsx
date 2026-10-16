import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { userService } from '../../services/userService';
import { orderService } from '../../services/orderService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';
import {
  MapPin,
  Phone,
  CreditCard,
  Banknote,
  Plus,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Store
} from 'lucide-react';

const CheckoutPage = () => {
  const { cart, fetchCart } = useCart();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' or 'simulated_card'

  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: 'Home',
    fullAddress: '',
    city: 'New York',
    state: 'NY',
    postalCode: '10001',
    phone: '',
    isDefault: false
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [pageError, setPageError] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        const [profileRes, addrRes] = await Promise.all([
          userService.getProfile(),
          userService.getAddresses()
        ]);

        if (profileRes?.data?.user?.phone) {
          setContactPhone(profileRes.data.user.phone);
        }

        const userAddrs = addrRes?.data?.addresses || [];
        setAddresses(userAddrs);

        if (userAddrs.length > 0) {
          const defaultAddr = userAddrs.find((a) => a.isDefault) || userAddrs[0];
          setSelectedAddressId(defaultAddr._id);
        } else {
          setShowNewAddressForm(true);
        }
      } catch (err) {
        setPageError('Failed to load your saved delivery addresses');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleCreateAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.fullAddress || !newAddress.city || !newAddress.postalCode) {
      error('Please complete full address, city, and postal code');
      return;
    }

    try {
      const res = await userService.addAddress({
        ...newAddress,
        phone: newAddress.phone || contactPhone
      });

      if (res?.data?.address) {
        setAddresses((prev) => [...prev, res.data.address]);
        setSelectedAddressId(res.data.address._id);
        setShowNewAddressForm(false);
        success('Delivery address saved!');
      }
    } catch (err) {
      error(err.formattedMessage || 'Failed to save address');
    }
  };

  const handlePlaceOrder = async () => {
    if (!cart.items || cart.items.length === 0) {
      error('Your cart is empty');
      navigate('/restaurants');
      return;
    }

    let deliveryAddress = null;

    if (showNewAddressForm) {
      if (!newAddress.fullAddress || !newAddress.city || !newAddress.postalCode) {
        error('Please complete the address form or select a saved address');
        return;
      }
      deliveryAddress = newAddress;
    } else {
      const found = addresses.find((a) => a._id === selectedAddressId);
      if (!found) {
        error('Please select a valid delivery address');
        return;
      }
      deliveryAddress = found;
    }

    if (!contactPhone.trim()) {
      error('Please provide a contact phone number for the delivery partner');
      return;
    }

    try {
      setSubmitting(true);
      setPageError(null);

      const orderPayload = {
        deliveryAddress: {
          label: deliveryAddress.label || 'Home',
          fullAddress: deliveryAddress.fullAddress,
          city: deliveryAddress.city,
          state: deliveryAddress.state || '',
          postalCode: deliveryAddress.postalCode,
          phone: deliveryAddress.phone || contactPhone
        },
        contactPhone: contactPhone.trim(),
        paymentMethod
      };

      const res = await orderService.createOrder(orderPayload);

      if (res && res.data) {
        success('Order placed successfully! Redirecting to tracker...');
        await fetchCart(); // Sync cleared cart
        navigate(`/orders/${res.data._id}`, { replace: true });
      }
    } catch (err) {
      setPageError(err.formattedMessage || 'Failed to place order');
      error(err.formattedMessage || 'Order placement failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner text="Configuring checkout details..." size="lg" />
      </div>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 mb-4">Your cart is empty.</p>
        <Link
          to="/restaurants"
          className="px-6 py-2.5 bg-primary-500 text-white rounded-xl font-bold text-sm shadow-md"
        >
          Browse Restaurants
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Checkout
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Complete delivery information and confirm payment
        </p>
      </div>

      {pageError && <ErrorAlert message={pageError} />}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Delivery Address & Payment */}
        <div className="lg:col-span-8 space-y-6">
          {/* Step 1: Delivery Address */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-50 text-primary-600 flex items-center justify-center font-bold">
                  1
                </div>
                <h2 className="text-lg font-bold text-gray-900">Delivery Address</h2>
              </div>

              {!showNewAddressForm && (
                <button
                  onClick={() => setShowNewAddressForm(true)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-primary-600 hover:text-primary-700"
                >
                  <Plus className="w-3.5 h-3.5" /> Add New Address
                </button>
              )}
            </div>

            {/* Existing Address Selection */}
            {!showNewAddressForm && addresses.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <label
                    key={addr._id}
                    className={`cursor-pointer flex flex-col justify-between p-4 rounded-2xl border-2 transition ${
                      selectedAddressId === addr._id
                        ? 'border-primary-500 bg-orange-50/30 shadow-xs'
                        : 'border-gray-100 hover:border-gray-200 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-gray-800 bg-gray-100 px-2.5 py-0.5 rounded-md">
                          {addr.label || 'Address'}
                        </span>
                        <input
                          type="radio"
                          name="selectedAddress"
                          checked={selectedAddressId === addr._id}
                          onChange={() => setSelectedAddressId(addr._id)}
                          className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                        />
                      </div>
                      <p className="text-sm font-semibold text-gray-900 leading-snug">
                        {addr.fullAddress}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {addr.city}, {addr.postalCode}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}

            {/* Inline New Address Form */}
            {showNewAddressForm && (
              <form onSubmit={handleCreateAddress} className="space-y-4 bg-gray-50 p-5 rounded-2xl border border-gray-200">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-gray-900">Enter New Delivery Address</h4>
                  {addresses.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowNewAddressForm(false)}
                      className="text-xs text-gray-500 hover:text-gray-800 underline"
                    >
                      Use Saved Address
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Label</label>
                    <input
                      type="text"
                      value={newAddress.label}
                      onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                      placeholder="Home, Office, Apartment"
                      className="w-full px-3 py-2 bg-white rounded-xl border border-gray-200 text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-gray-200 text-xs font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Full Street Address</label>
                  <input
                    type="text"
                    required
                    value={newAddress.fullAddress}
                    onChange={(e) => setNewAddress({ ...newAddress, fullAddress: e.target.value })}
                    placeholder="e.g. 742 Evergreen Terrace, Apt 4B"
                    className="w-full px-3 py-2 bg-white rounded-xl border border-gray-200 text-xs font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">State</label>
                    <input
                      type="text"
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-gray-200 text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Postal Code</label>
                    <input
                      type="text"
                      required
                      value={newAddress.postalCode}
                      onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-gray-200 text-xs font-medium"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-xs font-bold transition shadow-sm"
                  >
                    Save & Use Address
                  </button>
                </div>
              </form>
            )}

            {/* Contact Phone Number */}
            <div className="pt-4 border-t border-gray-100">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Contact Phone for Courier
              </label>
              <div className="relative max-w-sm">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+1 555-0199"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Payment Method */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="w-9 h-9 rounded-xl bg-orange-50 text-primary-600 flex items-center justify-center font-bold">
                2
              </div>
              <h2 className="text-lg font-bold text-gray-900">Select Payment Method</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Cash On Delivery */}
              <label
                className={`cursor-pointer flex items-start gap-3 p-4 rounded-2xl border-2 transition ${
                  paymentMethod === 'cod'
                    ? 'border-primary-500 bg-orange-50/30'
                    : 'border-gray-100 hover:border-gray-200 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="mt-1 w-4 h-4 text-primary-600 focus:ring-primary-500"
                />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Banknote className="w-5 h-5 text-emerald-600" />
                    <span className="font-bold text-sm text-gray-900">Cash on Delivery</span>
                  </div>
                  <p className="text-xs text-gray-500">Pay cash or scan QR when your food arrives.</p>
                </div>
              </label>

              {/* Simulated Card Pay */}
              <label
                className={`cursor-pointer flex items-start gap-3 p-4 rounded-2xl border-2 transition ${
                  paymentMethod === 'simulated_card'
                    ? 'border-primary-500 bg-orange-50/30'
                    : 'border-gray-100 hover:border-gray-200 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="simulated_card"
                  checked={paymentMethod === 'simulated_card'}
                  onChange={() => setPaymentMethod('simulated_card')}
                  className="mt-1 w-4 h-4 text-primary-600 focus:ring-primary-500"
                />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <CreditCard className="w-5 h-5 text-primary-600" />
                    <span className="font-bold text-sm text-gray-900">Instant Card (Simulated)</span>
                  </div>
                  <p className="text-xs text-gray-500">Instant order confirmation via simulated gateway.</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-lg space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h3 className="font-bold text-lg text-gray-900">Order Summary</h3>
            {cart.restaurant && (
              <span className="text-xs font-bold text-primary-600 truncate max-w-[150px]">
                {cart.restaurant.name}
              </span>
            )}
          </div>

          {/* Itemized List */}
          <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
            {cart.items.map((item) => (
              <div key={item.food._id} className="flex items-center justify-between text-xs">
                <span className="font-medium text-gray-700 truncate max-w-[180px]">
                  {item.quantity}x {item.food.name}
                </span>
                <span className="font-bold text-gray-900">
                  ${item.lineTotal?.toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing breakdown */}
          <div className="border-t border-gray-100 pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Item Subtotal</span>
              <span className="font-semibold text-gray-900">${cart.subtotal?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery Fee</span>
              <span className="font-semibold text-gray-900">${cart.deliveryFee?.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-100 pt-3 flex justify-between items-center text-sm">
              <span className="font-extrabold text-gray-900">Total Payable</span>
              <span className="font-extrabold text-xl text-primary-600">
                ${cart.totalAmount?.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-gray-50 text-[11px] text-gray-500 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Prices are server-verified for accuracy upon submission.</span>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={submitting}
            className="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-primary-500/25 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting ? (
              <span>Confirming Order...</span>
            ) : (
              <>
                <span>Place Order • ${cart.totalAmount?.toFixed(2)}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
