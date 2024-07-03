/**
 * This file is used to handle key combinations
 */

import { GlobalEventBus } from "@/lib/utils/events"

export class KeyComb {
  static keySet = new Set<string>()
  // static listeners: ((comb: Set<string>) => void)[] = [];

  static onKeyDown(e: KeyboardEvent) {
    KeyComb.keySet.add(e.key)
    if (KeyComb.keySet.size > 1) {
      GlobalEventBus.emitKeyCombination(KeyComb.keySet)
    }
  }

  static onKeyUp(e: KeyboardEvent) {
    KeyComb.keySet.delete(e.key)
  }
}

export const SettingsKeyComb = new Set(["Meta", ","]) // commnad + , on Mac
