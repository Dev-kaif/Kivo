import { PAGINATION } from '@/lib/constant';
import {
    createLoader,
    parseAsInteger,
    parseAsString,
    parseAsStringEnum,
} from 'nuqs/server';

export const joinedBoardsParam = {
    page: parseAsInteger
        .withDefault(PAGINATION.DEFAULT_PAGE)
        .withOptions({ clearOnDefault: true }),

    pageSize: parseAsInteger
        .withDefault(PAGINATION.DEFAULT_PAGE_SIZE)
        .withOptions({ clearOnDefault: true }),

    search: parseAsString
        .withDefault('')
        .withOptions({ clearOnDefault: true }),

    type: parseAsStringEnum(['owner', 'member', 'all'])
        .withDefault('member')
        .withOptions({ clearOnDefault: true }),
};

export const joinedBoardsParamLoader = createLoader(joinedBoardsParam);
