import { createLoader, parseAsString, parseAsStringEnum } from "nuqs/server";

export const dashboardParams = {
    search: parseAsString.withDefault("").withOptions({
        clearOnDefault: true,
    }),

    type: parseAsStringEnum(["owner", "member", "all"])
        .withDefault("all")
        .withOptions({ clearOnDefault: true }),
};

export const dashboardParamLoader = createLoader(dashboardParams);
