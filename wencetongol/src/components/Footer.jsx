import React from "react";

const Footer = () => {
  return (
    <footer className="border-t border-line py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 font-mono text-xs text-faint sm:flex-row">
        <p>© {new Date().getFullYear()} Wence Benierem Tongol</p>
        <p>Built with React, Tailwind CSS &amp; Vite</p>
      </div>
    </footer>
  );
};

export default Footer;
