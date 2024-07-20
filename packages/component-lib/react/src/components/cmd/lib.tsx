import React from "react"
import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command"

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"

import { Button } from "@/components/ui/button"

export function CommandFooter({
  children,
  className
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex items-center w-full rounded-b-lg border-t-[1px] bottom-0 justify-between px-1",
        className
      )}
    >
      {children}
    </div>
  )
}

export function VertifcalSeparator() {
  return <hr className="h-6 w-[1px] bg-muted mt-2 mb-2" />
}

export type ActionItemProps = {
  label: string
  value: string
}

export function ActionPanel({
  inputRef,
  listRef,
  selectedValue,
  actionItems,
  children
}: {
  inputRef: React.RefObject<HTMLInputElement>
  listRef: React.RefObject<HTMLElement>
  selectedValue: string
  actionItems: ActionItemProps[]
  children?: React.ReactNode
}) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  React.useEffect(() => {
    function listener(e: KeyboardEvent) {
      if (e.key === "k" && e.metaKey) {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }

    document.addEventListener("keydown", listener)

    return () => {
      document.removeEventListener("keydown", listener)
    }
  }, [])

  React.useEffect(() => {
    const el = listRef.current

    if (!el) return

    if (open) {
      el.style.overflow = "hidden"
    } else {
      el.style.overflow = ""
    }
  }, [open, listRef])

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm">
          Actions
          <span className="ml-1 flex space-x-0.5">
            <kbd>⌘</kbd>
            <kbd>K</kbd>
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[200px] p-0"
        onCloseAutoFocus={(e) => {
          e.preventDefault()
          inputRef?.current?.focus()
        }}
      >
        <Command>
          <CommandList>
            <CommandEmpty>No result found.</CommandEmpty>
            <CommandGroup heading={selectedValue}>
              {children}
              {actionItems.map((action) => (
                <CommandItem
                  key={action.value}
                  value={action.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  {action.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandInput placeholder="Search..." className="h-9" />
        </Command>
      </PopoverContent>
    </Popover>
  )
}
