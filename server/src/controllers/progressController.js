import { buildDashboard } from '../services/progressService.js';

export async function dashboard(req, res, next) { try { res.json(await buildDashboard(req.user)); } catch (e) { next(e); } }
