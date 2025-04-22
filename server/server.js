const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const {createAdminUser} = require("./scripts/createAdmin");
const {createAgentUser} = require("./scripts/createAgent");
require('dotenv').config();


const userRoutes = require('./routes/users');
const ticketRoutes = require('./routes/tickets');
const customerRoutes = require('./routes/customers');


const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


mongoose.connect(process.env.MONGODB_URI , {
  dbName: 'helpdesk'
})
  .then(async () => {
    console.log(' MongoDB connected');

    await createAdminUser();
    await createAgentUser();

 
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
});




app.use('/api/users', userRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/customers', customerRoutes);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Something went wrong!', error: err.message });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 