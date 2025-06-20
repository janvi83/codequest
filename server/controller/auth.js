import users from '../models/auth.js';
import Otp from '../models/otp.js';
import LoginHistory from "../models/loginHistory.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

// Signup function
export const signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // Check if user already exists
        const existingUser = await users.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);
        // Create user
        const newUser = await users.create({
            name,
            email,
            password: hashedPassword,
            joinedon: new Date(),
        });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

// Login function
export const login = async (req, res) => {
    const { email, password, browser, os, device, ip } = req.body;
    try {
        const extinguser = await users.findOne({ email });
        if (!extinguser) {
            return res.status(404).json({ message: "User does not exists" });
        }
        const ispasswordcrct = await bcrypt.compare(password, extinguser.password);
        if (!ispasswordcrct) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }
        const token = jwt.sign(
            { email: extinguser.email, id: extinguser._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Save login history
        if (browser && os && device && ip) {
            await LoginHistory.create({
                userId: extinguser._id,
                browser,
                os,
                device,
                ip,
                timestamp: new Date()
            });
        }

        res.status(200).json({ result: extinguser, token });
    } catch (error) {
        res.status(500).json("something went wrong...");
        return;
    }
};

// Send OTP function
export const sendOtp = async (req, res) => {
    const { email } = req.body;
    try {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await Otp.create({ email, otp, expiresAt: Date.now() + 10 * 60 * 1000 });

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP is: ${otp}`
        });

        res.json({ success: true, message: 'OTP sent' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to send OTP' });
    }
};

// Verify OTP function
export const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const record = await Otp.findOne({ email, otp, expiresAt: { $gt: Date.now() } });
        if (!record) return res.json({ success: false, message: 'Invalid or expired OTP' });

        await Otp.deleteMany({ email });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: 'OTP verification failed' });
    }
};