import { PAGINATION } from '@/lib/constant';
import {
    createLoader,
    parseAsInteger,
    parseAsString,
    parseAsStringEnum,
} from 'nuqs/server';

export const ownedBoardsParam = {
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
        .withDefault('owner')
        .withOptions({ clearOnDefault: true }),
};

export const ownedBoardsParamLoader = createLoader(ownedBoardsParam);
