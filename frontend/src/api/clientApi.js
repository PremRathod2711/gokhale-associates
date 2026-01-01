import api from "./axios";

// ASSOCIATE
export const editClient = (clientId, payload) =>
  api.patch(`/associate/edit/${clientId}`, payload);

// CA
export const addCARemark = (clientId, payload) =>
  api.patch(`/ca/remark/${clientId}`, payload);

// ADMIN
export const editBilling = (clientId, payload) =>
  api.patch(`/admin/edit-billing/${clientId}`, payload);

// COMMON
export const getClientDetails = (id) =>
  api.get(`/dashboard/client/${id}`);
