import { useState, useEffect, useRef } from 'react';
import { FaPlay, FaPause } from 'react-icons/fa'; // Import the icons from react-icons
import './App.css';
import './Cursors.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Intro from './components/Intro';
import Headline from './components/Headline';
import Projects from './components/Projects';
import BrainCanvas from './components/BrainCanvas';
import StreamerText from './components/StreamerText';
import PersonalInfo from './components/PersonalInfo';
import RotatingSphere from './components/RotatingSphere';

// Import your audio file
import backgroundMusic from './assets/music/background-music.mp3';

function App() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1024); // Checking if the screen is larger than 1024px
  const [isPlaying, setIsPlaying] = useState(true); // State to track if the music is playing
  const audioRef = useRef(null); // Reference to control the audio

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 300); // Small delay for smooth effect

    // Resize listener
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 1024); // Adjust the condition if needed
    };

    window.addEventListener('resize', handleResize);

    // Ensure audio is playing initially if it is set to true
    if (audioRef.current && isPlaying) {
      audioRef.current.play(); // Start playing the audio
    } else if (audioRef.current && !isPlaying) {
      audioRef.current.pause(); // Pause the audio if isPlaying is false
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();    // Pause the audio when the component unmounts
      }
      window.removeEventListener('resize', handleResize); // Cleanup on unmount
    };
  }, [isPlaying]); // This useEffect will run when `isPlaying` state changes

  // Toggle play/pause state
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying); // Toggle the play state
  };

  return (
    <div
      className={`select-none font-custom flex flex-col min-h-screen justify-between text-white transition-all duration-700 ease-in ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="flex flex-col justify-center items-center">
        {/* Navbar */}
        <Navbar />
      </div>

      {/* Main Section */}
      <section className={`mt-[5vh] h-auto items-center ${isDesktop ? 'grid grid-cols-2' : 'flex flex-col'}`}>
        {/* Left column with BrainCanvas (Only on Desktop) */}
        {isDesktop && (
          <div className="h-[45vh] ml-[5vw] rounded-3xl translucent-container mt-10 mb-5 mr-8 flex-grow flex flex-col justify-center items-center custom-green select-none">
            <BrainCanvas />
          </div>
        )}

        {/* Right column with Headline and Intro */}
        <div className={`flex-grow flex flex-col justify-center items-center custom-green ${isDesktop ? 'mx-[5vw]' : 'mb-4 mx-10'}`}>
          <Headline />
          <Intro />
        </div>
      </section>

      {/* Other sections as before */}
      <section className="mt-[5vh] mb-0.5 flex flex-col h-auto items-center">
        <StreamerText texts={[" Next.js ", " React.js ", " Node.js ", " Express.js ", " Flask ", " PyTorch ", " TensorFlow ", " Pandas ", " MatPlotLib ", " Scikit-Learn ", " Bootstrap ", " TailwindCSS ", " Git ", " Docker ", " MongoDB ", " RabbitMQ ", " Render ", " Unity ", " Vite ", " SQLAlchemy ", " AJAX ", " PyTest "]} direction={1} speed={0.3} />
      </section>

      <section className="mb-[5vh] mt-0.5 flex flex-col h-auto items-center">
        <StreamerText texts={[" Data Science ", " Machine Learning ", " Predictive Modelling ", " Statistical Analysis ", " Software Development ", " Algorithms ", " Data Structures ", " Web Development ", " Problem-Solving ", " Containerisation ", " User Authentication ", " Responsive Design ", " Version Control ", " Product Design ", " Data Engineering ", " High Performance Computing ", " Accelerated Computing "]} direction={-1} speed={0.3} />
      </section>

      {/* Projects Section */}
      <section className="h-auto flex items-center justify-center">
        <Projects className="curZur" />
      </section>

      {/* Tech Stack Section */}
      <div className={`mt-2vh] items-center justify-center ${isDesktop ? 'grid grid-cols-2' : 'flex flex-col'}`}>
        {isDesktop && (
          <div className='flex justify-center items-center flex-col mx-[4vw] scale-92'>
            <RotatingSphere />
          </div>
        )}

        <div className={`flex flex-col justify-center items-center ${isDesktop ? 'mx-[5vw]' : 'mx-[10vw] mb-4'}`}>
          <PersonalInfo />
        </div>
      </div>

      <section className="h-auto flex items-center justify-center">
        {/* Footer */}
        <footer className='mt-auto'>
          <Footer className="w-full flex justify-center" />
        </footer>
      </section>

      {/* Hidden Audio Player */}
      <audio ref={audioRef} src={backgroundMusic} autoPlay loop style={{ display: 'none' }} />

      {/* Play/Pause Button */}
      <div className="play-pause-button curZur" onClick={handlePlayPause}>
        {isPlaying ? (
          <FaPause size={30} color="#20C20E" />
        ) : (
          <FaPlay size={30} color="#20C20E" />
        )}
      </div>

    </div>
  );
}

export default App;
