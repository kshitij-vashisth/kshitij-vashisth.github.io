import arrow from '../assets/lotties/arrow-down-lottie.json'
import '@lottiefiles/lottie-player';
import { useState, useEffect } from 'react';

import React from 'react'

function ArrowDown() {
    const [showAnimation, setShowAnimation] = useState(true);
  
    useEffect(() => {
      // Set a timer to hide the animation after 2 seconds
      const timer = setTimeout(() => {
        setShowAnimation(false);
      }, 5000);
  
      // Clear the timer if the component is unmounted
      return () => clearTimeout(timer);
    }, []);
  
    return (
      <div className="App">
        {showAnimation && (
          <lottie-player
            src={arrow}
            background="transparent"
            speed="1"
            class="w-full max-w-md floating"
            loop
            autoplay
            style={{
              position: 'fixed',
              top: '10%',  // Adjust the top value as needed
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: '9999',
              opacity: '0.7',
              pointerEvents: 'none',  // Prevent interaction with other elements
            }}
          >
          </lottie-player>
        )}
      </div>
    );
  }

export default ArrowDown
