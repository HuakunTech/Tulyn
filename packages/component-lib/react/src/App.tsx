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
