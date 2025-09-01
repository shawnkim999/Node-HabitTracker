import { Request, Response } from "express";
import { Habit } from "../models/Habit";
import prisma from "../lib/prisma";

export const getAllHabits = async (req:Request, res:Response):Promise<void> => {
    try {
        const habits = await prisma.habit.findMany();

        res.json(habits)
    } catch (error) {
        console.error("Failed to get all habits: ", error);
        res.status(500).json({ error: "Failed to retrieve habits" });
    }
}

export const getHabitById = async (req:Request, res:Response):Promise<void> => {
    const habitId = req.params.id;
    try {
        const habit = await prisma.habit.findFirst({
            where: {id: habitId},
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
    try {
        const createdHabit = await prisma.habit.create({
            data: {
                title,
                description,
                status
            }
        });
        res.status(201).json(createdHabit);
    } catch (error) {
        console.error("Failed to create habit: ", error);
        res.status(500).json({ error: "Failed to create habit" });
    }
}

export const updateHabit = async (req:Request, res:Response):Promise<void> => {
    const habitId = req.params.id;
    const { title, description, status } = req.body;
    try {
        const updatedUser = await prisma.habit.update({
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
        })

        res.json(updatedUser);
    } catch (error) {
        console.error("Failed to update habit: ", error);
        res.status(500).json({ error: "Failed to update habit" });
    }
}

export const deleteHabit = async (req:Request, res:Response):Promise<void> => {
    const habitId = req.params.id;
    try {
        await prisma.habit.delete({ where: { id: habitId } });

        res.status(204).send();
    } catch (error) {
        console.error("Failed to delete habit: ", error);
        res.status(500).json({ error: "Failed to delete habit" });
    }
}