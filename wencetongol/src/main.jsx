import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Self-hosted fonts, latin subset only, and only the weights the site uses:
// Inter 400/500/600/700 and JetBrains Mono 400/500/600. Loading these from
// fonts.googleapis.com cost a render-blocking stylesheet on a third origin
// which then named eight files on a fourth -- DNS, TCP and TLS twice over
// before any text could paint. Bundled here, they are same-origin and arrive
// on the connection the page already has. Inter 800 is not imported: nothing
// in the site uses font-extrabold, and Google was serving it anyway.
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/inter/latin-700.css";
import "@fontsource/jetbrains-mono/latin-400.css";
import "@fontsource/jetbrains-mono/latin-500.css";
import "@fontsource/jetbrains-mono/latin-600.css";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
