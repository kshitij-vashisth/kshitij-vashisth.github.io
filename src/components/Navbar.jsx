import React from "react";
import { useState } from "react";
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="z-50 inline-block w-fit mt-4">
      <ul className="group flex items-center justify-center gap-2 px-3 py-2 bg-black rounded-2xl backdrop-blur-md shadow-md">
        <a
          href="https://github.com/KayVeeZ" target="_blank"
          className="scale-200 hover:scale-300 px-4 py-1.5 text-sm font-light text-[#20C20E] transition-all duration-300 hover:text-[#1A9A0B] rounded-2xl"
        >
          <FaGithub className="curZur"/>
        </a>
        <a
          href="https://linkedin.com/in/kshitijvashisth" target="_blank"
          className="scale-200 hover:scale-300 px-4 py-1.5 text-sm font-light text-[#20C20E] transition-all duration-300 hover:text-[#1A9A0B] rounded-2xl"
        >
          <FaLinkedin className="curZur" />
        </a>
      </ul>
    </nav>
  );
};

export default Navbar;
