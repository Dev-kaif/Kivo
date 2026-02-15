import { useQueryStates } from 'nuqs';
import { boardParams } from '../server/paramLoader';

export const useBoardParams = () => {
    return useQueryStates(boardParams)
}
