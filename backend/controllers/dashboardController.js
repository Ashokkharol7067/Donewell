import { getStats } from '../services/dashboardService.js';
const stats = async (req, res, next) => { try { res.json(await getStats(req.user._id)); } catch (error) { next(error); } };
export { stats };
