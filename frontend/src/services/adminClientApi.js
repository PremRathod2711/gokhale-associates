import axios from "../api/axios";

export const fetchClients = (params = {}) =>
axios.get("/admin/clients", { params });

export const softDeleteClient = (id) =>
axios.patch(`/admin/clients/soft-delete/${id}`);

export const restoreClient = (id) =>
axios.patch(`/admin/clients/restore/${id}`);

export const forceDeleteClient = (id) =>
axios.delete(`/admin/clients/force-delete/${id}`);
