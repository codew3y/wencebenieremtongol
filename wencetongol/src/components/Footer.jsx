import React from "react";
import ViewCounter from "./ViewCounter";

const Footer = () => {
  return (
    <footer className="border-t border-line py-8">
      {/* Centred now that the build-stack credit is gone: left-aligning one
          item in a justify-between row would leave it stranded. */}
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-2 px-6 font-mono text-xs text-faint">
        <p>© {new Date().getFullYear()} Wence Benierem Tongol</p>
        <ViewCounter />
      </div>
    </footer>
  );
};

export default Footer;
