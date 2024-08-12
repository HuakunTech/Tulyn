import {
	Button,
	CommandDemo,
	ThemeCustomizer,
	ThemeProvider,
	ThemeWrapper,
	TooltipProvider
} from "@kksh/react"
// import "@kksh/react/css"
import "@kksh/react/themes"

function App() {
	return (
		<ThemeProvider defaultTheme="dark" storageKey="docs-kk-ui-theme">
			<ThemeWrapper className="relative flex flex-col items-start md:flex-row md:items-center">
				<TooltipProvider>
					<ThemeCustomizer />
				</TooltipProvider>
			</ThemeWrapper>
			<ThemeWrapper>
				<Button>Hello</Button>
				<CommandDemo />
			</ThemeWrapper>
		</ThemeProvider>
	)
}

export default App
