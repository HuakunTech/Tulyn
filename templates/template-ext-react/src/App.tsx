import { CommandDemo, ModeToggle, ThemeProvider } from "@kunkunsh/react"

export default function App() {
  return (
    <ThemeProvider>
      <div className="flex h-screen w-full flex-col items-center justify-center space-y-5">
        <ModeToggle />
        <CommandDemo className="h-[25em] w-[35em]" />
      </div>
    </ThemeProvider>
  )
}
