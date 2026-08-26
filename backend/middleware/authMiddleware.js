import jwt from "jsonwebtoken";
import cookie from "cookie";
import User from "../models/User.js";

async function protect(req, res, next) {
  try {
    const cookies = cookie.parse(req.headers.cookie || "");
    const token = cookies.task_token;
    if (!token)
      return res.status(401).json({ message: "Authentication required" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user)
      return res.status(401).json({ message: "User no longer exists" });
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}
export default protect;
