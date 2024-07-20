# ShadCN Style cmdk

This is React component library based on [cmdk](https://github.com/pacocoursey/cmdk) and [ShadCN](https://github.com/shadcn-ui/ui).

This is pretty much a wrapper and re-export of ShadCN Command Component. The reason I created this library is to make it easier to install and use the components without having to set up ShadCN.

Extra features added, such as action panel.

#### Docs: https://huakunshen.github.io/shadcn-cmdk/

<div style="text-align: center;">
    <img width="600" src="./assets/demo.png" style="margin: auto;" />
</div>

## Components

```tsx
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandListCommandFooter,
  VertifcalSeparator,
  ActionPanel,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ThemeProvider,
  ModeToggle
} from "shadcn-cmdk"

function App() {
  return (
    <>
      <Command>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>
              <TwitterLogoIcon className="mr-2 h-4 w-4" />
              <span>Twitter</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
        <CommandFooter>
          <GearIcon className="w-4 h-4 ml-2" />
          <ActionPanel
            listRef={listRef}
            selectedValue={value}
            inputRef={inputRef}
            actionItems={[
              { label: "Open Application", value: "open" },
              { label: "Show in Finder", value: "finder" },
              { label: "Show Info in Finder", value: "info" },
              { label: "Add to Favorites", value: "favorites" }
            ]}
          ></ActionPanel>
        </CommandFooter>
      </Command>
    </>
  )
}
//   type ActionItemProps
```

## Demo

A demo component is provided in [./src/components/cmd/demo.tsx](./src/components/cmd/demo.tsx).

```tsx
import { ThemeProvider } from "@/components/theme-provider"
import { CommandDemo } from "@/components/cmd/demo"
import { ModeToggle } from "@/components/theme-toggle"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="w-full flex-col h-screen flex justify-center items-center space-y-5">
        <ModeToggle />
        <div className="w-[35em] h-[25em]">
          <CommandDemo />
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App
```
