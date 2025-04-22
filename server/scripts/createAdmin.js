const User = require('../models/User');

const createAdminUser = async () => {
  const ADMIN = {
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    role: "admin"
  };

  try {
    const exists = await User.findOne({ email: ADMIN.email });
    if (exists) {
      console.log(`⚠️ Admin already exists: ${ADMIN.email}`);
    } else {
      const admin = new User(ADMIN);
      await admin.save();
      console.log(`✅ Admin created: ${ADMIN.email}`);
    }
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
  }
};

module.exports = { createAdminUser };
