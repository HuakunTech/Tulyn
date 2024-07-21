import { CommandDemo, ThemeProvider, ModeToggle } from "@kunkun/react"

export default function App() {
  return (
    <ThemeProvider>
      <div className="w-full h-screen flex justify-center items-center flex-col space-y-5">
        <ModeToggle />
        <CommandDemo className="w-[35em] h-[25em]" />
      </div>
    </ThemeProvider>
  )
}
