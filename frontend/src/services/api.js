import axios from 'axios';

const API_BASE_URL = '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const authService = {
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  loginUser: async (email, password) => {
    const response = await apiClient.post('/auth/user/login', {
      email,
      password,
      userType: 'USER',
    });
    return response.data;
  },

  loginHospital: async (email, password) => {
    const response = await apiClient.post('/auth/hospital/login', {
      email,
      password,
      userType: 'HOSPITAL',
    });
    return response.data;
  },

  loginBloodBank: async (email, password) => {
    const response = await apiClient.post('/auth/bloodbank/login', {
      email,
      password,
      userType: 'BLOOD_BANK',
    });
    return response.data;
  },

  registerUser: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  registerHospital: async (hospitalData) => {
    const response = await apiClient.post('/auth/hospital/register', hospitalData);
    return response.data;
  },

  registerBloodBank: async (bloodBankData) => {
    const response = await apiClient.post('/auth/bloodbank/register', bloodBankData);
    return response.data;
  },

  getDemoAccounts: async () => {
    const response = await apiClient.get('/auth/demo-accounts');
    return response.data;
  },
};

export const hospitalService = {
  getAll: async (params = {}) => {
    const response = await apiClient.get('/hospitals', { params });
    return response.data;
  },

  getByCity: async (city, params = {}) => {
    const response = await apiClient.get(`/hospitals/city/${encodeURIComponent(city)}`, { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/hospitals/${encodeURIComponent(id)}`);
    return response.data;
  },

  register: async (hospitalData) => {
    const response = await apiClient.post('/hospitals/register', hospitalData);
    return response.data;
  },

  update: async (id, hospitalData) => {
    const response = await apiClient.put(`/hospitals/${encodeURIComponent(id)}`, hospitalData);
    return response.data;
  },

  getBloodBanks: async () => {
    const response = await apiClient.get('/hospitals/bloodbanks');
    return response.data;
  },
};

export const driveService = {
  getAll: async (params = {}) => {
    const response = await apiClient.get('/drives', { params });
    return response.data;
  },

  getByCity: async (city) => {
    const response = await apiClient.get(`/drives/city/${encodeURIComponent(city)}`);
    return response.data;
  },

  getByBloodBank: async (bloodBankId) => {
    const response = await apiClient.get(`/drives/bank/${encodeURIComponent(bloodBankId)}`);
    return response.data;
  },

  create: async (driveData) => {
    const response = await apiClient.post('/drives', driveData);
    return response.data;
  },

  complete: async (driveId) => {
    const response = await apiClient.put(`/drives/${driveId}/complete`);
    return response.data;
  },

  delete: async (driveId) => {
    const response = await apiClient.delete(`/drives/${driveId}`);
    return response.data;
  },

  registerDonor: async (driveId, donorName = 'Registered Donor') => {
    const response = await apiClient.post(`/drives/${driveId}/register`, { donorName });
    return response.data;
  },
};

export const donationService = {
  recordDonation: async (donationData) => {
    const response = await apiClient.post('/donations', donationData);
    return response.data;
  },

  getAll: async () => {
    const response = await apiClient.get('/donations');
    return response.data;
  },

  getByDonor: async (donorId) => {
    const response = await apiClient.get(`/donations/donor/${encodeURIComponent(donorId)}`);
    return response.data;
  },

  getDonorSummary: async (donorId) => {
    const response = await apiClient.get(`/donations/donor/${encodeURIComponent(donorId)}/summary`);
    return response.data;
  },

  getByHospital: async (hospitalId) => {
    const response = await apiClient.get(`/donations/hospital/${encodeURIComponent(hospitalId)}`);
    return response.data;
  },

  getHospitalSummary: async (hospitalId) => {
    const response = await apiClient.get(`/donations/hospital/${encodeURIComponent(hospitalId)}/summary`);
    return response.data;
  },
};

export const bloodRequestService = {
  getAll: async (params = {}) => {
    const response = await apiClient.get('/requests', { params });
    return response.data;
  },

  getByHospital: async (hospitalId) => {
    const response = await apiClient.get(`/requests/hospital/${encodeURIComponent(hospitalId)}`);
    return response.data;
  },

  getStatsByBloodGroup: async () => {
    const response = await apiClient.get('/requests/stats/blood-groups');
    return response.data;
  },

  create: async (requestData) => {
    const response = await apiClient.post('/requests', requestData);
    return response.data;
  },

  fulfill: async (requestId) => {
    const response = await apiClient.put(`/requests/${requestId}/fulfill`);
    return response.data;
  },

  delete: async (requestId) => {
    const response = await apiClient.delete(`/requests/${requestId}`);
    return response.data;
  },

  pledge: async (requestId, donorName = 'Anonymous Donor', units = 1) => {
    const response = await apiClient.post(`/requests/${requestId}/pledge`, {
      donorName,
      units,
    });
    return response.data;
  },
};

export const statsService = {
  getStats: async () => {
    const response = await apiClient.get('/stats');
    return response.data;
  },

  getDonorStats: async (donorId) => {
    const response = await apiClient.get(`/stats/donor/${encodeURIComponent(donorId)}`);
    return response.data;
  },

  getHospitalStats: async (hospitalId) => {
    const response = await apiClient.get(`/stats/hospital/${encodeURIComponent(hospitalId)}`);
    return response.data;
  },

  getBloodBankStats: async (bloodBankId) => {
    const response = await apiClient.get(`/stats/bloodbank/${encodeURIComponent(bloodBankId)}`);
    return response.data;
  },
};

export default apiClient;
