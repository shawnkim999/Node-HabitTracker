import { Request, Response } from "express";
import prisma from "../lib/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret';

export const userSignup = async (req:Request, res:Response):Promise<void> => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        res.status(400).json({ error: 'Username, email and password required' });
        return;
    }
    try {
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ username }, { email }]
            }
        })

        if (existingUser) {
            res.status(400).json({ error: "Email or username already exists" });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { username, email, password: hashedPassword }
        });

        res.status(201).json({ message: "User created", userId: user.id });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Signup failed' });
    }
}

export const userLogin = async (req:Request, res:Response):Promise<void> => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ error: "Email and password required" });
        return;
    }
    try {
        const user = await prisma.user.findFirst({
            where: { email }
        });

        if (!user) {
            res.status(404).json({ error: "Invalid email credentials" });
            return;
        };

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            res.status(404).json({ error: "Invalid password credentials" });
            return;
        }

        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" })

        res.json({ message: "Login successful", token })
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
}