import jwt from 'jsonwebtoken';
import db from "../models/index.js";
import dotenv from 'dotenv';
dotenv.config({ path: process.env.NODE_ENV === "test" ? ".env.test" : ".env" });

const { User } = db;

const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Missing or invalid authorization header' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(payload.id);
        if (!user) return res.status(401).json({ message: 'Invalid token: user not found' });
        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token', error: err.message });
    }
}

export default authenticate;
