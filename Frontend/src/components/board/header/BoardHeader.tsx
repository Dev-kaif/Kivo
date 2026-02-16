"use client";

import { useParams } from "next/navigation";
import { Separator } from "../../ui/separator";
import { SidebarTrigger } from "../../ui/sidebar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { ShareButton } from "./share/ShareButton";
import { useGetBoardName } from "../hooks/useBoardMembers";
import { ActivityButton } from "./activity/ActivityButton";
import { MembersButton } from "./members/MembersButton";

export default function BoardHeader() {
    const params = useParams();
    const boardId = params.id as string;
    const { boardName, isGettingName } = useGetBoardName(boardId)

    return (
        <header className="flex sticky top-0 z-50 px-4 border-b h-14 gap-2 items-center bg-sidebar">
            <div className="flex shrink-0 grow items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                    className="mr-2 data-[orientation=vertical]:h-4"
                />
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbPage>
                                {isGettingName ?
                                    "Loding..." : boardName
                                }
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            <div className="ml-auto flex items-center gap-2">
                <ActivityButton boardId={boardId} />
                <MembersButton boardId={boardId} />
                <ShareButton boardId={boardId} />
            </div>
        </header>
    );
}
