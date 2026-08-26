import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

const safeUser = (user) => ({ id: user._id, name: user.name, email: user.email, createdAt: user.createdAt });
const cookieOptions = {
  httpOnly: true,
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000
};
const setAuthCookie = (res, userId) => res.cookie('task_token', generateToken(userId), cookieOptions);

async function register(req, res, next) {
  try {
    const { name, password } = req.body;
    const email = req.body.email?.trim().toLowerCase();
    if (!name || !email || !password || password.length < 6) return res.status(400).json({ message: 'Name, email and a password of 6+ characters are required' });
    if (await User.findOne({ email })) return res.status(409).json({ message: 'An account with that email already exists' });
    const user = await User.create({ name, email, password });
    setAuthCookie(res, user._id);
    res.status(201).json({ user: safeUser(user) });
  } catch (error) { next(error); }
}
async function login(req, res, next) {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const { password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password || ''))) return res.status(401).json({ message: 'Invalid email or password' });
    setAuthCookie(res, user._id);
    res.json({ user: safeUser(user) });
  } catch (error) { next(error); }
}
async function updateProfile(req, res, next) {
  try {
    const { name, email, currentPassword, newPassword } = req.body;
    const trimmedName = name?.trim();
    const normalizedEmail = email?.trim().toLowerCase();

    if (!trimmedName || trimmedName.length < 2 || trimmedName.length > 80 || !normalizedEmail) {
      return res.status(400).json({ message: 'A valid name and email are required' });
    }
    if (newPassword && newPassword.length < 6) {
      return res.status(400).json({ message: 'The new password must be at least 6 characters' });
    }
    if (normalizedEmail !== req.user.email && await User.findOne({ email: normalizedEmail })) {
      return res.status(409).json({ message: 'An account with that email already exists' });
    }
    if (newPassword) {
      const userWithPassword = await User.findById(req.user._id).select('+password');
      if (!currentPassword || !(await userWithPassword.comparePassword(currentPassword))) {
        return res.status(401).json({ message: 'Current password is incorrect' });
      }
      req.user.password = newPassword;
    }

    req.user.name = trimmedName;
    req.user.email = normalizedEmail;
    await req.user.save();
    res.json({ user: safeUser(req.user), message: 'Profile updated successfully' });
  } catch (error) { next(error); }
}
const me = (req, res) => res.json({ user: safeUser(req.user) });
const logout = (req, res) => res.clearCookie('task_token', cookieOptions).json({ message: 'Signed out successfully' });
export { register, login, updateProfile, me, logout };
