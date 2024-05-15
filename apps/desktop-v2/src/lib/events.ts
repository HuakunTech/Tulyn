import mitt from "mitt";

export const EVENT_SEARCH_BAR_KEYDOWN = "searchBarKeyDown";

export class GlobalEventBus {
  static emitter = mitt();

  static emitSearchBarKeyDown(event: KeyboardEvent) {
    GlobalEventBus.emitter.emit("searchBarKeyDown", event);
  }

  static onSearchBarKeyDown(handler: (event: KeyboardEvent) => void) {
    GlobalEventBus.emitter.on("searchBarKeyDown", handler as any);
  }

  static offSearchBarKeyDown(handler: (event: KeyboardEvent) => void) {
    GlobalEventBus.emitter.off("searchBarKeyDown", handler as any);
  }
}
