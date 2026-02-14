import db from '../lib/db';
import { getIO } from '../websocket/socket';
import { AppError } from "../utils/appError";


export const createTask = async (
    userId: string,
    listId: string,
    title: string
) => {

    // Verify user is board member
    const list = await db.list.findFirst({
        where: {
            id: listId,
            board: {
                members: {
                    some: { userId }
                }
            }
        },
        select: {
            boardId: true
        }
    });

    if (!list) {
        throw new AppError("List not found or access denied", 403);
    }

    const lastTask = await db.task.findFirst({
        where: {
            listId
        },
        orderBy: {
            position: "desc"
        },
    });

    // gap
    const newPosition = lastTask ? lastTask.position + 65536 : 65536;

    const task = await db.task.create({
        data: {
            title,
            listId,
            position: newPosition,
            assignees: {
                connect: {
                    id: userId
                },
            },
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

    await db.activityLog.create({
        data: {
            action: "TASK_CREATED",
            userId,
            boardId: list.boardId,
            taskId: task.id,
            details: {
                title: task.title
            },
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

    // Ensure task exists and user is board member
    const task = await db.task.findFirst({
        where: {
            id: taskId,
            list: {
                board: {
                    members: {
                        some: {
                            userId
                        }
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
            list: true
        }
    });

    await db.activityLog.create({
        data: {
            action: "TASK_UPDATED",
            userId,
            boardId: updatedTask.list.boardId,
            taskId: updatedTask.id,
            details: {
                title: updatedTask.title
            },
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

    getIO().to(task.list.boardId).emit("task:deleted", { taskId });

    return task;
};


