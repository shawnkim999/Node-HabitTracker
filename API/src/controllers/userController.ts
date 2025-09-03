import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const getCurrentUser = async (req:Request, res:Response):Promise<void> => {
    const userId = req.user?.userId;
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                email: true,
                createdAt: true
            }
        });

        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        };

        res.json(user);
    } catch (error) {
        console.error("Failed to get user by id", error);
        res.status(500).json({ error: "Server error" })
    }
}

export const updateUser = async (req:Request, res:Response):Promise<void> => {
    const userId = req.user?.userId;
    const { username, email } = req.body;

    if (!username || !email) {
        res.status(400).json({ error: "Username and email is required" })
    }
    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                username,
                email
            },
            select: {
                id: true,
                username: true,
                email: true,
                createdAt: true
            }
        });

        res.json(updatedUser);
    } catch (error) {
        console.error("Failed to update user", error);
        res.status(500).json({ error: "Server error" })
    }
}

export const deleteUser = async (req:Request, res:Response):Promise<void> => {
    const userId = req.user?.userId;
    try {
        await prisma.user.delete({
            where: { id: userId }
        })

        res.status(204).send()
    } catch (error) {
        console.error("Failed to delete user", error);
        res.status(500).json({ error: "Server error" })
    }
}