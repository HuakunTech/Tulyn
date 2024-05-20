import { z } from "zod";
import { deepMap, listenKeys, map } from "nanostores";

export const appStateSchema = z.object({
  searchTerm: z.string(),
});
export type AppState = z.infer<typeof appStateSchema>;

export const $appState = map<AppState>({
  searchTerm: "",
});

export function setSearchTerm(searchTerm: string) {
  $appState.setKey("searchTerm", searchTerm);
}
