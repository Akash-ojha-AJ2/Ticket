const User = require('../models/User');

// Load environment variables
const createAgentUser = async () => {
  const AGENT = {
    name: "Agent User",
    email: "agent@gmail.com",
    password: "agent123",
    role: "agent"
  };

  try {
    const exists = await User.findOne({ email: AGENT.email });
    if (exists) {
      console.log(`⚠️ Agent already exists: ${AGENT.email}`);
    } else {
      const agent = new User(AGENT);
      await agent.save();
      console.log(`✅ Agent created: ${AGENT.email}`);
    }
  } catch (error) {
    console.error('❌ Error creating agent:', error.message);
  }
};

module.exports = { createAgentUser };