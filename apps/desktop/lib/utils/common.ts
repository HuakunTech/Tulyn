// things I don't know where to put

import { modifierKeySet } from "./js"

export function isLetter(letter: string): boolean {
  if (letter.length != 1) return false
  return letter.match(/[a-zA-Z]/) ? true : false
}

export function isShortcut(letters: string[]): boolean {
  // letters contain at least one modifier key and one non-modifier key

  let hasModifier = false
  let hasNonModifier = false

  for (let letter of letters) {
    if (modifierKeySet.has(letter)) {
      hasModifier = true
    } else {
      hasNonModifier = true
    }
  }

  return hasModifier && hasNonModifier
}
