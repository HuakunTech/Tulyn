/**
 * Global event bus for the desktop app.
 * Events such as keydown events and combination events can be shared across components with this global event bus.
 */
import { Action } from "@akun/api/models"
import mitt from "mitt"
import { setsEqual } from "./js"
import { SettingsKeyComb } from "./keycomb"

export const EVENT_SEARCH_BAR_KEYDOWN = "searchBarKeyDown"
export const EVENT_KEY_DOWN = "keyDown"
export const EVENT_KEY_COMBINATION = "keyCombination"
export const EVENT_ACTION_SELECTED = "actionSelected"

type Events = {
  searchBarKeyDown: KeyboardEvent
  keyCombination: Set<string>
  keyDown: KeyboardEvent
  actionSelected: string
}

export function keyCombToSetting(keyComb: Set<string>) {
  if (setsEqual(keyComb, SettingsKeyComb)) {
    window.location.href = "/settings"
  }
}

export class GlobalEventBus {
  static emitter = mitt<Events>()

  /* -------------------------------------------------------------------------- */
  /*                                 Search Bar                                 */
  /* -------------------------------------------------------------------------- */

  static emitSearchBarKeyDown(event: KeyboardEvent) {
    GlobalEventBus.emitter.emit(EVENT_SEARCH_BAR_KEYDOWN, event)
  }

  static onSearchBarKeyDown(handler: (event: KeyboardEvent) => void) {
    GlobalEventBus.emitter.on(EVENT_SEARCH_BAR_KEYDOWN, handler)
  }

  static offSearchBarKeyDown(handler: (event: KeyboardEvent) => void) {
    GlobalEventBus.emitter.off(EVENT_SEARCH_BAR_KEYDOWN, handler)
  }

  /* -------------------------------------------------------------------------- */
  /*                            Keyboard Combinations                           */
  /* -------------------------------------------------------------------------- */

  static emitKeyCombination(keyComb: Set<string>) {
    GlobalEventBus.emitter.emit(EVENT_KEY_COMBINATION, keyComb)
  }

  static onKeyCombination(handler: (keyComb: Set<string>) => void) {
    GlobalEventBus.emitter.on(EVENT_KEY_COMBINATION, handler)
  }

  static offKeyCombination(handler: (keyComb: Set<string>) => void) {
    GlobalEventBus.emitter.off(EVENT_KEY_COMBINATION, handler)
  }

  /* -------------------------------------------------------------------------- */
  /*                                Any Key Down                                */
  /* -------------------------------------------------------------------------- */

  static onKeyDown(handler: (event: KeyboardEvent) => void) {
    GlobalEventBus.emitter.on(EVENT_KEY_DOWN, handler)
  }

  static offKeyDown(handler: (event: KeyboardEvent) => void) {
    GlobalEventBus.emitter.off(EVENT_KEY_DOWN, handler)
  }

  static emitKeyDown(event: KeyboardEvent) {
    GlobalEventBus.emitter.emit(EVENT_KEY_DOWN, event)
  }

  /* -------------------------------------------------------------------------- */
  /*                               Settings Hotkey                              */
  /* -------------------------------------------------------------------------- */
  static setupSettingsKeyComb() {
    GlobalEventBus.onKeyCombination(keyCombToSetting)
  }

  static removeSettingsKeyComb() {
    GlobalEventBus.offKeyCombination(keyCombToSetting)
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Actions                                  */
  /* -------------------------------------------------------------------------- */
  static emitActionSelected(action: string) {
    GlobalEventBus.emitter.emit(EVENT_ACTION_SELECTED, action)
  }

  static onActionSelected(handler: (action: string) => void) {
    GlobalEventBus.emitter.on(EVENT_ACTION_SELECTED, handler)
  }

  static offActionSelected(handler: (action: string) => void) {
    GlobalEventBus.emitter.off(EVENT_ACTION_SELECTED, handler)
  }
}
