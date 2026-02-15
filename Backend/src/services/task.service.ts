import z from 'zod';
import db from '../lib/db';
import { getIO } from '../websocket/socket';
import { AppError } from "../utils/appError";
import { logActivity } from "../utils/logActivity";
import { ActivityAction } from "../../generated/prisma/enums";
import { createTaskBodySchema, updateTaskBodySchema } from '../validators/task.schema';

export const createTask = async (
    userId: string,
    input: z.infer<typeof createTaskBodySchema>
) => {

    const { listId, title, description, priority, dueDate } = input;

    const list = await db.list.findFirst({
        where: {
            id: listId,
            board: {
                members: {
                    some: { userId },
                },
            },
        },
        select: { boardId: true },
    });

    if (!list) {
        throw new AppError("List not found or access denied", 403);
    }

    const lastTask = await db.task.findFirst({
        where: { listId },
        orderBy: { position: "desc" },
    });

    const newPosition = lastTask
        ? lastTask.position + 65536
        : 65536;

    const task = await db.task.create({
        data: {
            title,
            description,
            priority,
            dueDate,
            listId,
            position: newPosition,
            assignees: {
                connect: { id: userId },
            },
        },
        include: {
            assignees: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });

    await logActivity({
        action: ActivityAction.TASK_CREATED,
        userId,
        boardId: list.boardId,
        taskId: task.id,
        details: { title: task.title },
    });

    getIO().to(list.boardId).emit("task:created", task);

    return task;
};


export const moveTask = async (
    userId: string,
    taskId: string,
    newListId: string,
    newPosition: number
) => {


    const task = await db.task.findFirst({
        where: {
            id: taskId,
            list: {
                board: {
                    members: {
                        some: {
                            userId
                        }
                    },
                },
            },
        },
        include: {
            list: { select: { boardId: true } },
        },
    });

    if (!task) {
        throw new AppError("Task not found or access denied", 403);
    }

    const updatedTask = await db.task.update({
        where: {
            id: taskId
        },
        data: {
            listId: newListId,
            position: newPosition,
        },
        include: {
            list: {
                select: {
                    boardId: true
                }
            },
        },
    });

    await logActivity({
        action: ActivityAction.TASK_MOVED,
        userId,
        boardId: updatedTask.list.boardId,
        taskId: updatedTask.id,
        details: {
            fromListId: task.listId,
            toListId: newListId,
            newPosition,
        },
    });

    getIO().to(updatedTask.list.boardId).emit("task:moved", updatedTask);

    return updatedTask;
};


export const deleteTask = async (
    userId: string,
    taskId: string
) => {

    // access and finding
    const task = await db.task.findFirst({
        where: {
            id: taskId,
            list: {
                board: {
                    members: {
                        some: { userId }
                    }
                }
            }
        },
        include: {
            list: {
                select: {
                    boardId: true
                }
            }
        }
    });

    if (!task) {
        throw new AppError("Task not found or access denied", 404);
    }

    await db.task.delete({
        where: { id: taskId }
    });

    await logActivity({
        action: ActivityAction.TASK_DELETED,
        userId,
        boardId: task.list.boardId,
        taskId,
        details: { title: task.title },
    });

    getIO().to(task.list.boardId).emit("task:deleted", { taskId });

    return task;
};


export const updateTask = async (
    userId: string,
    taskId: string,
    input: z.infer<typeof updateTaskBodySchema>
) => {

    const task = await db.task.findFirst({
        where: {
            id: taskId,
            list: {
                board: {
                    members: {
                        some: {
                            userId
                        },
                    },
                },
            },
        },
        include: {
            list: {
                select: {
                    boardId: true
                },
            },
        },
    });

    if (!task) {
        throw new AppError("Task not found or access denied", 404);
    }

    const updated = await db.task.update({
        where: {
            id: taskId
        },
        data: input,
    });

    await logActivity({
        action: ActivityAction.TASK_UPDATED,
        userId,
        boardId: task.list.boardId,
        taskId,
        details: {
            old: {
                title: task.title,
                description: task.description,
                priority: task.priority,
                dueDate: task.dueDate,
            },
            new: input,
        },
    });

    getIO().to(task.list.boardId).emit("task:updated", updated);

    return updated;
};
