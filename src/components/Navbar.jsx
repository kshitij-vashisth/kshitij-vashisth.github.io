import React, { useState, useEffect, useRef } from "react";
import { FaGithub, FaLinkedin, FaPlay, FaPause } from "react-icons/fa";
import backgroundMusic from '../assets/music/background-music.mp3'; // import the music

const Navbar = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((err) => {
          console.warn('Play failed:', err);
        });
      } else {
        audioRef.current.pause();
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [isPlaying]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <nav className="z-50 inline-block w-fit mt-4">
      <ul className="group flex items-center justify-center gap-4 px-5 py-5 bg-black rounded-2xl">
        {/* GitHub Link */}
        <a
          href="https://github.com/KayVeeZ"
          target="_blank"
          className="scale-200 hover:scale-300 px-4 py-1.5 text-sm font-light text-[#20C20E] transition-all duration-300 hover:text-[#1A9A0B] rounded-2xl"
        >
          <FaGithub className="text-[30px] curZur" />
        </a>

        {/* LinkedIn Link */}
        <a
          href="https://linkedin.com/in/kshitijvashisth"
          target="_blank"
          className="scale-200 hover:scale-300 px-4 py-1.5 text-sm font-light text-[#20C20E] transition-all duration-300 hover:text-[#1A9A0B] rounded-2xl"
        >
          <FaLinkedin className="text-[30px] curZur" />
        </a>

        {/* Play/Pause Button */}
        <div
          className="scale-200 hover:scale-300 text-[30px] text-[#20C20E] curZur"
          onClick={handlePlayPause}
        >
          {isPlaying ? <FaPause /> : <FaPlay />}
        </div>
      </ul>

      {/* Hidden Audio Element */}
      <audio ref={audioRef} src={backgroundMusic} loop style={{ display: 'none' }} />
    </nav>
  );
};

export default Navbar;
