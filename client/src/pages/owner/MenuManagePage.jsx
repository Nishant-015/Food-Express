import React, { useState, useEffect } from 'react';
import { orderService } from '../../services/orderService';
import { foodService } from '../../services/foodService';
import { useToast } from '../../context/ToastContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import {
  Utensils,
  Plus,
  Edit2,
  Trash2,
  DollarSign,
  Tag,
  Check,
  X,
  Search
} from 'lucide-react';

const MenuManagePage = () => {
  const { success, error } = useToast();

  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState(null);

  // Add / Edit Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFoodId, setEditingFoodId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    isVegetarian: false,
    isAvailable: true
  });

  const loadMenuData = async () => {
    try {
      setLoading(true);
      const dashRes = await orderService.getOwnerDashboard();
      if (!dashRes?.data?.restaurant) {
        setPageError('Please create your restaurant profile before adding menu items.');
        setLoading(false);
        return;
      }

      const rest = dashRes.data.restaurant;
      setRestaurant(rest);

      const [foodsRes, catsRes] = await Promise.all([
        foodService.getFoods({ restaurantId: rest._id }),
        foodService.getCategories({ restaurantId: rest._id })
      ]);

      if (foodsRes?.data) setFoods(foodsRes.data);
      if (catsRes?.data) setCategories(catsRes.data);
    } catch (err) {
      setPageError('Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenuData();
  }, []);

  const openAddModal = () => {
    setEditingFoodId(null);
    setForm({
      name: '',
      description: '',
      price: '',
      category: categories[0]?._id || '',
      image: '',
      isVegetarian: false,
      isAvailable: true
    });
    setModalOpen(true);
  };

  const openEditModal = (food) => {
    setEditingFoodId(food._id);
    setForm({
      name: food.name,
      description: food.description || '',
      price: food.price,
      category: food.category?._id || food.category,
      image: food.image || '',
      isVegetarian: !!food.isVegetarian,
      isAvailable: food.isAvailable !== false
    });
    setModalOpen(true);
  };

  const handleSaveFood = async (e) => {
    e.preventDefault();

    if (!form.name || !form.price || !form.category) {
      error('Please fill in food name, price, and category');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        ...form,
        price: Number(form.price)
      };

      if (editingFoodId) {
        const res = await foodService.updateFood(restaurant._id, editingFoodId, payload);
        if (res?.data) {
          setFoods((prev) =>
            prev.map((f) => (f._id === editingFoodId ? { ...f, ...res.data } : f))
          );
          success('Menu item updated!');
        }
      } else {
        const res = await foodService.createFood(restaurant._id, payload);
        if (res?.data) {
          setFoods((prev) => [res.data, ...prev]);
          success('New menu item added!');
        }
      }
      setModalOpen(false);
    } catch (err) {
      error(err.formattedMessage || 'Failed to save menu item');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleAvailability = async (food) => {
    try {
      const newStatus = !food.isAvailable;
      await foodService.updateFood(restaurant._id, food._id, { isAvailable: newStatus });
      setFoods((prev) =>
        prev.map((f) => (f._id === food._id ? { ...f, isAvailable: newStatus } : f))
      );
      success(`${food.name} is now ${newStatus ? 'available' : 'marked sold out'}`);
    } catch (err) {
      error(err.formattedMessage || 'Failed to update item availability');
    }
  };

  const handleDeleteFood = async (foodId) => {
    if (!window.confirm('Are you sure you want to delete this dish from the menu?')) return;

    try {
      await foodService.deleteFood(restaurant._id, foodId);
      setFoods((prev) => prev.filter((f) => f._id !== foodId));
      success('Dish removed from menu');
    } catch (err) {
      error(err.formattedMessage || 'Failed to delete dish');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner text="Loading kitchen menu..." size="lg" />
      </div>
    );
  }

  const filteredFoods = foods.filter((f) =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Menu Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Create, edit, and toggle availability for dishes served at {restaurant?.name}
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-2xl font-bold text-xs shadow-md shadow-primary-500/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Food Item
        </button>
      </div>

      {pageError && <ErrorAlert message={pageError} />}

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter menu items by name..."
          className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 shadow-xs"
        />
      </div>

      {/* Menu Table / Cards */}
      {filteredFoods.length === 0 ? (
        <EmptyState
          icon={Utensils}
          title="No menu items found"
          description="You haven't added any dishes yet or no items match your search. Add your signature dishes now!"
          actionText="+ Add First Dish"
          onAction={openAddModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFoods.map((food) => (
            <div
              key={food._id}
              className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition"
            >
              <div>
                <div className="relative h-40 w-full overflow-hidden bg-gray-100">
                  <img
                    src={food.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80'}
                    alt={food.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-lg text-xs font-bold text-gray-900 shadow-xs">
                    ${food.price?.toFixed(2)}
                  </div>

                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    {food.isVegetarian ? (
                      <span className="veg-badge bg-white shadow-xs"></span>
                    ) : (
                      <span className="non-veg-badge bg-white shadow-xs"></span>
                    )}
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="font-extrabold text-base text-gray-900 truncate">{food.name}</h3>
                  {food.description && (
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                      {food.description}
                    </p>
                  )}
                  {food.category?.name && (
                    <span className="inline-block text-[10px] font-bold text-primary-600 bg-orange-50 px-2 py-0.5 rounded-md">
                      {food.category.name}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="p-4 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleToggleAvailability(food)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition ${
                    food.isAvailable
                      ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                  }`}
                >
                  {food.isAvailable ? 'In Stock' : 'Sold Out'}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(food)}
                    className="p-2 text-gray-500 hover:text-gray-900 hover:bg-white rounded-xl transition"
                    title="Edit dish"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteFood(food._id)}
                    className="p-2 text-gray-400 hover:text-rose-600 hover:bg-white rounded-xl transition"
                    title="Delete dish"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Food Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingFoodId ? 'Edit Dish' : 'Add New Dish'}
      >
        <form onSubmit={handleSaveFood} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Food Item Name
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Margherita D.O.P Pizza"
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="14.99"
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                required
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Ingredients and culinary notes..."
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Photo URL
            </label>
            <input
              type="url"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium"
            />
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isVegetarian}
                onChange={(e) => setForm({ ...form, isVegetarian: e.target.checked })}
                className="w-4 h-4 text-primary-600 rounded"
              />
              <span className="text-xs font-bold text-gray-700">Vegetarian Dish</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isAvailable}
                onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
                className="w-4 h-4 text-primary-600 rounded"
              />
              <span className="text-xs font-bold text-gray-700">Currently Available</span>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-xs font-bold shadow-md disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Save Dish'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MenuManagePage;
