import { ThemeProvider } from "@/components/theme-provider";
import DownloadForm from "@/components/download-form";
import { Toaster } from "@/components/ui/toaster";
import { SkillIconsTwitter } from "./components/TwitterIcon";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Toaster />
      <div className="h-screen pt-32 flex flex-col">
        <DownloadForm className="grow" />
        <span className="flex space-x-2 items-center p-3">
          <SkillIconsTwitter />
          <span className="text-muted-foreground">Download Video</span>
        </span>
      </div>
    </ThemeProvider>
  );
}

export default App;
