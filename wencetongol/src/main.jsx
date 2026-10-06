import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Self-hosted fonts, latin subset only. Loading these from fonts.googleapis.com
// cost a render-blocking stylesheet on a third origin which then named eight
// files on a fourth -- DNS, TCP and TLS twice over before any text could paint.
// Bundled here, they are same-origin and arrive on the connection the page
// already has.
//
// Geist ships as a variable font: one file covers 400 through 700, so the whole
// display range costs a single request where Inter cost four.
// Geist is declared as an @font-face in index.css (latin subset only).
import "@fontsource/jetbrains-mono/latin-400.css";
import "@fontsource/jetbrains-mono/latin-500.css";
import "@fontsource/jetbrains-mono/latin-600.css";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
