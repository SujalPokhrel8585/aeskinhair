import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@/components/theme";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // NOTE: StrictMode disabled, its dev double-mount leaves the R3F/GLTF
  // hero model detached from the scene graph (invisible in dev only).
  <BrowserRouter>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </BrowserRouter>,
);

// Register service worker for offline support + instant repeat visits.
// Only in production - dev mode would cache HMR assets and break reloads.
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      /* SW registration failed - site still works, just no offline caching */
    });
  });
}
