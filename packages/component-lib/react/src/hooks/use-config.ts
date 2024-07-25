import { Style } from "../registry/styles"
import { Theme } from "../registry/themes"
import { useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"

type Config = {
  style: Style["name"]
  theme: Theme["name"]
  radius: number
}

const configAtom = atomWithStorage<Config>("config", {
  style: "default",
  theme: "zinc",
  radius: 0.5
})

export function useConfig() {
  return useAtom(configAtom)
}
