import { ThemeProvider } from "@/components/theme-provider";
import DownloadForm from "@/components/download-form";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Toaster />
      {/* <Button
        variant="outline"
        onClick={() => {
          toast({
            title: "Scheduled: Catch up ",
            description: "Friday, February 10, 2023 at 5:57 PM",
            action: <ToastAction altText="Goto schedule to undo">Undo</ToastAction>,
          });
        }}
      >
        Add to calendar
      </Button> */}
      <div className="h-screen flex justify-center items-center">
        <DownloadForm />
      </div>
    </ThemeProvider>
  );
}

export default App;
