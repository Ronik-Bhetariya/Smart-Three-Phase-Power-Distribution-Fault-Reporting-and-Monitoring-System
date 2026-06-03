app.service("ApiService", function ($http, API_BASE) {
  this.getPowerStatus = () => $http.get(`${API_BASE}/power`);
  this.seedPower = () => $http.post(`${API_BASE}/power/seed`);
  this.schedulePowerWindow = (payload) => $http.post(`${API_BASE}/power/schedule-window`, payload);

  this.reportFault = (payload) => $http.post(`${API_BASE}/faults`, payload);
  this.trackFault = (params) => $http.get(`${API_BASE}/faults/track`, { params });
  this.getFaults = () => $http.get(`${API_BASE}/faults`);
  this.updateFault = (id, payload) => $http.patch(`${API_BASE}/faults/${id}`, payload);

  this.createComplaint = (payload) => $http.post(`${API_BASE}/complaints`, payload);
  this.trackComplaint = (complaintId) =>
    $http.get(`${API_BASE}/complaints/track/${complaintId}`);
  this.getComplaints = () => $http.get(`${API_BASE}/complaints`);
  this.updateComplaint = (id, payload) =>
    $http.patch(`${API_BASE}/complaints/${id}`, payload);

  this.fetchBill = (consumerNumber) => $http.get(`${API_BASE}/bills/${consumerNumber}`);
  this.payBill = (billId) => $http.post(`${API_BASE}/bills/pay/${billId}`);
  this.seedBills = () => $http.post(`${API_BASE}/bills/seed`);
  this.getAllBills = () => $http.get(`${API_BASE}/bills`);
  this.createBill = (payload) => $http.post(`${API_BASE}/bills`, payload);

  this.getDashboard = () => $http.get(`${API_BASE}/dashboard`);
  this.getNotifications = () => $http.get(`${API_BASE}/notifications`);
  this.updatePowerPhase = (phase, payload) => $http.put(`${API_BASE}/power/${phase}`, payload);

  this.seedAdmin = () => $http.post(`${API_BASE}/auth/seed-admin`);
  this.adminLogin = (payload) => $http.post(`${API_BASE}/auth/admin-login`, payload);
});
