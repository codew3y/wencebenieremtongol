import React from "react";

const Footer = () => {
  return (
    <footer className="border-t border-white/5 py-8">
      <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Wence Benierem Tongol</p>
        <p>Built with React &amp; Tailwind CSS</p>
      </div>
    </footer>
  );
};

export default Footer;
