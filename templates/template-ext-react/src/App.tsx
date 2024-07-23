import { ui } from "@kunkunsh/api/ui/iframe"
import {
  ActionPanel,
  Button,
  Command,
  CommandEmpty,
  CommandFooter,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
  Input,
  ThemeProvider,
  VertifcalSeparator
} from "@kunkunsh/react"
import {
  ArrowLeftIcon,
  CalendarIcon,
  EnvelopeClosedIcon,
  FaceIcon,
  GearIcon,
  InstagramLogoIcon,
  LinkedInLogoIcon,
  PersonIcon,
  RocketIcon,
  TwitterLogoIcon
} from "@radix-ui/react-icons"
import { useEffect, useRef, useState } from "react"

export default function App() {
  const [value, setValue] = useState("linear")
  const actionInputRef = useRef<HTMLInputElement | null>(null)
  const [searchInput, setSearchInput] = useState("")
  const listRef = useRef(null)
  const seachInputEle = useRef<HTMLInputElement | null>(null)
  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      setSearchInput("")
      if (seachInputEle.current!.value.length > 0) {
        seachInputEle.current!.value = ""
      } else {
        // ui.goHome()
      }
    }
  }

  return (
    <ThemeProvider>
      <main className="h-screen">
        <span>{searchInput}</span>
        <Command
          onValueChange={(v) => {
            setValue(v)
          }}
        >
          <CommandInput
            ref={seachInputEle}
            placeholder="Type a command or search..."
            className="h-12"
            onValueChange={(v) => {
              console.log(`onValueChange: ${v}`)
              setSearchInput(v)
            }}
            // value={searchInput}
            onKeyDown={(e) => onKeyDown(e)}
          >
            <Button
              size="icon"
              variant="outline"
              onClick={() => {
                setSearchInput("")
                // ui.goHome()
              }}
            >
              <ArrowLeftIcon />
            </Button>
          </CommandInput>
          <CommandList className="h-full">
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem>
                <TwitterLogoIcon className="mr-2 h-4 w-4" />
                <span>Twitter</span>
              </CommandItem>
              <CommandItem>
                <InstagramLogoIcon className="mr-2 h-4 w-4" />
                <span>Instagram</span>
              </CommandItem>
              <CommandItem>
                <LinkedInLogoIcon className="mr-2 h-4 w-4" />
                <span>LinkedIn</span>
              </CommandItem>
              <CommandItem>
                <CalendarIcon className="mr-2 h-4 w-4" />
                <span>Calendar</span>
              </CommandItem>
              <CommandItem>
                <FaceIcon className="mr-2 h-4 w-4" />
                <span>Search Emoji</span>
              </CommandItem>
              <CommandItem>
                <RocketIcon className="mr-2 h-4 w-4" />
                <span>Launch</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Settings">
              <CommandItem>
                <PersonIcon className="mr-2 h-4 w-4" />
                <span>Profile</span>
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <EnvelopeClosedIcon className="mr-2 h-4 w-4" />
                <span>Mail</span>
                <CommandShortcut>⌘B</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <GearIcon className="mr-2 h-4 w-4" />
                <span>Settings</span>
                <CommandShortcut>⌘S</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
          <CommandFooter>
            <GearIcon className="ml-2 h-4 w-4" />
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                Open Application
                <kbd className="ml-1">↵</kbd>
              </Button>
              <VertifcalSeparator />
              <ActionPanel
                listRef={listRef}
                selectedValue={value}
                inputRef={actionInputRef}
                actionItems={[
                  { label: "Open Application", value: "open" },
                  { label: "Show in Finder", value: "finder" },
                  { label: "Show Info in Finder", value: "info" },
                  { label: "Add to Favorites", value: "favorites" }
                ]}
              ></ActionPanel>
            </div>
          </CommandFooter>
        </Command>
      </main>
    </ThemeProvider>
  )
}
