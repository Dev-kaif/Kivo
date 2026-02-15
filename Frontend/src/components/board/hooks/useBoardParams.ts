import { useQueryStates } from 'nuqs';
import { boardParams } from '../server/paramLoader';

export const useOwnedBoardsParams = () => {
    return useQueryStates(boardParams)
}
