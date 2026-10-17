import { request } from './api.js';

export const projectService = {
  async list() { return (await request('/projects')).data; },
  async listAdmin(token) { return (await request('/admin/projects', { token })).data; },
  async create(token, payload) { return (await request('/projects', { method: 'POST', body: payload, token })).data; },
  async update(token, id, payload) { return (await request(`/projects/${id}`, { method: 'PUT', body: payload, token })).data; },
  async remove(token, id) { await request(`/projects/${id}`, { method: 'DELETE', token }); },
  async upload(token, file) {
    const form = new FormData();
    form.append('image', file);
    return (await request('/uploads', { method: 'POST', form, token })).url;
  },
  async login(email, password) { return (await request('/auth/login', { method: 'POST', body: { email, password } })).token; },
};
