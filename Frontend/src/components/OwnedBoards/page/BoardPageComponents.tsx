"use client";

import {
    EntityContainer,
    EntityHeader,
    EntityPagination,
    EntitySearch,
    LoadingView,
    ErrorView
} from "@/components/Generic/entityComponents";

import { useSuspenseOwnedBoards } from "../hooks/useOwnedBoards";
import { useOwnedBoardsParams } from "../hooks/useBoardParams";
import { useEntitySearch } from "@/components/Generic/entitySearch";



export const OwnedBoardsHeader = () => {
    return (
        <EntityHeader
            title="My Boards"
            discription="Your personal workspaces and projects."
            newButtonLable="Create Board"
            newButtonHref="/dashboard"
        />
    );
};



export const OwnedBoardsSearch = () => {
    const [params, setParams] = useOwnedBoardsParams();

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



export const OwnedBoardsPagination = () => {
    const boards = useSuspenseOwnedBoards();
    const [params, setParams] = useOwnedBoardsParams();

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



export const OwnedBoardsContainer = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return (
        <EntityContainer
            header={<OwnedBoardsHeader />}
            search={<OwnedBoardsSearch />}
            pagination={<OwnedBoardsPagination />}
        >
            {children}
        </EntityContainer>
    );
};



export const OwnedBoardsLoading = () => {
    return <LoadingView message="Loading boards" />;
};

export const OwnedBoardsError = () => {
    return <ErrorView message="Error loading boards" />;
};
