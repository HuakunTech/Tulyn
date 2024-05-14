import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";

function App() {
  const [count, setCount] = useState(0);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="flex justify-center space-x-10 mb-10">
        <a href="https://vitejs.dev" target="_blank" className="w-40 h-40">
          <img src={viteLogo} className="w-40 h-40" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" className="w-40 h-40">
          <img src={reactLogo} className="w-40 h-40" alt="React logo" />
        </a>
      </div>
      <h1 className="text-3xl">React Template For Jarvis Extension</h1>
      <ModeToggle />
      <div className="card">
        <Button onClick={() => setCount((count) => count + 1)}>count is {count}</Button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    </ThemeProvider>
  );
}

export default App;
