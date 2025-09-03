import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const getAllHabits = async (req:Request, res:Response):Promise<void> => {
    const userId = req.user?.userId;

    if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    try {
        const habits = await prisma.habit.findMany({
            where: { userId }
        });

        res.json(habits)
    } catch (error) {
        console.error("Failed to get all habits: ", error);
        res.status(500).json({ error: "Failed to retrieve habits" });
    }
}

export const getHabitById = async (req:Request, res:Response):Promise<void> => {
    const habitId = req.params.id;
    const userId = req.user?.userId;

    if (!userId) {
        res.status(401).json({ error: "Unauthorized" })
        return;
    }
    try {
        const habit = await prisma.habit.findFirst({
            where: {
                id: habitId,
                userId
            },
            select: {
                id: true,
                title: true,
                description: true,
                status: true,
                createdAt: true
            }
        });

        if (!habit) {
            res.status(404).json({ error: "Habit not found" });
            return;
        }

        res.json(habit);
    } catch (error) {
        console.error("Failed to get habit by id: ", error);
        res.status(500).json({ error: "Failed to retrieve habit by id" });
    }
}

export const createHabit = async (req:Request, res:Response):Promise<void> => {
    const { title, description, status } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    try {
        const createdHabit = await prisma.habit.create({
            data: {
                title,
                description,
                status,
                user: {
                    connect: { id: userId }
                }
            },
        });
        res.status(201).json(createdHabit);
    } catch (error) {
        console.error("Failed to create habit: ", error);
        res.status(500).json({ error: "Failed to create habit" });
    }
}

export const updateHabit = async (req:Request, res:Response):Promise<void> => {
    const habitId = req.params.id;
    const userId = req.user?.userId;
    const { title, description, status } = req.body;

    if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    try {
        const habit = await prisma.habit.findFirst({
            where: { 
                id: habitId,
                userId
            }
        });

        if (!habit) {
            res.status(404).json({ error: "Habit not found or unauthorized" });
            return;
        };

        const updatedHabit = await prisma.habit.update({
            where: { id: habitId },
            data: {
                title,
                description,
                status
            },
            select: {
                id: true,
                title: true,
                description: true,
                status: true,
                createdAt: true
            }
        });

        res.json(updatedHabit);
    } catch (error) {
        console.error("Failed to update habit: ", error);
        res.status(500).json({ error: "Failed to update habit" });
    }
}

export const deleteHabit = async (req:Request, res:Response):Promise<void> => {
    const habitId = req.params.id;
    const userId = req.user?.userId;

    if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    try {
        const habit = await prisma.habit.findFirst({
            where: { 
                id: habitId,
                userId
            }
        });

        if (!habit) {
            res.status(404).json({ error: "Habit not found or unauthorized" });
            return;
        };

        await prisma.habit.delete({ where: { id: habitId } });

        res.status(204).send();
    } catch (error) {
        console.error("Failed to delete habit: ", error);
        res.status(500).json({ error: "Failed to delete habit" });
    }
}