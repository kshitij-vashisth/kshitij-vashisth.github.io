import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const StreamerText = ({ texts, direction = 1, speed = 1.2 }) => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const [offset, setOffset] = useState(0);
  const [textWidth, setTextWidth] = useState(0);

  // Add a single white bullet point after each string
  const sandwichedText = texts.map((text) => `${text} <span class="text-white">•</span>`).join("\u00A0");

  const repeatedText = Array(50).fill(sandwichedText).join("\u00A0");

  useEffect(() => {
    if (textRef.current) {
      setTextWidth(textRef.current.scrollWidth / 2);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setOffset((prev) => {
        // Use window.scrollY to determine the horizontal offset
        const scrollY = window.scrollY;
        let newOffset = scrollY * 0.5 * direction * speed;
        
        // Wrap around if exceeding textWidth
        if (newOffset > textWidth) return newOffset % textWidth;
        if (newOffset < 0) return textWidth + (newOffset % textWidth);
        return newOffset;
      });
    };
  
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [direction, textWidth, speed]);

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden bg-black flex items-center">
      <motion.div
        ref={textRef}
        className="flex text-2xl font-bold custom-green transition-all ease-in-out duration-300"
        style={{
          transform: `translateX(${-offset}px)`,
          whiteSpace: "nowrap",
        }}
        dangerouslySetInnerHTML={{ __html: repeatedText }}
      />
    </div>
  );
};

export default StreamerText;