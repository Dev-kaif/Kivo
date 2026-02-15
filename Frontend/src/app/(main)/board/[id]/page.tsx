import { getServerApi } from "@/lib/server-api";
import { KanbanBoard } from "@/components/board/KanbanBoard";

export default async function BoardPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const api = await getServerApi();

    const { data: board } = await api.get(`/boards/${id}`);

    return (
        <main className="h-screen bg-gray-50 flex flex-col">
            <KanbanBoard boardId={id} initialLists={board.lists} />
        </main>
    );
}
