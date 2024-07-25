import { ThemeProvider } from "@/components/theme"
import { ThemeCustomizer } from "@/components/theme/theme-customizer"
import { Button } from "@/components/ui/button"
import { TooltipProvider } from "@/components/ui/tooltip"
import "@/registry/themes.css"
import { ThemeWrapper } from "@/components/theme/theme-wrapper"
import React from "react"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ThemeWrapper className="relative flex flex-col items-start md:flex-row md:items-center">
        <TooltipProvider>
          <ThemeCustomizer />
        </TooltipProvider>
      </ThemeWrapper>
      <ThemeWrapper>
        <Button>Hello</Button>
      </ThemeWrapper>
    </ThemeProvider>
  )
}

export default App
