// src/components/Footer.tsx
import React, { useEffect, useState } from "react";

const Footer: React.FC = () => {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedTime = dateTime.toLocaleTimeString();
  const formattedDate = dateTime.toLocaleDateString();

  return (
    <footer className="bg-black text-white px-6 py-4 mt-10">
      <div className="flex flex-col sm:flex-row items-center justify-between text-sm">
        {/* Left: Time & Date */}
        <div className="mb-2 sm:mb-0">
          <p>
            {formattedTime} | {formattedDate}
          </p>
        </div>
        {/* Center: Copyright */}
        <div className="text-center leading-tight">
          <p className="font-semibold">
            &copy; {new Date().getFullYear()} Task Board Application
          </p>
          <p className="text-sm font-light">
            Developed with{" "}
            <span className="text-red-500 animate-pulse font-bold">❤</span> by
            Sivasai Nukala
          </p>
        </div>

        {/* Right: Social Links */}
        <div className="flex gap-4">
          <a
            href="https://github.com/Sivasaiklu"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/sivasainukala16"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
