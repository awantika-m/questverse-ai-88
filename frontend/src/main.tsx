import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Enable React Router v7 future flag
const router = {
  future: {
    v7_startTransition: true
  }
};

window.__reactRouterConfig = router;

createRoot(document.getElementById("root")!).render(<App />);
