import React, { useEffect, useRef, useState } from "react";

const StreamerText = ({ texts, direction = 1, speed = 0.6 }) => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const [textWidth, setTextWidth] = useState(0);
  const offsetRef = useRef(0);
  const animationRef = useRef(null);
  const lastScrollYRef = useRef(window.scrollY);

  const sandwichedText = texts
    .map((text) => `<span class="text-[white]"> ${text}</span>\u00A0<span class="text-[#20C20E]"> • </span>\u00A0`)
    .join("");
  const repeatedText = Array(50).fill(sandwichedText).join("\u00A0");

  useEffect(() => {
    if (textRef.current) {
      setTextWidth(textRef.current.scrollWidth / 2); // only 1 loop width
    }
  }, []);

  useEffect(() => {
    const update = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollYRef.current;
      lastScrollYRef.current = currentScrollY;

      offsetRef.current += delta * direction * speed;

      // Wrap the offset manually
      if (textWidth > 0) {
        offsetRef.current = ((offsetRef.current % textWidth) + textWidth) % textWidth;
        textRef.current.style.transform = `translateX(${-offsetRef.current}px)`;
      }

      animationRef.current = requestAnimationFrame(update);
    };

    animationRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationRef.current);
  }, [direction, speed, textWidth]);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden bg-black flex items-center"
    >
      <div
        ref={textRef}
        className="flex text-2xl font-bold custom-green"
        style={{
          whiteSpace: "nowrap",
          willChange: "transform", // helpful for GPU optimization
        }}
        dangerouslySetInnerHTML={{ __html: repeatedText }}
      />
    </div>
  );
};

export default StreamerText;
