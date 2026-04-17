import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { getToken } from "@/lib/auth";

// Wire the JWT token from localStorage into every API call

createRoot(document.getElementById("root")!).render(<App />);
