import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { requireAdmin } from '../middleware/auth.js';
import * as auth from '../controllers/authController.js';
import * as projects from '../controllers/projectController.js';
import * as certificates from '../controllers/certificateController.js';
import { uploadImage, uploadMiddleware } from '../controllers/uploadController.js';

// Express 4 tidak menangkap error async otomatis, jadi dibungkus.
const h = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const router = Router();

router.get('/health', (_req, res) => res.json({ ok: true }));
router.post('/auth/login', rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false }), h(auth.login));

router.get('/projects', h(projects.listPublic));
router.get('/projects/:id', h(projects.getOne));
router.get('/admin/projects', requireAdmin, h(projects.listAdmin));
router.post('/projects', requireAdmin, h(projects.create));
router.put('/projects/:id', requireAdmin, h(projects.update));
router.delete('/projects/:id', requireAdmin, h(projects.remove));

router.get('/certificates', h(certificates.listPublic));
router.get('/admin/certificates', requireAdmin, h(certificates.listAdmin));
router.post('/certificates', requireAdmin, h(certificates.create));
router.put('/certificates/:id', requireAdmin, h(certificates.update));
router.delete('/certificates/:id', requireAdmin, h(certificates.remove));

router.post('/uploads', requireAdmin, uploadMiddleware, h(uploadImage));

export default router;