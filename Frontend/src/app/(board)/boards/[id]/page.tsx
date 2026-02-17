import { getServerApi } from "@/lib/server-api";
import { KanbanBoard } from "@/components/board/KanbanBoard";
import { requireAuth } from "@/lib/requireAuth";
import Link from "next/link";

export default async function BoardPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    await requireAuth();
    const { id } = await params;

    const api = await getServerApi();

    let board = null;
    let isMember = true;

    try {
        const response = await api.get(`/boards/${id}`);
        board = response.data;
    } catch (error: any) {
        if (error.response?.status === 404 || error.response?.status === 403) {
            isMember = false;
        } else {
            throw error;
        }
    }

    if (!isMember) {
        return (
            <main className="h-[90vh] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-6">
                <div className="bg-white/80 backdrop-blur-md shadow-xl rounded-3xl p-10 max-w-md w-full text-center border border-gray-200">

                    <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-red-50 border border-red-100">
                        <span className="text-red-500 text-2xl font-semibold">!</span>
                    </div>

                    <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
                        Access Denied
                    </h1>

                    <p className="mt-3 text-gray-600 leading-relaxed">
                        You are not a member of this board.
                    </p>

                    <Link
                        href="/dashboard"
                        className="mt-8 inline-block w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-800 active:scale-[0.98] transition-all duration-200"
                    >
                        Go to Dashboard
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="h-[90vh] bg-gray-50 flex flex-col">
            <KanbanBoard boardId={id} initialLists={board.lists} />
        </main>
    );
}
