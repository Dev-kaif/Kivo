import { useQueryStates } from 'nuqs';
import { joinedBoardsParam } from '../server/paramLoader';

export const useJoinedBoardsParams = () => {
    return useQueryStates(joinedBoardsParam)
}
