import { Router } from "express";
import {
    getAllHabits,
    getHabitById,
    createHabit,
    updateHabit,
    deleteHabit
} from '../controllers/habitController'

const router = Router();

router.get("/", getAllHabits);
router.get("/:id", getHabitById);
router.post("/", createHabit);
router.put("/:id", updateHabit);
router.delete("/:id", deleteHabit);

export default router;