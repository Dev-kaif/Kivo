"use client";

import {
    EntityContainer,
    EntityHeader,
    EntityPagination,
    EntitySearch,
    LoadingView,
    ErrorView
} from "@/components/Generic/entityComponents";

import { useSuspenseJoinedBoards } from "../hooks/useJoinedBoards";
import { useJoinedBoardsParams } from "../hooks/useBoardParams";
import { useEntitySearch } from "@/components/Generic/entitySearch";



export const JoinedBoardsHeader = () => {
    return (
        <EntityHeader
            title="Joined Boards"
            discription="Boards you joined"
        />
    );
};



export const JoinedBoardsSearch = () => {
    const [params, setParams] = useJoinedBoardsParams();

    const { searchValue, onSearchChange } = useEntitySearch({
        params,
        setParams
    });

    return (
        <EntitySearch
            value={searchValue}
            onChange={onSearchChange}
            placeHolder="Search boards"
        />
    );
};



export const JoinedBoardsPagination = () => {
    const boards = useSuspenseJoinedBoards();
    const [params, setParams] = useJoinedBoardsParams();

    return (
        <EntityPagination
            page={boards.data.page}
            totalPage={boards.data.totalPages}
            onPageChange={(page) =>
                setParams({ ...params, page })
            }
            disabled={boards.isFetching}
        />
    );
};



export const JoinedBoardsContainer = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return (
        <EntityContainer
            header={<JoinedBoardsHeader />}
            search={<JoinedBoardsSearch />}
            pagination={<JoinedBoardsPagination />}
        >
            {children}
        </EntityContainer>
    );
};



export const JoinedBoardsLoading = () => {
    return <LoadingView message="Loading boards" />;
};

export const JoinedBoardsError = () => {
    return <ErrorView message="Error loading boards" />;
};
