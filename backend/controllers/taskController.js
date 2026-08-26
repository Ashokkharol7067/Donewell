import Task from '../models/Task.js';

function taskData(body) { return { title: body.title, description: body.description || '', priority: body.priority || 'medium', dueDate: body.dueDate || null, status: body.status || 'pending' }; }
async function list(req, res, next) {
  try {
    const { status, priority, search, sort = 'createdAt', page = 1, limit = 10 } = req.query;
    const filter = { user: req.user._id };
    if (['pending', 'completed'].includes(status)) filter.status = status;
    if (['low', 'medium', 'high'].includes(priority)) filter.priority = priority;
    if (search) filter.title = { $regex: search, $options: 'i' };
    const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 50);
    const currentPage = Math.max(Number(page) || 1, 1);
    const totalTasks = await Task.countDocuments(filter);
    const tasks = await Task.find(filter).sort({ [sort === 'dueDate' ? 'dueDate' : 'createdAt']: 1 }).skip((currentPage - 1) * safeLimit).limit(safeLimit);
    res.json({ tasks, currentPage, totalPages: Math.ceil(totalTasks / safeLimit), totalTasks, limit: safeLimit });
  } catch (error) { next(error); }
}
async function create(req, res, next) { try { const task = await Task.create({ ...taskData(req.body), user: req.user._id }); res.status(201).json({ task }); } catch (error) { next(error); } }
async function getOne(req, res, next) { try { const task = await Task.findOne({ _id: req.params.id, user: req.user._id }); if (!task) return res.status(404).json({ message: 'Task not found' }); res.json({ task }); } catch (error) { next(error); } }
async function update(req, res, next) { try { const task = await Task.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, taskData(req.body), { new: true, runValidators: true }); if (!task) return res.status(404).json({ message: 'Task not found' }); res.json({ task }); } catch (error) { next(error); } }
async function remove(req, res, next) { try { const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id }); if (!task) return res.status(404).json({ message: 'Task not found' }); res.json({ message: 'Task deleted' }); } catch (error) { next(error); } }
export { list, create, getOne, update, remove };
