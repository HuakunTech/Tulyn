import {
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

import {
  CommandFooter,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
  VertifcalSeparator,
  ActionPanel
} from "."
import { Button } from "../ui/button"
import React from "react"
import { cn } from "@/lib/utils"

export function CommandDemo({ className }: { className?: string }) {
  const [value, setValue] = React.useState("linear")
  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const listRef = React.useRef(null)

  React.useEffect(() => {
    inputRef?.current?.focus()
  }, [])
  return (
    <Command
      className={cn("rounded-lg border shadow-md", className)}
      value={value}
      onValueChange={(v) => {
        console.log(v)
        setValue(v)
      }}
    >
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
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
        <GearIcon className="w-4 h-4 ml-2" />
        <div className="flex space-x-2 items-center">
          <Button variant="ghost" size="sm">
            Open Application
            <kbd className="ml-1">↵</kbd>
          </Button>
          <VertifcalSeparator />
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
        </div>
      </CommandFooter>
    </Command>
  )
}
