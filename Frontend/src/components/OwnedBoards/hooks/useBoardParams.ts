import { useQueryStates } from 'nuqs';
import { ownedBoardsParam } from '../server/paramLoader';

export const useOwnedBoardsParams = () => {
    return useQueryStates(ownedBoardsParam)
}
