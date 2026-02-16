import { prefetch } from "@/lib/hydration";
import { settingsServerQueries } from "./queries";

export async function prefetchSettings() {
    await prefetch(settingsServerQueries.me());
}
