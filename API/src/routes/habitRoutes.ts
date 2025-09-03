import { Router } from "express";
import {
    getAllHabits,
    getHabitById,
    createHabit,
    updateHabit,
    deleteHabit
} from '../controllers/habitController'
import { authenticate } from "../middleware/authMiddleware";

const router = Router();
router.use(authenticate);

router.get("/", getAllHabits);
router.get("/:id", getHabitById);
router.post("/", createHabit);
router.put("/:id", updateHabit);
router.delete("/:id", deleteHabit);

export default router;