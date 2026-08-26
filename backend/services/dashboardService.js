import Task from '../models/Task.js';

async function getStats(userId) {
  const soon = new Date();
  soon.setDate(soon.getDate() + 7);
  const [counts, highPriority, dueSoon] = await Promise.all([
    Task.aggregate([{ $match: { user: userId } }, { $group: { _id: '$status', count: { $sum: 1 } } }]),
    Task.countDocuments({ user: userId, priority: 'high', status: 'pending' }),
    Task.find({ user: userId, status: 'pending', dueDate: { $gte: new Date(), $lte: soon } }).sort({ dueDate: 1 }).limit(5)
  ]);
  const byStatus = Object.fromEntries(counts.map((item) => [item._id, item.count]));
  return { total: (byStatus.pending || 0) + (byStatus.completed || 0), pending: byStatus.pending || 0, completed: byStatus.completed || 0, highPriority, dueSoon };
}
export { getStats };
