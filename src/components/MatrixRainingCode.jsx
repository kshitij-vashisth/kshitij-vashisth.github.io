import React, { useEffect, useRef } from "react";

const MatrixRainingCode = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let columns = Math.floor(width / 20);
    const characters = `abcdefghijklmnopqrstuvwxyz0123456789$+-*/=%"'#&_(),.;:?!\\|{}<>[]^~`;
    const charArray = characters.split("");
    
    let streams = Array.from({ length: columns }, () => ({
      chars: [],
      y: 0
    }));

    let frameRate = 25;
    let lastFrameTime = Date.now();

    // Load custom font
    const loadFont = async () => {
      const font = new FontFace("MatrixFont", "url(/fonts/matrixFont.ttf)"); // Adjust path
      await font.load();
      document.fonts.add(font);
    };

    loadFont().then(() => {
      ctx.font = "18px MatrixFont";

      const draw = () => {
        ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
        ctx.fillRect(0, 0, width, height);
        ctx.font = "18px MatrixFont";

        streams.forEach((stream, i) => {
          // Add a new character at the top of the stream
          const newChar = charArray[Math.floor(Math.random() * charArray.length)];
          stream.chars.unshift({ char: newChar, opacity: 1 }); // Most recent char

          // Limit stream length (adjustable)
          if (stream.chars.length > 20) {
            stream.chars.pop(); // Remove old chars
          }

          // Draw characters in the stream
          stream.chars.forEach((charObj, index) => {
            const x = i * 20;
            const y = stream.y - index * 20;

            if (y < 0) return; // Don't draw above the screen

            // Newest character is white
            ctx.fillStyle = index === 0 ? "#fff" : `rgba(0, 255, 0, ${charObj.opacity})`;
            ctx.fillText(charObj.char, x, y);

            // Gradually fade older characters
            if (index > 0) charObj.opacity *= 0.85;
          });

          // Move the stream down
          stream.y += 20;

          // Reset stream randomly
          if (stream.y > height && Math.random() > 0.975) {
            stream.y = 0;
            stream.chars = [];
          }
        });
      };

      const animate = () => {
        const currentTime = Date.now();
        if (currentTime - lastFrameTime > 1000 / frameRate) {
          draw();
          lastFrameTime = currentTime;
        }
        requestAnimationFrame(animate);
      };

      animate();
    });

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      columns = Math.floor(width / 20);
      streams = Array.from({ length: columns }, () => ({
        chars: [],
        y: 0
      }));
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas className="matrix-canvas fixed top-0 left-0 z-[-1]" ref={canvasRef}></canvas>;
};

export default MatrixRainingCode;
