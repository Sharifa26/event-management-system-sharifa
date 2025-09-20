import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from "../models/index.js";
import sendMail from '../utils/mailer.js';

const { User } = db;
const SALT_ROUNDS = 10;

const register = async (req, res) => {
    const { name, email, password, role } = req.body;
    if (!email || !password || !name) return res.status(400).json({ message: 'name, email and password required' });

    try {
        const existing = await User.findOne({ where: { email } });
        if (existing) return res.status(409).json({ message: 'Email already registered' });

        const hash = await bcrypt.hash(password, SALT_ROUNDS);
        const user = await User.create({ name, email, passwordHash: hash, role: role || 'attendee' });

        sendMail({
            to: user.email,
            subject: 'Welcome to Virtual Event Platform',
            text: `Hi ${user.name},\n\nYour account has been created.\n\nThanks.`,
            html: `<p>Hi ${user.name},</p><p>Your account has been created.</p>`
        }).catch(err => console.error('Failed to send welcome email:', err));

        return res.status(201).json({ message: 'Registered User Successfully', user: { name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'email and password required' });

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(401).json({ message: 'Invalid Email' });

        const match = await bcrypt.compare(password, user.passwordHash);
        if (!match) return res.status(401).json({ message: 'Invalid credentials' });

        const payload = {
            id: user.id,
            role: user.role,
            email: user.email
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

        const result = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }

        return res.json({ token, user: result });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
}

export default { register, login };
