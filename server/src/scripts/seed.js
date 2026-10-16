require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const Category = require('../models/Category');
const Food = require('../models/Food');
const Order = require('../models/Order');
const Cart = require('../models/Cart');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/foodieexpress';
    console.log(`Connecting to MongoDB at: ${mongoUri}`);
    await mongoose.connect(mongoUri);
    console.log('Connected! Clearing existing collections...');

    await Promise.all([
      User.deleteMany({}),
      Restaurant.deleteMany({}),
      Category.deleteMany({}),
      Food.deleteMany({}),
      Order.deleteMany({}),
      Cart.deleteMany({})
    ]);

    console.log('Existing collections cleared.');

    // 1. Create Users
    console.log('Creating seed users...');
    const adminUser = await User.create({
      name: 'System Administrator',
      email: 'admin@example.com',
      passwordHash: 'AdminPass123!',
      phone: '+1-555-0100',
      role: 'admin',
      isActive: true,
      addresses: [
        {
          label: 'Headquarters',
          fullAddress: '100 Express Blvd, Suite 400',
          city: 'New York',
          state: 'NY',
          postalCode: '10001',
          phone: '+1-555-0100',
          isDefault: true
        }
      ]
    });

    const ownerUser = await User.create({
      name: 'Marco Rossi',
      email: 'owner@example.com',
      passwordHash: 'Password123!',
      phone: '+1-555-0101',
      role: 'restaurant_owner',
      isActive: true,
      addresses: [
        {
          label: 'Restaurant Office',
          fullAddress: '45 Little Italy Way',
          city: 'New York',
          state: 'NY',
          postalCode: '10013',
          phone: '+1-555-0101',
          isDefault: true
        }
      ]
    });

    const secondOwner = await User.create({
      name: 'Priya Sharma',
      email: 'priya@example.com',
      passwordHash: 'Password123!',
      phone: '+1-555-0102',
      role: 'restaurant_owner',
      isActive: true
    });

    const customer1 = await User.create({
      name: 'Alice Johnson',
      email: 'customer@example.com',
      passwordHash: 'Password123!',
      phone: '+1-555-0199',
      role: 'customer',
      isActive: true,
      addresses: [
        {
          label: 'Home',
          fullAddress: '742 Evergreen Terrace, Apt 4B',
          city: 'New York',
          state: 'NY',
          postalCode: '10025',
          phone: '+1-555-0199',
          isDefault: true
        },
        {
          label: 'Work',
          fullAddress: '350 5th Avenue, Floor 22',
          city: 'New York',
          state: 'NY',
          postalCode: '10118',
          phone: '+1-555-0199',
          isDefault: false
        }
      ]
    });

    const customer2 = await User.create({
      name: 'David Miller',
      email: 'david@example.com',
      passwordHash: 'Password123!',
      phone: '+1-555-0188',
      role: 'customer',
      isActive: true,
      addresses: [
        {
          label: 'Apartment',
          fullAddress: '120 West 81st Street',
          city: 'New York',
          state: 'NY',
          postalCode: '10024',
          phone: '+1-555-0188',
          isDefault: true
        }
      ]
    });

    // 2. Create Global Food Categories
    console.log('Creating food categories...');
    const categoriesData = [
      {
        name: 'Pizza',
        description: 'Authentic stone-baked artisan pizzas',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80'
      },
      {
        name: 'Burgers',
        description: 'Juicy handcrafted gourmet burgers',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80'
      },
      {
        name: 'Indian Curries',
        description: 'Rich, aromatic curries and tandoori specials',
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&auto=format&fit=crop&q=80'
      },
      {
        name: 'Sushi & Asian',
        description: 'Fresh sushi rolls and vibrant Asian delicacies',
        image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&auto=format&fit=crop&q=80'
      },
      {
        name: 'Healthy Bowls',
        description: 'Fresh organic greens, poke and superfood bowls',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80'
      },
      {
        name: 'Desserts',
        description: 'Sweet handcrafted treats, brownies, and gelatos',
        image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&auto=format&fit=crop&q=80'
      },
      {
        name: 'Beverages',
        description: 'Refreshing juices, sodas, and mocktails',
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=80'
      }
    ];

    const categories = await Category.insertMany(categoriesData);
    const catMap = {};
    categories.forEach((cat) => {
      catMap[cat.name] = cat._id;
    });

    // 3. Create Restaurants
    console.log('Creating sample restaurants...');
    const bellaItalia = await Restaurant.create({
      name: 'Bella Italia Trattoria',
      description: 'Authentic Roman wood-fired pizzas, handmade pastas, and classic Italian desserts.',
      cuisines: ['Italian', 'Pizza', 'Pasta'],
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
      address: '142 Sullivan Street, Soho',
      city: 'New York',
      owner: ownerUser._id,
      rating: 4.8,
      deliveryFee: 35,
      estimatedDeliveryMinutes: 25,
      isOpen: true,
      isApproved: true
    });

    const spiceSymphony = await Restaurant.create({
      name: 'Spice Symphony',
      description: 'Royal North & South Indian delicacies, smoky tandoor kebabs, and rich gravies.',
      cuisines: ['Indian', 'Curry', 'Biryani'],
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
      address: '182 Lexington Ave',
      city: 'New York',
      owner: secondOwner._id,
      rating: 4.7,
      deliveryFee: 40,
      estimatedDeliveryMinutes: 35,
      isOpen: true,
      isApproved: true
    });

    const burgerCraft = await Restaurant.create({
      name: 'BurgerCraft Artisan Kitchen',
      description: 'Prime Angus beef smash patties, brioche buns, truffle fries, and thick shakes.',
      cuisines: ['Burgers', 'American', 'Fast Food'],
      image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80',
      address: '88 7th Avenue South',
      city: 'New York',
      owner: ownerUser._id,
      rating: 4.6,
      deliveryFee: 25,
      estimatedDeliveryMinutes: 20,
      isOpen: true,
      isApproved: true
    });

    const tokyoBites = await Restaurant.create({
      name: 'Tokyo Bites Sushi & Ramen',
      description: 'Traditional nigiri, maki rolls, rich tonkotsu ramen broth, and crispy gyoza.',
      cuisines: ['Japanese', 'Sushi', 'Asian'],
      image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=800&auto=format&fit=crop&q=80',
      address: '54 East 8th Street',
      city: 'New York',
      owner: secondOwner._id,
      rating: 4.9,
      deliveryFee: 45,
      estimatedDeliveryMinutes: 30,
      isOpen: true,
      isApproved: true
    });

    const greenLeaf = await Restaurant.create({
      name: 'GreenLeaf Organics & Bowls',
      description: 'Nutrient-rich grain bowls, organic salads, avocado toasts, and cold-pressed elixirs.',
      cuisines: ['Healthy Bowls', 'Salads', 'Vegan'],
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80',
      address: '210 Columbus Ave',
      city: 'New York',
      owner: ownerUser._id,
      rating: 4.5,
      deliveryFee: 30,
      estimatedDeliveryMinutes: 20,
      isOpen: true,
      isApproved: true
    });

    // 4. Create Foods (25 realistic food items)
    console.log('Creating 25+ food items across restaurants...');
    const foodsData = [
      // Bella Italia Foods
      {
        name: 'Margherita D.O.P Pizza',
        description: 'San Marzano tomatoes, fresh buffalo mozzarella, fresh basil, extra virgin olive oil.',
        price: 16.99,
        image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&auto=format&fit=crop&q=80',
        category: catMap['Pizza'],
        restaurant: bellaItalia._id,
        isVegetarian: true,
        isAvailable: true
      },
      {
        name: 'Truffle & Wild Mushroom Pizza',
        description: 'Roasted cremini & shiitake mushrooms, white truffle cream, taleggio cheese, thyme.',
        price: 19.5,
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80',
        category: catMap['Pizza'],
        restaurant: bellaItalia._id,
        isVegetarian: true,
        isAvailable: true
      },
      {
        name: 'Spicy Diavola Pepperoni',
        description: 'Spicy Calabrese salami, mozzarella, chili honey drizzle, charred crust.',
        price: 18.25,
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&auto=format&fit=crop&q=80',
        category: catMap['Pizza'],
        restaurant: bellaItalia._id,
        isVegetarian: false,
        isAvailable: true
      },
      {
        name: 'Homemade Tagliatelle Bolognese',
        description: 'Slow-simmered beef & pancetta ragù, fresh egg pasta, 24-month aged Parmigiano-Reggiano.',
        price: 21.0,
        image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281691?w=600&auto=format&fit=crop&q=80',
        category: catMap['Pizza'],
        restaurant: bellaItalia._id,
        isVegetarian: false,
        isAvailable: true
      },
      {
        name: 'Classic Venetian Tiramisu',
        description: 'Espresso-soaked savoiardi biscuits, mascarpone zabaglione, Dutch cocoa powder.',
        price: 8.5,
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&auto=format&fit=crop&q=80',
        category: catMap['Desserts'],
        restaurant: bellaItalia._id,
        isVegetarian: true,
        isAvailable: true
      },
      {
        name: 'San Pellegrino Sparkling Aranciata',
        description: 'Italian sparkling orange beverage made with real Mediterranean citrus juice.',
        price: 3.5,
        image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80',
        category: catMap['Beverages'],
        restaurant: bellaItalia._id,
        isVegetarian: true,
        isAvailable: true
      },

      // Spice Symphony Foods
      {
        name: 'Butter Chicken (Murgh Makhani)',
        description: 'Tender tandoori chicken cooked in velvety tomato cream sauce with fenugreek leaves.',
        price: 18.99,
        image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop&q=80',
        category: catMap['Indian Curries'],
        restaurant: spiceSymphony._id,
        isVegetarian: false,
        isAvailable: true
      },
      {
        name: 'Paneer Tikka Masala',
        description: 'Char-grilled cottage cheese cubes simmered in spiced onion-tomato gravy.',
        price: 16.5,
        image: 'https://images.unsplash.com/photo-1567184109191-37a6c9d7c52e?w=600&auto=format&fit=crop&q=80',
        category: catMap['Indian Curries'],
        restaurant: spiceSymphony._id,
        isVegetarian: true,
        isAvailable: true
      },
      {
        name: 'Hyderabadi Dum Biryani',
        description: 'Fragrant basmati rice layered with spiced marinated meat, saffron, and fried onions.',
        price: 19.99,
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
        category: catMap['Indian Curries'],
        restaurant: spiceSymphony._id,
        isVegetarian: false,
        isAvailable: true
      },
      {
        name: 'Garlic Butter Naan',
        description: 'Fresh tandoor-baked flatbread topped with minced roasted garlic and fresh cilantro.',
        price: 4.5,
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',
        category: catMap['Indian Curries'],
        restaurant: spiceSymphony._id,
        isVegetarian: true,
        isAvailable: true
      },
      {
        name: 'Mango Lassi',
        description: 'Chilled traditional yogurt smoothie blended with sweet Alphonso mango pulp.',
        price: 4.99,
        image: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=600&auto=format&fit=crop&q=80',
        category: catMap['Beverages'],
        restaurant: spiceSymphony._id,
        isVegetarian: true,
        isAvailable: true
      },

      // BurgerCraft Foods
      {
        name: 'The Double Smash Truffle Burger',
        description: 'Twin Angus beef patties, aged cheddar, truffle aioli, caramelized onions on toasted brioche.',
        price: 15.99,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
        category: catMap['Burgers'],
        restaurant: burgerCraft._id,
        isVegetarian: false,
        isAvailable: true
      },
      {
        name: 'Crispy Nashville Hot Chicken Burger',
        description: 'Buttermilk fried chicken breast drenched in cayenne chili oil, dill pickles, spicy slaw.',
        price: 14.5,
        image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=600&auto=format&fit=crop&q=80',
        category: catMap['Burgers'],
        restaurant: burgerCraft._id,
        isVegetarian: false,
        isAvailable: true
      },
      {
        name: 'Smoky Plant-Based Beyond Burger',
        description: 'Grilled 100% plant patty, vegan smoked gouda, avocado mash, lettuce, tomato, special sauce.',
        price: 15.5,
        image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&auto=format&fit=crop&q=80',
        category: catMap['Burgers'],
        restaurant: burgerCraft._id,
        isVegetarian: true,
        isAvailable: true
      },
      {
        name: 'Parmesan Truffle Herb Fries',
        description: 'Hand-cut Idaho potatoes tossed with white truffle oil, grated parmesan, and rosemary.',
        price: 6.99,
        image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=600&auto=format&fit=crop&q=80',
        category: catMap['Burgers'],
        restaurant: burgerCraft._id,
        isVegetarian: true,
        isAvailable: true
      },
      {
        name: 'Salted Caramel Bourbon Shake',
        description: 'Thick Madagascar vanilla bean ice cream spun with house caramel and crushed pretzel.',
        price: 6.5,
        image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80',
        category: catMap['Desserts'],
        restaurant: burgerCraft._id,
        isVegetarian: true,
        isAvailable: true
      },

      // Tokyo Bites Foods
      {
        name: 'Dragon Roll (Eel & Avocado)',
        description: 'Shrimp tempura, cucumber inside, topped with barbecued unagi, avocado, and unagi glaze.',
        price: 17.5,
        image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=600&auto=format&fit=crop&q=80',
        category: catMap['Sushi & Asian'],
        restaurant: tokyoBites._id,
        isVegetarian: false,
        isAvailable: true
      },
      {
        name: 'Spicy Bluefin Tuna Crunch Roll',
        description: 'Minced wild tuna, sriracha aioli, scallions, cucumber, tempura flakes.',
        price: 15.99,
        image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&auto=format&fit=crop&q=80',
        category: catMap['Sushi & Asian'],
        restaurant: tokyoBites._id,
        isVegetarian: false,
        isAvailable: true
      },
      {
        name: 'Tonkotsu Chashu Ramen',
        description: '18-hour pork bone broth, tender braised chashu pork belly, ajitsuke tamago egg, menma bamboo.',
        price: 18.5,
        image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80',
        category: catMap['Sushi & Asian'],
        restaurant: tokyoBites._id,
        isVegetarian: false,
        isAvailable: true
      },
      {
        name: 'Crispy Pork & Chive Gyoza (6 pcs)',
        description: 'Pan-seared Japanese dumplings served with ponzu dipping sauce and chili oil.',
        price: 8.99,
        image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=600&auto=format&fit=crop&q=80',
        category: catMap['Sushi & Asian'],
        restaurant: tokyoBites._id,
        isVegetarian: false,
        isAvailable: true
      },
      {
        name: 'Matcha Green Tea Ice Cream',
        description: 'Creamy Uji Kyoto ceremonial matcha gelato with sweet red bean paste.',
        price: 5.99,
        image: 'https://images.unsplash.com/photo-1505394033641-40c6ad1178d7?w=600&auto=format&fit=crop&q=80',
        category: catMap['Desserts'],
        restaurant: tokyoBites._id,
        isVegetarian: true,
        isAvailable: true
      },

      // GreenLeaf Organics Foods
      {
        name: 'Ahi Tuna & Edamame Poke Bowl',
        description: 'Sashimi grade raw yellowfin tuna, brown sushi rice, edamame, cucumber, pickled ginger, sesame.',
        price: 17.5,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
        category: catMap['Healthy Bowls'],
        restaurant: greenLeaf._id,
        isVegetarian: false,
        isAvailable: true
      },
      {
        name: 'Mediterranean Quinoa Falafel Bowl',
        description: 'Herbed organic falafel, tri-color quinoa, kalamata olives, creamy hummus, lemon-tahini dressing.',
        price: 15.0,
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80',
        category: catMap['Healthy Bowls'],
        restaurant: greenLeaf._id,
        isVegetarian: true,
        isAvailable: true
      },
      {
        name: 'Artisan Smashed Avocado Toast',
        description: 'Thick sourdough toast, mashed Hass avocado, cherry tomatoes, watermelon radish, everything spice.',
        price: 11.5,
        image: 'https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=600&auto=format&fit=crop&q=80',
        category: catMap['Healthy Bowls'],
        restaurant: greenLeaf._id,
        isVegetarian: true,
        isAvailable: true
      },
      {
        name: 'Immunity Cold-Pressed Green Juice',
        description: 'Kale, cucumber, crisp green apple, celery, ginger root, and fresh lime.',
        price: 6.99,
        image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&auto=format&fit=crop&q=80',
        category: catMap['Beverages'],
        restaurant: greenLeaf._id,
        isVegetarian: true,
        isAvailable: true
      }
    ];

    const insertedFoods = await Food.insertMany(foodsData);
    console.log(`Inserted ${insertedFoods.length} foods.`);

    // 5. Create Sample Orders for testing dashboards & tracking
    console.log('Creating sample orders...');
    const pizzaFood = insertedFoods.find((f) => f.name.includes('Margherita'));
    const tiramisuFood = insertedFoods.find((f) => f.name.includes('Tiramisu'));

    // Order 1: Delivered
    await Order.create({
      orderNumber: 'ORD-202610-1001',
      customer: customer1._id,
      restaurant: bellaItalia._id,
      items: [
        {
          food: pizzaFood._id,
          name: pizzaFood.name,
          unitPrice: pizzaFood.price,
          quantity: 2,
          lineTotal: pizzaFood.price * 2
        },
        {
          food: tiramisuFood._id,
          name: tiramisuFood.name,
          unitPrice: tiramisuFood.price,
          quantity: 1,
          lineTotal: tiramisuFood.price
        }
      ],
      deliveryAddress: customer1.addresses[0],
      contactPhone: customer1.phone,
      subtotal: pizzaFood.price * 2 + tiramisuFood.price,
      deliveryFee: bellaItalia.deliveryFee,
      discount: 0,
      totalAmount: pizzaFood.price * 2 + tiramisuFood.price + bellaItalia.deliveryFee,
      paymentMethod: 'simulated_card',
      paymentStatus: 'paid',
      orderStatus: 'delivered',
      statusHistory: [
        { status: 'placed', changedAt: new Date(Date.now() - 3600000 * 3), changedBy: customer1._id },
        { status: 'confirmed', changedAt: new Date(Date.now() - 3600000 * 2.5), changedBy: ownerUser._id },
        { status: 'preparing', changedAt: new Date(Date.now() - 3600000 * 2), changedBy: ownerUser._id },
        { status: 'out_for_delivery', changedAt: new Date(Date.now() - 3600000 * 1.5), changedBy: ownerUser._id },
        { status: 'delivered', changedAt: new Date(Date.now() - 3600000 * 1), changedBy: ownerUser._id }
      ]
    });

    // Order 2: Preparing (Active)
    const burgerFood = insertedFoods.find((f) => f.name.includes('Double Smash'));
    const friesFood = insertedFoods.find((f) => f.name.includes('Truffle Herb Fries'));

    await Order.create({
      orderNumber: 'ORD-202610-1002',
      customer: customer1._id,
      restaurant: burgerCraft._id,
      items: [
        {
          food: burgerFood._id,
          name: burgerFood.name,
          unitPrice: burgerFood.price,
          quantity: 1,
          lineTotal: burgerFood.price
        },
        {
          food: friesFood._id,
          name: friesFood.name,
          unitPrice: friesFood.price,
          quantity: 1,
          lineTotal: friesFood.price
        }
      ],
      deliveryAddress: customer1.addresses[0],
      contactPhone: customer1.phone,
      subtotal: burgerFood.price + friesFood.price,
      deliveryFee: burgerCraft.deliveryFee,
      discount: 0,
      totalAmount: burgerFood.price + friesFood.price + burgerCraft.deliveryFee,
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      orderStatus: 'preparing',
      statusHistory: [
        { status: 'placed', changedAt: new Date(Date.now() - 1800000), changedBy: customer1._id },
        { status: 'confirmed', changedAt: new Date(Date.now() - 1200000), changedBy: ownerUser._id },
        { status: 'preparing', changedAt: new Date(Date.now() - 600000), changedBy: ownerUser._id }
      ]
    });

    // Order 3: Cancelled order for testing
    await Order.create({
      orderNumber: 'ORD-202610-1003',
      customer: customer2._id,
      restaurant: spiceSymphony._id,
      items: [
        {
          food: insertedFoods.find((f) => f.name.includes('Butter Chicken'))._id,
          name: 'Butter Chicken (Murgh Makhani)',
          unitPrice: 18.99,
          quantity: 1,
          lineTotal: 18.99
        }
      ],
      deliveryAddress: customer2.addresses[0],
      contactPhone: customer2.phone,
      subtotal: 18.99,
      deliveryFee: spiceSymphony.deliveryFee,
      discount: 0,
      totalAmount: 18.99 + spiceSymphony.deliveryFee,
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      orderStatus: 'cancelled',
      cancellationReason: 'Customer changed delivery location',
      statusHistory: [
        { status: 'placed', changedAt: new Date(Date.now() - 7200000), changedBy: customer2._id },
        { status: 'cancelled', changedAt: new Date(Date.now() - 7000000), changedBy: customer2._id, note: 'Changed delivery location' }
      ]
    });

    console.log('Seed completed successfully!');
    console.log('======================================================');
    console.log('Sample Accounts Created:');
    console.log('  Admin:            admin@example.com    / AdminPass123!');
    console.log('  Restaurant Owner: owner@example.com    / Password123!');
    console.log('  Customer:         customer@example.com / Password123!');
    console.log('  Customer 2:       david@example.com    / Password123!');
    console.log('======================================================');

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('Error during database seed:', err);
    process.exit(1);
  }
};

seedData();
