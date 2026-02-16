import JoinBoardPage from "@/components/JoinedBoards/joinPage/JoinBoardPage";
import { requireAuth } from "@/lib/requireAuth";

export default async function Page() {
    await requireAuth();

    return (
        <div className="h-[90vh]">
            <JoinBoardPage />
        </div>
    )
}
