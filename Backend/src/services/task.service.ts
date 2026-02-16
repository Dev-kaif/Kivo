import { z } from 'zod';
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

    let validAssignees: { id: string }[] = [];

    if (input.assigneeIds?.length) {
        const members = await db.boardMember.findMany({
            where: {
                boardId: list.boardId,
                userId: { in: input.assigneeIds }
            },
            select: { userId: true }
        });

        validAssignees = members.map(m => ({ id: m.userId }));
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
            assignees: validAssignees.length
                ? {
                    connect: validAssignees
                }
                : undefined,
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
        details: {
            title: task.title,
            assigneeCount: validAssignees.length,
            assignees: task.assignees.map(a => a.name),
        },
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

    const targetList = await db.list.findFirst({
        where: {
            id: newListId,
            boardId: task.list.boardId
        },
        select: { id: true }
    });

    if (!targetList) {
        throw new AppError("Invalid target list", 400);
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
            assignees: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            },
            _count: {
                select: {
                    activities: true
                }
            },
        },
    });

    const fromList = await db.list.findUnique({
        where: { id: task.listId },
        select: { title: true },
    });

    const toList = await db.list.findUnique({
        where: { id: newListId },
        select: { title: true },
    });


    await logActivity({
        action: ActivityAction.TASK_MOVED,
        userId,
        boardId: updatedTask.list.boardId,
        taskId: updatedTask.id,
        details: {
            title: task.title,
            fromList: fromList?.title,
            toList: toList?.title,
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


    await logActivity({
        action: ActivityAction.TASK_DELETED,
        userId,
        boardId: task.list.boardId,
        taskId,
        details: {
            title: task.title
        },
    });

    await db.task.delete({
        where: { id: taskId }
    });

    getIO().to(task.list.boardId).emit("task:deleted", { taskId });

    return task;
};


export const updateTask = async (
    userId: string,
    taskId: string,
    updates: z.infer<typeof updateTaskBodySchema>
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

    let assigneeUpdate = undefined;

    if (updates.assigneeIds !== undefined) {
        const validMembers = await db.boardMember.findMany({
            where: {
                boardId: task.list.boardId,
                userId: { in: updates.assigneeIds }
            },
            select: { userId: true }
        });

        assigneeUpdate = {
            set: validMembers.map(m => ({ id: m.userId }))
        };
    }

    const updatedTask = await db.task.update({
        where: { id: taskId },
        data: {
            title: updates.title,
            description: updates.description,
            priority: updates.priority,
            dueDate: updates.dueDate,
            assignees: assigneeUpdate
        },
        include: {
            assignees: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        }
    });

    const changes: Record<string, any> = {};

    if (updates.title && updates.title !== task.title) {
        changes.title = {
            from: task.title,
            to: updates.title,
        };
    }

    if (updates.priority && updates.priority !== task.priority) {
        changes.priority = {
            from: task.priority,
            to: updates.priority,
        };
    }

    if (updates.assigneeIds !== undefined) {
        changes.assignees = updatedTask.assignees.map(a => a.name);
    }

    await logActivity({
        action: ActivityAction.TASK_UPDATED,
        userId,
        boardId: task.list.boardId,
        taskId,
        details: {
            title: task.title,
            changes,
        },
    });

    getIO().to(task.list.boardId).emit("task:updated", updatedTask);

    return updatedTask;
};
