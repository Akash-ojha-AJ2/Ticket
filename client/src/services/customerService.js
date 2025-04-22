import axios from 'axios';

export const getCustomers = async () => {
  try {
    const res = await axios.get('/api/customers');
    return { success: true, data: res.data };
  } catch (err) {
    return { 
      success: false, 
      error: err.response?.data?.message || 'Failed to fetch customers'
    };
  }
};


export const getCustomerById = async (id) => {
  try {
    const res = await axios.get(`/api/customers/${id}`);
    return { success: true, data: res.data };
  } catch (err) {
    return { 
      success: false, 
      error: err.response?.data?.message || 'Failed to fetch customer'
    };
  }
};


export const getUsers = async () => {
  try {
    const res = await axios.get('/api/users');
    return { success: true, data: res.data };
  } catch (err) {
    return { 
      success: false, 
      error: err.response?.data?.message || 'Failed to fetch users'
    };
  }
};


export const createUser = async (userData) => {
  try {
    const res = await axios.post('/api/users', userData);
    return { success: true, data: res.data };
  } catch (err) {
    return { 
      success: false, 
      error: err.response?.data?.message || 'Failed to create user'
    };
  }
};


export const updateUser = async (id, userData) => {
  try {
    const res = await axios.put(`/api/users/${id}`, userData);
    return { success: true, data: res.data };
  } catch (err) {
    return { 
      success: false, 
      error: err.response?.data?.message || 'Failed to update user'
    };
  }
};


export const deleteUser = async (id) => {
  try {
    const res = await axios.delete(`/api/users/${id}`);
    return { success: true, data: res.data };
  } catch (err) {
    return { 
      success: false, 
      error: err.response?.data?.message || 'Failed to delete user'
    };
  }
}; 