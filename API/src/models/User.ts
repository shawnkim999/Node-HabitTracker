import { Habit } from "./Habit";

export interface User {
    id: string;
    username: string;
    email: string;
    passwordHash: string;
    habits?: Habit[];
    createdAt: Date;
}