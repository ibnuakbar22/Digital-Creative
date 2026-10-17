import { request } from './api.js';

export const certificateService = {
    async list() { return (await request('/certificates')).data; },
    async listAdmin(token) { return (await request('/admin/certificates', { token })).data; },
    async create(token, payload) { return (await request('/certificates', { method: 'POST', body: payload, token })).data; },
    async update(token, id, payload) { return (await request(`/certificates/${id}`, { method: 'PUT', body: payload, token })).data; },
    async remove(token, id) { await request(`/certificates/${id}`, { method: 'DELETE', token }); },
};