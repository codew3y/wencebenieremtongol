import React from "react";

const Footer = () => {
  return (
    <footer className="border-t border-line py-8">
      {/* One line, centred: left-aligning a lone item in a justify-between
          row would leave it stranded. */}
      <div className="mx-auto max-w-6xl px-6 text-center font-mono text-xs text-faint">
        <p>© {new Date().getFullYear()} Wence Benierem Tongol</p>
      </div>
    </footer>
  );
};

export default Footer;
