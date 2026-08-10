import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import { SimulationProvider } from "./state/store";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SimulationProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </SimulationProvider>
  </StrictMode>,
);
