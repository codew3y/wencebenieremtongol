import React from "react";
import ReactDOM from "react-dom/client";
import { IconContext } from "react-icons";
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

// Every icon here is decorative: each one sits beside its own label, or inside
// a control that carries an aria-label of its own. react-icons renders
// role="img" with no name unless you give it one, which leaves an unnamed
// image in the accessibility tree for every icon on the page -- harmless to a
// screen reader, which skips them, but it is what Lighthouse means by an
// accessibility tree that is not well-formed, and an agent reading the tree
// sees a page littered with anonymous images.
//
// Setting it here rather than at each call site means the next icon someone
// adds is correct by default. An icon that genuinely needs a name can still
// pass its own aria-label or title, which takes precedence.
const iconDefaults = { attr: { "aria-hidden": "true", focusable: "false" } };

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <IconContext.Provider value={iconDefaults}>
      <App />
    </IconContext.Provider>
  </React.StrictMode>
);
